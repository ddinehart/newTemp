const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
const DB = require('./experiencesDB.js');
const bodyParser = require('body-parser');
const {S3Client , PutObjectCommand} = require('@aws-sdk/client-s3');
const multer = require('multer');
const uuid = require('uuid');

const upload = multer();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const {IAM_USER_KEY, IAM_USER_SECRET, REGION, BUCKET, WEBHOOK_KEY} = process.env;

const s3 = new S3Client({
  region:REGION,
  credentials: {
    accessKeyId:IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET,
  },
});


const authCookieName = '_id';

// The service port. In production the application is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 8080;
var apiRouter = express.Router();
// JSON body parsing using built-in middleware

apiRouter.post('/webhook', bodyParser.raw({type: 'application/json'}), async (request, response) => {
  console.log("WEBHOOK");
  const sig = request.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(request.rawBody, sig, WEBHOOK_KEY);
  } catch (err) {
    console.log(err.message)
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }
  console.log(event);

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const theBooking = JSON.parse(event.data.object.metadata.booking);
      // Then define and call a function to handle the event payment_intent.succeeded
      await DB.updateQuantities(theBooking.experienceId, theBooking.newQuantities);
      theBooking.price *= theBooking.quantity;
      await DB.createBooking(theBooking);
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});

app.use(
  bodyParser.json({
      verify: function(req, res, buf) {
          req.rawBody = buf;
      }
  })
);


app.use(express.json());

app.use(cookieParser());

// Serve up the applications static content
app.use(express.static('public'));

// Router for service endpoints
app.use(`/api`, apiRouter);


apiRouter.post('/create-checkout-session', async (req, res) => {
  try {

    let bookingId = uuid.v4();
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
        price_data: {
          currency: "usd",
          product_data: {
            name: req.body.title,
          },
          unit_amount: parseInt(req.body.price * 100),
        },
        quantity: req.body.quantity
      }
      ],

      mode:"payment",
      metadata: {
        booking: JSON.stringify({...req.body, _id:bookingId})
      },
      success_url: `${process.env.CLIENT_URL}/pay-done?id=${bookingId}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel?id=${req.body._id}?experienceId=${req.body.experienceId}`
    })
    res.send({url: session.url});
  } catch (error) {
    console.log(error);
    res.send({url: "/"});
  }
})

// const fulfillOrder = (lineItems) => {
//   // TODO: fill me in
//   console.log("Fulfilling order", lineItems);
// }

// app.post('/webhook', bodyParser.raw({type: 'application/json'}), async (request, response) => {
//   const payload = request.body;
//   const sig = request.headers['stripe-signature'];

//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
//   } catch (err) {
//     return response.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   // Handle the checkout.session.completed event
//   if (event.type === 'checkout.session.completed') {
//     console.log("IT HAS BEEN COMPLETED");
//     // Retrieve the session. If you require line items in the response, you may include them by expanding line_items.
//     const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
//       event.data.object.id,
//       {
//         expand: ['line_items'],
//       }
//     );
//     const lineItems = sessionWithLineItems.line_items;

//     // Fulfill the purchase...
//     fulfillOrder(lineItems);
//   }

//   response.status(200).end();
// });

apiRouter.post('/imageUpload', upload.single('file'), async (req, res) => {
  try {const params = {
    Bucket: BUCKET,
    Key: req.cookies._id.id + req.file.originalname,
    Body: req.file.buffer,
    ContentType: req.file.mimetype,
  }

  const command = new PutObjectCommand(params);

  await s3.send(command);
  
    res.send(`https://${BUCKET}.s3.${REGION}.amazonaws.com/${req.cookies._id.id + req.file.originalname}`);
} catch (err) {
  res.send("error");
}
})

// GetScores
apiRouter.get('/experiences/all/:limit', async (req, res) => {
  let limit = req.params.limit ? req.params.limit : 30;
  const scores = await DB.getExperiences(limit);
  res.send(scores);
});

apiRouter.get('/experiences/:_id', async (req, res) => {
  const experiences = await DB.getUserExperiences(req.params._id);
  res.send(experiences);
})

apiRouter.get('/experience/:_id', async (req, res) => {
  const experience = await DB.getExperience(req.params._id);
  res.send(experience);
})

apiRouter.put('/experience/:_id', async (req, res) => {
  DB.updateExpereince(req.body);
})

// SubmitScore
apiRouter.post('/experience', async (req, res) => {
  DB.addExperience(req.body);
  res.sendStatus(200);
});

apiRouter.delete('/experience/:_id', async (req, res) => {
    DB.deleteExperience(req.params._id);
    res.sendStatus(200);
})

apiRouter.post('/booking', async (req,res) => {
  await DB.updateQuantities(req.body.experienceId, req.body.newQuantities);
  req.body.price *= req.body.quantity;
  let newBooking = await DB.createBooking(req.body);
  res.send(newBooking);
})

apiRouter.get('/booking/:_id', async (req,res) => {
  let newBooking = await DB.getBooking(req.params._id);
  res.send(newBooking);
})
apiRouter.get('/bookings/:_id', async (req, res) => {
  let bookings = await DB.getBookings(req.params._id);
  res.send(bookings);
})

apiRouter.get('/loggedIn', async (req, res) => {
  const token = req?.cookies?._id.id
  if (token !== undefined && token !== "invalid") {
    console.log("LOGGED IN");
    const user = await DB.getUserByToken(token);
    res.send({loggedIn: true, ...user});
  }
  else res.send({loggedIn: false});
});

apiRouter.post('/oAuth', async (req, res) => {
  const user = await DB.getUser(req.body.email);
  if (user) {
    setAuthCookie(res, {id: user._id, name:req.body.firstName + " " + req.body.lastName});
    res.send({ _id: user._id });
    return;
  } else {
    const user = await DB.createUser(req.body);

    // Set the cookie
    setAuthCookie(res, user._id.toString());

    res.send({
      _id: user._id,
    });
  }
})

apiRouter.post('/login', async (req, res) => {
  const user = await DB.getUser(req.body.email);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      setAuthCookie(res, user._id.toString());
      res.send({ _id: user._id });
      return;
    }
  }
  res.status(401).send({ msg: 'Unauthorized' });
});

apiRouter.post('/register', async (req, res) => {
  if (await DB.getUser(req.body.email)) {
    res.status(409).send({ msg: 'Existing user' });
  } else {
    const user = await DB.createUser(req.body);

    // Set the cookie
    setAuthCookie(res, user._id.toString());

    res.send({
      _id: user._id,
    });
  }
});

apiRouter.delete('/logout', (_req, res) => {
  setAuthCookie(res, "invalid");
  res.status(204).end();
});

apiRouter.post('/review/:_id/:ratingCount/:starRating', async (req, res) => {
  let reviewId = await DB.addReview(req.body, req.params._id, req.params.ratingCount, req.params.starRating);
  res.send(reviewId);
})

apiRouter.get('/reviews/:_id', async (req, res) => {
  let reviews = await DB.getReviews(req.params._id);
  res.send(reviews);
});
// Return the application's default page if the path is unknown
app.use((req, res) => {
  res.sendFile('index.html', {root: 'public'});
});

function setAuthCookie(res, authToken) {
  res.cookie(authCookieName, authToken, {
    secure: true,
    httpOnly: true,
    sameSite: 'strict',
  });
}

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
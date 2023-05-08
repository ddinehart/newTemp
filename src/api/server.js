const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const express = require('express');
const app = express();
const DB = require('./experiencesDB.js');

const authCookieName = '_id';

// The service port. In production the application is statically hosted by the service on the same port.
const port = process.argv.length > 2 ? process.argv[2] : 8080;

// JSON body parsing using built-in middleware
app.use(express.json());

app.use(cookieParser());

// Serve up the applications static content
app.use(express.static('public'));

// Router for service endpoints
var apiRouter = express.Router();
app.use(`/api`, apiRouter);

// GetScores
apiRouter.get('/experiences/all/:limit', async (req, res) => {
  let limit = req.params.limit ? req.params.limit : 30;
  const scores = await DB.getExperiences(limit);
  res.send(scores);
});

apiRouter.get('/experiences/:id', async (req, res) => {
  const experiences = await DB.getUserExperiences(req.params.id);
  res.send(experiences);
})

// SubmitScore
apiRouter.post('/experience', async (req, res) => {
  DB.addExperience(req.body);
  res.sendStatus(200);
});

apiRouter.delete('/experience/:id', async (req, res) => {
    DB.deleteExperience(req.params.id);
    res.sendStatus(200);
})

apiRouter.get('/loggedIn', async (req, res) => {
  console.log(req.cookies);
  const token = req?.cookies._id
  if (token) res.send({loggedIn: true, id:req.cookies._id});
  else res.send({loggedIn: false});
});

apiRouter.get('/oAuth/:email', async (req, res) => {
  const user = await DB.getUser(req.params.email);
  console.log(user._id.toString());
  if (user) {
    setAuthCookie(res, user._id);
    res.send({ id: user._id });
    return;
  } else {
    const user = await DB.createUser(req.params);

    // Set the cookie
    setAuthCookie(res, user._id.toString());

    res.send({
      id: user._id,
    });
  }
})

apiRouter.post('/login', async (req, res) => {
  const user = await DB.getUser(req.body.email);
  if (user) {
    if (await bcrypt.compare(req.body.password, user.password)) {
      setAuthCookie(res, user._id.toString());
      res.send({ id: user._id });
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
      id: user._id,
    });
  }
});

apiRouter.delete('/logout', (_req, res) => {
  setAuthCookie(res, "invalid");
  res.status(204).end();
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
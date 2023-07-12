// import {MongoClient} from 'mongodb'

// async function handler(req, res) {
//  if (req.method === 'POST') {
//     const {
//     id = 'da39f21a-8af8-401a-93dd-4371c518f9cf',
//     authorId= '4',
//     date= 'May 20, 2022a',
//     listingCategoryId= 4,
//     title= 'Zion Wildflower',
//     featuredImage= 'https=//www.zionwildflower.com/wp-content/uploads/2020/06/King-Bungalow-Suite.jpg',
//     galleryImgs= [
//       'https=//www.zionwildflower.com/wp-content/uploads/2020/06/King-Bungalow-Suite.jpg',
//       'https=//lh5.googleusercontent.com/p/AF1QipMS5O0GVSH7zNlUvNkNu77_d0QJU_46DUeXvfJ4=w253-h189-k-no',
//       'https=//lh6.googleusercontent.com/proxy/rmIJ7NAgXzzwfxEOK7LC-pI09cmQNnYbf37zoTU-0_wVtmCimBjFsOYYOpP16EH7nTatwvQLqow1M10pOvSRBih56WrDdqDjPz_-mVOyufd7ZoxHIrHYy4DeztrpTaoKhGwhijFpKUqllIk1fWykRzVQGS7E2Q=w253-h168-k-no',
//      ' https=//lh5.googleusercontent.com/p/AF1QipNsk98_QoGHRsjL7zj5KgZJZjAJ6JwimnpTjBsW=w253-h168-k-no',
//     ],
//     commentCount= 64,
//     viewCount= 369,
//     like= true,
//     address= 'Zion Resort, 100 Kolob Terrace Rd, Virgin, UT 84779',
//     reviewStart= 4.4,
//     reviewCount= 478,
//     price= '$152',
//     maxGuests= 6,
//     saleOff= null,
//     isAds= null,
//     // map= { lat= '55.2094559', lng= '61.5594641' }
//   } = req.body;

//     if (!id || authorId || date || listingCategoryId || title ||featuredImage || galleryImgs || address ||price || maxGuests) {
//         res.status(422).json({message: 'invalid input'});
//         return;
//     }

//     const newExperience = {
//        id, 
//        authorId,
//        date, 
//        listingCategoryId,
//        title,
//        featuredImage,
//        galleryImgs,
//        commentCount,
//        viewCount,
//        like,
//        address,
//        reviewStart,
//        reviewCount,
//        price,
//        maxGuests,
//        saleOff,
//        isAds
//     }

//     let client;

//     try {

//     client = await MongoClient.connect(
//         "mongodb+srv://ddinehart:lapWxC303rNlPiNM@zve.vdfrtes.mongodb.net/zvesite?retryWrites=true&w=majority"
//     );
//     } catch (error) {
//         res.status(500).json({message: 'counld not connect'})
//         return
//     }

//     const db = client.db();

//     try {
//         const result = await db.collection('experiences').insertOne(newExperience)
//         newExperience._id = result.insertedId
//     }catch (error) {
//         client.close();
//         res.status(500).json({message: 'storing failed'})
//         return
//     }

//     client.close();
//     // console.log(newExperience);

//     res
//     .status(201)
//     .json({message: 'Successfully stored experience', message: newExperience});
//  }
// }

// export default handler;

const express = require("express");

// experienceRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /experience.
const experienceRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

// This section will help you get a list of all the experiences.
experienceRoutes.route("/experience").get(function (req, res) {
  let db_connect = dbo.getDb("experience");
  db_connect
    .collection("experiences")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// This section will help you get a single experience by id
experienceRoutes.route("/experience/:id").get(function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params._id) };
  db_connect.collection("experiences").findOne(myquery, function (err, result) {
    if (err) throw err;
    res.json(result);
  });
});

// This section will help you create a new experience.
experienceRoutes.route("/experience/add").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myobj = {
    _id: "da39f21a-8af8-401a-93dd-4371c518f9cf",
    authorId: 4,
    date: "May 20, 2022",
    href: "/listing-experiences-detail",
    listingCategoryId: 4,
    title: "Zion Wildflower",
    featuredImage:
      "https://www.zionwildflower.com/wp-content/uploads/2020/06/King-Bungalow-Suite.jpg",
    galleryImgs: [
      "https://www.zionwildflower.com/wp-content/uploads/2020/06/King-Bungalow-Suite.jpg",
      "https://lh5.googleusercontent.com/p/AF1QipMS5O0GVSH7zNlUvNkNu77_d0QJU_46DUeXvfJ4=w253-h189-k-no",
      "https://lh6.googleusercontent.com/proxy/rmIJ7NAgXzzwfxEOK7LC-pI09cmQNnYbf37zoTU-0_wVtmCimBjFsOYYOpP16EH7nTatwvQLqow1M10pOvSRBih56WrDdqDjPz_-mVOyufd7ZoxHIrHYy4DeztrpTaoKhGwhijFpKUqllIk1fWykRzVQGS7E2Q=w253-h168-k-no",
      "https://lh5.googleusercontent.com/p/AF1QipNsk98_QoGHRsjL7zj5KgZJZjAJ6JwimnpTjBsW=w253-h168-k-no",
    ],
    commentCount: 64,
    viewCount: 369,
    like: true,
    address: "Zion Resort, 100 Kolob Terrace Rd, Virgin, UT 84779",
    reviewStart: 4.4,
    reviewCount: 478,
    price: "$152",
    maxGuests: 6,
    saleOff: null,
    isAds: null,
  };
  db_connect.collection("experiences").insertOne(myobj, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
});

// This section will help you update a experience by id.
experienceRoutes.route("/update/:id").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params._id) };
  let newvalues = {
    $set: {
      name: req.body.name,
      position: req.body.position,
      level: req.body.level,
    },
  };
  db_connect
    .collection("experiences")
    .updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      console.log("1 document updated");
      response.json(res);
    });
});

// This section will help you delete a experience
experienceRoutes.route("/:id").delete((req, response) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId(req.params._id) };
  db_connect.collection("experiences").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    console.log("1 document deleted");
    response.json(obj);
  });
});

module.exports = experienceRoutes;

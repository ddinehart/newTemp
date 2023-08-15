require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

const url = `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@${process.env.HOSTNAME}`;
const client = new MongoClient(url);
const db = client.db(process.env.DATABASENAME);
const experienceCollection = db.collection(process.env.EXPERIENCECOLLECTION);
const userCollection = db.collection(process.env.USERCOLLECTION)
const reviewCollection = db.collection(process.env.REVIEWCOLLECTION)
const bookingCollection = db.collection(process.env.BOOKINGCOLLECTION)


async function addExperience(experience) {
  if (experience._id) {
    experience._id = new ObjectId(experience._id);
    await experienceCollection.replaceOne({_id: experience._id}, experience);
  } else {
    await experienceCollection.insertOne(experience);
  }
}

async function updateExperience(experience) {
  await experienceCollection.replaceOne({_id: new ObjectId(experience._id)}, {})
}

function getExperiences(limit) {
  try {
    const query = { };
    const options = {
      limit: limit,
    };
    const cursor = experienceCollection.find(query, options);
    return cursor.toArray();
  } catch (e) {
    return [];
  }
}
function getExperience(_id) {
  try {
    return experienceCollection.findOne({_id: new ObjectId(_id)});
  } catch (e) {
    return {};
  }
}
function getUserExperiences(_id) {
  try {
    const query = { userId: _id };
    const cursor = experienceCollection.find(query);
    return cursor.toArray();
  } catch (e) {
    return [];
  }
}

async function deleteExperience(_id) {
  try {
    await experienceCollection.deleteOne({_id: new ObjectId(_id)});
  } catch (e) {
    console.log(e);
  }
}

function getUser(email) {
  try {
    return userCollection.findOne({ email: email });
  } catch (e) {
    return {};
  }
}

async function updateQuantities(_id, quantities) {
  try {
    await experienceCollection.updateOne({ _id: new ObjectId(_id) }, { $set: { quantities: quantities } });
  } catch (e) {
    console.log(e);
  }
}

async function createUser(userData) {
  try {
  if (userData.password) userData.password = await bcrypt.hash(userData.password, 10);
  userData.token = uuid.v4();

  await userCollection.insertOne(userData);

  return userData;
  } catch (e) {
    return {};
  }
}

async function createBooking(booking) {
  try {
    let newBooking = await bookingCollection.insertOne(booking);
    return newBooking.insertedId.toString();
  } catch (e) {
    console.log(e);
    return "";
  }
}
async function getBooking(_id) {
  try {
    return bookingCollection.findOne({ _id: _id });
  } catch (e) {
    console.log(e);
    return {};
  }
}
async function getBookings(_id) {
  try {
    return bookingCollection.find({ userId: _id }).toArray();
  } catch (e) {
    return [];
  }
}

function getUserByToken(token) {
  console.log(token);
  try {
    return userCollection.findOne({ _id: new ObjectId(token) });
  } catch (e) {
    return {};
  }
}

async function addReview(review, _id, ratingCount, starRating) {
  try {
    ratingCount = parseInt(ratingCount);
    starRating = parseFloat(starRating);
    if (ratingCount === 0) await experienceCollection.updateOne({ _id: new ObjectId(_id) }, { $push: { ratings: review }, $set: { ratingCount: 1, starRating: review.rating } });
    else await experienceCollection.updateOne({ _id: new ObjectId(_id) }, { $push: { ratings: review }, $set: { ratingCount: ratingCount + 1, starRating: (((starRating * ratingCount) + review.rating) / (ratingCount + 1)).toFixed(1)}});
  } catch (e) {
    console.log(e);
  }
}

async function getReviews(_id) {
  try {
    let experience = await experienceCollection.findOne({ _id: new ObjectId(_id) });
    return experience.ratings;
  } catch (e) {
    return [];
  }
}

module.exports = { addExperience, getExperiences, deleteExperience, getUser, createUser, getUserByToken, getUserExperiences, getExperience, createBooking, getBooking, getBookings, addReview, updateQuantities, getReviews };
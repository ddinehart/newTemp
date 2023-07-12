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
  await experienceCollection.insertOne(experience);
}

async function updateExperience(experience) {
  await experienceCollection.replaceOne({_id: new ObjectId(experience._id)}, {})
}

function getExperiences(limit) {
  const query = { };
  const options = {
    limit: limit,
  };
  const cursor = experienceCollection.find(query, options);
  return cursor.toArray();
}
function getExperience(_id) {
  return experienceCollection.findOne({_id: new ObjectId(_id)});
}
function getUserExperiences(_id) {
  const query = { userId: _id };
  const cursor = experienceCollection.find(query);
  return cursor.toArray();
}

async function deleteExperience(_id) {
  await experienceCollection.deleteOne({_id: new ObjectId(_id)});
}

function getUser(email) {
  return userCollection.findOne({ email: email });
}

async function updateQuantities(_id, quantities) {
  await experienceCollection.updateOne({ _id: new ObjectId(_id) }, { $set: { quantities: quantities } });
}

async function createUser(userData) {
  console.log(userData);
  // Hash the password before we insert it into the database
  if (userData.password) userData.password = await bcrypt.hash(userData.password, 10);
  userData.token = uuid.v4();

  await userCollection.insertOne(userData);

  return userData;
}

async function createBooking(booking) {
  let newBooking = await bookingCollection.insertOne(booking);
  return newBooking.insertedId.toString();
}
async function getBooking(_id) {
  return bookingCollection.findOne({ _id: new ObjectId(_id) });
}
async function getBookings(_id) {
  return bookingCollection.find({ userId: _id }).toArray();
}

function getUserByToken(token) {
  return userCollection.findOne({ _id: new ObjectId(token) });
}

async function addReview(review, _id, ratingCount, starRating) {
  ratingCount = parseInt(ratingCount);
  starRating = parseFloat(starRating);
  if (ratingCount === 0) await experienceCollection.updateOne({ _id: new ObjectId(_id) }, { $push: { ratings: review }, $set: { ratingCount: 1, starRating: review.rating } });
  else await experienceCollection.updateOne({ _id: new ObjectId(_id) }, { $push: { ratings: review }, $set: { ratingCount: ratingCount + 1, starRating: (((starRating * ratingCount) + review.rating) / (ratingCount + 1)).toFixed(1)}});
}


module.exports = { addExperience, getExperiences, deleteExperience, getUser, createUser, getUserByToken, getUserExperiences, getExperience, createBooking, getBooking, getBookings, addReview, updateQuantities };
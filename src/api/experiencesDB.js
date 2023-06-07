require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcrypt');
const uuid = require('uuid');

const url = `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@${process.env.HOSTNAME}`;
const client = new MongoClient(url);
const db = client.db(process.env.DATABASENAME);
const experienceCollection = db.collection(process.env.EXPERIENCECOLLECTION);
const userCollection = db.collection(process.env.USERCOLLECTION)
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
function getExperience(id) {
  return experienceCollection.findOne({_id: new ObjectId(id)});
}
function getUserExperiences(id) {
  const query = { userId: id };
  const cursor = experienceCollection.find(query);
  return cursor.toArray();
}

async function deleteExperience(id) {
  await experienceCollection.deleteOne({_id: new ObjectId(id)});
}

function getUser(email) {
  return userCollection.findOne({ email: email });
}

async function createUser(userData) {
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
async function getBooking(id) {
  return bookingCollection.findOne({ _id: new ObjectId(id) });
}
async function getBookings(id) {
  return bookingCollection.find({ userId: id }).toArray();
}

function getUserByToken(token) {
  return userCollection.findOne({ token: token });
}

module.exports = { addExperience, getExperiences, deleteExperience, getUser, createUser, getUserByToken, getUserExperiences, getExperience, createBooking, getBooking, getBookings };
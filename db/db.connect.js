const mongoose = require('mongoose');
require('dotenv').config();

const mongoURI = process.env.MONGODB;

const initializeDatabase = async () => {
  await mongoose
    .connect(mongoURI)
    .then(() => {
      console.log('Connected to the database.');
    })
    .catch((error) => {
      console.log('Error connecting the database.', error);
    });
};

module.exports = { initializeDatabase };

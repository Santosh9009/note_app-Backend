const mongoose = require('mongoose');

const mongoURI = 'mongodb://0.0.0.0';

const connectToMongo = () => {
  mongoose.connect(mongoURI);

  // Event listeners for successful connection and errors
  mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB successfully!');
  });

  mongoose.connection.on('error', (err) => {
    console.error('Error connecting to MongoDB:', err);
  });
};

module.exports = connectToMongo;

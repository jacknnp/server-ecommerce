const mongoose = require("mongoose");

const keys = require("../config/keys");
const { database } = keys;
const options = {
  autoIndex: false, // Don't build indexes
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
  family: 4, // Use IPv4, skip trying IPv6
};

const connectDB = async () => {
  try {
    // Connect to MongoDB
    mongoose
      .connect(database.url, options)
      .then(() => console.log("MONGO CONNECTED !"))
      .catch((err) => console.log(err));
  } catch (error) {
    return null;
  }
};

module.exports = connectDB;

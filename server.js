const http = require("http");
const app = require("./config/express");
const connectDB = require("./config/mongoose");
require("dotenv").config();
const port = process.env.PORT;
//Socket.io---------------------------------
const socket = require("./socket");
//Socket.io---------------------------------

// Create Http Server
const server = http.createServer(app);

server.listen(port || 3000);

// Listening on listening to port
const onListening = () => {
  connectDB();
  console.log(`Server is Running on port ${port} `);
};
// Listen to error on listening to port
const onError = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;
  switch (error.code) {
    case "EACCES":
      console.log(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.log(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      console.log(`Error not know`);
      process.exit(1);
      throw error;
  }
};

/**
 * Exports Express
 * @public
 */

server.on("listening", onListening);
server.on("error", onError);
socket(server);
module.exports = server;

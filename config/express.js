const express = require("express");
//Lib Middle---------------------------------
const compression = require("compression");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");

//Lib Middle---------------------------------

//Api --------------------------------------
const api = require("../config/api");
//Api --------------------------------------

const app = express();
require("./passport");
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(
  helmet({
    contentSecurityPolicy: false,
    frameguard: true,
  })
);
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json({ limit: "50mb" }));
app.use(api);

module.exports = app;

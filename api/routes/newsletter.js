const express = require("express");
const { addSubscribeletter } = require("../controller/newsletter");
const router = express.Router();

router.post("/subscribe", addSubscribeletter);

module.exports = router;

const express = require("express");
const { addContact } = require("../controller/contact");
const router = express.Router();

router.post("/add", addContact);

module.exports = router;

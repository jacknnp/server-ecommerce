//Models------------------------------------
const Contact = require("../models/contact");

//Models------------------------------------
//Service Helper----------------------------
const mailgun = require("../service/mailgun");
//Service Helper----------------------------

exports.addContact = (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    if (!email) {
      return res
        .status(400)
        .json({ error: "You must enter an email address." });
    }

    if (!name) {
      return res
        .status(400)
        .json({ error: "You must enter description & name." });
    }

    if (!message) {
      return res.status(400).json({ error: "You must enter a message." });
    }

    const contact = new Contact({
      name,
      email,
      message,
    });

    contact.save(async (err, data) => {
      if (err) {
        return res.status(400).json({
          error: "Your request could not be processed. Please try again.",
        });
      }

      await mailgun.sendEmail(email, "contact");

      res.status(200).json({
        success: true,
        message: `We receved your message, we will reach you on your email address ${email}!`,
        contact: data,
      });
    });
  } catch (error) {
    res.status(400).json({ error: "Please check your connection and Retry !" });
  }
};

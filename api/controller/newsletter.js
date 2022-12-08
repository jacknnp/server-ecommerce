//Service Helper------------------------------

const mailgun = require("../service/mailgun");
const mailchimp = require("../service/mailchimp");
//Service Helper------------------------------

exports.addSubscribeletter = async (req, res, next) => {
  try {
    const email = req.body.email;

    if (!email) {
      return res
        .status(400)
        .json({ error: "You must enter an email address." });
    }

    const result = await mailchimp.subscribeToNewsletter(email);

    if (result.status === 400) {
      return res.status(400).json({ error: result.title });
    }

    await mailgun.sendEmail(email, "newsletter-subscription");

    res.status(200).json({
      success: true,
      message: "You have successfully subscribed to the newsletter",
    });
  } catch (error) {
    res.status(400).json({ error: result.title });
  }
};

const mailgun = require("mailgun-js");
const keys = require("../../config/keys");
const template = require("../../config/template");

const { key, domain, sender } = keys.mailgun;

//@build Class contructor
const mg = mailgun({ apiKey: key, domain: domain });

exports.sendEmail = async (email, type, host, data) => {
  console.log("Hello");
  console.log(key);
  try {
    const message = prepareTemplate(type, host, data);
    const config = {
      from: `PhuocNguyen Store! <${sender}> `,
      to: email,
      subject: message.subject,
      text: message.text,
    };
    return await mg.messages().send(config, (error, body) => {
      console.log(body);
    });
  } catch (error) {
    return error;
  }
};
const prepareTemplate = (type, host, data) => {
  let message;
  switch (type) {
    case "reset":
      message = template.resetEmail(host, data);
      break;

    case "reset-confirmation":
      message = template.confirmResetPasswordEmail();
      break;

    case "signup":
      message = template.signupEmail(data);
      break;

    case "merchant-signup":
      message = template.merchantSignup(host, data);
      break;

    case "merchant-welcome":
      message = template.merchantWelcome(data);
      break;

    case "newsletter-subscription":
      message = template.newsletterSubscriptionEmail();
      break;

    case "contact":
      message = template.contactEmail();
      break;

    case "merchant-application":
      message = template.merchantApplicationEmail();
      break;

    case "order-confirmation":
      message = template.orderConfirmationEmail(data);
      break;

    default:
      message = "";
  }

  return message;
};

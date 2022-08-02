const sgMail = require("@sendgrid/mail");
const User = require("../models/user");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: process.env.ADMIN_EMAIL,
    subject: "Thanks for joining!",
    text: `Welcome to the app, ${name}. Let me know how you get along with the app.`,
  });
};

const sendAccountCancelationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: process.env.ADMIN_EMAIL,
    subject: "Sorry to see you leave",
    text: `Thanks for trying the app, ${name}. If you have time, please let us know what we can do better. Hope to see you again soon!`,
  });
};

module.exports = {
  sendWelcomeEmail,
  sendAccountCancelationEmail,
};

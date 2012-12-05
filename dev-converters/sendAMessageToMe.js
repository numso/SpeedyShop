var nodemailer = require("nodemailer");

var smtpTransport = nodemailer.createTransport("SMTP",{
  service: "Gmail",
  auth: {
    user: "speedyshopsales@gmail.com",
    pass: "speedyshop1"
  }
});

var mailOptions = {
  from: "Speedy Shop <speedyshopsales@gmail.com>", // sender address
  to: "dontspamitsnotnice", // list of receivers
  subject: "Testing123", // Subject line
  text: "This is a little test", // plaintext body
  html: "<b>This ones in html</b>" // html body
};

// send mail with defined transport object
smtpTransport.sendMail(mailOptions, function (err, response) {
  if (err) {
    console.log(err);
  } else {
    console.log("Message sent: " + response.message);
  }

  smtpTransport.close();
});

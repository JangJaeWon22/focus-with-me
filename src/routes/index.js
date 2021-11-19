const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/nodemailerTest", function(req, res, next){
  let email = req.body.email;
  
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user:'test@gmail.com',
      password:'test'
    }
  });

  let mailOptions = {
    from: 'test@gmail.com',
    to: email,
    subject: 'sending email using node.js',
    text: 'challenge yourself'
  };
  
  transporter.sendMail
});
module.exports = router;

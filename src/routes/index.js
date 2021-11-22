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
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.NODEMAILER_USER,
      password: process.env.NODEMAILER_PASS,
    },
  });

  let mailOptions = {
    from: 'test@gmail.com',
    to: email,
    subject: 'sending email using node.js',
    text: 'challenge yourself'
  };
  
  let info = await transporter.sendMail({
    from: `"WDMA Team" <${process.env.NODEMAILER_USER}>`,
    to: email,
    subject: 'WDMA Auth Number',
    text: generatedAuthNumber,
    html: `<b>${generatedAuthNumber}</b>`
  });

  console.log('Message sent: %s', info.messageId);

  res.status(200).json({
    status: 'success',
    code: 200,
    message: 'sent auth email'
  });
});
module.exports = router;

main().catch(console.error);
const express = require("express");
const logger = require("morgan");
const app = express();
const cmtRouter = require("./routes/comments");
const postsRouter = require("./routes/posts");
const cors = require("cors");
const userRouter = require("./routes/users");
const { sequelize } = require("./models");
require("dotenv").config();
const passport = require("passport");
const passportConfig = require("./passport");
const session = require("express-session");

//swagger
// const swaggerUi = require("swagger-ui-express");
// const swaggerFile = require("./swagger-output");

// 테스트용
const { uploadContents, uploadTemp } = require("./middlewares/upload");

sequelize
  .sync({ force: false })
  .then(() => {
    console.log(
      `
      🐬🐬🐬🐬🐬🐬🐬🐬🐬🐬🐬🐬
      🐬🐬🐬🐬🐬🐬🐬🐬🐬🐬🐬🐬
      🐬🐬 돌고래 db 연결 🐬🐬
      🐬🐬🐬🐬🐬🐬🐬🐬🐬🐬🐬🐬
      🐬🐬🐬🐬🐬🐬🐬🐬🐬🐬🐬🐬
      🐙🐙🐙🐙🐙🐙🐙🐙🐙🐙🐙🐙
      🐙🐙🐙 나는 무너! 🐙🐙🐙
      🐙🐙 꿈을 꾸는 무너 🐙🐙
      🐙🐙🐙🐙🐙🐙🐙🐙🐙🐙🐙🐙
      `
    );
  })
  .catch((err) => {
    console.error(err);
  });

app.use(cors({ origin: true, credentials: true }));
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/public", express.static("public"));

//swagger
// app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));

//passport
passportConfig();
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "secret",
  })
);
app.use(passport.initialize());
app.use(passport.session()); // passport index 실행

//routing
app.use("/api", cmtRouter);
app.use("/api", userRouter);
app.use("/api", postsRouter);

//테스트 router
app.use("/api/test", uploadContents.single("image"), async (req, res) => {
  const { path } = req.file;

  console.log(path);
  return res.status(200).send({ path });
});

app.use("/api/ckUpload", uploadTemp.single("temp"), async (req, res) => {
  const { path } = req.file;

  return res.status(200).send({ path });
});

//Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

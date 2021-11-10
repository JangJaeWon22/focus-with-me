const express = require("express");
const logger = require("morgan");
const app = express();
const cors = require("cors");
const { sequelize } = require("./models");
require("dotenv").config();
const passport = require("passport");
const passportConfig = require("./passport");
const session = require("express-session");
const userRouter = require("./routes/users");
const postsRouter = require("./routes/posts");
const likeRouter = require("./routes/postlike");
const cmtRouter = require("./routes/comments");
const followRouter = require("./routes/follow");
const userInfoRouter = require("./routes/userInfo");
const bookmarkRouter = require("./routes/bookmark");
const likeCommentRouter = require("./routes/commentslike");

//swagger
const swaggerUi = require("swagger-ui-express");
const swaggerFile = require("./swagger-output");

// 테스트용
// const authMiddleware = require("./middlewares/auth");

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
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));

//passport
passportConfig();
// app.use(
//   session({
//     // false, 변경사항도 없는 session이 매번 다시 저장되는 걸 막아 작동 효율을 높임
//     resave: false,
//     // saveUninitialized: true => uninitialized 상태의 session을 강제로 저장,
//     // false => empty session obj가 쌓이는 걸 방지해 서버 스토리지를 아낄 수 있습니다.
//     saveUninitialized: false,
//     secret: "secret",
//     // 세션 쿠키 설정 (세션 관리 시 클라이언트에 보내는 쿠키)
//     cookie: {
//       httpOnly: true,
//       secure: false,
//     },
//   })
// );
app.use(passport.initialize());
// app.use(passport.session());

//routing
app.use("/api", cmtRouter);
app.use("/api", userRouter);
app.use("/api", postsRouter);
app.use("/api", likeRouter);
app.use("/api", followRouter);
app.use("/api", userInfoRouter);
app.use("/api", bookmarkRouter);
app.use("/api", likeCommentRouter);

//Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

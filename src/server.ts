import express from "express";
import morgan from "morgan";
import cors from "cors";
import userRouter from "./routes/users";
import postsRouter from "./routes/posts";
import likeRouter from "./routes/postsLike";
import cmtRouter from "./routes/comments";
import followRouter from "./routes/follow";
import userInfoRouter from "./routes/userInfo";
import bookmarkRouter from "./routes/bookmark";
import likeCommentRouter from "./routes/commentsLike";
import childCommentRouter from "./routes/childComments";

const app: express.Application = express();

import * as dotenv from "dotenv";
dotenv.config();

//swagger
import swaggerUi from "swagger-ui-express";
import swaggerFile from "./swagger-output.json";

// sequelize
  // .sync({ force: false })
  // .then(() => {
  //   console.log(
  //     `
  //     π¬π¬π¬π¬π¬π¬π¬π¬π¬π¬π¬π¬
  //     π¬π¬π¬π¬π¬π¬π¬π¬π¬π¬π¬π¬
  //     π¬π¬ λκ³ λ db μ°κ²° π¬π¬
  //     π¬π¬π¬π¬π¬π¬π¬π¬π¬π¬π¬π¬
  //     π¬π¬π¬π¬π¬π¬π¬π¬π¬π¬π¬π¬
  //     ππππππππππππ
  //     πππ λλ λ¬΄λ! πππ
  //     ππ κΏμ κΎΈλ λ¬΄λ ππ
  //     ππππππππππππ
  //     `
  //   );
  // })
  // .catch((error) => {
  //   console.error(error);
  // });

app.use(cors({ origin: true, credentials: true }));

app.use(
  morgan(
    `HTTP/:http-version :method :remote-addr [:url] :remote-user (:status) [:res[content-length]] [:referrer // :user-agent] [:response-time ms] `
    // { stream }
  )
);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use("/public", express.static("public"));

//swagger
app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerFile));

//passport
import passport from 'passport';
import Passport from "./passport"
const passportConfig: Passport = new Passport();
passportConfig.config()
// passportConfig();
// app.use(
//   session({
//     // false, λ³κ²½μ¬ν­λ μλ sessionμ΄ λ§€λ² λ€μ μ μ₯λλ κ±Έ λ§μ μλ ν¨μ¨μ λμ
//     resave: false,
//     // saveUninitialized: true => uninitialized μνμ sessionμ κ°μ λ‘ μ μ₯,
//     // false => empty session objκ° μμ΄λ κ±Έ λ°©μ§ν΄ μλ² μ€ν λ¦¬μ§λ₯Ό μλ μ μμ΅λλ€.
//     saveUninitialized: false,
//     secret: "secret",
//     // μΈμ μΏ ν€ μ€μ  (μΈμ κ΄λ¦¬ μ ν΄λΌμ΄μΈνΈμ λ³΄λ΄λ μΏ ν€)
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
app.use("/api", childCommentRouter);

// metrics
const client = require("prom-client");

const collectDefaultMetrics = client.collectDefaultMetrics;
client.collectDefaultMetrics({ timeOut: 5000 });

const counter = new client.Counter({
  name: "node_request_operations_total",
  help: "The total number of processed request",
});

const histogram = new client.Histogram({
  name: "node_request_duration_seconds",
  help: "Histogram for the durations in seconds",
  buckets: [1, 2, 5, 6, 10],
});

app.get("/", (req, res) => {
  let start: any = new Date();
  let simulateTime = 1000;

  setTimeout(() => {
    let time: any = new Date() 
    let end = time - start;
    histogram.observe(end / 1000);
  }, simulateTime);
  counter.inc();

  res.send("μμ΄μΉ μμ΄");
});

app.get("/metrics", async (req, res) => {
  res.setHeader("Content-Type", client.register.contentType);
  res.send(await client.register.metrics());
});

//Error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app;

"use strict";
exports.__esModule = true;
var express_1 = require("express");
var morgan_1 = require("morgan");
var cors_1 = require("cors");
var users_1 = require("./routes/users");
var posts_1 = require("./routes/posts");
var postsLike_1 = require("./routes/postsLike");
var comments_1 = require("./routes/comments");
var follow_1 = require("./routes/follow");
var userInfo_1 = require("./routes/userInfo");
var bookmark_1 = require("./routes/bookmark");
var commentsLike_1 = require("./routes/commentsLike");
var childComments_1 = require("./routes/childComments");
var app = (0, express_1["default"])();
var dotenv = require("dotenv");
dotenv.config();
//swagger
var swagger_ui_express_1 = require("swagger-ui-express");
var swagger_output_json_1 = require("./swagger-output.json");
// sequelize
// .sync({ force: false })
// .then(() => {
//   console.log(
//     `
//     🐬🐬🐬🐬🐬🐬🐬🐬🐬🐬🐬🐬
//     🐬🐬🐬🐬🐬🐬🐬🐬🐬🐬🐬🐬
//     🐬🐬 돌고래 db 연결 🐬🐬
//     🐬🐬🐬🐬🐬🐬🐬🐬🐬🐬🐬🐬
//     🐬🐬🐬🐬🐬🐬🐬🐬🐬🐬🐬🐬
//     🐙🐙🐙🐙🐙🐙🐙🐙🐙🐙🐙🐙
//     🐙🐙🐙 나는 무너! 🐙🐙🐙
//     🐙🐙 꿈을 꾸는 무너 🐙🐙
//     🐙🐙🐙🐙🐙🐙🐙🐙🐙🐙🐙🐙
//     `
//   );
// })
// .catch((error) => {
//   console.error(error);
// });
app.use((0, cors_1["default"])({ origin: true, credentials: true }));
app.use((0, morgan_1["default"])("HTTP/:http-version :method :remote-addr [:url] :remote-user (:status) [:res[content-length]] [:referrer // :user-agent] [:response-time ms] "
// { stream }
));
app.use(express_1["default"].json());
app.use(express_1["default"].urlencoded({ extended: false }));
// app.use("/public", express.static("public"));
//swagger
app.use("/swagger", swagger_ui_express_1["default"].serve, swagger_ui_express_1["default"].setup(swagger_output_json_1["default"]));
//passport
var passport_1 = require("passport");
var passport_2 = require("./passport");
var passportConfig = new passport_2["default"]();
passportConfig.config();
// passportConfig();
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
app.use(passport_1["default"].initialize());
// app.use(passport.session());
//routing
app.use("/api", comments_1["default"]);
app.use("/api", users_1["default"]);
app.use("/api", posts_1["default"]);
app.use("/api", postsLike_1["default"]);
app.use("/api", follow_1["default"]);
app.use("/api", userInfo_1["default"]);
app.use("/api", bookmark_1["default"]);
app.use("/api", commentsLike_1["default"]);
app.use("/api", childComments_1["default"]);
// metrics
// const client = require("prom-client");
// collectDefaultMetrics = client.collectDefaultMetrics;
// client.collectDefaultMetrics({ timeOut: 5000 });
// const counter = new client.Counter({
//   name: "node_request_operations_total",
//   help: "The total number of processed request",
// });
// const histogram = new client.Histogram({
//   name: "node_request_duration_seconds",
//   help: "Histogram for the durations in seconds",
//   buckets: [1, 2, 5, 6, 10],
// });
// app.get("/", (req, res) => {
//   let start = new Date();
//   let simulateTime = 1000;
//   setTimeout(() => {
//     let end = new Date() - start;
//     histogram.observe(end / 1000);
//   }, simulateTime);
//   counter.inc();
//   res.send("에이치 아이");
// });
// app.get("/metrics", async (req, res) => {
//   res.setHeader("Content-Type", client.register.contentType);
//   res.send(await client.register.metrics());
// });
//Error handler
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render("error");
});
exports["default"] = app;

const app = require("./server");
const dotenv = require("dotenv");
const schedule = require("node-schedule");
const { emptyTempS3 } = require("./library/controlS3");

dotenv.config();
const port = process.env.EXPRESS_PORT;

//winston
const { logger } = require("./config/logger");

//test용 시작 view page
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");
app.get("/", (req, res) => {
  const title = "YJ's playground";
  res.render("index", { title });
});

// 매일 0시 0분 0초에 temp 폴더 비우기
// 초 분 시 일 월 년
const job = schedule.scheduleJob("0 0 0 * * *", async () => {
  await emptyTempS3();
  console.log("temp 폴더 삭제");
});

// const fs = require("fs");
// const https = require("https");
// // Certificate 인증서 경로
// const privateKey = fs.readFileSync(
//   "/etc/letsencrypt/live/wwworld.shop/privkey.pem",
//   "utf8"
// );
// const certificate = fs.readFileSync(
//   "/etc/letsencrypt/live/wwworld.shop/cert.pem",
//   "utf8"
// );
// const ca = fs.readFileSync(
//   "/etc/letsencrypt/live/wwworld.shop/chain.pem",
//   "utf8"
// );

// const credentials = {
//   key: privateKey,
//   cert: certificate,
//   ca: ca,
// };

// const httpsServer = https.createServer(credentials, app);

app.listen(port, () => {
  logger.info(`
  ${port} 포트에서 서버가 가동되었습니다.😄😄
----------------------------------------------

       / / / / / / / / / / 
      / / / / / / / / / / 
    ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ
               __
              / _) 
       .-^^^-/ / 
    __/       / 
   <__.|_|-|_|

----------------------------------------------
  `);
});

// httpsServer.listen(443, () => {
//   logger.info(`
//   ${port} 포트에서 서버가 가동되었습니다.😄😄
// ----------------------------------------------

//        / / / / / / / / / /
//       / / / / / / / / / /
//     ㅇㅇㅇㅇㅇㅇㅇㅇㅇㅇ
//                __
//               / _)
//        .-^^^-/ /
//     __/       /
//    <__.|_|-|_|

// ----------------------------------------------
//   `);
// });

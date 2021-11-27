import app from "./server";
import * as dotenv from "dotenv";
dotenv.config();
import * as schedule from "node-schedule";
import ControlS3 from "./library/controlS3";
const { emptyTempS3 } = ControlS3;

const port = process.env.EXPRESS_PORT;

//winston
import { logger } from "./config/logger";

//test용 시작 view page
// app.set("views", __dirname + "/views");
// app.set("view engine", "ejs");
// app.get("/", (req, res) => {
//   const title = "YJ's playground";
//   res.render("index", { title });
// });

// 매일 0시 0분 0초에 temp 폴더 비우기
// 초 분 시 일 월 년
const job = schedule.scheduleJob("0 0 0 * * *", async () => {
  await emptyTempS3();
  console.log("temp 폴더 삭제");
});

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
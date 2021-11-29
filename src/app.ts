import app from "./server";
import * as dotenv from "dotenv";
dotenv.config();
import * as schedule from "node-schedule";
import ControlS3 from "./library/controlS3";
const { emptyTempS3 } = ControlS3;
import { sequelize } from './models';

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

//sequelize(ORM)
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
    )
  })
  .catch((err) => {
    console.error(err);
  });





app.listen(port, async () => {
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
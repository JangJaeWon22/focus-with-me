const app = require("./server");
const dotenv = require("dotenv");
const schedule = require("node-schedule");
const { emptyTemp } = require("./library/controlImage");

dotenv.config();
const port = process.env.EXPRESS_PORT;

//test용 시작 view page
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  const title = "YJ's playground";
  res.render("index", { title });
});

// 매일 0시 0분 0초에 temp 폴더 비우기
// 초 분 시 일 월 년
const job = schedule.scheduleJob("0 0 0 * * *", () => {
  emptyTemp();
  console.log("temp 폴더 삭제 후 다시 생성");
});

app.listen(port, () => {
  console.log(`${port} 포트에서 서버가 가동되었습니다.`);
});

const app = require("./server");
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.EXPRESS_PORT;

//test용 시작 view page
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  const title = "YJ's playground";
  res.render("index", { title });
});
//test용 끝

app.listen(port, () => {
  console.log(`${port} 포트에서 서버가 가동되었습니다.`);
});

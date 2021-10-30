// const date = new Date();

// let dateString = date.toLocaleDateString();
// let dateString2 = date.toLocaleTimeString();
// let dateString3 = date.toDateString();
// let dateString4 = date.toLocaleString();
// let dateString5 = date.toString();
// let dateString6 = date.toTimeString();
// let dateString7 = date.toString();

// let year = date.getFullYear();
// let month = date.getMonth() + 1;
// let day = date.getDate();
// let hour = date.getHours();
// let min = date.getMinutes();
// let second = date.getSeconds();

// // console.log(dateString);
// // console.log(dateString2);
// // console.log(dateString3);
// // console.log(dateString4);
// // console.log(dateString5);
// // console.log(dateString6);
// console.log(dateString7);

// let yyyyMMdd = [year, month, day].join("-");
// let hhmmss = [hour, min, second].join(":");

// let new = [yyyyMMdd, hhmmss].join('T');

// console.log(yyyyMMdd, hhmmss);

// Open a log file
// var myLog = new File("/data/logs/today.log");

// // See if the file exists
// if(myLog.exists()){
//   write('The file exists');
// }else{
//   write('The file does not exist');
// }

const html =
  '<p>Hello from CKEditor 5!asdasd<img src="http://3.34.44.44/public/uploads/temp/118a341adfcd0d8c8fa644fd864fa5ac"><img src="http://3.34.44.44/public/uploads/temp/cd89fda042bfb6b9b860bbf9119d7213"><img src="http://3.34.44.44/public/uploads/temp/0b0ae407a1726bcaeb05614b8bec9264"></p>';

var regexp = /<img[^>]+src\s*=\s*['"]([^'"]+)['"][^>]*>/g;
var srcs = html.match(regexp);

console.log(srcs);
const imageList = [];
srcs.forEach((src) => {
  const test = "public" + src.split("public")[1].slice(0, -2);
  console.log(test);
  imageList.push(test);
});
console.log(process.cwd() + "/src/" + imageList[0]);
console.log(imageList);

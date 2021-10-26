const date = new Date();

let dateString = date.toLocaleDateString();
let dateString2 = date.toLocaleTimeString();
let dateString3 = date.toDateString();
let dateString4 = date.toLocaleString();
let dateString5 = date.toString();
let dateString6 = date.toTimeString();
let dateString7 = date.toString();

let year = date.getFullYear();
let month = date.getMonth() + 1;
let day = date.getDate();
let hour = date.getHours();
let min = date.getMinutes();
let second = date.getSeconds();

// console.log(dateString);
// console.log(dateString2);
// console.log(dateString3);
// console.log(dateString4);
// console.log(dateString5);
// console.log(dateString6);
console.log(dateString7);

let yyyyMMdd = [year, month, day].join("-");
let hhmmss = [hour, min, second].join(":");

// let new = [yyyyMMdd, hhmmss].join('T');

console.log(yyyyMMdd, hhmmss);

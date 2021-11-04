const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "API",
    description: "Description",
  },
  host: "localhost:8080",
  schemes: ["http"],
};

const outputFile = "./swagger-output.json";
const endpointsFiles = [
  "./app.js",
  "./routes/users.js",
  "./routes/posts.js",
  "./routes/postlike.js",
  "./routes/comments.js",
  "./routes/bookmark.js",
  "./routes/myinfo.js",
];

/* NOTE: if you use the express Router, you must pass in the 
   'endpointsFiles' only the root file where the route starts,
   such as index.js, app.js, routes.js, ... */

swaggerAutogen(outputFile, endpointsFiles, doc);

const multer = require("multer");
const path = require("path");

module.exports = {
  //파일 생성 규칙
  uploadAvatar: multer({
    storage: multer.diskStorage({
      destination(req, file, cb) {
        cb(null, "${__dirname}/../public/uploads/avatar");
      },
      /*       filename(req, file, cb) {
        // const fileName = randomstring.generate(20);
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext);
      }, */
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
  }),
  uploadCover: multer({
    dest: "public/uploads/cover",
    limits: { fileSize: 1000000 },
  }),
  uploadContents: multer({
    dest: "public/uploads/content",
    limits: { fileSize: 1000000 },
  }),
  uploadTemp: multer({
    dest: "public/uploads/temp",
    limits: { fileSize: 1000000 },
  }),
};

const multer = require("multer");

module.exports = {
  uploadAvatar: multer({
    dest: "uploads/avatars",
    limits: { fileSize: 1000000 },
  }),
  uploadCover: multer({
    dest: "uploads/covers",
    limits: { fileSize: 1000000 },
  }),
  uploadContents: multer({
    dest: "uploads/Contents",
    limits: { fileSize: 1000000 },
  }),
};

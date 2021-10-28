const multer = require("multer");

module.exports = {
  uploadAvatar: multer({
    dest: "public/uploads/avatars",
    limits: { fileSize: 1000000 },
  }),
  uploadCover: multer({
    dest: "public/uploads/covers",
    limits: { fileSize: 1000000 },
  }),

  uploadContents: multer({
    dest: "public/uploads/contents",
    limits: { fileSize: 1000000 },
  }),
};

const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const bookmarkProcess = require("../controllers/bookmark-ctrl/bookmarkProcess");

router.post(
  "/bookmarks/:postId",
  authMiddleware,
  bookmarkProcess.createbookmark
);

module.exports = router;

const express = require("express");
const router = express.Router();
const { logInOnly } = require("../middlewares/passport-auth");
const {
  bookmarkProcess,
} = require("../controllers/bookmark-ctrl/bookmarkProcess");

router.post("/bookmarks/:postId", logInOnly, bookmarkProcess.createbookmark);
router.delete("/bookmarks/:postId", logInOnly, bookmarkProcess.deleteBookmark);

module.exports = router;

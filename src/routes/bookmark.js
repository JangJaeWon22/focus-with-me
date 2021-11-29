"use strict";
exports.__esModule = true;
var express = require("express");
var router = express.Router();
var passport_auth_1 = require("../middlewares/passport-auth");
var bookmarkProcess_1 = require("../controllers/bookmarkProcess");
router.post("/bookmarks/:postId", passport_auth_1.logInOnly, bookmarkProcess_1["default"].createbookmark);
router["delete"]("/bookmarks/:postId", passport_auth_1.logInOnly, bookmarkProcess_1["default"].deleteBookmark);
exports["default"] = router;

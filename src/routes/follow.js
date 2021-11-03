const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");

router.post("follows/create");

module.exports = router;

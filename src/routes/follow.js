const express = require("express");
const router = express.Router();
const authMW = require("../middlewares/auth");

router.post("follows/create");

module.exports = router;

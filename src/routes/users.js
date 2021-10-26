const express = require("express");
const router = express.Router();
const userCtrl = require("../controller/users-ctrl/users-ctrl");

router.post("/users/signup", userCtrl.userProcess.createUser);

module.exports = router;

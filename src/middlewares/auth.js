const Jwt = require("jsonwebtoken");
const { User } = require("../models");
const dotenv = require("dotenv");
dotenv.config();

const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;
  const [tokenType, tokenValue] = authorization.split(" ");
  if (tokenType !== "Bearer") {
    return res.status(200).send({
      message: "로그인이 필요한 기능입니다.",
    });
  }

  try {
    const { userId } = Jwt.verify(tokenValue, process.env.TOKEN_KEY);
    User.findOne({ where: { id: userId } }).then((user) => {
      res.locals.user = user;
      next();
    });
  } catch (error) {
    res.status(400).send({
      message: "로그인이 필요한 기능입니다.",
    });
    return;
  }
};

module.exports = authMiddleware;

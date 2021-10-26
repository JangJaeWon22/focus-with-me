const Jwt = require("jsonwebtoken");
const { User } = require("../models");
const dotenv = require("dotenv");
dotenv.config();

const authMiddleware = (req, res, next) => {
  const { authorization } = req.headers;
  const [tokenType, tokenValue] = authorization.split(" ");
  if (tokenType !== "Bearer") {
    return res.status(200).send({
      message: "로그인 후 사용하세요.",
    });
  }

  try {
    const { userId } = jwt.verify(tokenValue, process.env.TOKEN_KEY);
    User.findOne({ where: { userId } }).then((user) => {
      res.locals.user = user;
      console.log(user);
      console.log(res.locals.user);
      next();
    });
  } catch (error) {
    res.status(400).send({
      message: "로그인 후 사용하세요.",
    });
    return;
  }
};

module.exports = authMiddleware;

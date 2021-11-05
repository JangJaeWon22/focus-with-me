const Jwt = require("jsonwebtoken");
const { User } = require("../models");
const dotenv = require("dotenv");
dotenv.config();

// 로그인 판별
const authMiddleware = (req, res, next) => {
  console.log("로그인 인증 미들웨어 입장");
  const { authorization } = req.headers;
  if (!authorization)
    return res.status(200).send({ message: "로그인이 필요한 기능입니다." });
  const [tokenType, tokenValue] = authorization.split(" ");
  if (tokenType !== "Bearer") {
    return res.status(200).send({
      message: "로그인이 필요한 기능입니다.",
    });
  }

  try {
    const { userId } = Jwt.verify(tokenValue, process.env.TOKEN_KEY);
    User.findOne({
      where: { userId },
      include: [
        {
          model: User,
          attributes: ["userId", "nickname"],
          as: "Followers",
        },
        {
          model: User,
          attributes: ["userId", "nickname"],
          as: "Followings",
        },
      ],
    }).then((user) => {
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

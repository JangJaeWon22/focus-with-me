const Jwt = require("jsonwebtoken");
const { User } = require("../models");
const dotenv = require("dotenv");
dotenv.config();

// 로그인 판별
const authMiddleware = (req, res, next) => {
  console.log("로그인 인증 미들웨어 입장");
  console.log(req.headers);
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
    console.log(userId);
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
      console.log("로그인 인증 확인함 나갈께요");
      next();
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      message: "로그인이 필요한 기능입니다.",
      error,
    });
    return;
  }
};

module.exports = authMiddleware;

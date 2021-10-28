const Joi = require("joi");

const joiSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .max(50)
    .required(),
  nickname: Joi.string().min(1).max(20).required(),
  password: Joi.string().min(6).pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  confirmPassword: Joi.ref("password"),
});

const verifyJoi = async (req, res, next) => {
  const { email, nickname, password, confirmPassword } = req.body;
  try {
    const verifyBody = await joiSchema.validateAsync({
      email,
      nickname,
      password,
      confirmPassword,
    });
    res.verifyBody = verifyBody;
    next();
  } catch (err) {
    return res.status(400).send({
      message: "아이디와 비밀번호의 형식이 올바르지 않습니다.",
    });
  }
};

module.exports = verifyJoi;

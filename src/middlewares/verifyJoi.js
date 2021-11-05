const Joi = require("joi");

const verifyJoi = {
  //회원가입 시 joi 검증 실행
  singUpUser: async (req, res, next) => {
    const joiSchema = Joi.object({
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .max(50)
        .required(),
      nickname: Joi.string().min(1).max(20).required(),
      password: Joi.string().min(6).pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
      confirmPassword: Joi.ref("password"),
    });
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
  },

  //회원정보 수정 시 joi 검증 실행
  updateUserProfile: async (req, res, next) => {
    const joiSchema = Joi.object({
      nicknameNew: Joi.string().min(1).max(20),
    });

    try {
      // 사용자 인증 미들웨어에서 값 들고 옴
      if (req.body.nicknameNew) {
        const { nicknameNew } = req.body;
        const verifyBody = await joiSchema.validateAsync({ nicknameNew });
        res.verifyBody = verifyBody;
        next();
      } else {
        next();
      }
    } catch (err) {
      console.log(err);
      return res.status(400).send({
        message: "닉네임의 형식이 올바르지 않습니다.",
      });
    }
  },

  updateUserPw: async (req, res, next) => {
    const joiSchema = Joi.object({
      nicknameNew: Joi.string().min(1).max(20),
      passwordOld: Joi.string()
        .min(6)
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
      passwordNew: Joi.string()
        .min(6)
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
      confirmPasswordNew: Joi.ref("passwordNew"),
    });
    let { nicknameNew, passwordOld, passwordNew, confirmPasswordNew } =
      req.body;
    try {
      //변경할 비밀번호끼리 값 비교
      if (passwordNew === confirmPasswordNew) {
        ///비밀번호 변경을 하지 않을 경우 빈값으로 넘겨받아야됨
        if (!passwordNew || !confirmPasswordNew) {
          passwordNew = passwordOld;
          confirmPasswordNew = passwordOld;
          const verifyBody = await joiSchema.validateAsync({
            nicknameNew,
            passwordOld,
            passwordNew,
            confirmPasswordNew,
          });
          res.verifyBody = verifyBody;
          next();
        } else {
          const verifyBody = await joiSchema.validateAsync({
            nicknameNew,
            passwordOld,
            passwordNew,
            confirmPasswordNew,
          });
          res.verifyBody = verifyBody;
          next();
        }
      } else {
        return res.status(400).send({
          message:
            "변경할 비밀번호가 서로 일치하지 않습니다. 다시 한번 확인해주세요",
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).send({
        message: "아이디와 비밀번호의 형식이 올바르지 않습니다.",
      });
    }
  },
};

module.exports = { verifyJoi };

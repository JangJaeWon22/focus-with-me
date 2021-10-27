const Joi = require("joi");

const joiSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .max(50)
    .required(),
  nickname: Joi.string().min(1).max(20).required(),
  password: Joi.string().min(4).pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  confirmPassword: Joi.ref("password"),
});

module.exports = joiSchema;

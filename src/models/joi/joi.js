const Joi = require("joi");

const joiSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
    .max(50)
    .required(),
<<<<<<< HEAD
  nickname: Joi.string()
    .min(3)
    .max(20)
    .regex(/^[0-9a-z]+$/i)
    .required(),
  password: Joi.string().min(4).pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  passwordConfirm: Joi.ref("password"),
=======
  nickname: Joi.string().min(1).max(20).required(),
  password: Joi.string().min(4).pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  confirmPassword: Joi.ref("password"),
>>>>>>> e700fe3b7a2641584354496cebfb9adb422293e0
});

module.exports = joiSchema;

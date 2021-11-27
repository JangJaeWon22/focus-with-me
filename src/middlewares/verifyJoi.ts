import { Request, Response, NextFunction } from 'express';
import * as Joi from "joi"
import { logger } from "../config/logger"
import {singUpUser, updateUserProfile, updateUserPw, existNickname, existEmail } from "../interfaces/joi"

class VerifyJoi {
  //회원가입 시 joi 검증 실행
  public singUpUser = async (req: Request, res: Response, next: NextFunction) => {
    const joiSchema = Joi.object({
      email : Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .max(50)
        .required(),
      nickname: Joi.string().min(2).max(10).required(),
      password: Joi.string().regex(
        /^.*(?=^.{8,}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/
      ),
      confirmPassword: Joi.ref("password"),
    });
    const { email, nickname, password, confirmPassword } : singUpUser = req.body;
    try {
      const verifyBody : singUpUser = await joiSchema.validateAsync({
        email,
        nickname,
        password,
        confirmPassword,
      });
      res.singUpUser = verifyBody;
      next();
    } catch (error) {
      const message : string = "아이디와 비밀번호의 형식이 올바르지 않습니다.";
      logger.info(`verifyJoi-singUpUser middlewares 500 error:${message}`);
      return res.status(500).send({ message });
    }
  }

  // nickname 변경 시
  public updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    console.log("조이 검증 미들웨어 입장");
    const joiSchema = Joi.object({
      nicknameNew: Joi.string().min(2).max(10).required(),
    });
    try {
      // 사용자 인증 미들웨어에서 값 들고 옴
      if (req.body.nicknameNew) {
        const { nicknameNew } : updateUserProfile = req.body;
        const verifyBody: updateUserProfile = await joiSchema.validateAsync({ nicknameNew });
        res.updateUserProfile = verifyBody;
        next();
      } else {
        const message: string = "닉네임의 형식이 올바르지 않습니다.";
        logger.info(
          `verifyJoi-updateUserProfile middlewares 400 error:${message}`
        );
        return res.status(400).send({ message });
      }
    } catch (error) {
      console.log(error);
      const message: string = "닉네임의 형식이 올바르지 않습니다.";
      logger.error(
        `verifyJoi-updateUserProfile middlewares 500 error:${error}`
      );
      return res.status(500).send({ message });
    }
  }

  //프로필 정보 변경(password)
  public updateUserPw = async (req: Request, res: Response, next: NextFunction) => {
    const joiSchema = Joi.object({
      passwordOld: Joi.string().regex(
        /^.*(?=^.{8,}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/
      ),
      passwordNew: Joi.string().regex(
        /^.*(?=^.{8,}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/
      ),
      confirmPasswordNew: Joi.ref("passwordNew"),
    });
    const { passwordOld, passwordNew, confirmPasswordNew } : updateUserPw = req.body;
    try {
      ///비밀번호 변경을 하지 않을 경우 빈값으로 넘겨받아야됨
      if (!passwordNew || !confirmPasswordNew) {
        const message: string = "변경할 비밀번호 또는 비밀번호 확인란을 확인 해주세요.";
        logger.info(`verifyJoi-updateUserPw middlewares 400 error:${message}`);
        return res.status(400).send({ message });
      } else {
        if (passwordNew !== confirmPasswordNew) {
          const message: string = "변경할 비밀번호와 비밀번호 확인란이 일치하지 않습니다.";
          logger.info(
            `verifyJoi-updateUserPw middlewares 400 error:${message}`
          );
          return res.status(400).send({ message });
        } else {
          const verifyBody : updateUserPw = await joiSchema.validateAsync({
            passwordOld,
            passwordNew,
            confirmPasswordNew,
          });
          res.updateUserPw = verifyBody;
          next();
        }
      }
    } catch (error) {
      console.log(error);
      const message: string = "입력하신 비밀번호의 형식이 올바르지 않습니다.";
      logger.error(`verifyJoi-updateUserPw middlewares 500 error:${error}`);
      return res.status(500).send({ message });
    }
  }

  // 닉네임 중복검사
  public existNickname = async (req: Request, res: Response, next: NextFunction) => {
    console.log("조이 검증 미들웨어 입장");
    const joiSchema = Joi.object({
      nickname: Joi.string().min(2).max(10).required(),
    });
    try {
      if (req.body.nickname) {
        const { nickname } : existNickname = req.body;
        const verifyBody: existNickname = await joiSchema.validateAsync({ nickname });
        res.existNickname = verifyBody;
        next();
      } else {
        const message: string = "닉네임의 형식이 올바르지 않습니다.";
        logger.info(`verifyJoi-existNickname middlewares 400 error:${message}`);
        return res.status(400).send({ message });
      }
    } catch (error) {
      console.log(error);
      const message: string = "닉네임의 형식이 올바르지 않습니다.";
      logger.error(`verifyJoi-existNickname middlewares 500 error:${error}`);
      return res.status(500).send({ message });
    }
  }
  // 이메일 중복검사
  public existEmail = async (req: Request, res: Response, next: NextFunction) => {
    console.log("조이 검증 미들웨어 입장");
    const joiSchema = Joi.object({
      email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
        .max(50)
        .required(),
    });
    try {
      // 사용자 인증 미들웨어에서 값 들고 옴
      if (req.body.email) {
        const { email }: existEmail = req.body;
        const verifyBody: existEmail = await joiSchema.validateAsync({ email });
        res.existEmail = verifyBody;
        next();
      } else {
        const message: string = "이메일의 형식이 올바르지 않습니다.";
        logger.info(`verifyJoi-existEmail middlewares 400 error:${message}`);
        return res.status(400).send({ message });
      }
    } catch (error) {
      console.log(error);
      const message: string = "이메일 형식이 올바르지 않습니다.";
      logger.error(`verifyJoi-existEmail middlewares 500 error:${error}`);
      return res.status(500).send({ message });
    }
  }
};

export default new VerifyJoi ()

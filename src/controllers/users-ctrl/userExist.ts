import { Request, Response } from 'express';
import { User } from "../../models"
import {logger } from "../../config/logger"
import { UserAttr } from "../../interfaces/user"

class UserExist {
  public existEmail = async (req: Request, res: Response) => {
    const { email } : {email:string} = res.existEmail;
    try {
      const existEmail = await User.findOne({ where: { email } });
      if (!existEmail) {
        const message: string = "사용 가능한 이메일 입니다.";
        logger.info(`POST /api/users/emailexist 200 "res:${message}`);
        return res.status(200).send({ message });
      } else {
        const message: string = "이미 사용중인 이메일 입니다.";
        logger.info(`POST /api/users/emailexist 400 "res:${message}`);
        return res.status(400).send({ message });
      }
    } catch (error) {
      console.log(error);
      const message: string = "알 수 없는 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
      logger.error(`POST /api/users/emailexist 500 "res:${error}`);
      return res.status(500).send({ message });
    }
  }  
  public existNickname =  async (req: Request, res: Response) => {
    const { nickname }: {nickname:string} = res.existNickname;
    try {
      const existNickname = await User.findOne({ where: { nickname } });
      if (res.locals.user) {
        const nickname : string = res.locals.user.nickname;
        if (nickname == res.existNickname.nickname) {
          const message: string = "기존 닉네임과 변동사항이 없습니다.";
          logger.info(`POST /api/users/nicknameexist 200 "res:${message}`);
          return res.status(200).send({ message });
        } else if (existNickname) {
          const message: string = "이미 사용중인 닉네임 입니다.";
          logger.info(`POST /api/users/nicknameexist 400 "res:${message}`);
          return res.status(400).send({ message });
        } else {
          return successMsg();
        }
      } else {
        if (!existNickname) {
          return successMsg();
        } else {
          const message: string = "이미 사용중인 닉네임 입니다.";
          logger.info(`POST /api/users/nicknameexist 400 "res:${message}`);
          return res.status(400).send({ message });
        }
      }
    } catch (error) {
      console.log(error);
      const message: string = "알 수 없는 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
      logger.error(`POST /api/users/nicknameexist 500 "res:${error}`);
      return res.status(500).send({ message });
    }
    // success message
    function successMsg() {
      const message: string = "사용 가능한 닉네임 입니다";
      logger.info(`POST /api/users/nicknameexist 200 "res:${message}`);
      res.status(200).send({ message });
    }
  }
};

export default new UserExist();

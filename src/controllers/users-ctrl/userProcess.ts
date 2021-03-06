import { Request, Response } from 'express';
import { User } from "../../models"
import { Op } from "sequelize"
import * as bcrypt from "bcrypt"
import { logger } from "../../config/logger"
import { UserAttr } from "../../interfaces/user"

//userProcess => user 관련 db 생성, 삭제 메소드 포함
class UserProcess {
  //회원 가입
  public createUser = async (req: Request, res: Response) => {
    // 패스워드와 패스워드 확인 검증
    try {
      const { email, nickname, password, confirmPassword } = res.signUpUser;
      if (password !== confirmPassword) {
        const message : string = "패스워드가 패스워드 확인란과 동일하지 않습니다.";
        logger.info(`POST /api/users/signup 400 res:${message}`);
        return res.status(400).send({ message });
      }

      // 패스워드에 아이디 포함여부 검사
      if (password.match(email) !== null || email.match(password) !== null) {
        const message: string = "아이디가 포함된 비밀번호는 사용이 불가능합니다.";
        logger.info(`POST /api/users/signup 400 res:${message}`);
        return res.status(400).send({ message });
      }

      const existUsers = await User.findAll({
        where: {
          [Op.or]: [{ nickname }, { email }],
        },
      });

      //유효성 검사
      if (existUsers.length > 0) {
        const message: string = "이미 가입된 이메일 또는 닉네임이 있습니다.";
        logger.info(`POST /api/users/signup 400 res:${message}`);
        res.status(400).send({ message });
      } else {
        const date: Date = new Date();
        // const avatarUrl = "uploads/assets/noAvatar.png";
        const avatarUrl: string = "uploads/assets/noAvatar.svg";
        const encryptPassword = bcrypt.hashSync(password, 10);
        const user = await User.create({
          email,
          nickname,
          password: encryptPassword,
          avatarUrl,
          date,
        });
        const message: string = "회원가입에 성공했습니다.";
        logger.info(`POST /api/users/signup 201 res:${message}`);
        return res.status(201).send({ user, message });
      }
    } catch (error) {
      console.log(error);
      const message: string = "알 수 없는 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
      logger.error(`POST /api/users/signup 500 res:${error}`);
      return res.status(500).send({ message });
    }
  }

  //회원탈퇴
  public deleteUser = async (req: Request, res: Response) => {
    try {
      console.log("asdasdas")
      console.log(req.body)
      console.log(req.body.password)
      console.log("asdasdas")
      const userId : number = res.locals.user.userId;
      const existUser = await User.findOne({ where: { userId } }); 
      if (existUser) {
        if (existUser.provider === "kakao"){
          await User.destroy({ where: { userId: existUser.userId } });
              const message: string = "회원탈퇴가 완료되었습니다.";
              logger.info(`DELETE /api/users/withdrawal 200 res:${message}`);
              res.status(200).send({ message });
        }else {
          if(!req.body.password){
            const message: string = "비밀번호를 입력해주세요.";
            logger.info(`DELETE /api/users/withdrawal 400 res:${message}`);
            res.status(400).send({ message });
          }else{
            const { password } :{password:string} = req.body;
            if (bcrypt.compareSync(password, existUser.password)){
              await User.destroy({ where: { userId: existUser.userId } });
              const message: string = "회원탈퇴가 완료되었습니다.";
              logger.info(`DELETE /api/users/withdrawal 200 res:${message}`);
              res.status(200).send({ message });
            }else {
              console.log("hi")
              const message: string = "입력하신 비밀번호가 일치하지 않습니다."
              logger.info(`DELETE /api/users/withdrawal 400 res:${message}`);
              res.status(400).send({ message });
            }
          }
        }
      } else {
        const message: string = "존재하지 않는 회원입니다.";
        logger.info(`DELETE /api/users/withdrawal 400 res:${message}`);
        res.status(400).send({ message });
      }
      

        


    } catch (error) {
      console.log(error);
      const message: string = "알 수 없는 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
      logger.error(`DELETE /api/users/withdrawal 500 res:${error}`);
      res.status(500).send({
        message,
      });
    }
  }
};

export default new UserProcess();

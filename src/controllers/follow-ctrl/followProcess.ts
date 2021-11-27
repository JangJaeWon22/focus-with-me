import { Request, Response } from "express";
import { User, sequelize, Sequelize } from "../../models";
import { logger } from "../../config/logger";
import { UserAttr } from "../../interfaces/user"

class FollowProcess {
  public createFollow = async (req:Request, res:Response) => {
    const { user } = res.locals;
    const user_id: number  = user.userId
    const { userId } : {userId:number} = req.body;
    try {
      const userInfo: UserAttr = await User.findOne({ where: { userId:user_id } });
      const tagetUser: UserAttr = await User.findOne({ where: { userId } });
      const date: Date = new Date()
      // 사용자 있는지 체크
      if (userInfo) {
        if (tagetUser.userId !== user_id) {
          // 사용자가 자신을 팔로우를 하지못하게 하기 위해 비교 (메서드 비교를 위해 string 타입 그대로 사용)
          // await userInfo.addFollowing(parseInt(userId, 10));
          const sqlQuery = `
          INSERT INTO Follow (createAt, updateAt, followingId, followerId)
          VALUES(${date},${date},${tagetUser.userId},${user_id})
          `
          await sequelize.query(sqlQuery, {
            type: Sequelize.QueryTypes.INSERT,
          });

          const message: string = `${user.nickname}님이 ${tagetUser.nickname}님을 팔로잉 했습니다.`;
          logger.info(`POST /api/follows 200 res:${message}`);
          res.status(200).send({ isUser: true, message });
        } else {
          const message: string = "자기 자신을 following 할 수 없습니다.";
          logger.info(`POST /api/follows 400 res:${message}`);
          res.status(400).send({ message });
        }
      } else {
        const message: string = "사용자를 찾을 수 없습니다.";
        logger.info(`POST /api/follows 400 res:${message}`);
        res.status(400).send({ message });
      }
    } catch (error) {
      console.error(error);
      const message: string = "알 수 없는 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
      logger.error(`POST /api/follows 500 res:${error}`);
      res.status(500).send({ message });
    }
  }
  public deleteFollow = async (req:Request, res:Response) => {
    const { user } = res.locals;
    const user_id: number  = user.userId
    const { userId } : {userId:number} = req.body;
    try {
      const userInfo: UserAttr = await User.findOne({ where: { userId: user_id } });
      const tagetUser: UserAttr = await User.findOne({ where: { userId } });
      const date : Date = new Date()
      // 사용자 있는지 체크
      if (userInfo) {
        // 사용자가 자신을 팔로우 취소를 하지 못하게 하기 위해 비교
        if (tagetUser.userId !== user_id) {  
          // await userInfo.removeFollowing(parseInt(userId, 10));
          const sqlQuery = `
          DELETE INTO Follow (createAt, updateAt, followingId, followerId)
          VALUES(${date},${date},${tagetUser.userId},${user_id})
          `
          await sequelize.query(sqlQuery, {
            type: Sequelize.QueryTypes.DELETE,
          });
          const message: string = `${user.nickname}님이 ${tagetUser.nickname}님을 팔로잉 취소 했습니다.`;
          logger.info(`DELETE /api/follows 200 res:${message}`);
          res.status(200).send({ isUser: false, message });
        } else {
          const message: string = "자기 자신을 following 취소 할 수 없습니다.";
          logger.info(`DELETE /api/follows 400 res:${message}`);
          res.status(400).send({ message });
        }
      } else {
        const message: string = "사용자를 찾을 수 없습니다.";
        logger.info(`DELETE /api/follows 400 res:${message}`);
        res.status(400).send({ message });
      }
    } catch (error) {
      console.error(error);
      const message: string = "알 수 없는 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
      logger.error(`DELETE /api/follows 500 res:${message}`);
      res.status(500).send({ message });
    }
  }
};

export default new FollowProcess();
import { Request, Response } from 'express';
import { logger } from "../../config/logger";

class FollowOutPut {
  public getFollowing = async (req: Request, res: Response) => {
    const followingIdList = res.followingIdList
    try {
      // 미들웨어를 통해 followingIdList 가지고와서 followingIdList 전송
      const message: string = "팔로윙 중인 유저목록을 불러왔습니다.";
      logger.info(
        `GET /api/followings/${req.params.userId} 200 res:${message}`
      );
      res.status(200).send({ followingIdList, message });
    } catch (error) {
      // try에서 발생한 오류 catch해서 응답함
      console.error(error);
      const message: string = "알 수 없는 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
      logger.error(`GET /api/followings/${req.params.userId} 500 res:${error}`);
      res.status(500).send({ message });
    }
  }
  public getFollower = async (req: Request, res: Response) => {
    const followerIdList = res.followerIdList
    try {
      const message: string = "팔로워 중인 유저목록을 불러왔습니다";
      logger.info(`GET /api/followers/${req.params.userId} 200 res:${message}`);
      res.status(200).send({ followerIdList, message });
    } catch (error) {
      console.error(error);
      const message: string = "알 수 없는 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
      logger.error(`GET /api/followers/${req.params.userId} 500 res:${error}`);
      res.status(500).send({ message });
    }
  }
};

export default new FollowOutPut();

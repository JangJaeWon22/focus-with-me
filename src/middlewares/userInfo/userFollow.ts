import { Request, Response, NextFunction } from 'express';
import { User } from "../../models";
import { logger } from "../../config/logger"
import { FollowUser, IsFollow } from "../../interfaces/user"

class FollowMw {
  public follow = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    try {
      // const user = res.locals;
      // const { userId } = req.body === undefined ? res.locals.user : req.body;
      const user: any = await User.findOne({
        where: { userId: Number(userId) },
        include: [
          {
            model: User,
            attributes: ["userId", "nickname", "avatarUrl"],
            as: "Followers",
          },
          {
            model: User,
            attributes: ["userId", "nickname", "avatarUrl"],
            as: "Followings",
          },
        ],
      });
      if (!user) {
        const message: string = "조회 하려는 사용자가 없습니다.";
        logger.info(`userInfo/userFollow middleware error: ${message}`);
        return res.status(400).send({ message });
      } else {
        user.followerCount = user ? user.Followers.length : 0;
        user.followingCount = user ? user.Followings.length : 0;
        user.followingIdList = user ? user.Followings : [];
        user.followerIdList = user ? user.Followers : [];
        const followerCount: number = user.followerCount;
        const followingCount: number = user.followingCount;
        const followingIdList: IsFollow = user.followingIdList;
        const followerIdList: IsFollow = user.followerIdList;
        res.followerCount = followerCount;
        res.followingCount = followingCount;
        res.followingIdList = followingIdList;
        res.followerIdList = followerIdList;
        next();
      }
    } catch (error) {
      console.log(error);
      const message: string =
        "알 수 없는 문제로 회원 정보를 가져오는데 실패 했습니다.";
      logger.error(`userInfo/userFollow middleware catch error: ${error}`);
      res.status(500).send({ message });
    }
  };
}

export default new FollowMw();

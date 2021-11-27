import {singUpUser, updateUserProfile, updateUserPw, existNickname, existEmail } from "../interfaces/joi"
import { IsFollow } from "../interfaces/user"

declare global {
	namespace Express {
		interface Response {
			singUpUser?: singUpUser;
			updateUserProfile?: updateUserProfile;
			updateUserPw?: updateUserPw;
			existNickname?: existNickname;
			existEmail?: existEmail;
			isFollowing?: boolean;
			userInfo?: any;
			followerCount: number
			followingCount: number
			followingIdList: IsFollow
			followerIdList: IsFollow
		}
		interface Request {
		}
	}
}
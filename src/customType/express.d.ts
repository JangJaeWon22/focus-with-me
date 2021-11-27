import {signUpUser, updateUserProfile, updateUserPw, existNickname, existEmail } from "../interfaces/joi"
import { IsFollow } from "../interfaces/user"

declare global {
	namespace Express {
		interface Response {
			signUpUser?: signUpUser;
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
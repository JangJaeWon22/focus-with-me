import {singUpUser, updateUserProfile, updateUserPw, existNickname, existEmail } from "../interfaces/joi"

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
		}
		interface Request {
		}
	}
}
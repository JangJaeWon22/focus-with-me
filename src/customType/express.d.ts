import {signUpUser, updateUserProfile, updateUserPw, existNickname, existEmail } from "../interfaces/joi"
import { IsFollow } from "../interfaces/user"
import { FollowPost, Posts } from "../interfaces/post"

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
			followerCount?: number;
			followingCount?: number;
			followingIdList?: IsFollow;
			followerIdList?: IsFollow;
			followPost?: FollowPost | undefined[]
		}
		interface Request{
			posts? :any;
			randPosts?: Posts;
			queryResult?: Posts;
			totalPage?: number;
		}
		interface MulterRequest extends Request {
			file: any;
		}
	}
}


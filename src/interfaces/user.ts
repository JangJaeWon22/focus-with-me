export interface UserAttr {
    userId: number;
    email?: string;
    nickname: string;
    password?: string;
    avatarUrl?: string;
    provider: string;
    snsId?: string;
    date: Date;
    // 배열의 길이를 수행하기 위 선언
    length?:number
}

export interface FollowUser{
    userId: number;
    email?: string;
    nickname: string;
}

export interface Follow extends FollowUser{
    followingId: number
    followerId: number
    createdAt?: Date
    updatedAt?: Date
}


export interface GetUserInfo extends UserAttr {
    postCnt?: number
}

export interface IsFollow {
    followingId: number
    followerId: number
    createdAt?: Date
    updatedAt?: Date
}

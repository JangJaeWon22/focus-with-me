export interface Posts {
    postId?: number
    coverOriginal?: string
    coverCropped?: string
    title?: string
    categorySpace?: string
    categoryStudyMate?: string
    categoryInterest?: string
    contentEditor?: string
    date?: Date
    userId?: number
    likeCnt?: number
    bookCnt?: number
    nickname?: string
    avatarUrl?: string
    message?: string
    isLiked?: boolean
    isBookmarked?: boolean
}

// filter router searchMode=main 에서 사용
export interface FollowPost {
    postId?: number
    coverOriginal?:string
    coverCropped?:string
    title?: string
    categorySpace?: string
    categoryStudyMate?: string
    categoryInterest?: string
    contentEditor?: string
    date?: Date
    userId?: number
    nickname?: string
    avatarUrl?: string
}


import { bool } from "aws-sdk/clients/signer";

export interface MyBookLists {
    postId: number
    coverOriginal: string
    coverCropped: string
    title: string
    categorySpace: string
    categoryStudyMate: string
    categoryInterest: string
    contentEditor: string
    date: Date
    userId: number
    likeCnt: number
    bookCnt: number
}

export interface MyBookListsAdd extends MyBookLists{
    isLiked: boolean
    isBookmarked: boolean
}

export interface MyPosts {
    postId: number
    coverOriginal: string
    coverCropped: string
    title: string
    categorySpace: string
    categoryStudyMate: string
    categoryInterest: string
    contentEditor: string
    date: Date
    userId: number
    likeCnt: number
    bookCnt: number
}

export interface MyPostList extends MyPosts {
    isLiked: boolean
    isBookmarked: boolean
}
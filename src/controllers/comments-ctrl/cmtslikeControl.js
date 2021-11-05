const { CommentLike } = require("../../models");

const commentsLikeFunc = {
    // 댓글 좋아요 생성
    likeExist: async (req, res, next) => {
        try {
            const { postId, commentId } = req.params; // params에 postId, commentId 객체
            const { userId } = res.locals.user; // 미들웨어 연결에 필요
            const date = new Date(); // 날짜 삽입

            const likeCmt = await CommentLike.findOne({
                include: [{ model: CommentLike }], //join 사용됨
                where: { 
                    postId : postId, 
                    commentId : commentId, 
                    userId
                },
            });
            if (!likeCmt) {
                await CommentLike.create({
                    postId, commentId, date,
                });
                const likeCnt = await CommentLike.count({
                    where: { commentId, postId },
                });
                await CommentLike.update({likeCnt}, {where: {postId, commentId}});
                return res.status(200).send({
                    isLiked: true,
                    likeCnt,
                    message: " 댓글에 좋아요를 눌렀습니다. " });
            }
        } catch (err) {
            console.log(err);
            return res.status(400).send({
                message: "댓글 좋아요 기능에 문제가 있습니다. 관리자에게 문의해주세요.",
            });
        }
    }
    
    // 댓글 좋아요 취소 생성
    // notLikeExist : async (req, res, next) => {

    // }
    // "delete"
};

module.exports = {commentsLikeFunc};
const { Comment } = require("../../models");
const { Op } = require("sequelize");


const commentList = {
    commentUser: async (req, res) => {
        try {
            //route is not existed, therefore, use req.body
            const { userId, postId, avatarUrl, textContent } = req.body;
            //댓글 작성시, userId가 존재하지 않을경우, user에 id로 찾기
            const comment = await Comment.findOne({
                where: {
                    [Op.or]: [{ userId }, { postId }],
                }
            })
            res.status(201).send({ message : "댓글에 성공했습니다." })
     
            
        } catch (err) {
            res.status(500).send({ message: "댓글 서버에 오류가 생겼습니다." });
        }
    }
}
module.exports = {commentList};
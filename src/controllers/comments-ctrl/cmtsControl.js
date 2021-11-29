"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var models_1 = require("../../models");
var sequelize_1 = require("sequelize");
var logger_1 = require("../../config/logger");
var CommentController = /** @class */ (function () {
    function CommentController() {
        var _this = this;
        // 댓글 생성을 비동기식 방식으로 처리한다
        this.commentCreate = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var postId, textContent, userId, user, userNick, avatarUrl, date, comment, cmtCount, perPage, totalPg, message, error_1, message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        postId = req.params.postId;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        textContent = req.body.textContent;
                        userId = res.locals.user.userId;
                        return [4 /*yield*/, models_1.User.findByPk(userId)];
                    case 2:
                        user = _a.sent();
                        userNick = user.nickname;
                        avatarUrl = user.avatarUrl;
                        date = new Date();
                        return [4 /*yield*/, models_1.Comment.create({
                                userId: userId,
                                postId: Number(postId),
                                date: date,
                                textContent: textContent
                            })];
                    case 3:
                        comment = _a.sent();
                        return [4 /*yield*/, models_1.Comment.count({
                                where: { postId: Number(postId) }
                            })];
                    case 4:
                        cmtCount = _a.sent();
                        perPage = 4;
                        totalPg = Math.ceil(cmtCount / perPage);
                        message = "댓글 작성에 성공했습니다.";
                        logger_1.logger.info("POST api/posts/".concat(postId, "/comments 201 res:").concat(message));
                        // 성공 했을 경우, 다음과 같은 값을 보내준다
                        return [2 /*return*/, res.status(201).send({
                                userNick: userNick,
                                comment: comment,
                                avatarUrl: avatarUrl,
                                message: message,
                                totalPg: totalPg
                            })];
                    case 5:
                        error_1 = _a.sent();
                        // 에러 발생 했을 경우, console.log를 찍어준다
                        console.log(error_1);
                        message = "알 수 없는 문제가 발생했습니다.";
                        logger_1.logger.error("POST api/posts/".concat(postId, "/comments 500 res:").concat(error_1));
                        // try 구문에 에러가 생겼을 경우, 서버 에러로 인식하고 오류창을 보여준다
                        return [2 /*return*/, res.status(500).send({ message: message })];
                    case 6: return [2 /*return*/];
                }
            });
        }); };
        /*
          댓글 조회
          각 댓글별로 답글이 몇개있는지 끼워넣어서 보내줘야 함
        */
        this.commentSearch = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var postId, commentAll, respondComments, _i, commentAll_1, comment, isCommentLiked, childCnt, liked, pagination, page, perPage, pageNum, totCmtCount, totalPg, startNum, lastNum, message_1, cmtsList, i, message, error_2, message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        postId = req.params.postId;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 9, , 10]);
                        return [4 /*yield*/, models_1.Comment.findAll({
                                // db에서 찾을 때 할당 받은 postId와 같은 조건인 것을 찾음 (해당 게시글의 댓글만 가져오면 되서)
                                where: { postId: Number(postId) },
                                // 가져올때 속성은 comment의 전부 + commentLikeCnt(commentLikeId의 갯수)
                                attributes: [
                                    "Comment.*",
                                    "User.avatarUrl",
                                    "User.nickname",
                                    [sequelize_1["default"].literal("COUNT(DISTINCT CommentLikes.commentLikeId)"), "commentLikeCnt"],
                                ],
                                /*  join!! (user, commentLike) ==> user는 작성자의 닉네임, 작성자의 프로필사진
                                commentLike는 현재 미들웨어(loginBoth)를 타고 res.local.user가 있을 경우를 대비해서 그 사람이 각 댓글마다
                                좋아요를 했는지 안했는지 boolean 값을 주기 위해서 */
                                include: [
                                    {
                                        model: models_1.User,
                                        attributes: []
                                    },
                                    {
                                        model: models_1.CommentLike,
                                        attributes: []
                                    },
                                ],
                                /* raw => google링 해보면 나옴
                                가공 하지 않은 상태가 됨 {} <- 이런걸로 안감싸고, 바로 model.keyname으로 나옴 */
                                raw: true,
                                // group by 설정
                                group: ["commentId"]
                            })];
                    case 2:
                        commentAll = _a.sent();
                        respondComments = [];
                        _i = 0, commentAll_1 = commentAll;
                        _a.label = 3;
                    case 3:
                        if (!(_i < commentAll_1.length)) return [3 /*break*/, 8];
                        comment = commentAll_1[_i];
                        isCommentLiked = false;
                        childCnt = 0;
                        if (!res.locals.user) return [3 /*break*/, 5];
                        return [4 /*yield*/, models_1.CommentLike.findOne({
                                where: { userId: Number(res.locals.user.userId), postId: Number(comment.postId) }
                            })];
                    case 4:
                        liked = _a.sent();
                        if (liked)
                            isCommentLiked = true;
                        _a.label = 5;
                    case 5: return [4 /*yield*/, models_1.ChildComment.count({
                            where: {
                                commentId: Number(comment.commentId)
                            }
                        })];
                    case 6:
                        childCnt = _a.sent();
                        // 각 댓글별로 답글 수 찾기
                        respondComments.unshift({
                            userId: comment.userId,
                            userNickname: comment.nickname,
                            textContent: comment.textContent,
                            avatarUrl: comment.avatarUrl,
                            date: comment.date,
                            commentId: comment.commentId,
                            postId: comment.postId,
                            commentLikeCnt: comment.commentLikeCnt,
                            isCommentLiked: isCommentLiked,
                            childCnt: childCnt
                        });
                        _a.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 3];
                    case 8:
                        pagination = req.query.pagination;
                        page = Number(pagination);
                        perPage = 4;
                        // pagination 예외처리
                        if (!pagination)
                            page = 1;
                        page = Number(page);
                        pageNum = page // 페이지 수를 10진수로 처리함
                        ;
                        totCmtCount = respondComments.length;
                        totalPg = Math.ceil(totCmtCount / perPage);
                        startNum = (pageNum - 1) * perPage;
                        lastNum = pageNum * perPage;
                        // 예외처리
                        if (pageNum < 1) {
                            message_1 = "댓글 리스트를 불러오는데 실패 했습니다.";
                            logger_1.logger.info("GET /api/posts/".concat(postId, "/comments 400 res:").concat(message_1));
                            return [2 /*return*/, res.status(400).send({ message: message_1 })];
                        }
                        if (totCmtCount < lastNum) {
                            lastNum = totCmtCount;
                        }
                        cmtsList = [];
                        for (i = startNum; i < lastNum; i++) {
                            cmtsList.push(respondComments[i]);
                        }
                        message = "댓글 조회에 성공했습니다.";
                        logger_1.logger.info("GET /api/posts/".concat(postId, "/comments 200 res:").concat(message));
                        return [2 /*return*/, res.status(200).send({ cmtsList: cmtsList, message: message, totalPg: totalPg, totCmtCount: totCmtCount })];
                    case 9:
                        error_2 = _a.sent();
                        console.log(error_2);
                        message = "알 수 없는 문제가 발생했습니다.";
                        logger_1.logger.error("GET /api/posts/".concat(postId, "/comments 500 res:").concat(error_2));
                        return [2 /*return*/, res.status(500).send({ message: message })];
                    case 10: return [2 /*return*/];
                }
            });
        }); };
        // 댓글 삭제
        this.commentDel = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var _a, postId, commentId, userId, reqDelete, message, message, error_3, message;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.params, postId = _a.postId, commentId = _a.commentId;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, , 7]);
                        userId = res.locals.user.userId;
                        return [4 /*yield*/, models_1.Comment.findOne({
                                // where 옵션으로 나열함으로써, 기본적으로 and 옵션과 같다
                                // postId 라는 컬럼에서 postId로, commentId 라는 컬럼에서 commentId로 가져온다
                                where: { postId: Number(postId), commentId: Number(commentId) }
                            })];
                    case 2:
                        reqDelete = _b.sent();
                        if (!(reqDelete.userId === userId)) return [3 /*break*/, 4];
                        // 특정 포스트에 해당하는 특정 댓글을 지운다
                        // 특정 포스트 -> 특정 댓글
                        return [4 /*yield*/, models_1.Comment.destroy({
                                where: { postId: Number(postId), commentId: Number(commentId), userId: userId }
                            })];
                    case 3:
                        // 특정 포스트에 해당하는 특정 댓글을 지운다
                        // 특정 포스트 -> 특정 댓글
                        _b.sent();
                        message = "댓글이 삭제되었습니다.";
                        logger_1.logger.info("DELETE /api/posts/".concat(postId, "/comments/").concat(commentId, " 200 res:").concat(message));
                        return [2 /*return*/, res.status(200).send({ message: message })];
                    case 4:
                        message = "작성자가 아닙니다.";
                        logger_1.logger.info("DELETE /api/posts/".concat(postId, "/comments/").concat(commentId, " 400 res:").concat(message));
                        return [2 /*return*/, res.status(400).send({ message: message })];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_3 = _b.sent();
                        console.log(error_3);
                        message = "알 수 없는 문제가 발생했습니다.";
                        logger_1.logger.error("DELETE /api/posts/".concat(postId, "/comments/").concat(commentId, " 500 res:").concat(error_3));
                        return [2 /*return*/, res.status(500).send({ message: message })];
                    case 7: return [2 /*return*/];
                }
            });
        }); };
    }
    return CommentController;
}());
;
exports["default"] = new CommentController();

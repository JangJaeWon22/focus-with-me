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
var models_1 = require("../models");
var sequelize_1 = require("sequelize");
var logger_1 = require("../config/logger");
/*
  댓글에 '답글 더보기' 버튼이 있고
  버튼 누르면 get api 호출
  페이지네이션 (무한스크롤) 5개씩?
  {
    childCommentId,
    textContent,
    postId,
    userId,
    avatarUrl (JOIN)
    nickname (JOIN)
  }

  Options:
    정렬 : 최신순(날짜 내림차순)
*/
var ChildCommentsController = /** @class */ (function () {
    function ChildCommentsController() {
        var _this = this;
        this.getChildComments = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var page, _a, commentId, postId, currentPage, childPerPage, offset, totalCnt, sqlQuery, childComments, message, error_1, message;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        page = req.query.page;
                        _a = req.params, commentId = _a.commentId, postId = _a.postId;
                        currentPage = 0;
                        if (!page)
                            currentPage = 1;
                        currentPage = Number(page);
                        childPerPage = 3;
                        offset = (currentPage - 1) * childPerPage;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 4, , 5]);
                        return [4 /*yield*/, models_1.ChildComment.count({
                                where: { commentId: commentId, postId: postId }
                            })];
                    case 2:
                        totalCnt = _b.sent();
                        sqlQuery = "\n        SELECT child.*, Users.nickname, Users.avatarUrl\n        FROM ChildComments AS child\n        JOIN Users ON child.userId = Users.userId\n        WHERE child.commentId = ".concat(commentId, " and child.postId = ").concat(postId, "\n        GROUP BY child.childCommentId\n        LIMIT ").concat(childPerPage, "\n        OFFSET ").concat(offset, "\n        ; \n      ");
                        return [4 /*yield*/, models_1.sequelize.query(sqlQuery, {
                                // type: Sequelize.QueryTypes.SELECT,
                                type: sequelize_1.QueryTypes.SELECT
                            })];
                    case 3:
                        childComments = _b.sent();
                        message = "답글 조회 성공";
                        logger_1.logger.info("GET /api/posts/".concat(postId, "/comments/").concat(commentId, "/childs 200 res: ").concat(message));
                        return [2 /*return*/, res.status(200).send({ message: message, childComments: childComments, totalCnt: totalCnt })];
                    case 4:
                        error_1 = _b.sent();
                        console.log(error_1);
                        message = "답글 조회 실패";
                        logger_1.logger.error("GET /api/posts/".concat(postId, "/comments/").concat(commentId, "/childs 500 res: ").concat(error_1));
                        return [2 /*return*/, res.status(500).send({ message: message })];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        this.postChildComments = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var textContent, _a, postId, commentId, _b, userId, nickname, avatarUrl, date, child, user, message, error_2, message;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        textContent = req.body.textContent, _a = req.params, postId = _a.postId, commentId = _a.commentId;
                        _b = res.locals.user, userId = _b.userId, nickname = _b.nickname, avatarUrl = _b.avatarUrl;
                        date = new Date();
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, models_1.ChildComment.create({
                                textContent: textContent,
                                postId: Number(postId),
                                userId: userId,
                                date: date,
                                commentId: Number(commentId)
                            })];
                    case 2:
                        child = _c.sent();
                        user = { nickname: nickname, avatarUrl: avatarUrl };
                        message = "답글 작성 완료";
                        logger_1.logger.info("POST /api/posts/".concat(postId, "/comments/").concat(commentId, "/childs 200 res: ").concat(message));
                        return [2 /*return*/, res.status(201).send({ message: message, user: user, child: child /* result */ })];
                    case 3:
                        error_2 = _c.sent();
                        console.log(error_2);
                        message = "답글을 작성 할 수 없습니다.";
                        logger_1.logger.error("POST /api/posts/".concat(postId, "/comments/").concat(commentId, "/childs 500 res: ").concat(error_2));
                        return [2 /*return*/, res.status(500).send({ message: message })];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        this.deleteChildComments = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var _a, postId, commentId, childCommentId, userId, childComment, message, message, message, error_3, message;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.params, postId = _a.postId, commentId = _a.commentId, childCommentId = _a.childCommentId;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, , 7]);
                        userId = res.locals.user.userId;
                        return [4 /*yield*/, models_1.ChildComment.findByPk(childCommentId)];
                    case 2:
                        childComment = _b.sent();
                        console.log(childComment.userId);
                        console.log("userId", userId);
                        // 답글 없을 경우 예외 처리
                        if (!childComment) {
                            message = "답글을 찾을 수 없습니다.";
                            logger_1.logger.info("DELETE /api/posts/".concat(postId, "/comments/").concat(commentId, "/childs/").concat(childCommentId, " 400 res: ").concat(message));
                            return [2 /*return*/, res.status(400).send({ message: message })];
                        }
                        if (!(userId === childComment.userId)) return [3 /*break*/, 4];
                        return [4 /*yield*/, models_1.ChildComment.destroy({
                                where: { childCommentId: childComment.childCommentId }
                            })];
                    case 3:
                        _b.sent();
                        message = "답글 삭제 완료";
                        logger_1.logger.info("DELETE /api/posts/".concat(postId, "/comments/").concat(commentId, "/childs/").concat(childCommentId, " 200 res: ").concat(message));
                        return [2 /*return*/, res.status(200).send({ message: message })];
                    case 4:
                        message = "답글을 작성한 작성자가 아닙니다.";
                        logger_1.logger.info("DELETE /api/posts/".concat(postId, "/comments/").concat(commentId, "/childs/").concat(childCommentId, " 400 res: ").concat(message));
                        return [2 /*return*/, res.status(400).send({ message: message })];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_3 = _b.sent();
                        console.log(error_3);
                        message = "답글 삭제 실패";
                        logger_1.logger.error("POST /api/posts/".concat(postId, "/comments/").concat(commentId, "/childs/").concat(childCommentId, " 500 res: ").concat(error_3));
                        return [2 /*return*/, res.status(500).send({ message: message })];
                    case 7: return [2 /*return*/];
                }
            });
        }); };
    }
    return ChildCommentsController;
}());
exports["default"] = new ChildCommentsController();

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
var logger_1 = require("../../config/logger");
var commentsLikeController = /** @class */ (function () {
    function commentsLikeController() {
        var _this = this;
        this.likeExist = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var _a, postId, commentId, userId, cmts, date, likeCount, message, message, error_1, message;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.params, postId = _a.postId, commentId = _a.commentId;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 7, , 8]);
                        userId = res.locals.user.userId;
                        return [4 /*yield*/, models_1.CommentLike.findOne({
                                where: { postId: Number(postId), commentId: Number(commentId), userId: Number(userId) }
                            })];
                    case 2:
                        cmts = _b.sent();
                        if (!!cmts) return [3 /*break*/, 5];
                        date = new Date();
                        // 댓글 기능 추가 실행
                        return [4 /*yield*/, models_1.CommentLike.create({
                                postId: Number(postId),
                                userId: Number(userId),
                                commentId: Number(commentId),
                                date: date
                            })];
                    case 3:
                        // 댓글 기능 추가 실행
                        _b.sent();
                        return [4 /*yield*/, models_1.CommentLike.count({
                                where: { postId: Number(postId), commentId: Number(commentId) }
                            })];
                    case 4:
                        likeCount = _b.sent();
                        message = "댓글 좋아요.";
                        logger_1.logger.info("POST /api/posts/".concat(postId, "/comments/").concat(commentId, "/like 200 res:").concat(message));
                        return [2 /*return*/, res.status(200).send({ isLiked: true, likeCount: likeCount, message: message })];
                    case 5:
                        message = "좋아요를 이미 눌렀습니다.";
                        logger_1.logger.info("POST /api/posts/".concat(postId, "/comments/").concat(commentId, "/like 400 res:").concat(message));
                        return [2 /*return*/, res.status(400).send({ message: message })];
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_1 = _b.sent();
                        console.error(error_1);
                        message = "댓글 좋아요 기능에 문제가 발생했습니다.";
                        logger_1.logger.info("POST /api/posts/".concat(postId, "/comments/").concat(commentId, "/like 500 res:").concat(error_1));
                        return [2 /*return*/, res.status(500).send({ message: message })];
                    case 8: return [2 /*return*/];
                }
            });
        }); };
        this.notLikeExist = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var _a, postId, commentId, userId, cmts, likeCount, message, message, error_2, message;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.params, postId = _a.postId, commentId = _a.commentId;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 7, , 8]);
                        userId = res.locals.user.userId;
                        return [4 /*yield*/, models_1.CommentLike.findOne({
                                where: { postId: Number(postId), commentId: Number(commentId), userId: Number(userId) }
                            })];
                    case 2:
                        cmts = _b.sent();
                        if (!cmts) return [3 /*break*/, 5];
                        //해당 댓글로부터 db 삭제
                        return [4 /*yield*/, models_1.CommentLike.destroy({ where: { postId: Number(postId), commentId: Number(commentId), userId: Number(userId) } })];
                    case 3:
                        //해당 댓글로부터 db 삭제
                        _b.sent();
                        return [4 /*yield*/, models_1.CommentLike.count({
                                where: { commentId: Number(commentId), postId: Number(postId) }
                            })];
                    case 4:
                        likeCount = _b.sent();
                        message = "댓글 좋아요 취소";
                        logger_1.logger.info("DELETE /api/posts/".concat(postId, "/comments/").concat(commentId, "/like 200 res:").concat(message));
                        return [2 /*return*/, res.status(200).send({ isLiked: false, likeCount: likeCount, message: message })];
                    case 5:
                        message = "좋아요를 한 상태에서만 가능한 기능입니다.";
                        logger_1.logger.info("DELETE /api/posts/".concat(postId, "/comments/").concat(commentId, "/like 400 res:").concat(message));
                        res.status(400).send({ message: message });
                        _b.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        error_2 = _b.sent();
                        // try 구문에서 발생한 오류 catch해서 메세지 전송.
                        console.error(error_2);
                        message = "관리자에게 문의해주세요.";
                        logger_1.logger.error("DELETE /api/posts/".concat(postId, "/comments/").concat(commentId, "/like 500 res:").concat(error_2));
                        res.status(500).send({ message: message });
                        return [3 /*break*/, 8];
                    case 8: return [2 /*return*/];
                }
            });
        }); };
    }
    return commentsLikeController;
}());
exports["default"] = new commentsLikeController();

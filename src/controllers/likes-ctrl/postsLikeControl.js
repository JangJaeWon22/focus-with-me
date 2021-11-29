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
var postLikeController = /** @class */ (function () {
    function postLikeController() {
        var _this = this;
        // 게시물 좋아요 추가 기능
        // 빈하트일때 좋아요 검사
        this.addLike = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var postId, userId, date, liked, message, message, error_1, message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        postId = req.params.postId;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        userId = res.locals.user.userId;
                        date = new Date();
                        return [4 /*yield*/, models_1.Like.findOne({
                                where: { postId: Number(postId), userId: Number(userId) }
                            })];
                    case 2:
                        liked = _a.sent();
                        if (!!liked) return [3 /*break*/, 4];
                        return [4 /*yield*/, models_1.Like.create({
                                postId: Number(postId),
                                userId: Number(userId),
                                date: date
                            })];
                    case 3:
                        _a.sent(); // 좋아요 생성
                        message = "좋아요를 눌렀습니다.";
                        logger_1.logger.info("POST /api/posts/".concat(postId, "/like 200 res:").concat(message));
                        return [2 /*return*/, res.status(200).send({ isLiked: true, message: message })];
                    case 4:
                        message = "좋아요를 이미 눌렀습니다.";
                        logger_1.logger.info("POST /api/posts/".concat(postId, "/like 400 res:").concat(message));
                        // user가 좋아요를 이미 누른 상태에서 한번 더 눌렀을 경우
                        return [2 /*return*/, res.status(400).send({ message: message })];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_1 = _a.sent();
                        console.log(error_1);
                        message = "좋아요 기능에 문제가 있습니다. 관리자에게 문의해주세요.";
                        logger_1.logger.error("POST /api/posts/".concat(postId, "/like 500 res:").concat(error_1));
                        return [2 /*return*/, res.status(500).send({ message: message })];
                    case 7: return [2 /*return*/];
                }
            });
        }); };
        // 게시물 좋아요 취소 기능
        this.removeLike = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var postId, userId, liked, message, message, error_2, message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        postId = req.params.postId;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        userId = res.locals.user.userId;
                        return [4 /*yield*/, models_1.Like.findOne({
                                where: { postId: Number(postId), userId: Number(userId) }
                            })];
                    case 2:
                        liked = _a.sent();
                        if (!liked) return [3 /*break*/, 4];
                        return [4 /*yield*/, models_1.Like.destroy({
                                where: { postId: Number(postId), userId: Number(userId) }
                            })];
                    case 3:
                        _a.sent();
                        message = "좋아요 취소";
                        logger_1.logger.info("DELETE /api/posts/".concat(postId, "/like 200 res:").concat(message));
                        return [2 /*return*/, res.status(200).send({ isLiked: false, message: message })];
                    case 4:
                        message = "이미 좋아요를 취소했습니다.";
                        logger_1.logger.info("DELETE /api/posts/".concat(postId, "/like 400 res:").concat(message));
                        return [2 /*return*/, res.status(400).send({ message: message })];
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_2 = _a.sent();
                        console.log(error_2); // catch error 문 이렇게 확인
                        message = "좋아요 취소 기능에 문제가 있습니다. 관리자에게 문의해주세요.";
                        logger_1.logger.error("DELETE /api/posts/".concat(postId, "/like 500 res:").concat(error_2));
                        return [2 /*return*/, res.status(500).send({ message: message })];
                    case 7: return [2 /*return*/];
                }
            });
        }); };
    }
    return postLikeController;
}());
;
exports["default"] = new postLikeController();

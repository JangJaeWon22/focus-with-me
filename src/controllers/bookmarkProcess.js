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
var logger_1 = require("../config/logger");
var BookmarkProcess = /** @class */ (function () {
    function BookmarkProcess() {
        var _this = this;
        this.createbookmark = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var postId, userId, bookmark, date, message, message, error_1, message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        postId = req.params.postId;
                        userId = res.locals.user.userId;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, , 7]);
                        return [4 /*yield*/, models_1.Bookmark.findOne({
                                where: { postId: postId, userId: userId }
                            })];
                    case 2:
                        bookmark = _a.sent();
                        date = new Date();
                        if (!!bookmark) return [3 /*break*/, 4];
                        // 북마크 추가 실행
                        return [4 /*yield*/, models_1.Bookmark.create({
                                postId: Number(postId),
                                userId: userId,
                                date: date
                            })];
                    case 3:
                        // 북마크 추가 실행
                        _a.sent();
                        message = "북마크 완료";
                        logger_1.logger.info("POST /api/bookmarks/".concat(postId, " 200 res:").concat(message));
                        res.status(200).send({ isBookmarked: true, message: message });
                        return [3 /*break*/, 5];
                    case 4:
                        message = "북마크를 이미 했습니다.";
                        logger_1.logger.info("POST /api/bookmarks/".concat(postId, " 400 res:").concat(message));
                        res.status(400).send({ message: message });
                        _a.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_1 = _a.sent();
                        console.error(error_1);
                        message = "알 수 없는 문제가 발생했습니다.";
                        logger_1.logger.error("POST /api/bookmarks/".concat(postId, " 500 res:").concat(error_1));
                        // try 구문에서 발생한 오류 catch해서 메세지 전송.
                        res.status(500).send({ message: message });
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        }); };
        this.deleteBookmark = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var postId, userId, bookmark, message, message, message, error_2, message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        postId = req.params.postId;
                        userId = res.locals.user.userId;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 8, , 9]);
                        return [4 /*yield*/, models_1.Bookmark.findOne({
                                where: { postId: postId, userId: userId }
                            })];
                    case 2:
                        bookmark = _a.sent();
                        if (!bookmark) return [3 /*break*/, 6];
                        if (!(bookmark.userId === userId)) return [3 /*break*/, 4];
                        //해당 북마크 db 삭제
                        return [4 /*yield*/, models_1.Bookmark.destroy({ where: { postId: postId, userId: userId } })];
                    case 3:
                        //해당 북마크 db 삭제
                        _a.sent();
                        message = "북마크 취소";
                        logger_1.logger.info("DELETE /api/bookmarks/".concat(postId, " 200 res:").concat(message));
                        res.status(200).send({ isBookmarked: false, message: message });
                        return [3 /*break*/, 5];
                    case 4:
                        message = "작성자가 아닙니다.";
                        logger_1.logger.info("DELETE /api/bookmarks/".concat(postId, " 400 res:").concat(message));
                        res.status(400).send({ message: message });
                        _a.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        message = "북마크 한 정보를 찾을 수 없습니다.";
                        logger_1.logger.info("DELETE /api/bookmarks/".concat(postId, " 400 res:").concat(message));
                        res.status(400).send({ message: message });
                        _a.label = 7;
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        error_2 = _a.sent();
                        // try 구문에서 발생한 오류 catch해서 메세지 전송.
                        console.error(error_2);
                        message = "알 수 없는 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
                        logger_1.logger.error("DELETE /api/bookmarks/".concat(postId, " 500 res:").concat(error_2));
                        res.status(500).send({ message: message });
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        }); };
    }
    return BookmarkProcess;
}());
exports["default"] = new BookmarkProcess();

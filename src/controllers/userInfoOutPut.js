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
var UserInfoOutPut = /** @class */ (function () {
    function UserInfoOutPut() {
        var _this = this;
        // 회원 정보 조회
        this.getUser = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var userInfo, isFollowing, followerCount, followingCount, message, message;
            return __generator(this, function (_a) {
                userInfo = res.userInfo;
                isFollowing = res.isFollowing;
                followerCount = res.followerCount;
                followingCount = res.followingCount;
                try {
                    message = "회원 정보 조회를 했습니다.";
                    logger_1.logger.info("GET /api/mypage/myInfo/".concat(req.params.userId, " 200 res:").concat(message));
                    res.status(200).send({
                        userInfo: userInfo,
                        followerCount: followerCount,
                        followingCount: followingCount,
                        message: message,
                        isFollowing: isFollowing
                    });
                }
                catch (error) {
                    console.log(error);
                    message = "회원 정보 조회에 실패 했습니다.";
                    logger_1.logger.error("GET /api/mypage/myInfo/".concat(req.params.userId, " 500 res:").concat(error));
                    res.status(500).send({ message: message });
                }
                return [2 /*return*/];
            });
        }); };
        this.getUserPost = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var userId, postLists, myPosts, _i, postLists_1, postList, isLiked, isBookmarked, liked, bookmarked, message, error_1, message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = req.params.userId;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 9, , 10]);
                        return [4 /*yield*/, models_1.Post.findAll({
                                where: { userId: Number(userId) },
                                attributes: [
                                    "Post.*",
                                    [sequelize_1["default"].literal("COUNT(DISTINCT Likes.likeId)"), "likeCnt"],
                                    [
                                        sequelize_1["default"].literal("COUNT(DISTINCT Bookmarks.bookmarkId)"),
                                        "bookCnt",
                                    ],
                                ],
                                include: [
                                    {
                                        model: models_1.Like,
                                        attributes: []
                                    },
                                    {
                                        model: models_1.Bookmark,
                                        attributes: []
                                    },
                                ],
                                raw: true,
                                group: ["postId"]
                            })];
                    case 2:
                        postLists = _a.sent();
                        myPosts = [];
                        _i = 0, postLists_1 = postLists;
                        _a.label = 3;
                    case 3:
                        if (!(_i < postLists_1.length)) return [3 /*break*/, 8];
                        postList = postLists_1[_i];
                        isLiked = false;
                        isBookmarked = false;
                        if (!res.locals.user) return [3 /*break*/, 6];
                        return [4 /*yield*/, models_1.Like.findOne({
                                where: { userId: Number(res.locals.user.userId), postId: Number(postList.postId) }
                            })];
                    case 4:
                        liked = _a.sent();
                        // 좋아요 했으면 true
                        if (liked)
                            isLiked = true;
                        return [4 /*yield*/, models_1.Bookmark.findOne({
                                where: { userId: Number(res.locals.user.userId), postId: Number(postList.postId) }
                            })];
                    case 5:
                        bookmarked = _a.sent();
                        // 북마크 했으면 true
                        if (bookmarked)
                            isBookmarked = true;
                        _a.label = 6;
                    case 6:
                        // 배열에 삽입
                        myPosts.push({
                            postId: postList.postId,
                            coverOriginal: postList.coverOriginal,
                            coverCropped: postList.coverCropped,
                            // imageCover: postList.imageCover,
                            title: postList.title,
                            categorySpace: postList.categorySpace,
                            categoryStudyMate: postList.categoryStudyMate,
                            categoryInterest: postList.categoryInterest,
                            contentEditor: postList.contentEditor,
                            date: postList.date,
                            userId: postList.userId,
                            likeCnt: postList.likeCnt,
                            bookCnt: postList.bookCnt,
                            isLiked: isLiked,
                            isBookmarked: isBookmarked
                        });
                        _a.label = 7;
                    case 7:
                        _i++;
                        return [3 /*break*/, 3];
                    case 8:
                        message = "작성하신 게시물을 조회했습니다.";
                        logger_1.logger.info("GET /api/mypage/myposts/".concat(userId, " 200 res:").concat(message));
                        res.status(200).send({ myPosts: myPosts, message: message });
                        return [3 /*break*/, 10];
                    case 9:
                        error_1 = _a.sent();
                        console.error(error_1);
                        message = "알 수 없는 문제로 인해 정보를 가져오는데 실패했습니다.";
                        logger_1.logger.error("GET /api/mypage/myposts/".concat(userId, " 500 res:").concat(error_1));
                        res.status(500).send({ message: message });
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        }); };
        this.getUserBookmark = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var userId, postLists, mybooks, myBookLists, _i, postLists_2, postList, _a, mybooks_1, mybook, bookmarkedPosts, _b, myBookLists_1, myBookList, isLiked, isBookmarked, liked, bookmarked, message, error_2, message;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        userId = req.params.userId;
                        _c.label = 1;
                    case 1:
                        _c.trys.push([1, 10, , 11]);
                        return [4 /*yield*/, models_1.Post.findAll({
                                attributes: [
                                    "Post.*",
                                    [sequelize_1["default"].literal("COUNT(DISTINCT Likes.likeId)"), "likeCnt"],
                                    [
                                        sequelize_1["default"].literal("COUNT(DISTINCT Bookmarks.bookmarkId)"),
                                        "bookCnt",
                                    ],
                                ],
                                include: [
                                    {
                                        model: models_1.Like,
                                        attributes: []
                                    },
                                    {
                                        model: models_1.Bookmark,
                                        attributes: []
                                    },
                                ],
                                raw: true,
                                group: ["postId"]
                            })];
                    case 2:
                        postLists = _c.sent();
                        return [4 /*yield*/, models_1.Bookmark.findAll({
                                where: { userId: Number(userId) }
                            })];
                    case 3:
                        mybooks = _c.sent();
                        myBookLists = [];
                        for (_i = 0, postLists_2 = postLists; _i < postLists_2.length; _i++) {
                            postList = postLists_2[_i];
                            for (_a = 0, mybooks_1 = mybooks; _a < mybooks_1.length; _a++) {
                                mybook = mybooks_1[_a];
                                if (postList.postId === mybook.postId) {
                                    myBookLists.push({
                                        postId: postList.postId,
                                        coverOriginal: postList.coverOriginal,
                                        coverCropped: postList.coverCropped,
                                        // imageCover: postList.imageCover,
                                        title: postList.title,
                                        categorySpace: postList.categorySpace,
                                        categoryStudyMate: postList.categoryStudyMate,
                                        categoryInterest: postList.categoryInterest,
                                        contentEditor: postList.contentEditor,
                                        date: postList.date,
                                        userId: postList.userId,
                                        likeCnt: postList.likeCnt,
                                        bookCnt: postList.bookCnt
                                    });
                                }
                            }
                        }
                        bookmarkedPosts = [];
                        _b = 0, myBookLists_1 = myBookLists;
                        _c.label = 4;
                    case 4:
                        if (!(_b < myBookLists_1.length)) return [3 /*break*/, 9];
                        myBookList = myBookLists_1[_b];
                        isLiked = false;
                        isBookmarked = false;
                        if (!res.locals.user) return [3 /*break*/, 7];
                        return [4 /*yield*/, models_1.Like.findOne({
                                where: {
                                    userId: res.locals.user.userId,
                                    postId: myBookList.postId
                                }
                            })];
                    case 5:
                        liked = _c.sent();
                        // 좋아요 했으면 true
                        if (liked)
                            isLiked = true;
                        return [4 /*yield*/, models_1.Bookmark.findOne({
                                where: {
                                    userId: res.locals.user.userId,
                                    postId: myBookList.postId
                                }
                            })];
                    case 6:
                        bookmarked = _c.sent();
                        // 북마크 했으면 true
                        if (bookmarked)
                            isBookmarked = true;
                        _c.label = 7;
                    case 7:
                        // 배열에 삽입
                        bookmarkedPosts.push({
                            postId: myBookList.postId,
                            coverOriginal: myBookList.coverOriginal,
                            coverCropped: myBookList.coverCropped,
                            // imageCover: myBookList.imageCover,
                            title: myBookList.title,
                            categorySpace: myBookList.categorySpace,
                            categoryStudyMate: myBookList.categoryStudyMate,
                            categoryInterest: myBookList.categoryInterest,
                            contentEditor: myBookList.contentEditor,
                            date: myBookList.date,
                            userId: myBookList.userId,
                            likeCnt: myBookList.likeCnt,
                            bookCnt: myBookList.bookCnt,
                            isLiked: isLiked,
                            isBookmarked: isBookmarked
                        });
                        _c.label = 8;
                    case 8:
                        _b++;
                        return [3 /*break*/, 4];
                    case 9:
                        message = "북마크한 리스트를 조회 했습니다.";
                        logger_1.logger.info("GET /mypage/mybookmarks/".concat(userId, " 200 res:").concat(message));
                        res.status(200).send({ bookmarkedPosts: bookmarkedPosts, message: message });
                        return [3 /*break*/, 11];
                    case 10:
                        error_2 = _c.sent();
                        console.error(error_2);
                        message = "알 수 없는 문제로 인해 정보를 가져오는데 실패했습니다.";
                        logger_1.logger.error("GET /mypage/mybookmarks/".concat(userId, " 500 res:").concat(error_2));
                        res.status(500).send({ message: message });
                        return [3 /*break*/, 11];
                    case 11: return [2 /*return*/];
                }
            });
        }); };
    }
    return UserInfoOutPut;
}());
;
exports["default"] = new UserInfoOutPut();

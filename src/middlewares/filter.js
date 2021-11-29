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
var filter = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var searchMode, sqlQuery, posts, randPosts, followingIdList, followPost, message, _a, categorySpace, categoryInterest, categoryStudyMate, keyword, sort, page, currentPage, postPerPage, offset, userId, condition, sortBy, keywords, where, beforePagination, cntForPaging, totalCnt, totalPage, sqlQuery, posts, postsArr, _i, posts_1, post, isLiked, isBookmarked, liked, bookmarked;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                searchMode = req.query.searchMode;
                if (!(searchMode === "main")) return [3 /*break*/, 6];
                sqlQuery = "\n    SELECT Posts.*, COUNT(Likes.postId) AS likeCnt, Users.nickname, Users.avatarUrl\n    FROM Posts\n    JOIN Likes On Posts.postId = Likes.postId\n    JOIN Users ON Posts.userId = Users.userId\n    GROUP BY Posts.postId\n    ORDER BY likeCnt DESC\n    LIMIT 10;";
                return [4 /*yield*/, models_1.sequelize.query(sqlQuery, {
                        type: sequelize_1["default"].QueryTypes.SELECT
                    })];
            case 1:
                posts = _b.sent();
                return [4 /*yield*/, models_1.Post.findAll({
                        attributes: ["Post.*", "User.nickname", "User.avatarUrl"],
                        include: {
                            model: models_1.User,
                            attributes: []
                        },
                        raw: true,
                        order: [sequelize_1["default"].fn("RAND")],
                        limit: 10
                    })];
            case 2:
                randPosts = _b.sent();
                if (!res.locals) return [3 /*break*/, 4];
                followingIdList = res.locals.user
                    ? res.locals.user.Followings.map(function (f) { return f.userId; })
                    : [];
                return [4 /*yield*/, models_1.Post.findAll({
                        where: { userId: followingIdList },
                        attributes: ["Post.*", "User.nickname", "User.avatarUrl"],
                        include: {
                            model: models_1.User,
                            attributes: []
                        },
                        raw: true,
                        limit: 5,
                        order: [["date", "DESC"]]
                    })];
            case 3:
                followPost = _b.sent();
                res.followPost = followPost;
                return [3 /*break*/, 5];
            case 4:
                res.followPost = [];
                _b.label = 5;
            case 5:
                message = "쿼리 결과 : 메인";
                req.posts = posts;
                req.randPosts = randPosts;
                req.queryResult = { message: message };
                next();
                return [3 /*break*/, 15];
            case 6:
                _a = req.query, categorySpace = _a.categorySpace, categoryInterest = _a.categoryInterest, categoryStudyMate = _a.categoryStudyMate, keyword = _a.keyword, sort = _a.sort;
                page = req.query.page;
                currentPage = 0;
                if (!page)
                    currentPage = 1;
                postPerPage = 9;
                offset = (currentPage - 1) * postPerPage;
                userId = void 0;
                condition = [];
                sortBy = "";
                if (sort)
                    sortBy = "ORDER BY Post.date ".concat(sort);
                if (keyword) {
                    keywords = keyword;
                    condition.push("Post.title LIKE '%".concat(encodeURIComponent(keywords), "%'"));
                }
                if (categoryInterest)
                    condition.push("Post.categoryInterest='".concat(categoryInterest, "'"));
                if (categorySpace)
                    condition.push("Post.categorySpace='".concat(categorySpace, "'"));
                if (categoryStudyMate)
                    condition.push("Post.categoryStudyMate='".concat(categoryStudyMate, "'"));
                where = condition.length === 0 ? "" : "WHERE ".concat(condition.join(" AND "));
                beforePagination = "SELECT COUNT(*) as cnt\n      FROM Posts AS Post \n      ".concat(where);
                return [4 /*yield*/, models_1.sequelize.query(beforePagination, {
                        type: sequelize_1["default"].QueryTypes.SELECT
                    })];
            case 7:
                cntForPaging = _b.sent();
                totalCnt = cntForPaging[0].cnt;
                totalPage = Math.ceil(totalCnt / postPerPage);
                sqlQuery = "SELECT Post.*,\n    COUNT(DISTINCT Likes.likeId) AS likeCnt, \n    COUNT(DISTINCT Bookmarks.bookmarkId) AS bookCnt\n    FROM Posts AS Post \n    LEFT OUTER JOIN Likes AS Likes ON Post.postId = Likes.postId \n    LEFT OUTER JOIN Bookmarks AS Bookmarks ON Post.postId = Bookmarks.postId \n    ".concat(where, "\n    GROUP BY Post.postId\n    ").concat(sortBy, "\n    LIMIT ").concat(postPerPage, "\n    OFFSET ").concat(offset, ";");
                return [4 /*yield*/, models_1.sequelize.query(sqlQuery, {
                        type: sequelize_1["default"].QueryTypes.SELECT
                    })];
            case 8:
                posts = _b.sent();
                postsArr = [];
                _i = 0, posts_1 = posts;
                _b.label = 9;
            case 9:
                if (!(_i < posts_1.length)) return [3 /*break*/, 14];
                post = posts_1[_i];
                isLiked = false;
                isBookmarked = false;
                if (!res.locals.user) return [3 /*break*/, 12];
                userId = res.locals.user.userId;
                return [4 /*yield*/, models_1.Like.findOne({
                        where: { userId: userId, postId: post.postId }
                    })];
            case 10:
                liked = _b.sent();
                return [4 /*yield*/, models_1.Bookmark.findOne({
                        where: { userId: userId, postId: post.postId }
                    })];
            case 11:
                bookmarked = _b.sent();
                0;
                if (liked)
                    isLiked = true;
                if (bookmarked)
                    isBookmarked = true;
                _b.label = 12;
            case 12:
                postsArr.push({
                    postId: post.postId,
                    coverOriginal: post.coverOriginal,
                    coverCropped: post.coverCropped,
                    title: post.title,
                    categorySpace: post.categorySpace,
                    categoryStudyMate: post.categoryStudyMate,
                    categoryInterest: post.categoryInterest,
                    contentEditor: post.contentEditor,
                    date: post.date,
                    userId: post.userId,
                    likeCnt: post.likeCnt,
                    bookCnt: post.bookCnt,
                    isLiked: isLiked,
                    isBookmarked: isBookmarked
                });
                _b.label = 13;
            case 13:
                _i++;
                return [3 /*break*/, 9];
            case 14:
                req.posts = postsArr;
                req.totalPage = totalPage;
                next();
                _b.label = 15;
            case 15: return [2 /*return*/];
        }
    });
}); };
exports["default"] = filter;

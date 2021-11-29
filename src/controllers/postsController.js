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
var controlS3_1 = require("../library/controlS3");
var logger_1 = require("../config/logger");
var extractImageSrcS3 = controlS3_1["default"].extractImageSrcS3, copyImagesS3 = controlS3_1["default"].copyImagesS3, removeObjS3 = controlS3_1["default"].removeObjS3;
var PostsController = /** @class */ (function () {
    function PostsController() {
    }
    /*
      게시물 조회
    */
    PostsController.prototype.getPosts = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var randPosts, posts, totalPage, followPost, message;
            return __generator(this, function (_a) {
                randPosts = req.randPosts, posts = req.posts, totalPage = req.totalPage;
                followPost = res.followPost;
                message = "posts 조회 성공";
                logger_1.logger.info("GET /api/posts 200 res:".concat(message));
                return [2 /*return*/, res.status(200).send({
                        message: message,
                        posts: posts,
                        randPosts: randPosts,
                        followPost: followPost,
                        totalPage: totalPage
                    })];
            });
        });
    };
    /*
      게시물 생성
    */
    PostsController.prototype.postPosts = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var files, originPath, croppedPath, userId, body, title, categorySpace, categoryStudyMate, categoryInterest, contentEditor, imageList, _a, innerHtml, encodedTitle, encodedHTML, date, post, message, error_1, message;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        files = JSON.parse(JSON.stringify(req.files));
                        originPath = req.files
                            ? "uploads".concat(files["coverOriginal"][0].location.split("uploads")[1])
                            : "";
                        croppedPath = req.files
                            ? "uploads".concat(files["coverCropped"][0].location.split("uploads")[1])
                            : "";
                        userId = res.locals.user.userId;
                        body = JSON.parse(JSON.stringify(req.body));
                        title = body.title, categorySpace = body.categorySpace, categoryStudyMate = body.categoryStudyMate, categoryInterest = body.categoryInterest, contentEditor = body.contentEditor;
                        imageList = extractImageSrcS3(contentEditor);
                        _a = copyImagesS3;
                        return [4 /*yield*/, imageList];
                    case 1: 
                    // 비교 후 이동
                    return [4 /*yield*/, _a.apply(void 0, [_b.sent()])];
                    case 2:
                        // 비교 후 이동
                        _b.sent();
                        innerHtml = contentEditor.replace(/temp/g, "content");
                        encodedTitle = encodeURIComponent(title);
                        encodedHTML = encodeURIComponent(innerHtml);
                        date = new Date();
                        post = {
                            userId: userId,
                            coverCropped: croppedPath,
                            coverOriginal: originPath,
                            // imageCover: path,
                            title: encodedTitle,
                            categoryInterest: categoryInterest,
                            categorySpace: categorySpace,
                            categoryStudyMate: categoryStudyMate,
                            contentEditor: encodedHTML,
                            date: date
                        };
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 5, , 6]);
                        return [4 /*yield*/, models_1.Post.create(post)];
                    case 4:
                        _b.sent();
                        message = "게시물 작성 성공!";
                        logger_1.logger.info("POST /api/posts 201 res:".concat(message));
                        return [2 /*return*/, res.status(201).send({ message: message })];
                    case 5:
                        error_1 = _b.sent();
                        console.log(error_1);
                        message = "DB 저장에 실패했습니다.";
                        logger_1.logger.info("POST /api/posts 500 res:".concat(message));
                        return [2 /*return*/, res.status(500).send({ message: message })];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    /*
      게시물 수정
    */
    PostsController.prototype.putPosts = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, postId, files, originPath, croppedPath, body, title, categoryInterest, categorySpace, categoryStudyMate, contentEditor, post, backup, message_1, message_2, decodedHtml, prevImageList, prevCoverOriginal, prevCoverCropped, imageList, _a, message, error_2, message;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        userId = res.locals.user.userId;
                        postId = req.params.postId;
                        files = JSON.parse(JSON.stringify(req.files));
                        originPath = files["coverOriginal"]
                            ? "uploads".concat(files["coverOriginal"][0].location.split("uploads")[1])
                            : null;
                        croppedPath = files["coverCropped"]
                            ? "uploads".concat(files["coverCropped"][0].location.split("uploads")[1])
                            : null;
                        console.log("ㅎㅎ", originPath);
                        console.log("ㅎㅎ", croppedPath);
                        body = JSON.parse(JSON.stringify(req.body));
                        title = body.title, categoryInterest = body.categoryInterest, categorySpace = body.categorySpace, categoryStudyMate = body.categoryStudyMate, contentEditor = body.contentEditor;
                        return [4 /*yield*/, models_1.Post.findByPk(postId)];
                    case 1:
                        post = _b.sent();
                        backup = post;
                        _b.label = 2;
                    case 2:
                        _b.trys.push([2, 12, , 17]);
                        if (!(!post || userId !== post.userId)) return [3 /*break*/, 5];
                        // 이미 업로드된 이미지 삭제
                        // await removeObjS3(path);
                        return [4 /*yield*/, removeObjS3(originPath)];
                    case 3:
                        // 이미 업로드된 이미지 삭제
                        // await removeObjS3(path);
                        _b.sent();
                        return [4 /*yield*/, removeObjS3(croppedPath)];
                    case 4:
                        _b.sent();
                        // 조건에 따라 status 분기
                        if (!post) {
                            message_1 = "해당 게시물이 존재하지 않습니다.";
                            logger_1.logger.info("PUT /api/posts/".concat(postId, " 404 res:").concat(message_1));
                            return [2 /*return*/, res.status(404).send({ message: message_1 })];
                        }
                        else {
                            message_2 = "본인의 게시물만 수정할 수 있습니다.";
                            logger_1.logger.info("PUT /api/posts/".concat(postId, " 404 res:").concat(message_2));
                            return [2 /*return*/, res.status(403).send({ message: message_2 })];
                        }
                        _b.label = 5;
                    case 5:
                        decodedHtml = decodeURIComponent(post.contentEditor);
                        prevImageList = extractImageSrcS3(decodedHtml);
                        prevCoverOriginal = decodeURIComponent(post.coverOriginal);
                        prevCoverCropped = decodeURIComponent(post.coverCropped);
                        imageList = extractImageSrcS3(contentEditor);
                        _a = copyImagesS3;
                        return [4 /*yield*/, imageList];
                    case 6: return [4 /*yield*/, _a.apply(void 0, [_b.sent()])];
                    case 7:
                        _b.sent();
                        // 수정 본문 이미지 처리가 안되어있음.
                        //새로 올라온 데이터가 있을 때만 데이터 바꾸기
                        // if (path) post.imageCover = path;
                        if (originPath)
                            post.coverOriginal = originPath;
                        if (croppedPath)
                            post.coverCropped = croppedPath;
                        if (title)
                            post.title = encodeURIComponent(title);
                        if (categorySpace)
                            post.categorySpace = categorySpace;
                        if (categoryInterest)
                            post.categoryInterest = categoryInterest;
                        if (categoryStudyMate)
                            post.categoryStudyMate = categoryStudyMate;
                        if (contentEditor)
                            post.contentEditor = encodeURIComponent(contentEditor);
                        return [4 /*yield*/, post.save()];
                    case 8:
                        _b.sent();
                        message = "게시물 수정 성공";
                        logger_1.logger.info("PUT /api/posts/".concat(postId, " 204 res:").concat(message));
                        res.status(204).send({ message: message });
                        //성공하면 기존 본문 이미지들 삭제
                        if (prevImageList.length !== 0) {
                            prevImageList.forEach(function (src) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, removeObjS3(src)];
                                        case 1:
                                            _a.sent();
                                            return [2 /*return*/];
                                    }
                                });
                            }); });
                        }
                        if (!originPath) return [3 /*break*/, 10];
                        return [4 /*yield*/, removeObjS3(prevCoverOriginal)];
                    case 9:
                        _b.sent();
                        _b.label = 10;
                    case 10: return [4 /*yield*/, removeObjS3(prevCoverCropped)];
                    case 11:
                        _b.sent();
                        return [2 /*return*/];
                    case 12:
                        error_2 = _b.sent();
                        console.log(error_2);
                        // 새로 넣으려던 데이터는 지운다. -> 원상복구 시켜야 함.
                        // ROLLBACK : 기존데이터를 다시 넣고 저장.
                        // 원상복구 해야할 요소 : 파일, DB
                        // 기존 데이터를 어딘가에 백업해야할 듯.
                        return [4 /*yield*/, post.update(backup)];
                    case 13:
                        // 새로 넣으려던 데이터는 지운다. -> 원상복구 시켜야 함.
                        // ROLLBACK : 기존데이터를 다시 넣고 저장.
                        // 원상복구 해야할 요소 : 파일, DB
                        // 기존 데이터를 어딘가에 백업해야할 듯.
                        _b.sent();
                        return [4 /*yield*/, post.save()];
                    case 14:
                        _b.sent();
                        return [4 /*yield*/, removeObjS3(originPath)];
                    case 15:
                        _b.sent();
                        return [4 /*yield*/, removeObjS3(croppedPath)];
                    case 16:
                        _b.sent();
                        message = "DB 업데이트 실패";
                        logger_1.logger.error("PUT /api/posts/".concat(postId, " 204 res:").concat(message));
                        return [2 /*return*/, res.status(500).send({ message: message })];
                    case 17: return [2 /*return*/];
                }
            });
        });
    };
    /*
      게시물 삭제
    */
    PostsController.prototype.deletePosts = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var postId, userId, post, decodedHtml, imgList, _i, imgList_1, src, message, error_3, message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        postId = req.params.postId;
                        userId = res.locals.user.userId;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 10, , 11]);
                        return [4 /*yield*/, models_1.Post.findByPk(postId)];
                    case 2:
                        post = _a.sent();
                        if (userId !== post.userId)
                            return [2 /*return*/, res.status(403).send({ message: "주인 아님" })];
                        decodedHtml = decodeURIComponent(post.contentEditor);
                        imgList = extractImageSrcS3(decodedHtml);
                        _i = 0, imgList_1 = imgList;
                        _a.label = 3;
                    case 3:
                        if (!(_i < imgList_1.length)) return [3 /*break*/, 6];
                        src = imgList_1[_i];
                        return [4 /*yield*/, removeObjS3(src)];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        _i++;
                        return [3 /*break*/, 3];
                    case 6: return [4 /*yield*/, removeObjS3(post.coverOriginal)];
                    case 7:
                        _a.sent();
                        return [4 /*yield*/, removeObjS3(post.coverCropped)];
                    case 8:
                        _a.sent();
                        return [4 /*yield*/, post.destroy()];
                    case 9:
                        _a.sent();
                        message = "포스팅 삭제 성공";
                        logger_1.logger.info("DELETE /api/posts/".concat(postId, " 200 res:").concat(message));
                        return [2 /*return*/, res.status(200).send({ message: message })];
                    case 10:
                        error_3 = _a.sent();
                        console.log(error_3);
                        message = "포스팅 삭제 실패";
                        logger_1.logger.error("DELETE /api/posts/".concat(postId, " 200 res:").concat(error_3));
                        return [2 /*return*/, res.status(500).send({ message: message })];
                    case 11: return [2 /*return*/];
                }
            });
        });
    };
    /*
      특정 게시물 조회
    */
    PostsController.prototype.getOnePost = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var postId, userId, isBookmarked, isLiked, isFollowing, currentNick, currentAvatar, post, user, bookmarked, liked, targetId, following, message, error_4, message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        postId = req.params.postId;
                        userId = (res.locals.user ? res.locals.user : { userId: null }).userId;
                        isBookmarked = false;
                        isLiked = false;
                        isFollowing = false;
                        currentNick = "";
                        currentAvatar = "";
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 8, , 9]);
                        return [4 /*yield*/, models_1.Post.findOne({
                                where: { postId: postId },
                                include: {
                                    model: models_1.User,
                                    attributes: ["nickname", "avatarUrl"]
                                }
                            })];
                    case 2:
                        post = _a.sent();
                        if (!userId) return [3 /*break*/, 7];
                        return [4 /*yield*/, models_1.User.findByPk(userId)];
                    case 3:
                        user = _a.sent();
                        currentNick = user.nickname;
                        currentAvatar = user.avatarUrl;
                        return [4 /*yield*/, models_1.Bookmark.findOne({
                                where: { postId: postId, userId: userId }
                            })];
                    case 4:
                        bookmarked = _a.sent();
                        if (bookmarked)
                            isBookmarked = true;
                        return [4 /*yield*/, models_1.Like.findOne({
                                where: { postId: postId, userId: userId }
                            })];
                    case 5:
                        liked = _a.sent();
                        if (liked)
                            isLiked = true;
                        targetId = post.userId;
                        return [4 /*yield*/, models_1.sequelize.query("SELECT * FROM Follow\n        WHERE Follow.followingId=".concat(targetId, " AND Follow.followerId=").concat(userId, ";"), { type: sequelize_1.QueryTypes.SELECT })];
                    case 6:
                        following = _a.sent();
                        if (following.length !== 0)
                            isFollowing = true;
                        _a.label = 7;
                    case 7:
                        message = "특정 게시물 1개를 조회 했습니다.";
                        logger_1.logger.info("GET /api/posts/".concat(postId, " 200 res:").concat(message));
                        return [2 /*return*/, res.status(200).send({
                                post: post,
                                isBookmarked: isBookmarked,
                                isLiked: isLiked,
                                isFollowing: isFollowing,
                                currentNick: currentNick,
                                currentAvatar: currentAvatar
                            })];
                    case 8:
                        error_4 = _a.sent();
                        console.log(error_4);
                        message = "DB 조회에 실패했습니다.";
                        logger_1.logger.error("GET /api/posts/".concat(postId, " 500 res:").concat(error_4, "}"));
                        return [2 /*return*/, res.status(500).send({ message: message })];
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    /*
      ckEditor 본문 이미지 업로드
    */
    PostsController.prototype.ckUpload = function (req, res) {
        var file = req.file;
        var path = "uploads".concat(file.location.split("uploads")[1]);
        logger_1.logger.info("POST /api/posts/ckUpload 201 res:".concat(path, " \uACBD\uB85C \uC774\uBBF8\uC9C0 \uC800\uC7A5"));
        return res.status(201).send({ path: path });
    };
    /*
      크롭퍼에 넣어줄 이미지 가져온 뒤 보여주기
    */
    PostsController.prototype.getCoverOriginal = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var postId, post, coverOriginalUrl, error_5;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        postId = req.params.postId;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, models_1.Post.findByPk(postId)];
                    case 2:
                        post = _a.sent();
                        coverOriginalUrl = post.coverOriginal;
                        // const result = await getObjS3(coverOriginalUrl);
                        // const base64Format = result.Body.toString("base64");
                        // const utf8Format = result.Body.toString("utf-8");
                        // const buffer = result.Body;
                        logger_1.logger.info("POST /api/posts/".concat(postId, "/coverOriginal 200 res: \uACBD\uB85C\uC758 \uC774\uBBF8\uC9C0 \uAC16\uB2E4\uC8FC\uAE30!!"));
                        // return res.status(200).send({ coverOriginalObj: base64Format });
                        return [2 /*return*/, res.status(200).send({ coverOriginalObj: coverOriginalUrl })];
                    case 3:
                        error_5 = _a.sent();
                        console.log(error_5);
                        logger_1.logger.error("POST /api/posts/".concat(postId, "/coverOriginal 500 res:").concat(error_5));
                        return [2 /*return*/, res.status(500).send({ message: "파일을 불러올 수 없습니다." })];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    return PostsController;
}());
exports["default"] = new PostsController();

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
var FollowMw = /** @class */ (function () {
    function FollowMw() {
        var _this = this;
        this.follow = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var userId, user, message, followerCount, followingCount, followingIdList, followerIdList, error_1, message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = req.params.userId;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, models_1.User.findOne({
                                where: { userId: Number(userId) },
                                include: [
                                    {
                                        model: models_1.User,
                                        attributes: ["userId", "nickname", "avatarUrl"],
                                        as: "Followers"
                                    },
                                    {
                                        model: models_1.User,
                                        attributes: ["userId", "nickname", "avatarUrl"],
                                        as: "Followings"
                                    },
                                ]
                            })];
                    case 2:
                        user = _a.sent();
                        if (!user) {
                            message = "조회 하려는 사용자가 없습니다.";
                            logger_1.logger.info("userInfo/userFollow middleware error: ".concat(message));
                            return [2 /*return*/, res.status(400).send({ message: message })];
                        }
                        else {
                            user.followerCount = user ? user.Followers.length : 0;
                            user.followingCount = user ? user.Followings.length : 0;
                            user.followingIdList = user ? user.Followings : [];
                            user.followerIdList = user ? user.Followers : [];
                            followerCount = user.followerCount;
                            followingCount = user.followingCount;
                            followingIdList = user.followingIdList;
                            followerIdList = user.followerIdList;
                            res.followerCount = followerCount;
                            res.followingCount = followingCount;
                            res.followingIdList = followingIdList;
                            res.followerIdList = followerIdList;
                            next();
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _a.sent();
                        console.log(error_1);
                        message = "알 수 없는 문제로 회원 정보를 가져오는데 실패 했습니다.";
                        logger_1.logger.error("userInfo/userFollow middleware catch error: ".concat(error_1));
                        res.status(500).send({ message: message });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
    }
    return FollowMw;
}());
exports["default"] = new FollowMw();

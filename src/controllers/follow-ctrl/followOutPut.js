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
var logger_1 = require("../../config/logger");
var FollowOutPut = /** @class */ (function () {
    function FollowOutPut() {
        var _this = this;
        this.getFollowing = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var followingIdList, message, message;
            return __generator(this, function (_a) {
                followingIdList = res.followingIdList;
                try {
                    message = "팔로윙 중인 유저목록을 불러왔습니다.";
                    logger_1.logger.info("GET /api/followings/".concat(req.params.userId, " 200 res:").concat(message));
                    res.status(200).send({ followingIdList: followingIdList, message: message });
                }
                catch (error) {
                    // try에서 발생한 오류 catch해서 응답함
                    console.error(error);
                    message = "알 수 없는 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
                    logger_1.logger.error("GET /api/followings/".concat(req.params.userId, " 500 res:").concat(error));
                    res.status(500).send({ message: message });
                }
                return [2 /*return*/];
            });
        }); };
        this.getFollower = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var followerIdList, message, message;
            return __generator(this, function (_a) {
                followerIdList = res.followerIdList;
                try {
                    message = "팔로워 중인 유저목록을 불러왔습니다";
                    logger_1.logger.info("GET /api/followers/".concat(req.params.userId, " 200 res:").concat(message));
                    res.status(200).send({ followerIdList: followerIdList, message: message });
                }
                catch (error) {
                    console.error(error);
                    message = "알 수 없는 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
                    logger_1.logger.error("GET /api/followers/".concat(req.params.userId, " 500 res:").concat(error));
                    res.status(500).send({ message: message });
                }
                return [2 /*return*/];
            });
        }); };
    }
    return FollowOutPut;
}());
;
exports["default"] = new FollowOutPut();

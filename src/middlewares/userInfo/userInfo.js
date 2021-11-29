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
//유저 정보 가공(작성한 게시글 갯수 카운트)
var UserInfo = /** @class */ (function () {
    function UserInfo() {
        var _this = this;
        this.getUserInfo = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var userId, userQuery, userInfo, isFollowing, result, error_1, message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        userId = req.params.userId;
                        userQuery = "\n      SELECT Users.userId,Users.email,Users.nickname,Users.avatarUrl,Users.date,Users.provider, COUNT(Posts.userId) AS postCnt\n      FROM Users\n      LEFT OUTER JOIN Posts On Users.userId = Posts.userId\n      WHERE Users.userId = ".concat(userId, "\n      GROUP BY Users.userId\n      ORDER BY date DESC;");
                        return [4 /*yield*/, models_1.sequelize.query(userQuery, {
                                type: sequelize_1["default"].QueryTypes.SELECT
                            })];
                    case 1:
                        userInfo = _a.sent();
                        isFollowing = false;
                        if (!res.locals.user) return [3 /*break*/, 3];
                        return [4 /*yield*/, models_1.sequelize.query("SELECT * FROM Follow \n          WHERE Follow.followerId=".concat(res.locals.user.userId, " AND\n          Follow.followingId=").concat(userInfo[0].userId), {
                                type: sequelize_1["default"].QueryTypes.SELECT
                            })];
                    case 2:
                        result = _a.sent();
                        if (result.length !== 0)
                            isFollowing = true;
                        _a.label = 3;
                    case 3:
                        res.isFollowing = isFollowing;
                        res.userInfo = userInfo;
                        next();
                        return [3 /*break*/, 5];
                    case 4:
                        error_1 = _a.sent();
                        console.error(error_1);
                        message = "알 수 없는 문제로 회원 정보를 가져오는데 실패 했습니다.";
                        logger_1.logger.error("userInfo/userInfo middleware error: ".concat(error_1));
                        res.status(500).send({ message: message });
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
    }
    return UserInfo;
}());
exports["default"] = new UserInfo();

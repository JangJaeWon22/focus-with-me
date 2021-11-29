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
var moment_1 = require("moment");
var FollowProcess = /** @class */ (function () {
    function FollowProcess() {
        var _this = this;
        this.createFollow = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var user, user_id, userId, userInfo, tagetUser, dateStr, date, sqlQuery, message, message, message, error_1, message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = res.locals.user;
                        user_id = user.userId;
                        userId = req.body.userId;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 9, , 10]);
                        return [4 /*yield*/, models_1.User.findOne({ where: { userId: user_id } })];
                    case 2:
                        userInfo = _a.sent();
                        return [4 /*yield*/, models_1.User.findOne({ where: { userId: userId } })];
                    case 3:
                        tagetUser = _a.sent();
                        dateStr = (0, moment_1["default"])();
                        date = dateStr.format("YYYY-MM-DD HH:mm:ss");
                        if (!userInfo) return [3 /*break*/, 7];
                        if (!(tagetUser.userId !== user_id)) return [3 /*break*/, 5];
                        sqlQuery = "\n          INSERT INTO Follow (createdAt, updatedAt, followingId, followerId)\n          VALUES(\"".concat(date, "\",\"").concat(date, "\",").concat(tagetUser.userId, ",").concat(user_id, ")\n          ");
                        return [4 /*yield*/, models_1.sequelize.query(sqlQuery, {
                                type: sequelize_1.QueryTypes.INSERT
                            })];
                    case 4:
                        _a.sent();
                        message = "".concat(user.nickname, "\uB2D8\uC774 ").concat(tagetUser.nickname, "\uB2D8\uC744 \uD314\uB85C\uC789 \uD588\uC2B5\uB2C8\uB2E4.");
                        logger_1.logger.info("POST /api/follows 200 res:".concat(message));
                        res.status(200).send({ isUser: true, message: message });
                        return [3 /*break*/, 6];
                    case 5:
                        message = "자기 자신을 following 할 수 없습니다.";
                        logger_1.logger.info("POST /api/follows 400 res:".concat(message));
                        res.status(400).send({ message: message });
                        _a.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        message = "사용자를 찾을 수 없습니다.";
                        logger_1.logger.info("POST /api/follows 400 res:".concat(message));
                        res.status(400).send({ message: message });
                        _a.label = 8;
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        error_1 = _a.sent();
                        console.error(error_1);
                        message = "알 수 없는 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
                        logger_1.logger.error("POST /api/follows 500 res:".concat(error_1));
                        res.status(500).send({ message: message });
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        }); };
        this.deleteFollow = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var user, user_id, userId, userInfo, tagetUser, date, sqlQuery, message, message, message, error_2, message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        user = res.locals.user;
                        user_id = user.userId;
                        userId = req.body.userId;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 9, , 10]);
                        return [4 /*yield*/, models_1.User.findOne({ where: { userId: user_id } })];
                    case 2:
                        userInfo = _a.sent();
                        return [4 /*yield*/, models_1.User.findOne({ where: { userId: userId } })];
                    case 3:
                        tagetUser = _a.sent();
                        date = new Date();
                        if (!userInfo) return [3 /*break*/, 7];
                        if (!(tagetUser.userId !== user_id)) return [3 /*break*/, 5];
                        sqlQuery = "\n          DELETE From Follow\n          WHERE followingId = ".concat(tagetUser.userId, " AND followerId = ").concat(user_id, "\n          ");
                        return [4 /*yield*/, models_1.sequelize.query(sqlQuery, {
                                type: sequelize_1.QueryTypes.DELETE
                            })];
                    case 4:
                        _a.sent();
                        message = "".concat(user.nickname, "\uB2D8\uC774 ").concat(tagetUser.nickname, "\uB2D8\uC744 \uD314\uB85C\uC789 \uCDE8\uC18C \uD588\uC2B5\uB2C8\uB2E4.");
                        logger_1.logger.info("DELETE /api/follows 200 res:".concat(message));
                        res.status(200).send({ isUser: false, message: message });
                        return [3 /*break*/, 6];
                    case 5:
                        message = "자기 자신을 following 취소 할 수 없습니다.";
                        logger_1.logger.info("DELETE /api/follows 400 res:".concat(message));
                        res.status(400).send({ message: message });
                        _a.label = 6;
                    case 6: return [3 /*break*/, 8];
                    case 7:
                        message = "사용자를 찾을 수 없습니다.";
                        logger_1.logger.info("DELETE /api/follows 400 res:".concat(message));
                        res.status(400).send({ message: message });
                        _a.label = 8;
                    case 8: return [3 /*break*/, 10];
                    case 9:
                        error_2 = _a.sent();
                        console.error(error_2);
                        message = "알 수 없는 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
                        logger_1.logger.error("DELETE /api/follows 500 res:".concat(message));
                        res.status(500).send({ message: message });
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/];
                }
            });
        }); };
    }
    return FollowProcess;
}());
;
exports["default"] = new FollowProcess();

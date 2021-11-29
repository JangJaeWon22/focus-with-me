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
var bcrypt = require("bcrypt");
var controlS3_1 = require("../../library/controlS3");
var logger_1 = require("../../config/logger");
// 프로필 수정 페이지 접근 시 회원 정보 먼저 조회
var UserUpdate = /** @class */ (function () {
    function UserUpdate() {
        var _this = this;
        this.updateUserProfile = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var user, file, avatarUrl, nicknameNew, existNick, message, message, message, error_1, message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 11, , 12]);
                        console.log("업데이트 라우터 입장");
                        user = res.locals.user;
                        file = req.file;
                        avatarUrl = "";
                        nicknameNew = res.updateUserProfile.nicknameNew;
                        if (!file) return [3 /*break*/, 3];
                        if (!(user.avatarUrl !== "uploads/assets/noAvatar.svg")) return [3 /*break*/, 2];
                        // await removeImage(user.avatarUrl);
                        return [4 /*yield*/, controlS3_1["default"].removeObjS3(user.avatarUrl)];
                    case 1:
                        // await removeImage(user.avatarUrl);
                        _a.sent();
                        _a.label = 2;
                    case 2:
                        avatarUrl = "uploads".concat(file.location.split("uploads")[1]);
                        return [3 /*break*/, 4];
                    case 3:
                        avatarUrl = user.avatarUrl;
                        _a.label = 4;
                    case 4: return [4 /*yield*/, models_1.User.findOne({ where: { nickname: nicknameNew } })];
                    case 5:
                        existNick = _a.sent();
                        if (!!existNick) return [3 /*break*/, 7];
                        // 중복 되는 내용이 없을 경우 update 진행
                        return [4 /*yield*/, user.update({
                                nickname: nicknameNew,
                                avatarUrl: avatarUrl
                            })];
                    case 6:
                        // 중복 되는 내용이 없을 경우 update 진행
                        _a.sent();
                        message = "회원 정보 수정이 완료 되었습니다.";
                        logger_1.logger.info("PUT /api/users/profileEdit 200 res:".concat(message));
                        return [2 /*return*/, res.status(200).send({ user: user, message: message })];
                    case 7:
                        if (!
                        // else if 중복되는 닉네임이 로그인한 user 자신의 닉네임일 경우를 비교
                        (existNick.nickname === nicknameNew &&
                            existNick.userId === user.userId)) 
                        // else if 중복되는 닉네임이 로그인한 user 자신의 닉네임일 경우를 비교
                        return [3 /*break*/, 9];
                        return [4 /*yield*/, user.update({
                                nickname: nicknameNew,
                                avatarUrl: avatarUrl
                            })];
                    case 8:
                        _a.sent();
                        message = "회원 정보 수정이 완료 되었습니다.";
                        logger_1.logger.info("PUT /api/users/profileEdit 200 res:".concat(message));
                        return [2 /*return*/, res.status(200).send({ user: user, message: message })];
                    case 9:
                        message = "중복된 닉네임입니다.";
                        logger_1.logger.info("PUT /api/users/profileEdit 400 res:".concat(message));
                        return [2 /*return*/, res.status(400).send({ message: message })];
                    case 10: return [3 /*break*/, 12];
                    case 11:
                        error_1 = _a.sent();
                        console.log(error_1);
                        message = "알 수 없는 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
                        logger_1.logger.error("PUT /api/users/profileEdit 500 res:".concat(error_1));
                        return [2 /*return*/, res.status(500).send({ message: message })];
                    case 12: return [2 /*return*/];
                }
            });
        }); };
        this.updateUserPw = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var user, _a, passwordOld, passwordNew, existUser, encryptPassword, profile, message, message, message, error_2, message;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 8, , 9]);
                        user = res.locals.user;
                        _a = res.updateUserPw, passwordOld = _a.passwordOld, passwordNew = _a.passwordNew;
                        return [4 /*yield*/, models_1.User.findOne({ where: { userId: user.userId } })];
                    case 1:
                        existUser = _b.sent();
                        if (!existUser) return [3 /*break*/, 6];
                        if (!bcrypt.compareSync(passwordOld, existUser.password)) return [3 /*break*/, 4];
                        encryptPassword = bcrypt.hashSync(passwordNew, 10);
                        return [4 /*yield*/, models_1.User.update({
                                password: encryptPassword
                            }, { where: { userId: user.userId } })];
                    case 2:
                        _b.sent();
                        return [4 /*yield*/, models_1.User.findOne({
                                where: { userId: user.userId }
                            })];
                    case 3:
                        profile = _b.sent();
                        message = "회원정보 수정이 완료되었습니다.";
                        logger_1.logger.info("PUT /api/users/edit 200 res:".concat(message));
                        res.status(201).send({ profile: profile, message: message });
                        return [3 /*break*/, 5];
                    case 4:
                        message = "입력하신 현재의 비밀번호가 일치하지 않습니다.";
                        logger_1.logger.info("PUT /api/users/edit 400 res:".concat(message));
                        res.status(400).send({ message: message });
                        _b.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        message = "등록된 정보를 찾을 수 없습니다.";
                        logger_1.logger.info("PUT /api/users/edit 400 res:".concat(message));
                        res.status(400).send({ message: message });
                        _b.label = 7;
                    case 7: return [3 /*break*/, 9];
                    case 8:
                        error_2 = _b.sent();
                        console.log(error_2);
                        message = "알 수 없는 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
                        logger_1.logger.info("PUT /api/users/edit 500 res:".concat(error_2));
                        res.status(500).send({ message: message });
                        return [3 /*break*/, 9];
                    case 9: return [2 /*return*/];
                }
            });
        }); };
    }
    return UserUpdate;
}());
;
exports["default"] = new UserUpdate();

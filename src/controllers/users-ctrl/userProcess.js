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
var bcrypt = require("bcrypt");
var logger_1 = require("../../config/logger");
//userProcess => user 관련 db 생성, 삭제 메소드 포함
var UserProcess = /** @class */ (function () {
    function UserProcess() {
        var _this = this;
        //회원 가입
        this.createUser = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var _a, email, nickname, password, confirmPassword, message, message, existUsers, message, date, avatarUrl, encryptPassword, user, message, error_1, message;
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 5, , 6]);
                        _a = res.signUpUser, email = _a.email, nickname = _a.nickname, password = _a.password, confirmPassword = _a.confirmPassword;
                        if (password !== confirmPassword) {
                            message = "패스워드가 패스워드 확인란과 동일하지 않습니다.";
                            logger_1.logger.info("POST /api/users/signup 400 res:".concat(message));
                            return [2 /*return*/, res.status(400).send({ message: message })];
                        }
                        // 패스워드에 아이디 포함여부 검사
                        if (password.match(email) !== null || email.match(password) !== null) {
                            message = "아이디가 포함된 비밀번호는 사용이 불가능합니다.";
                            logger_1.logger.info("POST /api/users/signup 400 res:".concat(message));
                            return [2 /*return*/, res.status(400).send({ message: message })];
                        }
                        return [4 /*yield*/, models_1.User.findAll({
                                where: (_b = {},
                                    _b[sequelize_1.Op.or] = [{ nickname: nickname }, { email: email }],
                                    _b)
                            })];
                    case 1:
                        existUsers = _c.sent();
                        if (!(existUsers.length > 0)) return [3 /*break*/, 2];
                        message = "이미 가입된 이메일 또는 닉네임이 있습니다.";
                        logger_1.logger.info("POST /api/users/signup 400 res:".concat(message));
                        res.status(400).send({ message: message });
                        return [3 /*break*/, 4];
                    case 2:
                        date = new Date();
                        avatarUrl = "uploads/assets/noAvatar.svg";
                        encryptPassword = bcrypt.hashSync(password, 10);
                        return [4 /*yield*/, models_1.User.create({
                                email: email,
                                nickname: nickname,
                                password: encryptPassword,
                                avatarUrl: avatarUrl,
                                date: date
                            })];
                    case 3:
                        user = _c.sent();
                        message = "회원가입에 성공했습니다.";
                        logger_1.logger.info("POST /api/users/signup 201 res:".concat(message));
                        return [2 /*return*/, res.status(201).send({ user: user, message: message })];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_1 = _c.sent();
                        console.log(error_1);
                        message = "알 수 없는 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
                        logger_1.logger.error("POST /api/users/signup 500 res:".concat(error_1));
                        return [2 /*return*/, res.status(500).send({ message: message })];
                    case 6: return [2 /*return*/];
                }
            });
        }); };
        //회원탈퇴
        this.deleteUser = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var userId, existUser, message, message, error_2, message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        userId = res.locals.user.userId;
                        return [4 /*yield*/, models_1.User.findOne({ where: { userId: userId } })];
                    case 1:
                        existUser = _a.sent();
                        if (!existUser) return [3 /*break*/, 3];
                        return [4 /*yield*/, models_1.User.destroy({ where: { userId: existUser.userId } })];
                    case 2:
                        _a.sent();
                        message = "회원탈퇴가 완료되었습니다.";
                        logger_1.logger.info("DELETE /api/users/withdrawal 400 res:".concat(message));
                        res.status(200).send({ message: message });
                        return [3 /*break*/, 4];
                    case 3:
                        message = "회원탈퇴가 실패되었습니다.";
                        logger_1.logger.info("DELETE /api/users/withdrawal 400 res:".concat(message));
                        res.stauts(400).send({ message: message });
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_2 = _a.sent();
                        console.log(error_2);
                        message = "알 수 없는 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
                        logger_1.logger.error("DELETE /api/users/withdrawal 500 res:".concat(error_2));
                        res.status(500).send({
                            message: message
                        });
                        return [3 /*break*/, 6];
                    case 6: return [2 /*return*/];
                }
            });
        }); };
    }
    return UserProcess;
}());
;
exports["default"] = new UserProcess();

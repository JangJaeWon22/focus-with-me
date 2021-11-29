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
var Joi = require("joi");
var logger_1 = require("../config/logger");
var VerifyJoi = /** @class */ (function () {
    function VerifyJoi() {
        var _this = this;
        //회원가입 시 joi 검증 실행
        this.signUpUser = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var joiSchema, _a, email, nickname, password, confirmPassword, verifyBody, error_1, message;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        joiSchema = Joi.object({
                            email: Joi.string()
                                .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
                                .max(50)
                                .required(),
                            nickname: Joi.string().min(2).max(10).required(),
                            password: Joi.string().regex(/^.*(?=^.{8,}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/),
                            confirmPassword: Joi.ref("password")
                        });
                        _a = req.body, email = _a.email, nickname = _a.nickname, password = _a.password, confirmPassword = _a.confirmPassword;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, joiSchema.validateAsync({
                                email: email,
                                nickname: nickname,
                                password: password,
                                confirmPassword: confirmPassword
                            })];
                    case 2:
                        verifyBody = _b.sent();
                        res.signUpUser = verifyBody;
                        next();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _b.sent();
                        message = "아이디와 비밀번호의 형식이 올바르지 않습니다.";
                        logger_1.logger.info("verifyJoi-signUpUser middlewares 500 error:".concat(message));
                        return [2 /*return*/, res.status(500).send({ message: message })];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        // nickname 변경 시
        this.updateUserProfile = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var joiSchema, nicknameNew, verifyBody, message, error_2, message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("조이 검증 미들웨어 입장");
                        joiSchema = Joi.object({
                            nicknameNew: Joi.string().min(2).max(10).required()
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        if (!req.body.nicknameNew) return [3 /*break*/, 3];
                        nicknameNew = req.body.nicknameNew;
                        return [4 /*yield*/, joiSchema.validateAsync({ nicknameNew: nicknameNew })];
                    case 2:
                        verifyBody = _a.sent();
                        res.updateUserProfile = verifyBody;
                        next();
                        return [3 /*break*/, 4];
                    case 3:
                        message = "닉네임의 형식이 올바르지 않습니다.";
                        logger_1.logger.info("verifyJoi-updateUserProfile middlewares 400 error:".concat(message));
                        return [2 /*return*/, res.status(400).send({ message: message })];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_2 = _a.sent();
                        console.log(error_2);
                        message = "닉네임의 형식이 올바르지 않습니다.";
                        logger_1.logger.error("verifyJoi-updateUserProfile middlewares 500 error:".concat(error_2));
                        return [2 /*return*/, res.status(500).send({ message: message })];
                    case 6: return [2 /*return*/];
                }
            });
        }); };
        //프로필 정보 변경(password)
        this.updateUserPw = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var joiSchema, _a, passwordOld, passwordNew, confirmPasswordNew, message, message, verifyBody, error_3, message;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        joiSchema = Joi.object({
                            passwordOld: Joi.string().regex(/^.*(?=^.{8,}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/),
                            passwordNew: Joi.string().regex(/^.*(?=^.{8,}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/),
                            confirmPasswordNew: Joi.ref("passwordNew")
                        });
                        _a = req.body, passwordOld = _a.passwordOld, passwordNew = _a.passwordNew, confirmPasswordNew = _a.confirmPasswordNew;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 6, , 7]);
                        if (!(!passwordNew || !confirmPasswordNew)) return [3 /*break*/, 2];
                        message = "변경할 비밀번호 또는 비밀번호 확인란을 확인 해주세요.";
                        logger_1.logger.info("verifyJoi-updateUserPw middlewares 400 error:".concat(message));
                        return [2 /*return*/, res.status(400).send({ message: message })];
                    case 2:
                        if (!(passwordNew !== confirmPasswordNew)) return [3 /*break*/, 3];
                        message = "변경할 비밀번호와 비밀번호 확인란이 일치하지 않습니다.";
                        logger_1.logger.info("verifyJoi-updateUserPw middlewares 400 error:".concat(message));
                        return [2 /*return*/, res.status(400).send({ message: message })];
                    case 3: return [4 /*yield*/, joiSchema.validateAsync({
                            passwordOld: passwordOld,
                            passwordNew: passwordNew,
                            confirmPasswordNew: confirmPasswordNew
                        })];
                    case 4:
                        verifyBody = _b.sent();
                        res.updateUserPw = verifyBody;
                        next();
                        _b.label = 5;
                    case 5: return [3 /*break*/, 7];
                    case 6:
                        error_3 = _b.sent();
                        console.log(error_3);
                        message = "입력하신 비밀번호의 형식이 올바르지 않습니다.";
                        logger_1.logger.error("verifyJoi-updateUserPw middlewares 500 error:".concat(error_3));
                        return [2 /*return*/, res.status(500).send({ message: message })];
                    case 7: return [2 /*return*/];
                }
            });
        }); };
        // 닉네임 중복검사
        this.existNickname = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var joiSchema, nickname, verifyBody, message, error_4, message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("조이 검증 미들웨어 입장");
                        joiSchema = Joi.object({
                            nickname: Joi.string().min(2).max(10).required()
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        if (!req.body.nickname) return [3 /*break*/, 3];
                        nickname = req.body.nickname;
                        return [4 /*yield*/, joiSchema.validateAsync({ nickname: nickname })];
                    case 2:
                        verifyBody = _a.sent();
                        res.existNickname = verifyBody;
                        next();
                        return [3 /*break*/, 4];
                    case 3:
                        message = "닉네임의 형식이 올바르지 않습니다.";
                        logger_1.logger.info("verifyJoi-existNickname middlewares 400 error:".concat(message));
                        return [2 /*return*/, res.status(400).send({ message: message })];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_4 = _a.sent();
                        console.log(error_4);
                        message = "닉네임의 형식이 올바르지 않습니다.";
                        logger_1.logger.error("verifyJoi-existNickname middlewares 500 error:".concat(error_4));
                        return [2 /*return*/, res.status(500).send({ message: message })];
                    case 6: return [2 /*return*/];
                }
            });
        }); };
        // 이메일 중복검사
        this.existEmail = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var joiSchema, email, verifyBody, message, error_5, message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        console.log("조이 검증 미들웨어 입장");
                        joiSchema = Joi.object({
                            email: Joi.string()
                                .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } })
                                .max(50)
                                .required()
                        });
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 5, , 6]);
                        if (!req.body.email) return [3 /*break*/, 3];
                        email = req.body.email;
                        return [4 /*yield*/, joiSchema.validateAsync({ email: email })];
                    case 2:
                        verifyBody = _a.sent();
                        res.existEmail = verifyBody;
                        next();
                        return [3 /*break*/, 4];
                    case 3:
                        message = "이메일의 형식이 올바르지 않습니다.";
                        logger_1.logger.info("verifyJoi-existEmail middlewares 400 error:".concat(message));
                        return [2 /*return*/, res.status(400).send({ message: message })];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_5 = _a.sent();
                        console.log(error_5);
                        message = "이메일 형식이 올바르지 않습니다.";
                        logger_1.logger.error("verifyJoi-existEmail middlewares 500 error:".concat(error_5));
                        return [2 /*return*/, res.status(500).send({ message: message })];
                    case 6: return [2 /*return*/];
                }
            });
        }); };
    }
    return VerifyJoi;
}());
;
exports["default"] = new VerifyJoi();

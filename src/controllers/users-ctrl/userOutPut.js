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
var Jwt = require("jsonwebtoken");
var dotenv = require("dotenv");
dotenv.config();
var passport_1 = require("passport");
var logger_1 = require("../../config/logger");
var UserOutPut = /** @class */ (function () {
    function UserOutPut() {
        var _this = this;
        this.authUser = function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // local 로그인
                try {
                    // passport/index.js로 실행 됨
                    passport_1["default"].authenticate("local", function (passportError, user, info) {
                        // 인증이 실패했거나 유저 데이터가 없다면 에러 발생
                        if (passportError) {
                            console.error("passportError:", passportError);
                            logger_1.logger.error("POST /api/users/login 500 \"res:".concat(passportError));
                            return res.status(500).send({ message: passportError });
                        }
                        // user를 조회하지 못할 경우
                        if (!user) {
                            res.status(400).send({ message: info.message });
                            logger_1.logger.info("POST /api/users/login 400 \"res:".concat(info.message));
                            return;
                        }
                        // user데이터를 통해 로그인 진행
                        req.login(user, { session: false }, function (loginError) {
                            if (loginError) {
                                logger_1.logger.error("POST /api/users/login 400 \"res:".concat(loginError));
                                res.send(loginError);
                                return;
                            }
                            //회원정보 암호화
                            var token = Jwt.sign({ userId: user.userId }, process.env.TOKEN_KEY, { expiresIn: "1d" });
                            var message = "로그인에 성공하셨습니다.";
                            logger_1.logger.info("POST /api/users/login 201 \"res: ".concat(message));
                            res.status(201).send({ token: token, user: user, message: message });
                        });
                    })(req, res, next);
                }
                catch (error) {
                    console.error(error);
                    logger_1.logger.error("GET /api/kakao/callback 500 \"res: ".concat(error));
                    next(error);
                }
                return [2 /*return*/];
            });
        }); };
        this.kakaoCallback = function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var user, userId, token, message, message;
            return __generator(this, function (_a) {
                try {
                    console.log("넘어와찌롱");
                    console.log("-----------------------------------------");
                    user = req.user;
                    userId = user.userId;
                    token = Jwt.sign({ userId: userId }, process.env.TOKEN_KEY, { expiresIn: "1d" });
                    message = "로그인에 성공하였습니다.";
                    logger_1.logger.info("GET /api/kakao/callback 201 \"res: ".concat(message));
                    res.status(201).send({ message: message, token: token });
                }
                catch (error) {
                    console.log(error);
                    message = "알 수 없는 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
                    logger_1.logger.error("GET /api/kakao/callback 500 \"res: ".concat(error));
                    res.status(500).send({ message: message });
                }
                return [2 /*return*/];
            });
        }); };
    }
    return UserOutPut;
}());
;
exports["default"] = new UserOutPut();

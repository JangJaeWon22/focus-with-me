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
var passport_1 = require("passport");
var KakaoStrategy = require("passport-kakao").Strategy;
var models_1 = require("../models");
var dotenv_1 = require("dotenv");
dotenv_1["default"].config();
function kakao() {
    var _this = this;
    passport_1["default"].use("kakao", new KakaoStrategy({
        clientID: process.env.KAKAO_ID,
        callbackURL: process.env.KAKAO_CALLBACK
    }, function (accessToken, refreshTokenL, profile, done) { return __awaiter(_this, void 0, void 0, function () {
        var email, nickname, provider, avatarUrl, date, userInfo, existNick, newUser;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("profile", profile);
                    email = profile["_json"].kakao_account.email;
                    nickname = profile.displayName;
                    provider = "kakao";
                    avatarUrl = "uploads/assets/noAvatar.svg";
                    date = new Date();
                    return [4 /*yield*/, models_1.User.findOne({
                            where: { snsId: profile.id, provider: "kakao" }
                        })];
                case 1:
                    userInfo = _a.sent();
                    return [4 /*yield*/, models_1.User.findAll({ where: { nickname: nickname } })];
                case 2:
                    existNick = _a.sent();
                    if (!!userInfo) return [3 /*break*/, 4];
                    if (existNick) {
                        nickname = nickname + existNick.length;
                    }
                    return [4 /*yield*/, models_1.User.create({
                            email: email,
                            nickname: nickname,
                            snsId: profile.id,
                            avatarUrl: avatarUrl,
                            provider: provider,
                            date: date
                        })];
                case 3:
                    newUser = _a.sent();
                    console.log("회원 가입 햇음 passport/index로 넘어감 ㅂㅇ");
                    return [2 /*return*/, done(null, newUser)];
                case 4:
                    console.log("회원 있따고 함 그래서 passport/index 넘어감 ㅅㄱ");
                    return [2 /*return*/, done(null, userInfo)];
            }
        });
    }); }));
}
exports["default"] = kakao;

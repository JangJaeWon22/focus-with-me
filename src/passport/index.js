"use strict";
exports.__esModule = true;
var passport_1 = require("passport");
var localStrategy_1 = require("./localStrategy");
var kakaoStrategy_1 = require("./kakaoStrategy");
var models_1 = require("../models");
var jwt_1 = require("./jwt");
var Passport = /** @class */ (function () {
    function Passport() {
        this.config = function () {
            console.log("passportconfig() 실행!");
            passport_1["default"].serializeUser(function (user, done) {
                console.log("kakaoStrategy.js에서 옴 ㅎㅇ");
                done(null, user.userId);
            });
            passport_1["default"].deserializeUser(function (userId, done) {
                console.log("ㅎㅇ User 정보 필요하구나? 도와드림 ㅎㅎ");
                models_1.User.findOne({
                    where: { userId: userId },
                    include: [
                        {
                            model: models_1.User,
                            attributes: ["userId", "nickname"],
                            as: "Followers"
                        },
                        {
                            model: models_1.User,
                            attributes: ["userId", "nickname"],
                            as: "Followings"
                        },
                    ]
                })
                    .then(function (user) { return done(null, user); })["catch"](function (error) { return done(error); });
            });
            (0, localStrategy_1["default"])();
            (0, kakaoStrategy_1["default"])();
            (0, jwt_1.jwt)();
        };
    }
    return Passport;
}());
exports["default"] = Passport;

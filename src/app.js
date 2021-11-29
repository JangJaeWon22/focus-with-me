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
var server_1 = require("./server");
var dotenv = require("dotenv");
dotenv.config();
var schedule = require("node-schedule");
var controlS3_1 = require("./library/controlS3");
var emptyTempS3 = controlS3_1["default"].emptyTempS3;
var models_1 = require("./models");
var port = process.env.EXPRESS_PORT;
//winston
var logger_1 = require("./config/logger");
//test용 시작 view page
// app.set("views", __dirname + "/views");
// app.set("view engine", "ejs");
// app.get("/", (req, res) => {
//   const title = "YJ's playground";
//   res.render("index", { title });
// });
// 매일 0시 0분 0초에 temp 폴더 비우기
// 초 분 시 일 월 년
var job = schedule.scheduleJob("0 0 0 * * *", function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, emptyTempS3()];
            case 1:
                _a.sent();
                console.log("temp 폴더 삭제");
                return [2 /*return*/];
        }
    });
}); });
//sequelize(ORM)
models_1.sequelize
    .sync({ force: false })
    .then(function () {
    console.log("\n      \uD83D\uDC2C\uD83D\uDC2C\uD83D\uDC2C\uD83D\uDC2C\uD83D\uDC2C\uD83D\uDC2C\uD83D\uDC2C\uD83D\uDC2C\uD83D\uDC2C\uD83D\uDC2C\uD83D\uDC2C\uD83D\uDC2C\n      \uD83D\uDC2C\uD83D\uDC2C\uD83D\uDC2C\uD83D\uDC2C\uD83D\uDC2C\uD83D\uDC2C\uD83D\uDC2C\uD83D\uDC2C\uD83D\uDC2C\uD83D\uDC2C\uD83D\uDC2C\uD83D\uDC2C\n      \uD83D\uDC2C\uD83D\uDC2C \uB3CC\uACE0\uB798 db \uC5F0\uACB0 \uD83D\uDC2C\uD83D\uDC2C\n      \uD83D\uDC2C\uD83D\uDC2C\uD83D\uDC2C\uD83D\uDC2C\uD83D\uDC2C\uD83D\uDC2C\uD83D\uDC2C\uD83D\uDC2C\uD83D\uDC2C\uD83D\uDC2C\uD83D\uDC2C\uD83D\uDC2C\n      \uD83D\uDC2C\uD83D\uDC2C\uD83D\uDC2C\uD83D\uDC2C\uD83D\uDC2C\uD83D\uDC2C\uD83D\uDC2C\uD83D\uDC2C\uD83D\uDC2C\uD83D\uDC2C\uD83D\uDC2C\uD83D\uDC2C\n      \uD83D\uDC19\uD83D\uDC19\uD83D\uDC19\uD83D\uDC19\uD83D\uDC19\uD83D\uDC19\uD83D\uDC19\uD83D\uDC19\uD83D\uDC19\uD83D\uDC19\uD83D\uDC19\uD83D\uDC19\n      \uD83D\uDC19\uD83D\uDC19\uD83D\uDC19 \uB098\uB294 \uBB34\uB108! \uD83D\uDC19\uD83D\uDC19\uD83D\uDC19\n      \uD83D\uDC19\uD83D\uDC19 \uAFC8\uC744 \uAFB8\uB294 \uBB34\uB108 \uD83D\uDC19\uD83D\uDC19\n      \uD83D\uDC19\uD83D\uDC19\uD83D\uDC19\uD83D\uDC19\uD83D\uDC19\uD83D\uDC19\uD83D\uDC19\uD83D\uDC19\uD83D\uDC19\uD83D\uDC19\uD83D\uDC19\uD83D\uDC19\n      ");
})["catch"](function (err) {
    console.error(err);
});
server_1["default"].listen(port, function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        logger_1.logger.info("\n  ".concat(port, " \uD3EC\uD2B8\uC5D0\uC11C \uC11C\uBC84\uAC00 \uAC00\uB3D9\uB418\uC5C8\uC2B5\uB2C8\uB2E4.\uD83D\uDE04\uD83D\uDE04\n----------------------------------------------\n       / / / / / / / / / / \n      / / / / / / / / / / \n    \u3147\u3147\u3147\u3147\u3147\u3147\u3147\u3147\u3147\u3147\n               __\n              / _) \n       .-^^^-/ / \n    __/       / \n   <__.|_|-|_|\n----------------------------------------------\n  "));
        return [2 /*return*/];
    });
}); });

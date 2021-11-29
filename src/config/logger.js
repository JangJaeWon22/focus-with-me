"use strict";
exports.__esModule = true;
exports.logger = void 0;
var winston_1 = require("winston");
var winston_daily_rotate_file_1 = require("winston-daily-rotate-file");
var label = winston_1.format.label, combine = winston_1.format.combine, timestamp = winston_1.format.timestamp, printf = winston_1.format.printf, simple = winston_1.format.simple, colorize = winston_1.format.colorize;
var timezoned = function () {
    return new Date().toLocaleString("ko-KR", {
        timeZone: "Asia/Seoul"
    });
};
var printFormat = printf(function (_a) {
    var timestamp = _a.timestamp, label = _a.label, level = _a.level, message = _a.message;
    return "".concat(timestamp, " [").concat(label, "] ").concat(level, " : ").concat(message);
});
var printLogFormat = {
    file: combine(label({
        label: "study"
    }), timestamp({ format: timezoned }), printFormat),
    console: combine(colorize(), simple())
};
var opts = {
    file: new winston_daily_rotate_file_1["default"]({
        filename: "%DATE%.log",
        dirname: "./logs",
        level: "error",
        format: printLogFormat.file
    }),
    console: new winston_1.transports.Console({
        level: "info",
        format: printLogFormat.console
    })
};
var logger = (0, winston_1.createLogger)({
    transports: [opts.file]
});
exports.logger = logger;
if (process.env.NODE_ENV !== "production") {
    logger.add(opts.console);
}

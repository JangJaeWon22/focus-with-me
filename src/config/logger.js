const { createLogger, transports, format } = require("winston");
const winstonDaily = require("winston-daily-rotate-file");
const { label, combine, timestamp, printf, simple, colorize } = format;

const timezoned = () => {
  return new Date().toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
  });
};

const printFormat = printf(({ timestamp, label, level, message }) => {
  return `${timestamp} [${label}] ${level} : ${message}`;
});

const printLogFormat = {
  file: combine(
    label({
      label: "study",
    }),
    timestamp({ format: timezoned }),
    printFormat
  ),
  console: combine(colorize(), simple()),
};

const opts = {
  file: new winstonDaily({
    filename: `%DATE%.log`,
    dirname: "./logs",
    level: "info",
    format: printLogFormat.file,
  }),
  console: new transports.Console({
    level: "info",
    format: printLogFormat.console,
  }),
};

const logger = createLogger({
  transports: [opts.file],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(opts.console);
}

const stream = {
  write: (message) => {
    logger.info(message);
  },
};

module.exports = { logger, stream };

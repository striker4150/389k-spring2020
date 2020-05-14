var winston = require('winston');
var { transports: { Console }, format: { colorize, combine, json, printf, timestamp } } = winston;
var DailyRotateFile = require('winston-daily-rotate-file');

// Make log directory from https://stackoverflow.com/a/33773559
var fs = require('fs');
var path = require('path');
var logDir = 'log';
if(!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Log format from https://github.com/winstonjs/winston/issues/1135#issuecomment-343980350
const logFormat = combine(
  timestamp(),
  printf((info) => {
    const {
      timestamp, level, message, ...args
    } = info;

    const ts = timestamp.slice(0, 19).replace('T', ' ');
    return `${ts} [${level}]: ${message}${Object.keys(args).length ? ' ' + JSON.stringify(args, null, 2) : ''}`;
  }),
);

var Logger = winston.loggers.add('vgreviews', {
  level: 'debug',
  transports: [
    new Console({ format: combine(logFormat, colorize()) }),
    new DailyRotateFile({
      filename: path.join(logDir, 'app-%DATE%.log'),
      format: logFormat,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '7d'
    })
  ]
});
Logger.stream = { 
  write: function(message, encoding){ 
    Logger.info(message); 
  } 
}

module.exports = Logger

const winston = require('winston');
require('winston-daily-rotate-file');

const {combine, timestamp, json} = winston.format;

const fileRotateTransport = new winston.transports.DailyRotateFile({
    filename: 'chat-less-combined-%DATE%.log',
    datePattern: 'DD-MM-YYYY',
    maxFiles: '14d',
    maxSize: '500k'
});

const logger = winston.createLogger({
    level: 'info',
    format: combine(
        errors({ stack: true}),
        colorize({ all: true }),
        timestamp({
        format: 'DD-MM-YYYY hh:mm:ss.SSS A',
        }),
        align(),
        printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`) ),
    transports: [fileRotateTransport] 
});

module.exports = logger;
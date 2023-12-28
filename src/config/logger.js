import winston from 'winston';
import config from './config';

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const consoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.align(),
    winston.format.printf((info) => {
      return `${JSON.stringify(info)}`;
    })
  );

const logger = winston.createLogger({
  level: config.environment === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    enumerateErrorFormat(),
    config.environment === 'development' ? winston.format.colorize() : winston.format.uncolorize(),
    winston.format.prettyPrint(),
    winston.format.splat(),
    winston.format.json(),
    winston.format.printf(({ level, message }) => `${level}: ${typeof(message) === 'object' ? JSON.stringify(message) : message}`)
  ),
  transports: [
    new winston.transports.Console({
        stderrLevels: ['error', 'info']
    }),
  ],
});

export default logger;
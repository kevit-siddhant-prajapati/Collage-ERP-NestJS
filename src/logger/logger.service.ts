// logger.service.ts
import * as winston from 'winston';
import * as path from 'path';
import * as fs from 'fs';

const logDirectory = 'logs';

// Create logs directory if it doesn't exist
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const filename = path.join(logDirectory, 'user.log');

// Conditionally enable logging based on the environment
const enableLogging = process.env.NODE_ENV !== 'test';

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf((info) => {
      const methodName = info.meta && info.meta.methodName ? `(${info.meta.methodName})` : '';
      return `${info.timestamp} ${info.level}: ${methodName} : ${info.message}`;
    }),
  ),
  transports: enableLogging ? [new winston.transports.File({ filename })] : [],
});

if (process.env.NODE_ENV !== 'production' && enableLogging) { //prevent logging for production and test environment
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

import winston, { format } from 'winston';
const { combine, printf, timestamp, colorize, align } = format;

const fileFormat = combine(
  timestamp({ format: 'DD/MM/YYYY HH:mm:ss' }),
  align(),
  printf(({ timestamp, level, message }) => {
    return `[${timestamp}] ${level}: ${message}`;
  })
);

const consoleFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'DD/MM/YYYY HH:mm:ss' }),
  align(),
  printf(({ timestamp, level, message }) => {
    return `[${timestamp}] ${level}: ${message}`;
  })
);

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      filename: 'error.log',
      level: 'error',
      format: fileFormat
    }),
    new winston.transports.File({
      filename: 'other.log',
      level: 'info',
      format: fileFormat
    }),
    new winston.transports.Console({
      level: 'error',
      format: consoleFormat
    })
  ],
  exitOnError: false
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: consoleFormat
  }));
}

export default logger;
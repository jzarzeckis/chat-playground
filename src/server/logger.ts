import { createLogger, format, transports } from 'winston';

export const logger = createLogger({
  format: format.combine(format.splat(), format.json()),
  level: 'info',
  transports: [
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({ format: format.combine(format.colorize(), format.simple()) }));
}

import { createLogger, transports, format } from 'winston';

const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.metadata(), // Moves ALL extra fields to `metadata`
    format.json()
  ),
  transports: [
    new transports.Console(), // Logs to console
  ]
});

export { logger }
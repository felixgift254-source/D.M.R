const pino = require('pino');

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  // In production, format as JSON; in development, use pretty-print
  transport: process.env.NODE_ENV !== 'production'
    ? { target: 'pino-pretty', options: { colorize: true } }
    : undefined,
  // Redact sensitive fields from log output
  redact: {
    paths: ['req.headers.authorization', 'req.body.password'],
    remove: true
  }
});

module.exports = logger;

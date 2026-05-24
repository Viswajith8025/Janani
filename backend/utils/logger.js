export const logger = {
  info: (msg, meta = {}) => console.log(JSON.stringify({ level: 'INFO', msg, ...meta, timestamp: new Date().toISOString() })),
  warn: (msg, meta = {}) => console.warn(JSON.stringify({ level: 'WARN', msg, ...meta, timestamp: new Date().toISOString() })),
  error: (msg, error) => console.error(JSON.stringify({ level: 'ERROR', msg, error: error?.message, stack: error?.stack, timestamp: new Date().toISOString() })),
};

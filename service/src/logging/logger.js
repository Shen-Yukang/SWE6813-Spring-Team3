function emit(level, message, payload = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...payload,
  };
  // eslint-disable-next-line no-console
  console.log(JSON.stringify(entry));
}

module.exports = {
  info: (message, payload) => emit('info', message, payload),
  warn: (message, payload) => emit('warn', message, payload),
  error: (message, payload) => emit('error', message, payload),
};

const { logAuditEvent, sanitizeAuditPayload } = require('../services/auditService');

const auditLogger = (action, options = {}) => (req, res, next) => {
  const startTime = Date.now();

  res.on('finish', () => {
    if (!options.logOnError && res.statusCode >= 400) {
      return;
    }

    if (typeof options.shouldLog === 'function' && !options.shouldLog(req, res)) {
      return;
    }

    const metadata = {
      params: sanitizeAuditPayload(req.params),
      query: sanitizeAuditPayload(req.query),
      body: sanitizeAuditPayload(req.body)
    };

    if (typeof options.buildMetadata === 'function') {
      Object.assign(metadata, options.buildMetadata(req, res));
    }

    setImmediate(() => {
      logAuditEvent({
        action: action || `${req.method} ${req.originalUrl}`,
        actor: req.user,
        req,
        status: res.statusCode,
        durationMs: Date.now() - startTime,
        metadata
      }).catch((error) => {
        console.warn('[Audit] Failed to log event:', error.message);
      });
    });
  });

  next();
};

module.exports = auditLogger;

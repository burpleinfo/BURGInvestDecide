const { firestoreDb } = require('../config/firebase');

const SENSITIVE_KEYS = new Set([
  'password',
  'token',
  'idtoken',
  'refreshtoken',
  'authorization',
  'cookie',
  'session'
]);

const sanitizeAuditPayload = (value) => {
  if (Array.isArray(value)) {
    return value.map(sanitizeAuditPayload);
  }

  if (!value || typeof value !== 'object') {
    return value;
  }

  const result = {};
  for (const [key, entry] of Object.entries(value)) {
    if (SENSITIVE_KEYS.has(key.toLowerCase())) {
      continue;
    }
    result[key] = sanitizeAuditPayload(entry);
  }

  return result;
};

const logAuditEvent = async ({ action, actor, req, status, metadata, durationMs }) => {
  const record = {
    action,
    status,
    durationMs: Number.isFinite(durationMs) ? durationMs : null,
    createdAt: new Date().toISOString(),
    actorUid: actor?.uid || null,
    actorEmail: actor?.email || null,
    actorRole: actor?.role || null,
    authType: req?.authType || null,
    method: req?.method || null,
    path: req?.originalUrl || null,
    ip: req?.ip || null,
    userAgent: req?.headers?.['user-agent'] || null,
    metadata: sanitizeAuditPayload(metadata)
  };

  await firestoreDb.collection('auditLogs').add(record);
};

module.exports = { logAuditEvent, sanitizeAuditPayload };

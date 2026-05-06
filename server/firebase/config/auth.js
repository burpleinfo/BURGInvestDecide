const DEFAULT_SESSION_EXPIRES_IN_MS = 7 * 24 * 60 * 60 * 1000;

const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || 'ridesafe_session';
const SESSION_EXPIRES_IN_MS = Number(
  process.env.SESSION_EXPIRES_IN_MS || DEFAULT_SESSION_EXPIRES_IN_MS
);

const resolvedSameSite =
  process.env.COOKIE_SAME_SITE ||
  (process.env.NODE_ENV === 'production' ? 'none' : 'lax');

const resolvedSecure =
  typeof process.env.COOKIE_SECURE === 'string'
    ? process.env.COOKIE_SECURE === 'true'
    : resolvedSameSite === 'none' || process.env.NODE_ENV === 'production';

const cookieDomain = process.env.COOKIE_DOMAIN || undefined;

const buildSessionCookieOptions = () => {
  const options = {
    httpOnly: true,
    secure: resolvedSecure,
    sameSite: resolvedSameSite,
    maxAge: SESSION_EXPIRES_IN_MS,
    path: '/'
  };

  if (cookieDomain) {
    options.domain = cookieDomain;
  }

  return options;
};

const buildSessionCookieClearOptions = () => {
  const options = {
    httpOnly: true,
    path: '/'
  };

  if (cookieDomain) {
    options.domain = cookieDomain;
  }

  return options;
};

module.exports = {
  SESSION_COOKIE_NAME,
  SESSION_EXPIRES_IN_MS,
  buildSessionCookieOptions,
  buildSessionCookieClearOptions
};

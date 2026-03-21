// Cookie utility functions

// Set a cookie with expiration date
export const setCookie = (name, value, days = 30) => {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${encodeURIComponent(value)};${expires};path=/;SameSite=Lax`;
};

// Get a cookie value by name
export const getCookie = (name) => {
  const nameEQ = `${name}=`;
  const cookies = document.cookie.split(';');
  
  for (let i = 0; i < cookies.length; i++) {
    let cookie = cookies[i].trim();
    if (cookie.indexOf(nameEQ) === 0) {
      return decodeURIComponent(cookie.substring(nameEQ.length));
    }
  }
  return null;
};

// Delete a cookie
export const deleteCookie = (name) => {
  setCookie(name, '', -1);
};

// Clear all cookies
export const clearAllCookies = () => {
  const cookies = document.cookie.split(';');
  cookies.forEach((cookie) => {
    const cookieName = cookie.split('=')[0].trim();
    deleteCookie(cookieName);
  });
};

// Check if cookies are allowed
export const areCookiesAllowed = () => {
  const cookieConsent = getCookie('cookieConsent');
  return cookieConsent === 'true';
};

// Check if should show consent banner (once per day)
export const shouldShowConsentBanner = () => {
  const lastConsentTime = getCookie('cookieConsentTime');
  
  if (!lastConsentTime) {
    // No consent record, show banner
    return true;
  }
  
  const lastConsentDate = new Date(parseInt(lastConsentTime));
  const now = new Date();
  
  // Calculate difference in ms
  const timeDifference = now.getTime() - lastConsentDate.getTime();
  const dayInMs = 24 * 60 * 60 * 1000;
  
  // Show banner if more than 24 hours have passed
  return timeDifference > dayInMs;
};

// Save cookie consent preference with timestamp
export const saveCookieConsent = (allowed) => {
  setCookie('cookieConsent', allowed ? 'true' : 'false', 365);
  // Save current timestamp to check daily
  setCookie('cookieConsentTime', new Date().getTime().toString(), 365);
};

// Store user login data in cookies
export const storeUserData = (email, rememberMe = false) => {
  if (areCookiesAllowed()) {
    const days = rememberMe ? 30 : undefined;
    setCookie('userEmail', email, days || 30);
  }
};

// Get stored user email
export const getStoredUserEmail = () => {
  if (areCookiesAllowed()) {
    return getCookie('userEmail');
  }
  return null;
};

// Clear user data
export const clearUserData = () => {
  deleteCookie('userEmail');
};

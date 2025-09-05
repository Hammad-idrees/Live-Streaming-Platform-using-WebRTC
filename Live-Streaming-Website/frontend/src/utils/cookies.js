// utils/cookies.js

// Set a cookie with optional security settings
export const setCookie = (name, value, options = {}) => {
    const defaults = {
      path: '/',
      expires: 7, // days
      secure: window.location.protocol === 'https:', // Only secure in production
      sameSite: 'Strict'
    };
  
    const settings = { ...defaults, ...options };
    
    let cookieString = `${name}=${encodeURIComponent(value)}`;
    
    if (settings.path) {
      cookieString += `; Path=${settings.path}`;
    }
    
    if (settings.expires) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + settings.expires);
      cookieString += `; Expires=${expiryDate.toUTCString()}`;
    }
    
    if (settings.secure) {
      cookieString += '; Secure';
    }
    
    if (settings.sameSite) {
      cookieString += `; SameSite=${settings.sameSite}`;
    }
    
    if (settings.httpOnly) {
      cookieString += '; HttpOnly';
    }
  
    document.cookie = cookieString;
  };
  
  // Get a cookie value by name
  export const getCookie = (name) => {
    const nameEQ = `${name}=`;
    const cookies = document.cookie.split(';');
    
    for (let cookie of cookies) {
      cookie = cookie.trim();
      if (cookie.indexOf(nameEQ) === 0) {
        const value = decodeURIComponent(cookie.substring(nameEQ.length));
        return value;
      }
    }
    
    return null;
  };
  
  // Delete a cookie
  export const deleteCookie = (name, path = '/') => {
    document.cookie = `${name}=; Path=${path}; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
  };
  
  // Check if cookies are available
  export const areCookiesAvailable = () => {
    try {
      // Test if we can set and get a cookie
      const testKey = 'cookieTest';
      const testValue = 'test';
      
      setCookie(testKey, testValue, { expires: 1 });
      const retrieved = getCookie(testKey);
      deleteCookie(testKey);
      
      return retrieved === testValue;
    } catch (error) {
      console.error('Cookies not available:', error);
      return false;
    }
  };
  
  // Get all cookies as an object
  export const getAllCookies = () => {
    const cookies = {};
    
    if (document.cookie) {
      document.cookie.split(';').forEach(cookie => {
        const [name, value] = cookie.trim().split('=');
        if (name && value) {
          cookies[name] = decodeURIComponent(value);
        }
      });
    }
    
    return cookies;
  };
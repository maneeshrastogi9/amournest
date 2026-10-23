// Centralized API Base Configuration
// In production or when served by Express, relative URLs ('' or same-origin) are used.
// In standalone Vite dev (port 5173), fallback to 'http://localhost:5000'.
export const API_BASE_URL = 
  typeof window !== 'undefined' && 
  window.location.hostname === 'localhost' && 
  window.location.port === '5173'
    ? 'http://localhost:5000'
    : '';

export const getMediaUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
  return `${API_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

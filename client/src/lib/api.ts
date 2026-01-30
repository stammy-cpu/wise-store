// API configuration - points to backend server
// In development: uses local server
// In production: uses Render backend
const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export { API_BASE_URL };

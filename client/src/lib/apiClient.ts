import { API_BASE_URL } from './api';

/**
 * Wrapper for fetch that automatically adds the API base URL
 * Usage: apiFetch('/api/products') instead of fetch('/api/products')
 */
export async function apiFetch(url: string, options?: RequestInit): Promise<Response> {
  const fullUrl = `${API_BASE_URL}${url}`;

  // Ensure credentials are included for session cookies
  const fetchOptions: RequestInit = {
    ...options,
    credentials: 'include',
  };

  return fetch(fullUrl, fetchOptions);
}

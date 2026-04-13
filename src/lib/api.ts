import axios from 'axios';

const normalizeBaseUrl = (value?: string) => value?.trim().replace(/\/+$/, '') || '';

export const apiBaseUrl = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL);

if (
  typeof window !== 'undefined' &&
  window.location.protocol === 'https:' &&
  apiBaseUrl.startsWith('http://')
) {
  console.warn(
    `VITE_API_BASE_URL is using HTTP from an HTTPS page. Browser mixed-content rules may block requests to ${apiBaseUrl}.`,
  );
}

export const api = axios.create({
  baseURL: apiBaseUrl || undefined,
});

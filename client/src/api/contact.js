import { apiFetch } from './apiClient';

export function sendContactMessage(data) {
  return apiFetch('/api/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
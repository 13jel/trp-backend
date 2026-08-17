import { apiFetch } from './apiClient';

export function fetchAllProductsAdmin(token) {
  // Samma endpoint funkar, men vi kan bygga en admin-variant senare om du
  // vill visa inaktiva produkter också. För nu: vanliga listan räcker.
  return apiFetch('/api/products', { token });
}

export function createProduct(token, product) {
  return apiFetch('/api/products', {
    method: 'POST',
    token,
    body: JSON.stringify(product),
  });
}

export function updateProduct(token, id, updates) {
  return apiFetch(`/api/products/${id}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(updates),
  });
}
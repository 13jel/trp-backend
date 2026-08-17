import { apiFetch } from './apiClient';

export function addToCart(token, productId, quantity = 1) {
  return apiFetch('/api/cart', {
    method: 'POST',
    token,
    body: JSON.stringify({ product_id: productId, quantity }),
  });
}
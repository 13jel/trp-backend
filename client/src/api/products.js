import { apiFetch } from './apiClient';

export function fetchProducts() {
  return apiFetch('/api/products');
}
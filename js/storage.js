export const CART_KEY = 'cakery-charm-order';
export const ORDER_KEY = 'cakery-charm-latest-order';
export const FAVORITES_KEY = 'cakery-charm-favorites';
export const NEWSLETTER_KEY = 'cakery-charm-subscribers';

export function readJson(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch (err) {
    console.warn(`Error reading localStorage key "${key}":`, err);
    return fallback;
  }
}

export function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error writing localStorage key "${key}":`, err);
  }
}

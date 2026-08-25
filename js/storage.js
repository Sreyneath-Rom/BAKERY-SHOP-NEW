export const CART_KEY = 'cakery-charm-order';
export const ORDER_KEY = 'cakery-charm-latest-order';

export function readJson(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; }
  catch { return fallback; }
}

export function writeJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

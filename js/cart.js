import { CART_KEY, readJson, writeJson } from './storage.js';

export function getCart() { return readJson(CART_KEY, []); }
export function addItem(product, quantity = 1) {
  const cart = getCart();
  const item = cart.find((entry) => entry.name === product.name);
  if (item) item.quantity += quantity;
  else cart.push({ name: product.name, price: product.price, image: product.image, quantity });
  writeJson(CART_KEY, cart);
  return cart;
}
export function removeItem(index) {
  const cart = getCart(); cart.splice(index, 1); writeJson(CART_KEY, cart); return cart;
}
export function cartCount(cart = getCart()) { return cart.reduce((sum, item) => sum + item.quantity, 0); }
export function cartTotal(cart = getCart()) { return cart.reduce((sum, item) => sum + item.price * item.quantity, 0); }

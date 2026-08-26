import { CART_KEY, readJson, writeJson } from './storage.js';

export function getCart() {
  return readJson(CART_KEY, []);
}

export function saveCart(cart) {
  writeJson(CART_KEY, cart);
  document.dispatchEvent(new CustomEvent('cakery-cart-change', { detail: { cart } }));
  return cart;
}

export function addItem(product, quantity = 1, options = {}) {
  const cart = getCart();
  const itemName = options.size ? `${product.name} (${options.size})` : product.name;
  const itemPrice = typeof options.price === 'number' ? options.price : product.price;
  
  const existing = cart.find((entry) => entry.name === itemName);
  if (existing) {
    existing.quantity = Math.min(99, existing.quantity + quantity);
  } else {
    cart.push({
      name: itemName,
      baseName: product.name,
      price: itemPrice,
      image: product.image || 'images/logo.png',
      category: product.category || 'Bakery',
      size: options.size || null,
      quantity: Math.max(1, quantity)
    });
  }
  
  saveCart(cart);
  return cart;
}

export function updateQuantity(index, newQty) {
  const cart = getCart();
  if (index >= 0 && index < cart.length) {
    if (newQty <= 0) {
      cart.splice(index, 1);
    } else {
      cart[index].quantity = Math.min(99, newQty);
    }
    saveCart(cart);
  }
  return cart;
}

export function removeItem(index) {
  const cart = getCart();
  if (index >= 0 && index < cart.length) {
    cart.splice(index, 1);
    saveCart(cart);
  }
  return cart;
}

export function clearCart() {
  saveCart([]);
}

export function cartCount(cart = getCart()) {
  return cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
}

export function cartTotal(cart = getCart()) {
  return cart.reduce((sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
}

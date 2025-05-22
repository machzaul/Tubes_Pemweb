const CART_KEY = 'machzaulmart_cart';
const ORDERS_KEY = 'machzaulmart_orders';
const PRODUCTS_KEY = 'machzaulmart_products';

// Cart functions
export function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch {
    return [];
  }
}

export function setCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Order functions
export function getOrders() {
  try {
    return JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
  } catch {
    return [];
  }
}

export function setOrders(orders) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

// Product functions
export function getProducts() {
  try {
    return JSON.parse(localStorage.getItem(PRODUCTS_KEY)) || [];
  } catch {
    return [];
  }
}

export function setProducts(products) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

import { CartItem, DentalOrder, DentalProduct, ShippingDetails } from '@/types';

const CART_KEY = 'oralsense_shopping_cart';
const ORDERS_KEY = 'oralsense_dental_orders';

export const getStoredCart = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(CART_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveStoredCart = (cart: CartItem[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
};

export const addToCart = (product: DentalProduct, quantity: number = 1): CartItem[] => {
  const current = getStoredCart();
  const existingIdx = current.findIndex((item) => item.product.id === product.id);

  let updated: CartItem[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx].quantity += quantity;
  } else {
    updated = [...current, { product, quantity }];
  }

  saveStoredCart(updated);
  return updated;
};

export const updateCartItemQuantity = (productId: string, quantity: number): CartItem[] => {
  const current = getStoredCart();
  if (quantity <= 0) {
    return removeFromCart(productId);
  }
  const updated = current.map((item) => (item.product.id === productId ? { ...item, quantity } : item));
  saveStoredCart(updated);
  return updated;
};

export const removeFromCart = (productId: string): CartItem[] => {
  const current = getStoredCart();
  const updated = current.filter((item) => item.product.id !== productId);
  saveStoredCart(updated);
  return updated;
};

export const clearCart = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(CART_KEY);
};

export const getStoredOrders = (): DentalOrder[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(ORDERS_KEY);
  return data ? JSON.parse(data) : [];
};

export const createDemoOrder = (cartItems: CartItem[], shipping: ShippingDetails): DentalOrder => {
  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const deliveryFee = subtotal >= 35 || subtotal === 0 ? 0 : 3.99;
  const total = Number((subtotal + deliveryFee).toFixed(2));

  const newOrder: DentalOrder = {
    orderId: `OS-${Math.floor(10000 + Math.random() * 90000)}`,
    date: new Date().toISOString().split('T')[0],
    items: cartItems,
    subtotal: Number(subtotal.toFixed(2)),
    deliveryFee,
    total,
    shippingDetails: shipping,
    status: 'Confirmed',
  };

  if (typeof window !== 'undefined') {
    const existing = getStoredOrders();
    localStorage.setItem(ORDERS_KEY, JSON.stringify([newOrder, ...existing]));
    clearCart();
  }

  return newOrder;
};

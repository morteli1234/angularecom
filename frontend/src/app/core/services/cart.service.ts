import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { CartItem } from '../models/cart-item.model';

const CART_STORAGE_KEY = 'ANGULAR_ECOM_CART_V1';

type CartItemBase = Omit<CartItem, 'quantity'>;

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly cartItemsSubject = new BehaviorSubject<CartItem[]>([]);

  readonly cartItems$ = this.cartItemsSubject.asObservable();
  readonly itemCount$ = this.cartItems$.pipe(
    map((items) => items.reduce((total, item) => total + item.quantity, 0))
  );
  readonly subtotal$ = this.cartItems$.pipe(
    map((items) => items.reduce((total, item) => total + item.price * item.quantity, 0))
  );

  constructor() {
    this.hydrateFromStorage();
  }

  addToCart(item: CartItemBase, quantity: number): void {
    if (quantity <= 0) {
      return;
    }

    const currentItems = this.cartItemsSubject.value;
    const existing = currentItems.find((cartItem) => cartItem.productId === item.productId);

    const nextItems = existing
      ? currentItems.map((cartItem) =>
          cartItem.productId === item.productId
            ? { ...cartItem, quantity: cartItem.quantity + quantity }
            : cartItem
        )
      : [...currentItems, { ...item, quantity }];

    this.commit(nextItems);
  }

  removeFromCart(productId: number, quantity = 1): void {
    if (quantity <= 0) {
      return;
    }

    const nextItems = this.cartItemsSubject.value
      .map((item) =>
        item.productId === productId
          ? { ...item, quantity: Math.max(0, item.quantity - quantity) }
          : item
      )
      .filter((item) => item.quantity > 0);

    this.commit(nextItems);
  }

  setCartQuantity(productId: number, quantity: number): void {
    if (quantity < 0) {
      return;
    }

    const nextItems = this.cartItemsSubject.value
      .map((item) =>
        item.productId === productId
          ? { ...item, quantity }
          : item
      )
      .filter((item) => item.quantity > 0);

    this.commit(nextItems);
  }

  clearCart(): void {
    this.commit([]);
  }

  getCartItem(productId: number): CartItem | undefined {
    return this.cartItemsSubject.value.find((item) => item.productId === productId);
  }

  private commit(items: CartItem[]): void {
    this.cartItemsSubject.next(items);
    this.persistToStorage(items);
  }

  private hydrateFromStorage(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    const serialized = localStorage.getItem(CART_STORAGE_KEY);
    if (!serialized) {
      return;
    }

    try {
      const parsed = JSON.parse(serialized);
      if (!Array.isArray(parsed)) {
        this.commit([]);
        return;
      }

      const hydrated: CartItem[] = parsed
        .filter((item) => item && typeof item === 'object')
        .map((item) => ({
          productId: Number(item.productId),
          title: String(item.title ?? ''),
          price: Number(item.price ?? 0),
          image: String(item.image ?? ''),
          quantity: Math.max(0, Number(item.quantity ?? 0))
        }))
        .filter((item) => Number.isFinite(item.productId) && Number.isFinite(item.price) && item.quantity > 0);

      this.cartItemsSubject.next(hydrated);
    } catch {
      this.commit([]);
    }
  }

  private persistToStorage(items: CartItem[]): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }
}

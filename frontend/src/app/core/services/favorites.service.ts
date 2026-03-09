import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { FavoriteItem } from '../models/favorite-item.model';

const FAVORITES_STORAGE_KEY = 'ANGULAR_ECOM_FAVORITES_V1';
@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private readonly favoritesSubject = new BehaviorSubject<FavoriteItem[]>([]);

  readonly favorites$ = this.favoritesSubject.asObservable();
  readonly favoriteCount$ = this.favorites$.pipe(map((items) => items.length));

  constructor() {
    this.hydrateFromStorage();
  }

  addToFavorites(item: FavoriteItem): void {
    const currentItems = this.favoritesSubject.value;
    if (currentItems.find((favItem) => favItem.productId === item.productId)) {
      return; // Item is already in favorites
    }

    const nextItems = [...currentItems, item];
    this.commit(nextItems);
  }

  removeFromFavorites(productId: number): void {
    const nextItems = this.favoritesSubject.value.filter((item) => item.productId !== productId);
    this.commit(nextItems);
  }

  private commit(items: FavoriteItem[]): void {
    this.favoritesSubject.next(items);
    this.persistToStorage(items);
  }

  private persistToStorage(items: FavoriteItem[]): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(items));
  }

  private hydrateFromStorage(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!stored) {
      return;
    }

    try {
      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) {
        this.commit([]);
        return;
      }
      const hydrated: FavoriteItem[] = parsed
        .filter((item) => item && typeof item === 'object')
        .map((item) => ({
          productId: Number(item.productId),
          title: String(item.title ?? ''),
          price: Number(item.price ?? 0),
          image: String(item.image ?? ''),
        }))
        .filter((item) => Number.isFinite(item.productId) && Number.isFinite(item.price));
      this.favoritesSubject.next(hydrated);
    } catch {
      this.commit([]);
    }
  }
}

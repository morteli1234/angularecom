import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, catchError, finalize, map, of, tap } from 'rxjs';
import { InventoryItem, Product } from '../models/product.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private readonly http = inject(HttpClient);
  private hasLoaded = false;

  private readonly inventorySubject = new BehaviorSubject<InventoryItem[]>([]);
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  private readonly errorSubject = new BehaviorSubject<string | null>(null);

  readonly inventory$ = this.inventorySubject.asObservable();
  readonly categories$ = this.inventory$.pipe(
    map((products) => [...new Set(products.map((product) => product.category))].sort())
  );
  readonly loading$ = this.loadingSubject.asObservable();
  readonly error$ = this.errorSubject.asObservable();

  loadInventory(forceReload = false): void {
    if (this.loadingSubject.value) {
      return;
    }

    if (this.hasLoaded && !forceReload) {
      return;
    }

    this.loadingSubject.next(true);
    this.errorSubject.next(null);

    this.http
      .get<Product[]>(`${environment.apiBaseUrl}${environment.endpoints.products}`)
      .pipe(
        tap((products) => {
          this.inventorySubject.next(products.map((product) => this.toInventoryItem(product)));
          this.hasLoaded = true;
        }),
        catchError((error) => {
          this.hasLoaded = false;
          this.errorSubject.next('Unable to load inventory right now.');
          console.error('Failed to load products', error);
          return of([]);
        }),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe();
  }

  getItemById(productId: number): InventoryItem | undefined {
    return this.inventorySubject.value.find((item) => item.id === productId);
  }

  decreaseStock(productId: number, amount = 1): boolean {
    if (amount <= 0) {
      return false;
    }

    const item = this.getItemById(productId);
    if (!item || item.quantity < amount) {
      return false;
    }

    this.updateQuantity(productId, item.quantity - amount);
    return true;
  }

  increaseStock(productId: number, amount = 1): void {
    if (amount <= 0) {
      return;
    }

    const item = this.getItemById(productId);
    if (!item) {
      return;
    }

    this.updateQuantity(productId, item.quantity + amount);
  }

  setStock(productId: number, quantity: number): void {
    if (quantity < 0) {
      return;
    }

    const item = this.getItemById(productId);
    if (!item) {
      return;
    }

    this.updateQuantity(productId, quantity);
  }

  private toInventoryItem(product: Product): InventoryItem {
    return {
      ...product,
      quantity: 10
    };
  }

  private updateQuantity(productId: number, quantity: number): void {
    const updatedInventory = this.inventorySubject.value.map((item) =>
      item.id === productId ? { ...item, quantity } : item
    );

    this.inventorySubject.next(updatedInventory);
  }
}

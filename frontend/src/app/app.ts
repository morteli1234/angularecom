import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CartDrawerComponent } from './core/layout/cart-drawer/cart-drawer';
import { FooterComponent } from './core/layout/footer/footer';
import { NavbarComponent } from './core/layout/navbar/navbar';
import { InventoryService } from './core/services/inventory.service';
import { FavoritesDrawerComponent } from './core/layout/favorites-drawer/favorites-drawer';
import { NavbarDrawerComponent } from './core/layout/navbar-drawer/navbar-drawer';

@Component({
  selector: 'app-root',
  imports: [
    NavbarComponent,
    RouterOutlet,
    FooterComponent,
    CartDrawerComponent,
    FavoritesDrawerComponent,
    NavbarDrawerComponent,
  ],
  templateUrl: './app.html',
})
export class App {
  private readonly inventoryService = inject(InventoryService);

  protected readonly isCartOpen = signal(false);

  protected readonly isFavoritesOpen = signal(false);

  protected readonly isNavOpen = signal(false);

  protected openFavorites(): void {
    this.isFavoritesOpen.set(true);
  }

  protected openCart(): void {
    this.isCartOpen.set(true);
  }

  protected closeCart(): void {
    this.isCartOpen.set(false);
  }

  protected closeFavorites(): void {
    this.isFavoritesOpen.set(false);
  }

  protected readonly navCategories$ = this.inventoryService.categories$;

  protected openNav(): void {
    this.isNavOpen.set(true);
  }

  protected closeNav(): void {
    this.isNavOpen.set(false);
  }
}

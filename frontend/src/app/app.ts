import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CartDrawerComponent } from './core/layout/cart-drawer/cart-drawer';
import { FooterComponent } from './core/layout/footer/footer';
import { NavbarComponent } from './core/layout/navbar/navbar';
import { InventoryService } from './core/services/inventory.service';

@Component({
  selector: 'app-root',
  imports: [NavbarComponent, RouterOutlet, FooterComponent, CartDrawerComponent],
  templateUrl: './app.html',
})
export class App {
  private readonly inventoryService = inject(InventoryService);

  protected readonly isCartOpen = signal(false);

  protected openCart(): void {
    this.isCartOpen.set(true);
  }

  protected closeCart(): void {
    this.isCartOpen.set(false);
  }
  protected readonly navCategories$ = this.inventoryService.categories$;
}

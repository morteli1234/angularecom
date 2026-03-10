import { Component, inject, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs/internal/Observable';
import { CartService } from '../../services/cart.service';

import { InventoryService } from '../../services/inventory.service';
import { FavoriteButtonComponent } from '../navbar/navbuttons/favorite-button/favorite-button';
import { CartButtonComponent } from '../navbar/navbuttons/cart-button/cart-button';
import { SearchButtonComponent } from '../navbar/navbuttons/search-button/search-button';

@Component({
  selector: 'app-navbar-drawer',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    AsyncPipe,
    MatIconModule,
    FavoriteButtonComponent,
    CartButtonComponent,
    SearchButtonComponent,
  ],
  templateUrl: './navbar-drawer.html',
})
export class NavbarDrawerComponent {
  readonly open = input(false);
  readonly close = output<void>();
  readonly cartClick = output<void>();
  readonly favoritesClick = output<void>();

  private readonly inventoryService = inject(InventoryService);
  private readonly cartService = inject(CartService);

  protected readonly itemCount$ = this.cartService.itemCount$;
  protected onCartClick(): void {
    this.cartClick.emit();
  }

  protected onFavoritesClick(): void {
    this.favoritesClick.emit();
  }

  protected searchProducts(query: string): void {
    const q = query.trim().toLowerCase();

    if (!q) {
      return;
    }
    const matches = this.inventoryService
      .getSnapshot()
      .filter((product) => product.title.toLowerCase().includes(q));

    // Implement search functionality here, e.g., navigate to a search results page with the query as a parameter
  }

  protected onClose(): void {
    this.close.emit();
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }
  readonly categories$ = input.required<Observable<string[]>>();
}

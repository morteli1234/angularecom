import { Component, inject, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs/internal/Observable';
import { CartService } from '../../services/cart.service';

import { InventoryService } from '../../services/inventory.service';

@Component({
  selector: 'app-navbar-drawer',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AsyncPipe, MatIconModule],
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

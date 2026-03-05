import { AsyncPipe } from '@angular/common';
import { Component, inject, output, input, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs/internal/Observable';
import { InventoryService } from '../../services/inventory.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AsyncPipe, MatIconModule],
  templateUrl: './navbar.html',
})
export class NavbarComponent {
  readonly cartClick = output<void>();

  private readonly inventoryService = inject(InventoryService);
  private readonly cartService = inject(CartService);

  protected readonly itemCount$ = this.cartService.itemCount$;

  readonly categories$ = input.required<Observable<string[]>>();

  protected onCartClick(): void {
    this.cartClick.emit();
  }

  protected readonly filteredProducts = signal<Product[]>([]);

  protected searchProducts(query: string): void {
    const q = query.trim().toLowerCase();

    if (!q) {
      this.filteredProducts.set([]);
      return;
    }
    const matches = this.inventoryService
      .getSnapshot()
      .filter((product) => product.title.toLowerCase().includes(q));

    this.filteredProducts.set(matches);
    // Implement search functionality here, e.g., navigate to a search results page with the query as a parameter
  }
}

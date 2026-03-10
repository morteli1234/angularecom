import { AsyncPipe } from '@angular/common';
import { Component, inject, output, input, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs/internal/Observable';
import { Product } from '../../../../models/product.model';
import { InventoryService } from '../../../../services/inventory.service';

@Component({
  selector: 'search-button',
  standalone: true,
  imports: [RouterLink, MatIconModule],
  templateUrl: './search-button.html',
})
export class SearchButtonComponent {
  searchQuery = signal('');

  private readonly inventoryService = inject(InventoryService);

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

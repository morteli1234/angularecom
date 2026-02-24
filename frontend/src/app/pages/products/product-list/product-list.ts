import { AsyncPipe, CurrencyPipe, TitleCasePipe } from '@angular/common';
import { Component, OnInit, inject, input } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { combineLatest, map } from 'rxjs';
import { InventoryService } from '../../../core/services/inventory.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [RouterLink, AsyncPipe, CurrencyPipe, TitleCasePipe],
  templateUrl: './product-list.html',
  styleUrl: './product-list.css'
})
export class ProductListComponent implements OnInit {
  readonly showTitle = input(true);
  readonly sectionTitle = input('Featured Products');

  private readonly inventoryService = inject(InventoryService);
  private readonly route = inject(ActivatedRoute);

  protected readonly loading$ = this.inventoryService.loading$;
  protected readonly error$ = this.inventoryService.error$;
  protected readonly activeCategory$ = this.route.paramMap.pipe(
    map((params) => params.get('category'))
  );
  protected readonly products$ = combineLatest([
    this.inventoryService.inventory$,
    this.activeCategory$
  ]).pipe(
    map(([products, category]) => {
      if (!category) {
        return products;
      }

      return products.filter((product) => product.category.toLowerCase() === category.toLowerCase());
    })
  );

  ngOnInit(): void {
    this.inventoryService.loadInventory();
  }
}

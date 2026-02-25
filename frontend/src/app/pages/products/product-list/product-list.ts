import { AsyncPipe, TitleCasePipe } from '@angular/common';
import { Component, OnInit, inject, input } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { combineLatest, map } from 'rxjs';
import { CartService } from '../../../core/services/cart.service';
import { InventoryService } from '../../../core/services/inventory.service';
import { ProductCardComponent } from '../product-card/product-card';

interface AddToCartPayload {
  productId: number;
  quantity: number;
}

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [RouterLink, AsyncPipe, TitleCasePipe, ProductCardComponent],
  templateUrl: './product-list.html'
})
export class ProductListComponent implements OnInit {
  readonly showTitle = input(true);
  readonly sectionTitle = input('Featured Products');
  readonly showStockControls = input(true);

  private readonly inventoryService = inject(InventoryService);
  private readonly cartService = inject(CartService);
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

  protected onAdd(payload: AddToCartPayload): void {
    const item = this.inventoryService.getItemById(payload.productId);
    if (!item) {
      return;
    }

    const didDecrease = this.inventoryService.decreaseStock(payload.productId, payload.quantity);
    if (!didDecrease) {
      return;
    }

    this.cartService.addToCart(
      {
        productId: item.id,
        title: item.title,
        price: item.price,
        image: item.image
      },
      payload.quantity
    );
  }
}

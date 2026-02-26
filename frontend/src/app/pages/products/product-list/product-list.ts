import { AsyncPipe, TitleCasePipe } from '@angular/common';
import { Component, OnInit, computed, effect, inject, input, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { combineLatest, map } from 'rxjs';
import { CartService } from '../../../core/services/cart.service';
import { InventoryItem } from '../../../core/models/product.model';
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
  templateUrl: './product-list.html',
})
export class ProductListComponent implements OnInit {
  readonly showTitle = input(true);
  readonly sectionTitle = input('Featured Products');
  readonly showStockControls = input(true);

  private readonly inventoryService = inject(InventoryService);
  private readonly cartService = inject(CartService);
  private readonly route = inject(ActivatedRoute);
  private readonly currentPage = signal(1);
  private readonly pageSize = signal<8 | 10>(8);

  protected readonly loading$ = this.inventoryService.loading$;
  protected readonly error$ = this.inventoryService.error$;
  protected readonly pageSizeOptions = [8, 10] as const;
  protected readonly activeCategory$ = this.route.paramMap.pipe(
    map((params) => params.get('category')),
  );
  protected readonly products$ = combineLatest([
    this.inventoryService.inventory$,
    this.activeCategory$,
  ]).pipe(
    map(([products, category]) => {
      if (!category) {
        return products;
      }

      return products.filter(
        (product) => product.category.toLowerCase() === category.toLowerCase(),
      );
    }),
  );
  protected readonly products = toSignal(this.products$, {
    initialValue: [] as InventoryItem[],
  });

  protected readonly pagination = computed(() => {
    const products = this.products();
    const currentPage = this.currentPage();
    const pageSize = this.pageSize();
    const totalItems = products.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
    const safePage = Math.min(Math.max(1, currentPage), totalPages);
    const startIndex = (safePage - 1) * pageSize;
    const pagedProducts = products.slice(startIndex, startIndex + pageSize);

    return {
      products: pagedProducts,
      totalItems,
      totalPages,
      currentPage: safePage,
      pageSize,
      startItem: totalItems === 0 ? 0 : startIndex + 1,
      endItem: Math.min(startIndex + pageSize, totalItems),
    };
  });

  constructor() {
    effect(() => {
      const totalPages = this.pagination().totalPages;
      if (this.currentPage() > totalPages) {
        this.currentPage.set(totalPages);
      }
    });
  }

  ngOnInit(): void {
    this.inventoryService.loadInventory();
  }

  protected onPageSizeChange(event: Event): void {
    const input = event.target as HTMLSelectElement;
    const parsed = Number(input.value);
    if (!this.pageSizeOptions.includes(parsed as 8 | 10)) {
      return;
    }

    this.pageSize.set(parsed as 8 | 10);
    this.currentPage.set(1);
  }

  protected goToPreviousPage(currentPage: number): void {
    this.currentPage.set(Math.max(1, currentPage - 1));
  }

  protected goToNextPage(currentPage: number, totalPages: number): void {
    this.currentPage.set(Math.min(totalPages, currentPage + 1));
  }

  protected goToPage(page: number): void {
    this.currentPage.set(Math.max(1, page));
  }

  protected pageNumbers(totalPages: number): number[] {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
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
        image: item.image,
      },
      payload.quantity,
    );
  }
}

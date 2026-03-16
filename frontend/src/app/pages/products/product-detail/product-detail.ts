import { AsyncPipe, CurrencyPipe, TitleCasePipe } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { combineLatest, map } from 'rxjs';
import { CartService } from '../../../core/services/cart.service';
import { InventoryService } from '../../../core/services/inventory.service';
import { HomeInstagallerySectionComponent } from '../../home/components/home-instagallery-section/home-instagallery-section';
import { HotToastService } from '@ngxpert/hot-toast';

HomeInstagallerySectionComponent;

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [RouterLink, AsyncPipe, CurrencyPipe, TitleCasePipe, HomeInstagallerySectionComponent],
  templateUrl: './product-detail.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ProductDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly inventoryService = inject(InventoryService);
  private readonly cartService = inject(CartService);
  private readonly toastService = inject(HotToastService);
  protected quantityToAdd = 1;
  protected readonly loading$ = this.inventoryService.loading$;
  protected readonly error$ = this.inventoryService.error$;
  protected readonly productId$ = this.route.paramMap.pipe(
    map((params) => Number(params.get('id'))),
    map((id) => (Number.isInteger(id) && id > 0 ? id : null)),
  );

  protected readonly pictures = [
    '/images/oversized_shirt.jpg',
    '/images/retro_sneakers.jpeg',
    '/images/totes.jpeg',
  ];

  protected readonly product$ = combineLatest([
    this.inventoryService.inventory$,
    this.productId$,
  ]).pipe(
    map(([inventory, productId]) => {
      if (productId === null) {
        return undefined;
      }

      return inventory.find((item) => item.id === productId);
    }),
  );

  ngOnInit(): void {
    this.inventoryService.loadInventory();
  }

  protected onQuantityInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const parsedValue = Number(inputElement.value);
    if (Number.isNaN(parsedValue)) {
      this.quantityToAdd = 1;
      return;
    }

    this.quantityToAdd = Math.max(1, Math.floor(parsedValue));
  }

  protected onAddToCart(productId: number): void {
    const product = this.inventoryService.getItemById(productId);
    if (!product || product.quantity <= 0) {
      return;
    }

    const quantity = Math.min(this.quantityToAdd, product.quantity);
    const didDecrease = this.inventoryService.decreaseStock(product.id, quantity);
    if (!didDecrease) {
      return;
    }

    this.cartService.addToCart(
      {
        productId: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
      },
      quantity,
    );
    this.toastService.success(`Added ${quantity} ${product.title} to cart`);
  }
  protected slidePrev(swiperEl: Element): void {
    (swiperEl as any).swiper.slidePrev();
  }

  protected slideNext(swiperEl: Element): void {
    (swiperEl as any).swiper.slideNext();
  }
}

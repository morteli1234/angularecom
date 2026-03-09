import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { Component, inject, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InventoryItem } from '../../../core/models/product.model';
import { CartService } from '../../../core/services/cart.service';
import { InventoryService } from '../../../core/services/inventory.service';
import { FavoritesService } from '../../../core/services/favorites.service';
import { MatIcon } from '@angular/material/icon';

interface AddToCartPayload {
  productId: number;
  quantity: number;
}

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [MatIcon, CurrencyPipe, TitleCasePipe, RouterLink],
  templateUrl: './product-card.html',
})
export class ProductCardComponent {
  readonly item = input.required<InventoryItem>();
  readonly showStockControls = input(true);
  protected readonly showAddToCart = signal(false);
  private readonly inventoryService = inject(InventoryService);
  private readonly cartService = inject(CartService);
  private readonly favoritesService = inject(FavoritesService);
  readonly add = output<AddToCartPayload>();

  protected quantityToAdd = 1;

  protected onQuantityInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const parsedValue = Number(inputElement.value);

    if (Number.isNaN(parsedValue)) {
      this.quantityToAdd = 1;
      return;
    }

    this.quantityToAdd = Math.max(1, Math.floor(parsedValue));
  }

  showAddToCartTrue(): void {
    this.showAddToCart.set(true);
  }

  showAddToCartFalse(): void {
    this.showAddToCart.set(false);
  }

  protected addToFavorites(): void {
    const product = this.item();
    this.favoritesService.addToFavorites({
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
    });
  }

  protected onAddToCart(productId: number): void {
    const product = this.inventoryService.getItemById(productId);
    if (!product || product.quantity <= 0) {
      return;
    }

    const quantity = 1; // Quick add always adds 1
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
  }

  protected onAdd(): void {
    const available = this.item().quantity;
    if (available <= 0) {
      return;
    }

    const quantity = Math.min(this.quantityToAdd, available);
    this.add.emit({ productId: this.item().id, quantity });
  }
}

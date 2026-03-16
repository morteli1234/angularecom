import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { Component, inject, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InventoryItem } from '../../../core/models/product.model';
import { CartService } from '../../../core/services/cart.service';
import { InventoryService } from '../../../core/services/inventory.service';
import { FavoritesService } from '../../../core/services/favorites.service';
import { MatIcon } from '@angular/material/icon';
import { HotToastService } from '@ngxpert/hot-toast';

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
  private readonly toastService = inject(HotToastService);
  readonly add = output<AddToCartPayload>();

  protected quantityToAdd = 1;

  protected isFavorite(productId: number): boolean {
    let isFav = false;
    this.favoritesService.favorites$.subscribe((favorites) => {
      isFav = favorites.some((fav) => fav.productId === productId);
    });
    return isFav;
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

  protected removeFromFavorites(): void {
    this.favoritesService.removeFromFavorites(this.item().id);
    this.toastService.success(`Removed ${this.item().title} from favorites`);
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
    this.toastService.success(`Added ${product.title} to favorites`);
  }

  protected onQuickAdd(): void {
    const quantity = 1;

    if (this.item().quantity <= 0) {
      return;
    }

    this.add.emit({ productId: this.item().id, quantity: 1 });
    this.toastService.success(`Added ${quantity} ${this.item().title} to cart`);
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

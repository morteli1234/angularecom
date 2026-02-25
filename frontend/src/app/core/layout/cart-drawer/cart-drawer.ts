import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, input, output, inject } from '@angular/core';
import { CartItem } from '../../../core/models/cart-item.model';
import { CartService } from '../../../core/services/cart.service';
import { InventoryService } from '../../../core/services/inventory.service';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe],
  templateUrl: './cart-drawer.html'
})
export class CartDrawerComponent {
  readonly open = input(false);
  readonly close = output<void>();

  private readonly cartService = inject(CartService);
  private readonly inventoryService = inject(InventoryService);

  protected readonly cartItems$ = this.cartService.cartItems$;
  protected readonly itemCount$ = this.cartService.itemCount$;
  protected readonly subtotal$ = this.cartService.subtotal$;
  protected readonly actionQuantities: Record<number, number> = {};

  protected onClose(): void {
    this.close.emit();
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  protected getActionQuantity(item: CartItem): number {
    const current = this.actionQuantities[item.productId];
    if (!current || current < 1) {
      return 1;
    }

    return Math.floor(current);
  }

  protected onActionQuantityInput(item: CartItem, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const parsedValue = Number(inputElement.value);
    if (!Number.isFinite(parsedValue)) {
      this.actionQuantities[item.productId] = 1;
      return;
    }

    this.actionQuantities[item.productId] = Math.max(1, Math.floor(parsedValue));
  }

  protected onAdd(item: CartItem): void {
    const requested = this.getActionQuantity(item);
    const stock = this.inventoryService.getItemById(item.productId)?.quantity ?? 0;
    const quantityToAdd = Math.min(requested, stock);
    if (quantityToAdd <= 0) {
      return;
    }

    const didDecrease = this.inventoryService.decreaseStock(item.productId, quantityToAdd);
    if (!didDecrease) {
      return;
    }

    this.cartService.addToCart(
      {
        productId: item.productId,
        title: item.title,
        price: item.price,
        image: item.image
      },
      quantityToAdd
    );
  }

  protected onRemove(item: CartItem): void {
    const requested = this.getActionQuantity(item);
    const quantityToRemove = Math.min(requested, item.quantity);
    if (quantityToRemove <= 0) {
      return;
    }

    this.cartService.removeFromCart(item.productId, quantityToRemove);
    this.inventoryService.increaseStock(item.productId, quantityToRemove);
  }
}

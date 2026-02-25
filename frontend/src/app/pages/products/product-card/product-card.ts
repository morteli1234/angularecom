import { CurrencyPipe, TitleCasePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { InventoryItem } from '../../../core/models/product.model';

interface AddToCartPayload {
  productId: number;
  quantity: number;
}

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CurrencyPipe, TitleCasePipe],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css'
})
export class ProductCardComponent {
  readonly item = input.required<InventoryItem>();
  readonly showStockControls = input(true);

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

  protected onAdd(): void {
    const available = this.item().quantity;
    if (available <= 0) {
      return;
    }

    const quantity = Math.min(this.quantityToAdd, available);
    this.add.emit({ productId: this.item().id, quantity });
  }
}

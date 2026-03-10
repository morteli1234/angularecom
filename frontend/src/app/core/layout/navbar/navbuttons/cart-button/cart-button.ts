import { AsyncPipe } from '@angular/common';
import { Component, inject, output, input, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../../../services/cart.service';

import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'cart-button',
  standalone: true,
  imports: [AsyncPipe, MatIconModule],
  templateUrl: './cart-button.html',
})
export class CartButtonComponent {
  readonly cartClick = output<void>();
  private readonly cartService = inject(CartService);

  protected readonly itemCount$ = this.cartService.itemCount$;
  protected onCartClick(): void {
    this.cartClick.emit();
  }
}

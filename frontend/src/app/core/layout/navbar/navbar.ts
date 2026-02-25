import { AsyncPipe } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, AsyncPipe],
  templateUrl: './navbar.html'
})
export class NavbarComponent {
  readonly cartClick = output<void>();

  private readonly cartService = inject(CartService);

  protected readonly itemCount$ = this.cartService.itemCount$;

  protected onCartClick(): void {
    this.cartClick.emit();
  }
}

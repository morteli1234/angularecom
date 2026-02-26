import { AsyncPipe } from '@angular/common';
import { Component, inject, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, AsyncPipe, MatIconModule],
  templateUrl: './navbar.html',
})
export class NavbarComponent {
  readonly cartClick = output<void>();

  private readonly cartService = inject(CartService);

  protected readonly itemCount$ = this.cartService.itemCount$;

  protected onCartClick(): void {
    this.cartClick.emit();
  }
}

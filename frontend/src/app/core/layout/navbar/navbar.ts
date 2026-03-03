import { AsyncPipe } from '@angular/common';
import { Component, inject, output, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs/internal/Observable';

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

  readonly categories$ = input.required<Observable<string[]>>();

  protected onCartClick(): void {
    this.cartClick.emit();
  }
}

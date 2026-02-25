import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CartDrawerComponent } from './core/layout/cart-drawer/cart-drawer';
import { FooterComponent } from './core/layout/footer/footer';
import { NavbarComponent } from './core/layout/navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [NavbarComponent, RouterOutlet, FooterComponent, CartDrawerComponent],
  templateUrl: './app.html'
})
export class App {
  protected readonly isCartOpen = signal(false);

  protected openCart(): void {
    this.isCartOpen.set(true);
  }

  protected closeCart(): void {
    this.isCartOpen.set(false);
  }
}

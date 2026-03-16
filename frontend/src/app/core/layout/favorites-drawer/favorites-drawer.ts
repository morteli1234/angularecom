import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { Component, input, output, inject } from '@angular/core';
import { FavoriteItem } from '../../../core/models/favorite-item.model';
import { FavoritesService } from '../../../core/services/favorites.service';
import { InventoryService } from '../../../core/services/inventory.service';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart-item.model';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-favorites-drawer',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe],
  templateUrl: './favorites-drawer.html',
})
export class FavoritesDrawerComponent {
  readonly open = input(false);
  readonly close = output<void>();

  private readonly favoritesService = inject(FavoritesService);
  private readonly inventoryService = inject(InventoryService);
  private readonly cartService = inject(CartService);
  private readonly toastService = inject(HotToastService);
  protected readonly favoriteItems$ = this.favoritesService.favorites$;

  protected onClose(): void {
    this.close.emit();
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  protected onRemove(item: FavoriteItem): void {
    this.favoritesService.removeFromFavorites(item.productId);
    this.toastService.success(`Removed ${item.title} from favorites`);
  }
}

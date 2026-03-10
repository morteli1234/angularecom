import { AsyncPipe } from '@angular/common';
import { Component, inject, output, input, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs/internal/Observable';
import { FavoritesService } from '../../../../services/favorites.service';
FavoritesService;

@Component({
  selector: 'favorite-button',
  standalone: true,
  imports: [MatIconModule, AsyncPipe],
  templateUrl: './favorite-button.html',
})
export class FavoriteButtonComponent {
  readonly favoritesClick = output<void>();
  private readonly favoritesService = inject(FavoritesService);

  protected readonly favoriteCount$ = this.favoritesService.favoriteCount$;
  protected onFavoritesClick(): void {
    this.favoritesClick.emit();
  }
}

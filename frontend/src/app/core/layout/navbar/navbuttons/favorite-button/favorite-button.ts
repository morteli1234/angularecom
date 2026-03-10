import { AsyncPipe } from '@angular/common';
import { Component, inject, output, input, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs/internal/Observable';

@Component({
  selector: 'favorite-button',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './favorite-button.html',
})
export class FavoriteButtonComponent {
  readonly favoritesClick = output<void>();

  protected onFavoritesClick(): void {
    this.favoritesClick.emit();
  }
}

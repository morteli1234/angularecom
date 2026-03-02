import { Component, OnInit, inject } from '@angular/core';
import { map } from 'rxjs';
import { InventoryService } from '../../core/services/inventory.service';
import {
  HeroCategory,
  HomeCategoriesSectionComponent,
} from './components/home-categories-section/home-categories-section';
import { HomeSpotlightSectionComponent } from './components/home-spotlight-section/home-spotlight-section';
import { HomeTrendColumnsSectionComponent } from './components/home-trend-columns-section/home-trend-columns-section';
import { ProductListComponent } from '../products/product-list/product-list';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ProductListComponent,
    HomeCategoriesSectionComponent,
    HomeSpotlightSectionComponent,
    HomeTrendColumnsSectionComponent,
  ],
  templateUrl: './home.html',
})
export class HomeComponent implements OnInit {
  private readonly inventoryService = inject(InventoryService);

  protected readonly footCategory: HeroCategory = {
    key: 'food',
    name: 'Food',
    description: 'Delicious and healthy options',
    route: ['/products'],
  };

  protected readonly categories$ = this.inventoryService.categories$.pipe(
    map((categories) => {
      const apiCards = categories.map((category) => this.toHeroCategory(category));
      return [...apiCards, this.footCategory];
    }),
  );

  ngOnInit(): void {
    this.inventoryService.loadInventory();
  }

  private toHeroCategory(category: string): HeroCategory {
    const normalized = category.toLowerCase();
    const descriptionMap: Record<string, string> = {
      electronics: 'Devices and daily tech picks',
      jewelery: 'Timeless accents and details',
      "men's clothing": 'Modern daily staples',
      "women's clothing": 'New season essentials',
    };

    return {
      key: category,
      name: this.toDisplayName(category),
      description: descriptionMap[normalized] ?? 'Explore this collection',
      route: ['/products/category', category],
    };
  }

  private toDisplayName(value: string): string {
    return value
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}

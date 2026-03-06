import { Component, OnInit, inject } from '@angular/core';
import { map } from 'rxjs';
import { InventoryService } from '../../core/services/inventory.service';
import { InventoryItem } from '../../core/models/product.model';
import {
  HeroCategory,
  HomeCategoriesSectionComponent,
} from './components/home-categories-section/home-categories-section';
import { HomeSpotlightSectionComponent } from './components/home-spotlight-section/home-spotlight-section';
import { HomeTrendColumnsSectionComponent } from './components/home-trend-columns-section/home-trend-columns-section';
import { ProductListComponent } from '../products/product-list/product-list';
import { HomeInstagallerySectionComponent } from './components/home-instagallery-section/home-instagallery-section';
import { HomeOfferSectionComponent } from './components/home-offer-section/home-offer-section';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    ProductListComponent,
    HomeCategoriesSectionComponent,
    HomeSpotlightSectionComponent,
    HomeTrendColumnsSectionComponent,
    HomeInstagallerySectionComponent,
    HomeOfferSectionComponent,
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

  protected readonly categories$ = this.inventoryService.inventory$.pipe(
    map((products) => {
      const apiCards = this.buildHeroCategories(products);
      return [...apiCards, this.footCategory];
    }),
  );

  ngOnInit(): void {
    this.inventoryService.loadInventory();
  }

  private buildHeroCategories(products: InventoryItem[]): HeroCategory[] {
    const firstImageByCategory = new Map<string, string>();
    const categoryOrder: string[] = [];

    for (const product of products) {
      if (!firstImageByCategory.has(product.category)) {
        firstImageByCategory.set(product.category, product.image);
        categoryOrder.push(product.category);
      }
    }

    return categoryOrder.map((category) =>
      this.toHeroCategory(category, firstImageByCategory.get(category)),
    );
  }

  private toHeroCategory(category: string, image?: string): HeroCategory {
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
      image,
    };
  }

  private toDisplayName(value: string): string {
    return value
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}

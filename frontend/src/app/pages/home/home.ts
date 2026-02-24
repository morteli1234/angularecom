import { AsyncPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { InventoryService } from '../../core/services/inventory.service';
import { ProductListComponent } from '../products/product-list/product-list';

interface HeroCategory {
  key: string;
  name: string;
  description: string;
  route: readonly [string, string];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ProductListComponent, AsyncPipe],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  private readonly inventoryService = inject(InventoryService);

  protected activeSlideIndex = 0;

  protected readonly categories$ = this.inventoryService.categories$.pipe(
    map((categories) => categories.map((category) => this.toHeroCategory(category)))
  );

  protected readonly carouselSlides = [
    { title: 'Spring Collection', subtitle: 'Soft layers and fresh colors' },
    { title: 'Weekend Edit', subtitle: 'Easy outfits for everyday comfort' },
    { title: 'Studio Favorites', subtitle: 'Editor picks this week' }
  ];

  protected readonly hotTrend = ['Oversized shirts', 'Retro sneakers', 'Statement totes', 'Cargo silhouettes'];
  protected readonly bestSeller = ['Core tee pack', 'Slim chino', 'Urban runner', 'Weatherproof jacket'];
  protected readonly featured = ['Premium knit drop', 'Limited colorway cap', 'Travel-ready set', 'Minimal leather belt'];

  ngOnInit(): void {
    this.inventoryService.loadInventory();
  }

  protected get activeSlide() {
    return this.carouselSlides[this.activeSlideIndex];
  }

  protected prevSlide(): void {
    const lastIndex = this.carouselSlides.length - 1;
    this.activeSlideIndex = this.activeSlideIndex === 0 ? lastIndex : this.activeSlideIndex - 1;
  }

  protected nextSlide(): void {
    const lastIndex = this.carouselSlides.length - 1;
    this.activeSlideIndex = this.activeSlideIndex === lastIndex ? 0 : this.activeSlideIndex + 1;
  }

  protected goToSlide(index: number): void {
    this.activeSlideIndex = index;
  }

  protected categoryGridClasses(categoryCount: number): string {
    return categoryCount % 2 === 1
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[minmax(11rem,1fr)]'
      : 'grid-cols-1 sm:grid-cols-2';
  }

  protected categoryCardClasses(index: number, categoryCount: number): string {
    const hasOddCount = categoryCount % 2 === 1;
    return hasOddCount && index === 0 ? 'sm:col-span-2 lg:col-span-2 lg:row-span-2' : '';
  }

  private toHeroCategory(category: string): HeroCategory {
    const normalized = category.toLowerCase();
    const descriptionMap: Record<string, string> = {
      electronics: 'Devices and daily tech picks',
      jewelery: 'Timeless accents and details',
      "men's clothing": 'Modern daily staples',
      "women's clothing": 'New season essentials'
    };

    return {
      key: category,
      name: this.toDisplayName(category),
      description: descriptionMap[normalized] ?? 'Explore this collection',
      route: ['/products/category', category]
    };
  }

  private toDisplayName(value: string): string {
    return value
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface SpotlightSlide {
  title: string;
  subtitle: string;
}

@Component({
  selector: 'app-home-spotlight-section',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home-spotlight-section.html',
})
export class HomeSpotlightSectionComponent {
  protected activeSlideIndex = 0;

  protected readonly carouselSlides: SpotlightSlide[] = [
    { title: 'Spring Collection', subtitle: 'Soft layers and fresh colors' },
    { title: 'Weekend Edit', subtitle: 'Easy outfits for everyday comfort' },
    { title: 'Studio Favorites', subtitle: 'Editor picks this week' },
  ];

  protected get activeSlide(): SpotlightSlide {
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
}

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
  protected readonly navButtonClass =
    'inline-flex items-center justify-center h-10 w-10 text-lg bg-stone-50 text-stone-900 rounded-full border border-stone-300 shadow-sm transition-colors hover:bg-stone-100';
  protected readonly ctaLinkClass =
    'inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-stone-900 bg-amber-500 rounded-lg border border-amber-400 shadow-sm transition-colors hover:bg-amber-400';
  private readonly activeDotClass = 'h-2.5 w-2.5 rounded-full bg-amber-500 transition-colors';
  private readonly inactiveDotClass = 'h-2.5 w-2.5 rounded-full bg-stone-400 transition-colors hover:bg-stone-500';

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

  protected dotButtonClass(index: number): string {
    return index === this.activeSlideIndex ? this.activeDotClass : this.inactiveDotClass;
  }
}

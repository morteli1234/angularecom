import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterLink } from '@angular/router';
import { register } from 'swiper/element/bundle';

register();

interface SpotlightSlide {
  title: string;
  subtitle: string;
}

@Component({
  selector: 'app-home-spotlight-section',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home-spotlight-section.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
}

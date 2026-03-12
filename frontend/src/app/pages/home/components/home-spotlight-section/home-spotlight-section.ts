import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild } from '@angular/core';
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
  @ViewChild('spotlightSwiper', { static: true })
  private spotlightSwiper?: ElementRef;

  ngAfterViewInit(): void {
    const swiperEl = this.spotlightSwiper?.nativeElement as any;
    if (!swiperEl) return;

    Object.assign(swiperEl, {
      slidesPerView: 1,
      spaceBetween: 0,
      loop: true,
      autoplay: {
        delay: 8000,
        disableOnInteraction: false,
      },
      pagination: {
        clickable: true,
      },
    });

    swiperEl.initialize();
  }
}

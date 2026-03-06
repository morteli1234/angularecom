import { Component, DestroyRef, inject, signal } from '@angular/core';
import { interval } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home-offer-section',
  standalone: true,
  templateUrl: './home-offer-section.html',
})
export class HomeOfferSectionComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly target = new Date('2026-04-25T10:00:00').getTime();

  protected readonly days = signal('00');
  protected readonly hours = signal('00');
  protected readonly minutes = signal('00');
  protected readonly seconds = signal('00');

  constructor() {
    interval(1000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.tick());
    this.tick();
  }

  private tick(): void {
    const diff = this.target - Date.now();
    if (diff <= 0) {
      this.days.set('00');
      this.hours.set('00');
      this.minutes.set('00');
      this.seconds.set('00');
      return;
    }

    this.days.set(String(Math.floor(diff / 86400000)).padStart(2, '0'));
    this.hours.set(String(Math.floor((diff % 86400000) / 3600000)).padStart(2, '0'));
    this.minutes.set(String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0'));
    this.seconds.set(String(Math.floor((diff % 60000) / 1000)).padStart(2, '0'));
  }
}

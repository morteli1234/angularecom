import { AsyncPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

export interface HeroCategory {
  key: string;
  name: string;
  description: string;
  route: readonly [string] | readonly [string, string];
  image?: string;
}

@Component({
  selector: 'app-home-categories-section',
  standalone: true,
  imports: [RouterLink, AsyncPipe],
  templateUrl: './home-categories-section.html',
})
export class HomeCategoriesSectionComponent {
  readonly categories$ = input.required<Observable<HeroCategory[]>>();

  protected categoryGridClasses(categoryCount: number): string {
    return categoryCount >= 5
      ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2'
      : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';
  }

  protected categoryCardClasses(index: number, categoryCount: number): string {
    if (categoryCount < 5) {
      return 'min-h-56 lg:min-h-64';
    }

    if (index === 0) {
      return 'min-h-72 md:col-span-2 lg:col-span-2 lg:row-span-2 lg:min-h-[34rem]';
    }

    return 'min-h-56 lg:min-h-[16.5rem]';
  }

  protected categoryToneClasses(index: number): string {
    const tones = [
      'bg-stone-200',
      'bg-emerald-100',
      'bg-violet-100',
      'bg-rose-100',
      'bg-sky-100',
    ];

    return tones[index % tones.length];
  }

  protected categoryImageFrameClasses(index: number, categoryCount: number): string {
    if (categoryCount >= 5 && index === 0) {
      return 'w-1/2 md:w-2/5';
    }

    return 'w-1/2';
  }
}

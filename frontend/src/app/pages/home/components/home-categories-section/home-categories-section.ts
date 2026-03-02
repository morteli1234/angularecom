import { AsyncPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

export interface HeroCategory {
  key: string;
  name: string;
  description: string;
  route: readonly [string] | readonly [string, string];
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
    return categoryCount % 2 === 1
      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[minmax(11rem,1fr)]'
      : 'grid-cols-1 sm:grid-cols-2';
  }

  protected categoryCardClasses(index: number, categoryCount: number): string {
    const hasOddCount = categoryCount % 2 === 1;
    return hasOddCount && index === 0 ? 'sm:col-span-2 lg:col-span-2 lg:row-span-2' : '';
  }
}

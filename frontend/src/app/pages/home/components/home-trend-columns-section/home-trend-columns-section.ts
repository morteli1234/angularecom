import { Component } from '@angular/core';

@Component({
  selector: 'app-home-trend-columns-section',
  standalone: true,
  templateUrl: './home-trend-columns-section.html',
})
export class HomeTrendColumnsSectionComponent {
  protected readonly hotTrend = [
    'Oversized shirts',
    'Retro sneakers',
    'Statement totes',
    'Cargo silhouettes',
  ];

  protected readonly bestSeller = [
    'Core tee pack',
    'Slim chino',
    'Urban runner',
    'Weatherproof jacket',
  ];

  protected readonly featured = [
    'Premium knit drop',
    'Limited colorway cap',
    'Travel-ready set',
    'Minimal leather belt',
  ];
}

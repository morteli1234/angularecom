import { Component } from '@angular/core';

@Component({
  selector: 'app-home-trend-columns-section',
  standalone: true,
  templateUrl: './home-trend-columns-section.html',
})
export class HomeTrendColumnsSectionComponent {
  protected readonly hotTrend = ['Oversized shirts', 'Retro sneakers', 'Statement totes'];

  protected readonly bestSeller = ['Core tee pack', 'Slim chino', 'Urban runner'];

  protected readonly feature = ['Premium knit drop', 'Limited colorway cap', 'Travel-ready set'];
}

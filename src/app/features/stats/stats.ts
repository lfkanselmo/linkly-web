import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BarChart, LineChart } from 'echarts/charts';
import { GridComponent, TooltipComponent } from 'echarts/components';
import * as echarts from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { NgxEchartsDirective, provideEchartsCore } from 'ngx-echarts';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { StatsResponse, UrlMetadataResponse } from '../../core/models/url';
import { ThemeService } from '../../core/services/theme';
import { UrlService } from '../../core/services/url.service';
import { readChartColors } from '../../core/utils/chart-theme';
import { Card } from '../../shared/components/card/card';
import { seriesLineOptions, topValuesBarOptions } from './chart-options';

echarts.use([LineChart, BarChart, GridComponent, TooltipComponent, CanvasRenderer]);

@Component({
  selector: 'app-stats',
  imports: [Card, NgxEchartsDirective],
  providers: [provideEchartsCore({ echarts })],
  templateUrl: './stats.html',
  styleUrl: './stats.scss',
})
export class Stats {
  private readonly route = inject(ActivatedRoute);
  private readonly urlService = inject(UrlService);
  private readonly theme = inject(ThemeService);

  protected readonly shortCode = this.route.snapshot.paramMap.get('code') ?? '';
  protected readonly loading = signal(true);
  protected readonly notFound = signal(false);
  protected readonly metadata = signal<UrlMetadataResponse | null>(null);
  protected readonly stats = signal<StatsResponse | null>(null);

  protected readonly hasClicks = computed(() => (this.stats()?.totalClicks ?? 0) > 0);
  protected readonly isExpired = computed(() => {
    const expiresAt = this.metadata()?.expiresAt;
    return expiresAt !== null && expiresAt !== undefined && new Date(expiresAt) < new Date();
  });

  private readonly chartColors = computed(() => {
    this.theme.isDark();
    return readChartColors();
  });

  protected readonly seriesOptions = computed(() => this.buildOptions((data) => seriesLineOptions(data.series, this.chartColors())));
  protected readonly browserOptions = computed(() =>
    this.buildOptions((data) => topValuesBarOptions(data.topBrowsers, this.chartColors())),
  );
  protected readonly osOptions = computed(() =>
    this.buildOptions((data) => topValuesBarOptions(data.topOperatingSystems, this.chartColors())),
  );
  protected readonly countryOptions = computed(() =>
    this.buildOptions((data) => topValuesBarOptions(data.topCountries, this.chartColors())),
  );

  constructor() {
    forkJoin({
      metadata: this.urlService.getMetadata(this.shortCode).pipe(
        map((value) => ({ found: true as const, value })),
        catchError(() => of({ found: false as const })),
      ),
      stats: this.urlService.getStats(this.shortCode, 'day').pipe(catchError(() => of(null))),
    }).subscribe(({ metadata, stats }) => {
      if (metadata.found) {
        this.metadata.set(metadata.value);
      } else {
        this.notFound.set(true);
      }
      this.stats.set(stats);
      this.loading.set(false);
    });
  }

  private buildOptions<T>(build: (data: StatsResponse) => T): T | null {
    const data = this.stats();
    return data ? build(data) : null;
  }
}

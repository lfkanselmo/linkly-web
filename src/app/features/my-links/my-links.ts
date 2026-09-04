import { Component, OnInit, inject, signal } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { UrlMetadataResponse } from '../../core/models/url';
import { UrlService } from '../../core/services/url.service';
import { loadMyLinkCodes } from '../../core/utils/my-links-storage';
import { Card } from '../../shared/components/card/card';

@Component({
  selector: 'app-my-links',
  imports: [Card],
  templateUrl: './my-links.html',
  styleUrl: './my-links.scss',
})
export class MyLinks implements OnInit {
  private readonly urlService = inject(UrlService);

  protected readonly links = signal<UrlMetadataResponse[]>([]);
  protected readonly loading = signal(true);

  ngOnInit(): void {
    const codes = loadMyLinkCodes();
    if (codes.length === 0) {
      this.loading.set(false);
      return;
    }
    forkJoin(codes.map((code) => this.urlService.getMetadata(code).pipe(catchError(() => of(null))))).subscribe(
      (results) => {
        this.links.set(results.filter((result): result is UrlMetadataResponse => result !== null));
        this.loading.set(false);
      },
    );
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api-config';
import { ShortenRequest, ShortenResponse, StatsPeriod, StatsResponse, UrlMetadataResponse } from '../models/url';

@Injectable({ providedIn: 'root' })
export class UrlService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(API_BASE_URL);

  shorten(request: ShortenRequest): Observable<ShortenResponse> {
    return this.http.post<ShortenResponse>(`${this.baseUrl}/urls`, request);
  }

  getMetadata(shortCode: string): Observable<UrlMetadataResponse> {
    return this.http.get<UrlMetadataResponse>(`${this.baseUrl}/urls/${shortCode}`);
  }

  getStats(shortCode: string, groupBy: StatsPeriod): Observable<StatsResponse> {
    const params = new HttpParams().set('groupBy', groupBy);
    return this.http.get<StatsResponse>(`${this.baseUrl}/urls/${shortCode}/stats`, { params });
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { API_BASE_URL } from '../config/api-config';
import { ShortenRequest, ShortenResponse, UrlMetadataResponse } from '../models/url';

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
}

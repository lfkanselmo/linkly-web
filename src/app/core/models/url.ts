export interface ShortenRequest {
  originalUrl: string;
  customCode?: string;
  expiresAt?: string;
}

export interface ShortenResponse {
  shortCode: string;
  shortUrl: string;
  originalUrl: string;
  createdAt: string;
  expiresAt: string | null;
}

export interface UrlMetadataResponse {
  shortCode: string;
  originalUrl: string;
  createdAt: string;
  expiresAt: string | null;
  totalClicks: number;
}

export interface ClickCountByPeriod {
  periodStart: string;
  count: number;
}

export interface TopValue {
  value: string;
  count: number;
}

export interface StatsResponse {
  totalClicks: number;
  series: ClickCountByPeriod[];
  topBrowsers: TopValue[];
  topOperatingSystems: TopValue[];
  topCountries: TopValue[];
  topReferrers: TopValue[];
}

export type StatsPeriod = 'day' | 'week' | 'month';

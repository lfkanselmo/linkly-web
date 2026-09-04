import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';

import { Stats } from './stats';

describe('Stats', () => {
  let fixture: ComponentFixture<Stats>;
  let httpMock: HttpTestingController;

  async function setup(code: string): Promise<void> {
    await TestBed.configureTestingModule({
      imports: [Stats],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ code }) } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Stats);
    httpMock = TestBed.inject(HttpTestingController);
  }

  afterEach(() => {
    httpMock.verify();
  });

  it('renders the total click count once both requests resolve', async () => {
    await setup('aB3xQ');
    fixture.detectChanges();

    httpMock.expectOne('http://localhost:8080/api/v1/urls/aB3xQ').flush({
      shortCode: 'aB3xQ',
      originalUrl: 'https://example.com',
      createdAt: new Date().toISOString(),
      expiresAt: null,
      totalClicks: 5,
    });
    httpMock.expectOne('http://localhost:8080/api/v1/urls/aB3xQ/stats?groupBy=day').flush({
      totalClicks: 5,
      series: [{ periodStart: new Date().toISOString(), count: 5 }],
      topBrowsers: [{ value: 'Chrome', count: 5 }],
      topOperatingSystems: [{ value: 'Windows', count: 5 }],
      topCountries: [{ value: 'CO', count: 5 }],
      topReferrers: [],
    });
    fixture.detectChanges();

    const heading = fixture.nativeElement.querySelector('h1');
    expect(heading?.textContent).toContain('5');
  });

  it('shows a not-found message when the metadata lookup fails', async () => {
    await setup('missing');
    fixture.detectChanges();

    httpMock.expectOne('http://localhost:8080/api/v1/urls/missing').flush('not found', {
      status: 404,
      statusText: 'Not Found',
    });
    httpMock.expectOne('http://localhost:8080/api/v1/urls/missing/stats?groupBy=day').flush('not found', {
      status: 404,
      statusText: 'Not Found',
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.empty')?.textContent).toContain('No encontramos');
  });
});

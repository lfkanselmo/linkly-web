import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyLinks } from './my-links';

describe('MyLinks', () => {
  let fixture: ComponentFixture<MyLinks>;
  let httpMock: HttpTestingController;

  afterEach(() => {
    localStorage.removeItem('linkly.my-links');
  });

  it('shows an empty message when nothing was shortened in this browser', async () => {
    await TestBed.configureTestingModule({
      imports: [MyLinks],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(MyLinks);
    fixture.detectChanges();

    const empty = fixture.nativeElement.querySelector('.empty');
    expect(empty?.textContent).toContain('Todavía no acortaste');
  });

  it('fetches metadata for every stored code and ignores failed lookups', async () => {
    localStorage.setItem('linkly.my-links', JSON.stringify(['aB3xQ', 'gone']));

    await TestBed.configureTestingModule({
      imports: [MyLinks],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(MyLinks);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();

    httpMock.expectOne('http://localhost:8080/api/v1/urls/aB3xQ').flush({
      shortCode: 'aB3xQ',
      originalUrl: 'https://example.com',
      createdAt: new Date().toISOString(),
      expiresAt: null,
      totalClicks: 3,
    });
    httpMock.expectOne('http://localhost:8080/api/v1/urls/gone').flush('not found', {
      status: 404,
      statusText: 'Not Found',
    });
    fixture.detectChanges();

    const codes = Array.from(fixture.nativeElement.querySelectorAll('.link-row__code')).map((element) =>
      (element as HTMLElement).textContent?.trim(),
    );
    expect(codes).toEqual(['aB3xQ']);
  });
});

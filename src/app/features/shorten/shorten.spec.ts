import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Shorten } from './shorten';

function setInputValue(input: HTMLInputElement, value: string): void {
  input.value = value;
  input.dispatchEvent(new Event('input'));
}

function submitForm(fixture: ComponentFixture<Shorten>): void {
  const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
  form.dispatchEvent(new Event('submit', { cancelable: true }));
}

describe('Shorten', () => {
  let fixture: ComponentFixture<Shorten>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Shorten],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(Shorten);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('shows the shortened link after a successful submit', () => {
    const urlInput = fixture.nativeElement.querySelector('input[type="url"]') as HTMLInputElement;
    setInputValue(urlInput, 'https://example.com/page');
    fixture.detectChanges();
    submitForm(fixture);

    const req = httpMock.expectOne('http://localhost:8080/api/v1/urls');
    expect(req.request.method).toBe('POST');
    req.flush({
      shortCode: 'aB3xQ',
      shortUrl: 'http://localhost:8080/aB3xQ',
      originalUrl: 'https://example.com/page',
      createdAt: new Date().toISOString(),
      expiresAt: null,
    });
    fixture.detectChanges();

    const link = fixture.nativeElement.querySelector('.result__link');
    expect(link?.textContent).toContain('aB3xQ');
  });

  it('does not call the API when the URL is blank', () => {
    submitForm(fixture);
    httpMock.expectNone('http://localhost:8080/api/v1/urls');
  });

  it('surfaces the backend error message on failure', () => {
    const urlInput = fixture.nativeElement.querySelector('input[type="url"]') as HTMLInputElement;
    setInputValue(urlInput, 'https://example.com/page');
    fixture.detectChanges();
    submitForm(fixture);

    const req = httpMock.expectOne('http://localhost:8080/api/v1/urls');
    req.flush('originalUrl must not point back to Linkly', { status: 400, statusText: 'Bad Request' });
    fixture.detectChanges();

    const error = fixture.nativeElement.querySelector('.field__error');
    expect(error?.textContent).toContain('originalUrl');
  });
});

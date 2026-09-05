import { Component, ElementRef, effect, inject, signal, viewChild } from '@angular/core';
import QRCode from 'qrcode';

import { UrlService } from '../../core/services/url.service';
import { ShortenResponse } from '../../core/models/url';
import { saveMyLinkCode } from '../../core/utils/my-links-storage';
import { Button } from '../../shared/components/button/button';
import { Card } from '../../shared/components/card/card';
import { InputField } from '../../shared/components/input-field/input-field';
import { SelectField, SelectOption } from '../../shared/components/select-field/select-field';

const EXPIRATION_OPTIONS: SelectOption[] = [
  { value: 'never', label: 'Nunca' },
  { value: '1', label: '1 día' },
  { value: '7', label: '7 días' },
  { value: '30', label: '30 días' },
];

@Component({
  selector: 'app-shorten',
  imports: [Button, Card, InputField, SelectField],
  templateUrl: './shorten.html',
  styleUrl: './shorten.scss',
})
export class Shorten {
  private readonly urlService = inject(UrlService);
  private readonly qrCanvas = viewChild<ElementRef<HTMLCanvasElement>>('qrCanvas');

  protected readonly expirationOptions = EXPIRATION_OPTIONS;

  protected readonly originalUrl = signal('');
  protected readonly customCode = signal('');
  protected readonly expiration = signal<string | null>('never');
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly result = signal<ShortenResponse | null>(null);
  protected readonly copied = signal(false);

  constructor() {
    effect(() => {
      const response = this.result();
      const canvas = this.qrCanvas()?.nativeElement;
      if (response && canvas) {
        QRCode.toCanvas(canvas, response.shortUrl, { width: 148, margin: 1 }).catch(() => undefined);
      }
    });
  }

  handleSubmit(event: Event): void {
    event.preventDefault();
    this.submit();
  }

  copyLink(): void {
    const response = this.result();
    if (!response || !navigator.clipboard) {
      return;
    }
    navigator.clipboard.writeText(response.shortUrl).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 1800);
    }, () => undefined);
  }

  reset(): void {
    this.result.set(null);
    this.originalUrl.set('');
    this.customCode.set('');
    this.expiration.set('never');
    this.error.set(null);
  }

  private submit(): void {
    if (!this.originalUrl().trim()) {
      return;
    }
    this.loading.set(true);
    this.error.set(null);
    this.urlService
      .shorten({
        originalUrl: this.originalUrl().trim(),
        customCode: this.customCode().trim() || undefined,
        expiresAt: this.resolveExpiresAt(),
      })
      .subscribe({
        next: (response) => {
          this.loading.set(false);
          this.result.set(response);
          saveMyLinkCode(response.shortCode);
        },
        error: (httpError) => {
          this.loading.set(false);
          this.error.set(typeof httpError.error === 'string' ? httpError.error : 'No se pudo acortar el link.');
        },
      });
  }

  private resolveExpiresAt(): string | undefined {
    const days = this.expiration();
    if (!days || days === 'never') {
      return undefined;
    }
    const date = new Date();
    date.setDate(date.getDate() + Number(days));
    return date.toISOString();
  }
}

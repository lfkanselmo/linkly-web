import { Component, inject, signal } from '@angular/core';

import { ThemeService } from './core/services/theme';
import { Button } from './shared/components/button/button';
import { Card } from './shared/components/card/card';
import { InputField } from './shared/components/input-field/input-field';
import { SelectField, SelectOption } from './shared/components/select-field/select-field';

@Component({
  selector: 'app-root',
  imports: [Button, Card, InputField, SelectField],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly theme = inject(ThemeService);

  protected readonly url = signal('');
  protected readonly expiration = signal<string | null>('never');
  protected readonly loading = signal(false);

  protected readonly expirationOptions: SelectOption[] = [
    { value: 'never', label: 'Nunca' },
    { value: '1d', label: '1 día' },
    { value: '7d', label: '7 días' },
    { value: '30d', label: '30 días' },
  ];

  protected toggleTheme(): void {
    this.theme.setChoice(this.theme.isDark() ? 'light' : 'dark');
  }

  protected simulateShorten(): void {
    this.loading.set(true);
    setTimeout(() => this.loading.set(false), 1200);
  }
}

import { Injectable, signal } from '@angular/core';

export type ThemeChoice = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'linkly.theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly media = window.matchMedia('(prefers-color-scheme: dark)');
  readonly choice = signal<ThemeChoice>(this.readStoredChoice());
  readonly isDark = signal(this.resolveIsDark(this.choice()));

  constructor() {
    this.applyToDocument();
    this.media.addEventListener('change', () => {
      if (this.choice() === 'system') {
        this.isDark.set(this.media.matches);
        this.applyToDocument();
      }
    });
  }

  setChoice(choice: ThemeChoice): void {
    this.choice.set(choice);
    this.isDark.set(this.resolveIsDark(choice));
    this.persist(choice);
    this.applyToDocument();
  }

  private resolveIsDark(choice: ThemeChoice): boolean {
    return choice === 'dark' || (choice === 'system' && this.media.matches);
  }

  private applyToDocument(): void {
    const root = document.documentElement;
    if (this.choice() === 'system') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', this.choice());
    }
  }

  private readStoredChoice(): ThemeChoice {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'light' || stored === 'dark' ? stored : 'system';
  }

  private persist(choice: ThemeChoice): void {
    if (choice === 'system') {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, choice);
    }
  }
}

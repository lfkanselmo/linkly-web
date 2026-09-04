import { Component, ElementRef, HostListener, inject, input, model, signal } from '@angular/core';

export interface SelectOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-select-field',
  imports: [],
  templateUrl: './select-field.html',
  styleUrl: './select-field.scss',
})
export class SelectField {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  readonly label = input<string>('');
  readonly options = input<SelectOption[]>([]);
  readonly placeholder = input<string>('Seleccionar');
  readonly value = model<string | null>(null);

  readonly isOpen = signal(false);

  get selectedLabel(): string {
    return this.options().find((option) => option.value === this.value())?.label ?? this.placeholder();
  }

  toggle(): void {
    this.isOpen.update((open) => !open);
  }

  select(option: SelectOption): void {
    this.value.set(option.value);
    this.isOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.isOpen.set(false);
    }
  }

  @HostListener('keydown.escape')
  onEscape(): void {
    this.isOpen.set(false);
  }
}

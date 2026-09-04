import { Component, input, model } from '@angular/core';

@Component({
  selector: 'app-input-field',
  imports: [],
  templateUrl: './input-field.html',
  styleUrl: './input-field.scss',
})
export class InputField {
  readonly label = input<string>('');
  readonly placeholder = input<string>('');
  readonly type = input<'text' | 'url'>('text');
  readonly error = input<string | null>(null);
  readonly disabled = input(false);
  readonly value = model<string>('');
}

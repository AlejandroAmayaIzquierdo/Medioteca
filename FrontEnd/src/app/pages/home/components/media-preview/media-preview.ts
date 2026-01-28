import { Component, computed, input } from '@angular/core';
import { Media } from '../../../../core/models/Media/Media';

@Component({
  selector: 'app-media-preview',
  imports: [],
  templateUrl: './media-preview.html',
})
export class MediaPreview {
  readonly media = input.required<Media>();

  protected readonly mediaType = computed(() => {
    const types: Record<number, string> = {
      1: 'Libro',
      2: 'Película',
      3: 'Música',
      4: 'Videojuego',
    };
    return types[this.media().mediaTypeId] ?? 'Otro';
  });

  protected readonly badgeColor = computed(() => {
    const colors: Record<number, string> = {
      1: 'bg-blue-500',
      2: 'bg-red-500',
      3: 'bg-green-500',
      4: 'bg-purple-500',
    };
    return colors[this.media().mediaTypeId] ?? 'bg-gray-500';
  });
}

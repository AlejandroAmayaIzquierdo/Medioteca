import { Component, computed, input } from '@angular/core';
import { Media } from '../../../../core/models/Media/Media';
import { MediaType } from '../../../../core/models/Media/MediaTypes';
import { Router } from '@angular/router';

@Component({
  selector: 'app-media-preview',
  imports: [],
  templateUrl: './media-preview.html',
})
export class MediaPreview {
  constructor(private router: Router) {}

  readonly mediaTypes = input<MediaType[]>([]);
  readonly media = input.required<Media>();

  protected readonly mediaType = computed(() => {
    const type = this.mediaTypes().find((type) => type.id === this.media().mediaTypeId);
    return type?.name ?? 'Otro';
  });

  protected readonly badgeColor = computed(() => {
    const colors: Record<number, string> = {
      1: 'bg-blue-500',
      2: 'bg-red-500',
      3: 'bg-green-500',
      4: 'bg-purple-500',
      5: 'bg-yellow-500',
    };
    return colors[this.media().mediaTypeId] ?? 'bg-gray-500';
  });

  public navigateToDetail() {
    this.router.navigate([`/media/${this.media().id}`]);
  }
}

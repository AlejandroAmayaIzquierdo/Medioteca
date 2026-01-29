import { Component, computed, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MediaService } from '../../core/services/media.service';
import { Media } from '../../core/models/Media/Media';
import { HlmCard, HlmCardContent } from '@spartan-ng/helm/card';
import { HlmBadge } from '@spartan-ng/helm/badge';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-media-detail',
  imports: [HlmCard, HlmCardContent, HlmBadge, DatePipe],
  templateUrl: './media-detail.html',
})
export class MediaDetail implements OnInit {
  protected readonly CurrentMedia = signal<Media | null>(null);

  constructor(
    protected route: ActivatedRoute,
    protected mediaService: MediaService,
  ) {}

  protected readonly CurrentMediaType = computed(() => {
    const media = this.CurrentMedia();
    const types = this.mediaService.mediaTypes$();
    if (media) {
      return types.find((type) => type.id === media.mediaTypeId) || null;
    }
    return null;
  });

  protected readonly badgeColor = computed(() => {
    const colors: Record<number, string> = {
      1: 'bg-blue-500',
      2: 'bg-red-500',
      3: 'bg-green-500',
      4: 'bg-purple-500',
      5: 'bg-yellow-500',
    };
    if (!this.CurrentMedia()) return 'bg-gray-500';
    return colors[this.CurrentMedia()!.mediaTypeId] ?? 'bg-gray-500';
  });

  ngOnInit(): void {
    const mediaId = this.route.snapshot.paramMap.get('id');
    if (mediaId) this.loadMedia(mediaId);
  }

  public loadMedia = (id: string) => {
    this.mediaService.fetchMediaById(id).subscribe({
      next: (data) => {
        this.CurrentMedia.set(data);
      },
      error: (error) => {
        console.error('Error fetching media by ID:', error);
      },
    });
  };
}

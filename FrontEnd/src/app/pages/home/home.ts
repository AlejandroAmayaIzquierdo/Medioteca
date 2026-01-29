import { Component, signal } from '@angular/core';
import { MediaTypeCard } from './components/media-type-card/media-type-card';
import { SearchBar } from '../../Shared/components/search-bar/search-bar';
import { MediaService } from '../../core/services/media.service';
import { MediaPreview } from './components/media-preview/media-preview';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { LucideAngularModule, Plus } from 'lucide-angular';
import { CreateMediaDialog } from './components/create-media-dialog/create-media-dialog';
import { CreateMediaDto } from '../../core/models/Media/Media';
import { toast } from 'ngx-sonner';
import { AuthService } from '../../core/services/auth.service';
import { Permissions } from '../../core/models/Auth/Permissions';

@Component({
  selector: 'app-home',
  imports: [
    MediaTypeCard,
    SearchBar,
    MediaPreview,
    HlmButtonImports,
    LucideAngularModule,
    CreateMediaDialog,
  ],
  templateUrl: './home.html',
})
export class Home {
  protected readonly CanCreateMedia = Permissions.CanCreateMedia;
  protected readonly toast = toast;
  isCreating = signal(false);

  constructor(
    protected mediaService: MediaService,
    protected authService: AuthService,
  ) {}
  protected onSearch(query: string) {
    console.log('Search query:', query);

    this.mediaService.fetchMedia({ searchTerm: query }).subscribe();
  }

  protected createMedia(event: CreateMediaDto) {
    this.isCreating.set(true);
    this.mediaService.createMedia(event).subscribe({
      next: () => {
        this.isCreating.set(false);
        console.log('Media created successfully');
        this.toast.success('Media created successfully');
        this.mediaService.fetchMedia({}).subscribe();
      },
      error: (error) => {
        this.isCreating.set(false);
        const message =
          error.error?.detail || error.error?.message || error.message || 'Error creating media';
        console.error('Error creating media:', error);
        this.toast.error(message);
      },
    });
  }
}

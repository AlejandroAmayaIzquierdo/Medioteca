import { Component } from '@angular/core';
import { MediaTypeCard } from './components/media-type-card/media-type-card';
import { SearchBar } from '../../Shared/components/search-bar/search-bar';
import { MediaService } from '../../core/services/media.service';
import { MediaPreview } from './components/media-preview/media-preview';

@Component({
  selector: 'app-home',
  imports: [MediaTypeCard, SearchBar, MediaPreview],
  templateUrl: './home.html',
})
export class Home {
  constructor(protected mediaService: MediaService) {}
  protected onSearch(query: string) {
    console.log('Search query:', query);

    this.mediaService.fetchMedia({ searchTerm: query }).subscribe();
  }
}

import { Component, EventEmitter, Output, signal } from '@angular/core';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmButtonImports } from '@spartan-ng/helm/button';

@Component({
  selector: 'app-search-bar',
  imports: [HlmInputImports, HlmButtonImports],
  templateUrl: './search-bar.html',
})
export class SearchBar {
  protected readonly search = signal('');

  @Output() protected readonly onSearch = new EventEmitter<string>();

  protected submitSearch(event: Event) {
    event.preventDefault();
    this.onSearch.emit(this.search());
  }
}

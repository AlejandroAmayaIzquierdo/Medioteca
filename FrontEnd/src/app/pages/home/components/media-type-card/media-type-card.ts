import { Component, computed, Input } from '@angular/core';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { Book, Film, Music, File, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-media-type-card',
  imports: [HlmCardImports, LucideAngularModule],
  templateUrl: './media-type-card.html',
})
export class MediaTypeCard {
  private readonly BookIcon = Book;
  private readonly MusicIcon = Music;
  private readonly VideoIcon = Film;
  private readonly DocumentIcon = File;

  protected IconColor = computed(() => {
    switch (this.type) {
      case 'Books':
        return 'text-blue-500';
      case 'Music':
        return 'text-green-500';
      case 'Video':
        return 'text-red-500';
      case 'Document':
        return 'text-yellow-500';
      default:
        return 'text-blue-500';
    }
  });

  protected Icon = computed(() => {
    switch (this.type) {
      case 'Books':
        return this.BookIcon;
      case 'Music':
        return this.MusicIcon;
      case 'Video':
        return this.VideoIcon;
      case 'Document':
        return this.DocumentIcon;
      default:
        return this.BookIcon;
    }
  });

  protected readonly Tittle = computed(() => {
    switch (this.type) {
      case 'Books':
        return 'Libros';
      case 'Music':
        return 'Música';
      case 'Video':
        return 'Videos';
      case 'Document':
        return 'Documentos';
      default:
        return 'Libros';
    }
  });

  @Input() type: 'Books' | 'Music' | 'Video' | 'Document' = 'Books';
}

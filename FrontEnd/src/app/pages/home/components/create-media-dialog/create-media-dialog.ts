import { Component, EventEmitter, input, Input, Output, signal } from '@angular/core';
import { BrnDialogImports } from '@spartan-ng/brain/dialog';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { LucideAngularModule, Plus, Loader2 } from 'lucide-angular';
import { CreateMediaDto } from '../../../../core/models/Media/Media';
import { form, FormField } from '@angular/forms/signals';
import { MediaType } from '../../../../core/models/Media/MediaTypes';
import { BrnPopoverContent } from '@spartan-ng/brain/popover';
import { HlmComboboxImports } from '@spartan-ng/helm/combobox';

@Component({
  selector: 'app-create-media-dialog',
  imports: [
    BrnDialogImports,
    HlmDialogImports,
    HlmButtonImports,
    LucideAngularModule,
    FormField,
    BrnPopoverContent,
    HlmComboboxImports,
  ],
  templateUrl: './create-media-dialog.html',
})
export class CreateMediaDialog {
  @Input() mediaTypes: MediaType[] = [];
  readonly loading = input(false);

  @Output() onSubmitMedia = new EventEmitter<CreateMediaDto>();
  protected PlusIcon = Plus;
  protected LoaderIcon = Loader2;

  protected createMedia = signal<CreateMediaDto>({
    title: '',
    description: '',
    mediaTypeId: 1,
  });

  protected createMediaForm = form(this.createMedia);

  protected onSubmit(event: Event): void {
    event.preventDefault();
    const newMedia: CreateMediaDto = this.createMedia();
    console.log('Creating media:', newMedia);
    this.onSubmitMedia.emit(newMedia);
  }

  public itemToString = (mediaType: MediaType) => (mediaType ? mediaType.name : '');

  protected onMediaTypeChange(mediaType: MediaType | null): void {
    if (mediaType) {
      this.createMedia.update((current) => ({
        ...current,
        mediaTypeId: mediaType.id,
      }));
    }
  }
}

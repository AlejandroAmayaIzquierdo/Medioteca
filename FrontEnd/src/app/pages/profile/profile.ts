import { Component, signal } from '@angular/core';
// import { BackButton } from '../../Shared/back-button/back-button';
import { AuthService } from '../../core/services/auth.service';
import { UpdateUserDto } from '../../core/models/Users/Profile';
import { form, FormField, min, required } from '@angular/forms/signals';
import { Loader2, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-profile',
  imports: [LucideAngularModule, FormField],
  templateUrl: './profile.html',
})
export class Profile {
  readonly LoaderIcon = Loader2;
  protected user = signal<UpdateUserDto>({
    userName: '',
  });

  protected updateUserForm = form(this.user, (schemaPath) => {
    required(schemaPath.userName!);
    min(schemaPath.userName!, 3);
  });

  constructor(protected authService: AuthService) {
    const current = this.authService.user();
    console.log('Current user data:', current);
    this.user.set({
      userName: current?.userName,
    });
  }

  protected onSubmit(event: Event): void {
    event.preventDefault();

    const updateData: UpdateUserDto = this.user();

    console.log('Submitting profile update form', updateData);
  }
}

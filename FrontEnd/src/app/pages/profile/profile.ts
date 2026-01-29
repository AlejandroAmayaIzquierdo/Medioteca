import { Component, signal } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { UpdateUserDto } from '../../core/models/Users/Profile';
import { form, FormField, min, required } from '@angular/forms/signals';
import { Loader2, LucideAngularModule, Mail, Shield, User } from 'lucide-angular';
import { UserService } from '../../core/services/user.service';
import { toast } from 'ngx-sonner';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmBadgeImports } from '@spartan-ng/helm/badge';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmAvatarImports } from '@spartan-ng/helm/avatar';

@Component({
  selector: 'app-profile',
  imports: [
    LucideAngularModule,
    FormField,
    HlmCardImports,
    HlmButtonImports,
    HlmInputImports,
    HlmLabelImports,
    HlmBadgeImports,
    HlmSeparatorImports,
    HlmAvatarImports,
  ],
  templateUrl: './profile.html',
})
export class Profile {
  protected toast = toast;
  protected readonly LoaderIcon = Loader2;
  protected readonly UserIcon = User;
  protected readonly MailIcon = Mail;
  protected readonly ShieldIcon = Shield;
  protected user = signal<UpdateUserDto>({
    userName: '',
  });

  protected updateUserForm = form(this.user, (schemaPath) => {
    required(schemaPath.userName!);
    min(schemaPath.userName!, 3);
  });

  constructor(
    protected authService: AuthService,
    protected userService: UserService,
  ) {
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

    this.userService.updateProfile(updateData).subscribe({
      next: (updatedUser) => {
        console.log('Profile updated successfully', updatedUser);
        this.authService.setUser(updatedUser);
        this.toast.success('Perfil actualizado con éxito');
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        const message =
          error.error?.detail || error.error?.message || error.message || 'Error updating profile';
        this.toast.error(message);
      },
    });
  }
}

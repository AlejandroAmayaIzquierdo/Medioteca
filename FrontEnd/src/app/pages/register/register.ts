import { Component, signal } from '@angular/core';
import { Loader2, Lock, LucideAngularModule, Mail, User } from 'lucide-angular';
import { toast } from 'ngx-sonner';
import { RegisterFormDto } from '../../core/models/Auth/Register';
import { debounce, email, form, FormField, min, required } from '@angular/forms/signals';
import { AuthService } from '../../core/services/auth.service';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [
    FormField,
    LucideAngularModule,
    HlmCardImports,
    HlmButtonImports,
    HlmInputImports,
    HlmLabelImports,
    RouterLink,
  ],
  templateUrl: './register.html',
})
export class Register {
  protected readonly LoaderIcon = Loader2;
  protected readonly UserIcon = User;
  protected readonly MailIcon = Mail;
  protected readonly LockIcon = Lock;
  protected readonly toast = toast;

  constructor(public authService: AuthService) {}

  protected user = signal<RegisterFormDto>({
    userName: '',
    email: '',
    password: '',
  });

  protected registerForm = form(this.user, (schemaPath) => {
    debounce(schemaPath.email, 500);
    required(schemaPath.email);
    email(schemaPath.email);
    required(schemaPath.password);
    min(schemaPath.password, 8);
    required(schemaPath.userName);
    min(schemaPath.userName, 3);
  });

  protected onSubmit(event: Event): void {
    event.preventDefault();

    const registerData: RegisterFormDto = this.user();

    this.authService.register(registerData).subscribe({
      next: () => {
        toast.success('Registro exitoso. Por favor, inicia sesión.');
      },
      error: (error) => {
        toast.error(`Error al registrar: ${error.error?.detail || 'Error desconocido'}`);
      },
    });
  }
}

import { Component, signal } from '@angular/core';
import { FormField, debounce, email, form, min, required } from '@angular/forms/signals';
import { LoginFormDto } from '../../core/models/Auth/Login';
import { LucideAngularModule, Loader2 } from 'lucide-angular';
import { AuthService } from '../../core/services/auth.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-login',
  imports: [FormField, LucideAngularModule],
  templateUrl: './login.html',
})
export class Login {
  readonly LoaderIcon = Loader2;

  protected readonly toast = toast;

  protected user = signal<LoginFormDto>({
    email: '',
    password: '',
  });

  constructor(public authService: AuthService) {}

  protected loginForm = form(this.user, (schemaPath) => {
    debounce(schemaPath.email, 500);
    required(schemaPath.email);
    email(schemaPath.email);
    required(schemaPath.password);
    min(schemaPath.password, 8);
  });

  protected onSubmit(event: Event): void {
    event.preventDefault();

    const loginData: LoginFormDto = this.user();

    console.log('Submitting login form', loginData);

    this.authService.login(loginData).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        this.toast.success('Login successful');
      },
      error: (error) => {
        console.error('Login failed', error);
        this.toast.error('Login failed: ' + (error.error?.detail || 'Unknown error'));
      },
    });
  }
}

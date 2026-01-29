import { Component, signal } from '@angular/core';
import { FormField, debounce, email, form, min, required } from '@angular/forms/signals';
import { LoginFormDto } from '../../core/models/Auth/Login';
import { LucideAngularModule, Loader2, Mail, Lock } from 'lucide-angular';
import { AuthService } from '../../core/services/auth.service';
import { toast } from 'ngx-sonner';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    FormField,
    LucideAngularModule,
    HlmCardImports,
    HlmButtonImports,
    HlmInputImports,
    HlmLabelImports,
    RouterLink,
  ],
  templateUrl: './login.html',
})
export class Login {
  protected readonly LoaderIcon = Loader2;
  protected readonly MailIcon = Mail;
  protected readonly LockIcon = Lock;

  protected readonly toast = toast;

  protected user = signal<LoginFormDto>({
    email: '',
    password: '',
  });

  constructor(
    public authService: AuthService,
    private router: Router,
  ) {}

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
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Login failed', error);
        this.toast.error(error.error?.detail || 'Login failed');
      },
    });
  }
}

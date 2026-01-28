import { Component, computed, OnInit, signal } from '@angular/core';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { UserService } from '../../core/services/user.service';
import { WebApiUserDto } from '../../core/models/Auth/User';
import { toast } from 'ngx-sonner';
import { HlmCardImports } from '@spartan-ng/helm/card';
import { LucideAngularModule, Shield, User, Users, UserX } from 'lucide-angular';
import { DatePipe } from '@angular/common';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin',
  imports: [HlmTableImports, HlmCardImports, LucideAngularModule, DatePipe, HlmButtonImports],
  templateUrl: './admin.html',
})
export class Admin implements OnInit {
  protected ShieldIcon = Shield;
  protected UsersIcon = Users;
  protected UserXIcon = UserX;
  protected UserIcon = User;

  protected users = signal<WebApiUserDto[]>([]);

  protected deactivatedUsers = computed(() => this.users().filter((user) => !user.isActive));

  protected readonly toast = toast;

  constructor(
    protected userService: UserService,
    protected authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users.set(data.items);
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        this.toast.error('Failed to load users: ' + (error.error?.detail || 'Unknown error'));
      },
    });
  }

  protected activateOrDeactivateUser(userId: string) {
    this.userService.deactivateUser(userId).subscribe({
      next: () => {
        this.toast.success('User deactivated successfully');
        this.users.set(
          this.users().map((user) =>
            user.id === userId ? { ...user, isActive: !user.isActive } : user,
          ),
        );
      },
      error: (error) => {
        console.error('Error deactivating user:', error);
        this.toast.error('Failed to deactivate user: ' + (error.error?.detail || 'Unknown error'));
      },
    });
  }
}

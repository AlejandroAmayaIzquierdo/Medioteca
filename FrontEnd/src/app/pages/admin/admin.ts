import { Component, OnInit, signal } from '@angular/core';
import { HlmTableImports } from '@spartan-ng/helm/table';
import { UserService } from '../../core/services/user.service';
import { WebApiUserDto } from '../../core/models/Auth/User';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-admin',
  imports: [HlmTableImports],
  templateUrl: './admin.html',
})
export class Admin implements OnInit {
  protected users = signal<WebApiUserDto[]>([]);

  protected readonly toast = toast;

  constructor(protected userService: UserService) {}

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
}

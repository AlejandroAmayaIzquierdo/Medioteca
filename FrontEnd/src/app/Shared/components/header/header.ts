import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { BrnPopoverImports } from '@spartan-ng/brain/popover';
import { HlmPopoverImports } from '@spartan-ng/helm/popover';
import { HlmAvatarImports, HlmAvatar } from '@spartan-ng/helm/avatar';
import { LogOut, LucideAngularModule, Settings, Shield } from 'lucide-angular';
import { HlmSeparatorImports } from '@spartan-ng/helm/separator';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { Permissions } from '../../../core/models/Auth/Permissions';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    HlmPopoverImports,
    BrnPopoverImports,
    HlmAvatar,
    HlmAvatarImports,
    LucideAngularModule,
    HlmSeparatorImports,
    HlmButtonImports,
  ],
  templateUrl: './header.html',
})
export class Header {
  protected readonly AdminAccess = Permissions.AdminAccess;
  protected SettingsIcon = Settings;
  protected ShieldIcon = Shield;
  protected LogOutIcon = LogOut;
  constructor(protected authService: AuthService) {}
}

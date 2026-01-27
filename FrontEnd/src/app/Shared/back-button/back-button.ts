import { Component, Input } from '@angular/core';
import { ArrowLeft, LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-back-button',
  imports: [LucideAngularModule],
  templateUrl: './back-button.html',
  styleUrl: './back-button.css',
})
export class BackButton {
  protected ArrowLeftIcon = ArrowLeft;

  @Input() public returnUrl: string = '/';
}

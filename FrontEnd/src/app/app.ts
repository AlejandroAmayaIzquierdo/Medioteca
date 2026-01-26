import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './Shared/components/header/header';
import { NgxSonnerToaster } from 'ngx-sonner';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, NgxSonnerToaster],
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('medioteca-client');
}

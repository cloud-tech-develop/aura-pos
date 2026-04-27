import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from '@services/theme.service';
import { ApiConnectionService } from '@services/api-connection.service';
import { AppStore } from './store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private themeService = inject(ThemeService); // NO BORRAR
  private apiConnection = inject(ApiConnectionService);
}

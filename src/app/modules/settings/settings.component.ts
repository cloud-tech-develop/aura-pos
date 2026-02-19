import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page-container">
      <h1 class="page-title">Configuración</h1>
      <p class="page-description">Ajustes y preferencias del sistema</p>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 1rem 0;
    }
    .page-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 0.5rem;
    }
    .page-description {
      color: var(--text-secondary);
    }
  `]
})
export class SettingsComponent {}

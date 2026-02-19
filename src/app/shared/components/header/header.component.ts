import { Component, inject, signal, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ThemePanelComponent } from '../theme-panel/theme-panel.component';

interface Tab {
  id: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule, ThemePanelComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  private router = inject(Router);

  readonly tabs: Tab[] = [
    { id: 'inicio', label: 'Inicio', route: '/dashboard' },
    { id: 'equipo', label: 'Equipo', route: '/team' },
    { id: 'admin', label: 'Admin', route: '/admin' },
    { id: 'config', label: 'Config', route: '/settings' },
  ];

  // Estado del dropdown del usuario
  readonly isUserDropdownOpen = signal(false);

  constructor(private elementRef: ElementRef) {}

  isActive(route: string): boolean {
    return this.router.url.startsWith(route);
  }

  navigate(route: string): void {
    this.router.navigate([route]);
  }

  toggleUserDropdown(): void {
    this.isUserDropdownOpen.update((open) => !open);
  }

  closeUserDropdown(): void {
    this.isUserDropdownOpen.set(false);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside && this.isUserDropdownOpen()) {
      this.closeUserDropdown();
    }
  }
}

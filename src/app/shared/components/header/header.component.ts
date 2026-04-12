import { Component, inject, signal, ElementRef, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ThemePanelComponent } from '../theme-panel/theme-panel.component';
import { TranslationService, AppLanguage } from '@services/translation.service';

interface Tab {
  id: string;
  label: string;
  route: string;
}

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule, TranslateModule, ThemePanelComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  private router = inject(Router);
  readonly i18n = inject(TranslationService);

  readonly tabs: Tab[] = [
    { id: 'inicio', label: 'Inicio', route: '/dashboard' },
    { id: 'equipo', label: 'Equipo', route: '/team' },
    { id: 'sellers', label: 'Vendedores', route: '/sellers' },
    { id: 'admin', label: 'Admin', route: '/admin' },
    { id: 'config', label: 'Config', route: '/settings' },
  ];

  readonly isUserDropdownOpen = signal(false);

  constructor(private elementRef: ElementRef) {}

  readonly currentLang = this.i18n.currentLanguage;

  readonly languages: { code: AppLanguage; name: string }[] = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
  ];

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

  setLanguage(lang: AppLanguage): void {
    this.i18n.setLanguage(lang);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside && this.isUserDropdownOpen()) {
      this.closeUserDropdown();
    }
  }
}

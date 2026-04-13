import { AfterViewInit, Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MenuItem, MenuSectionItem } from '@core/interfaces';
import { MENU_SECTIONS } from '@core/constants';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, TranslateModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements AfterViewInit {
  private router = inject(Router);

  readonly logoText = 'Aura POS - V2';
  readonly version = 'v1.0.0';
  private readonly breakpoint = 768;

  readonly isCollapsed = signal(false);

  readonly menuSections: MenuSectionItem[] = MENU_SECTIONS;

  ngAfterViewInit(): void {
    setTimeout(() => this.openIf(this.menuSections));
    this.resize();
  }

  openIf(sections: MenuSectionItem[]): void {
    sections.forEach((section) => {
      const routes = section.items.map((item) => '/' + item.route);
      section.expanded = routes.includes(this.router.url);
      if (section.expanded) {
        section.items.forEach((item) => {
          item.expanded = true;
        });
      }
    });
  }

  toggleCollapse(): void {
    this.isCollapsed.update((v) => !v);
    if (this.isCollapsed()) {
      this.openIf(this.menuSections);
    }
  }

  toggleSection(section: MenuSectionItem): void {
    if (this.isCollapsed()) return;
    section.expanded = !section.expanded;
  }

  openSection(section: MenuSectionItem): void {
    if (this.isCollapsed()) return;
    section.expanded = true;
  }

  toggleExpand(item: MenuItem): void {
    if (this.isCollapsed()) return;
    if (item.children) {
      item.expanded = !item.expanded;
    }
  }

  navigate(route: string | undefined): void {
    if (route) {
      this.router.navigate([route]);
    }
  }

  isActive(route: string | undefined): boolean {
    if (!route) return false;
    return this.router.url === '/' + route;
  }

  @HostListener('window:resize')
  resize(): void {
    if (window.innerWidth < this.breakpoint) {
      this.isCollapsed.set(true);
    } else {
      this.isCollapsed.set(false);
    }
  }
}

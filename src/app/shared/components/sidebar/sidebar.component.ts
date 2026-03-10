import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  route?: string;
  children?: MenuItem[];
  expanded?: boolean;
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  private router = inject(Router);

  readonly logoText = 'Aura POS - V2';
  readonly version = 'v1.0.0';

  readonly menuSections: { title: string; items: MenuItem[] }[] = [
    {
      title: 'Inicio',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: 'chart',
          route: '/dashboard',
        },
      ],
    },
    {
      title: 'Ventas',
      items: [
        { id: 'sales', label: 'Punto de Venta', icon: 'cart', route: '/sales' },
        { id: 'customers', label: 'Clientes', icon: 'users', route: '/customers' },
      ],
    },
    {
      title: 'Inventario',
      items: [
        { id: 'inventory', label: 'Productos', icon: 'box', route: '/inventory' },
        { id: 'reports', label: 'Reportes', icon: 'report', route: '/reports' },
      ],
    },
    {
      title: 'Equipo',
      items: [
        { id: 'team', label: 'Equipo', icon: 'users', route: '/team' },
        { id: 'chat', label: 'Chat', icon: 'chat', route: '/team/chat' },
      ],
    },
    {
      title: 'Admin',
      items: [
        {
          id: 'admin',
          label: 'Administración',
          icon: 'admin',
          route: '/admin',
          children: [
            { id: 'users', label: 'Usuarios', route: '/admin/users' },
            { id: 'roles', label: 'Roles', route: '/admin/roles' },
          ],
        },
      ],
    },
    {
      title: 'Config',
      items: [{ id: 'settings', label: 'Configuración', icon: 'settings', route: '/settings' }],
    },
  ];

  toggleExpand(item: MenuItem): void {
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
    return this.router.url.startsWith(route);
  }
}

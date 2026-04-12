import { CATALOG, DASHBOARD, POS } from './routes';
import { MenuSectionItem } from '@core/interfaces';

export const MENU_SECTIONS: MenuSectionItem[] = [
  {
    title: 'NAV.PRIMARY.TITLE',
    items: [
      {
        id: 'dashboard',
        label: 'NAV.PRIMARY.DASHBOARD',
        icon: 'chart',
        route: `${DASHBOARD}`,
      },
      {
        id: 'pos',
        label: 'NAV.PRIMARY.POS',
        icon: 'chart',
        route: `${POS}`,
      },
    ],
  },
  {
    title: 'NAV.CATALOG.TITLE',
    items: [
      {
        id: 'products',
        label: 'NAV.CATALOG.PRODUCTS',
        icon: 'box',
        route: `${CATALOG.ROOT}/${CATALOG.PRODUCTS}`,
      },
      {
        id: 'categories',
        label: 'NAV.CATALOG.CATEGORIES',
        icon: 'th-large',
        route: `${CATALOG.ROOT}/${CATALOG.CATEGORIES}`,
      },
      {
        id: 'brands',
        label: 'NAV.CATALOG.BRANDS',
        icon: 'tag',
        route: `${CATALOG.ROOT}/${CATALOG.BRANDS}`,
      },
      {
        id: 'units',
        label: 'NAV.CATALOG.UNITS',
        icon: 'chart-bar',
        route: `${CATALOG.ROOT}/${CATALOG.UNITS}`,
      },
      {
        id: 'presentations',
        label: 'NAV.CATALOG.PRESENTATIONS',
        icon: 'sitemap',
        route: `${CATALOG.ROOT}/${CATALOG.PRESENTATIONS}`,
      },
      {
        id: 'compositions',
        label: 'NAV.CATALOG.COMPOSITIONS',
        icon: 'cog',
        route: `${CATALOG.ROOT}/${CATALOG.COMPOSITIONS}`,
      },
      {
        id: 'labels',
        label: 'NAV.CATALOG.LABELS',
        icon: 'tag',
        route: `${CATALOG.ROOT}/${CATALOG.LABELS}`,
      },
    ],
  },
  {
    title: 'NAV.ADMIN',
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

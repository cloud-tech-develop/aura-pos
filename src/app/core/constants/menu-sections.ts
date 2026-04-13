import { CATALOG, DASHBOARD, POS } from './routes';
import { MenuSectionItem } from '@core/interfaces';

export const MENU_SECTIONS: MenuSectionItem[] = [
  {
    title: 'NAV.PRIMARY.TITLE',
    icon: 'home',
    items: [
      {
        id: 'dashboard',
        label: 'NAV.PRIMARY.DASHBOARD',
        icon: 'home',
        route: `${DASHBOARD}`,
      },
      {
        id: 'pos',
        label: 'NAV.PRIMARY.POS',
        icon: 'shopping-cart',
        route: `${POS}`,
      },
    ],
  },
  {
    title: 'NAV.CATALOG.TITLE',
    icon: 'box',
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
    icon: 'prime',
    items: [
      {
        id: 'admin',
        label: 'Administración',
        icon: 'prime',
        route: 'admin',
        children: [
          { id: 'users', label: 'Usuarios', route: 'admin/users' },
          { id: 'roles', label: 'Roles', route: 'admin/roles' },
        ],
      },
    ],
  },
  {
    title: 'Config',
    icon: 'wrench',
    items: [{ id: 'settings', label: 'Configuración', icon: 'wrench', route: 'settings' }],
  },
];

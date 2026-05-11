import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'products',
    loadComponent: () =>
      import('@module-catalog/products/ui/index-products/index-products').then(
        (m) => m.IndexProducts,
      ),
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('@module-catalog/categories/ui/index-categories/index-categories').then(
        (m) => m.IndexCategories,
      ),
  },
  {
    path: 'brands',
    loadComponent: () =>
      import('@module-catalog/brands/ui/index-brands/index-brands').then((m) => m.IndexBrands),
  },
  {
    path: 'units',
    loadComponent: () =>
      import('@module-catalog/units/ui/index-units/index-units').then((m) => m.IndexUnits),
  },
  {
    path: 'presentations',
    loadComponent: () =>
      import('@module-catalog/presentations/ui/index-presentations/index-presentations').then(
        (m) => m.IndexPresentations,
      ),
  },
  {
    path: 'compositions',
    loadComponent: () =>
      import('@module-catalog/compositions/ui/index-compositions/index-compositions').then(
        (m) => m.IndexCompositions,
      ),
  },
  {
    path: 'labels',
    loadComponent: () =>
      import('@module-catalog/labels/ui/index-labels/index-labels').then((m) => m.IndexLabels),
  },
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatalogRoutingModule {}

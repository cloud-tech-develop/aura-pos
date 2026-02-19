# Ejemplo de Uso: Generar Módulo de Inventario

## Comando

```bash
/generate-module moduleName="inventory" features=["products", "categories", "suppliers"]
```

## Resultado

### 1. Archivo de Routing Creado

**src/app/modules/inventory/inventory-routing.module.ts:**

```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'products',
    loadComponent: () =>
      import('@module-inventory/products/ui/index-products/index-products')
        .then((m) => m.IndexProducts),
  },
  {
    path: 'categories',
    loadComponent: () =>
      import('@module-inventory/categories/ui/index-categories/index-categories')
        .then((m) => m.IndexCategories),
  },
  {
    path: 'suppliers',
    loadComponent: () =>
      import('@module-inventory/suppliers/ui/index-suppliers/index-suppliers')
        .then((m) => m.IndexSuppliers),
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
export class InventoryRoutingModule {}
```

### 2. Estructura de Carpetas Generada

```
src/app/modules/inventory/
├── inventory-routing.module.ts
├── products/
│   ├── ui/
│   │   ├── components/
│   │   │   └── .gitkeep
│   │   └── index-products/
│   │       ├── index-products.ts
│   │       ├── index-products.html
│   │       └── index-products.css
│   ├── interfaces/
│   │   └── index.ts
│   └── services/
│       └── index.ts
├── categories/
│   ├── ui/
│   │   ├── components/
│   │   │   └── .gitkeep
│   │   └── index-categories/
│   │       ├── index-categories.ts
│   │       ├── index-categories.html
│   │       └── index-categories.css
│   ├── interfaces/
│   │   └── index.ts
│   └── services/
│       └── index.ts
└── suppliers/
    ├── ui/
    │   ├── components/
    │   │   └── .gitkeep
    │   └── index-suppliers/
    │       ├── index-suppliers.ts
    │       ├── index-suppliers.html
    │       └── index-suppliers.css
    ├── interfaces/
    │   └── index.ts
    └── services/
        └── index.ts
```

### 3. Actualización de tsconfig.json

```json
{
  "compilerOptions": {
    "paths": {
      "@module-inventory/*": ["./src/app/modules/inventory/*"]
    }
  }
}
```

### 4. Actualización de app.routes.ts

```typescript
{
  path: 'inventory',
  loadChildren: () =>
    import('@module-inventory/inventory-routing.module')
      .then((m) => m.InventoryRoutingModule),
},
```

### 5. Ejemplo de Componente Generado

**src/app/modules/inventory/products/ui/index-products/index-products.ts:**

```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-index-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './index-products.html',
  styleUrl: './index-products.css',
})
export class IndexProducts {
  // Component logic here
}
```

**src/app/modules/inventory/products/ui/index-products/index-products.html:**

```html
<div class="products-container">
  <h1>Products</h1>
  <p>inventory - products page</p>
</div>
```

**src/app/modules/inventory/products/ui/index-products/index-products.css:**

```css
.products-container {
  padding: 1rem;
}
```

## URLs Resultantes

- `/inventory` → redirige a `/inventory/products`
- `/inventory/products` → IndexProducts
- `/inventory/categories` → IndexCategories
- `/inventory/suppliers` → IndexSuppliers

## Validación

Después de ejecutar el comando, verifica:

```bash
npm run build
```

Deberías ver en la salida:
```
Lazy chunk files:
...
chunk-XXXXXXXX.js    index-products
chunk-XXXXXXXX.js    index-categories
chunk-XXXXXXXX.js    index-suppliers
chunk-XXXXXXXX.js    inventory-routing-module
```

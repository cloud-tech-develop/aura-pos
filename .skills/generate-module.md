# Angular Module Generator

Generate Angular modules following the Aura POS normalized architecture with lazy loading, NgModules, and consistent folder structure.

## Example Usage

**Slash command:**
```
/generate-module
```

**Natural language:**
- "Create a new module called inventory with features: products, categories, and suppliers"
- "Generate module sales with pages: point-of-sale and clients"
- "Create module reports with features: dashboard and analytics"

## Parameters

- `moduleName` (string, required): Name of the module in kebab-case (e.g., 'point-of-sale', 'inventory-management')
- `features` (array of strings, required): List of feature names within the module (e.g., ['products', 'categories'])

## File Changes

### 1. Module Routing File
**Path:** `src/app/modules/{{moduleName}}/{{moduleName}}-routing.module.ts`

```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {{#each features}}
  {
    path: '{{this}}',
    loadComponent: () =>
      import('@module-{{../moduleName}}/{{this}}/ui/index-{{this}}/index-{{this}}')
        .then((m) => m.Index{{pascalCase this}}),
  },
  {{/each}}
  {
    path: '',
    redirectTo: '{{features.[0]}}',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class {{pascalCase moduleName}}RoutingModule {}
```

### 2. App Routes Update
**Path:** `src/app/app.routes.ts`

Add the following route to the children array:

```typescript
{
  path: '{{moduleName}}',
  loadChildren: () =>
    import('@module-{{moduleName}}/{{moduleName}}-routing.module')
      .then((m) => m.{{pascalCase moduleName}}RoutingModule),
},
```

### 3. Feature Component Files

For each feature in `features`, create:

**Component:** `src/app/modules/{{moduleName}}/{{feature}}/ui/index-{{feature}}/index-{{feature}}.ts`
```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-index-{{feature}}',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './index-{{feature}}.html',
  styleUrl: './index-{{feature}}.css',
})
export class Index{{pascalCase feature}} {
  // Component logic here
}
```

**Template:** `src/app/modules/{{moduleName}}/{{feature}}/ui/index-{{feature}}/index-{{feature}}.html`
```html
<div class="{{feature}}-container">
  <h1>{{titleCase feature}}</h1>
  <p>{{moduleName}} - {{feature}} page</p>
</div>
```

**Styles:** `src/app/modules/{{moduleName}}/{{feature}}/ui/index-{{feature}}/index-{{feature}}.css`
```css
.{{feature}}-container {
  padding: 1rem;
}
```

### 4. Supporting Files (per feature)

**Interfaces barrel:** `src/app/modules/{{moduleName}}/{{feature}}/interfaces/index.ts`
```typescript
// Exportar interfaces del módulo {{moduleName}} - {{feature}}
```

**Services barrel:** `src/app/modules/{{moduleName}}/{{feature}}/services/index.ts`
```typescript
// Exportar servicios del módulo {{moduleName}} - {{feature}}
```

**Components folder:** `src/app/modules/{{moduleName}}/{{feature}}/ui/components/.gitkeep`

## Instructions

1. Validate that `moduleName` is in kebab-case format
2. Validate that `features` array has at least one item
3. Check if `src/app/modules/{{moduleName}}` already exists - if so, error out
4. Check if path alias `@module-{{moduleName}}/*` exists in `tsconfig.json` - if not, add it
5. Create all directories and files as specified above
6. Import the routing module correctly in `app.routes.ts`
7. Verify the build compiles successfully

## Naming Conventions

- Module file: `{module}-routing.module.ts`
- Routing class: `{Module}RoutingModule`
- Component class: `Index{Feature}` (no "Component" suffix)
- Component selector: `app-index-{feature}`
- Component files: `index-{feature}.{ts,html,css}`
- Path alias: `@module-{module}/*`

## Validation Steps

After generating the module:
1. Run `npm run build` to verify compilation
2. Check that lazy chunks are generated for the new module
3. Verify routing works by navigating to `/{moduleName}` in the browser
4. Confirm the default redirect works (should redirect to first feature)

## Example

**Input:**
```json
{
  "moduleName": "inventory",
  "features": ["products", "categories", "suppliers"]
}
```

**Generated Structure:**
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

**tsconfig.json addition:**
```json
"@module-inventory/*": ["./src/app/modules/inventory/*"]
```

**app.routes.ts addition:**
```typescript
{
  path: 'inventory',
  loadChildren: () =>
    import('@module-inventory/inventory-routing.module')
      .then((m) => m.InventoryRoutingModule),
},
```

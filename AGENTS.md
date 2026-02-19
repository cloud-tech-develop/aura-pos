# AGENTS.md - Aura POS Coding Guidelines

## Build, Test & Lint Commands

```bash
# Development
npm start                    # Start dev server (default port 4200)
npm run watch               # Build with watch mode

# Production
npm run build               # Production build (optimized)
npm run build -- --configuration development  # Dev build

# Testing
npm test                    # Run all unit tests (Karma + Jasmine)
npm test -- --include='**/theme.service.spec.ts'  # Single test file
npm test -- --include='**/header.component.spec.ts' --watch=false  # Single test once
ng test --include='**/sales/**'  # All tests in sales module

# Note: No ESLint configured. Code style enforced via Prettier + TypeScript strict mode
```

## Import Guidelines

**Use path aliases for cross-module imports:**
```typescript
// ✅ Aliased imports (preferred)
import { MainLayoutComponent } from '@shared/components/main-layout/main-layout.component';
import { PointOfSaleService } from '@module-sales/point-of-sale/services/point-of-sale.service';

// ✅ Relative imports (same feature only)
import { Product } from '../interfaces/product.interface';
import { PointOfSaleService } from '../services/point-of-sale.service';

// ❌ Deep relative imports (avoid)
import { ThemeService } from '../../../core/services/theme.service';
```

**Available path aliases:**
- `@environment/*` - Environment configs
- `@store/*` - State management
- `@core/*` - Core services, models
- `@shared/*` - Shared components, utils
- `@module-{name}/*` - Module-specific code (admin, customers, dashboard, inventory, reports, sales, settings)

## Formatting Rules

**Prettier configuration (from package.json):**
- Print width: 100 characters
- Single quotes: true
- HTML parser: angular

**EditorConfig:**
- Indent: 2 spaces (no tabs)
- Charset: UTF-8
- Trim trailing whitespace: true
- Insert final newline: true

**TypeScript strict mode is ENABLED:**
- `strict: true`
- `noImplicitOverride: true`
- `noImplicitReturns: true`
- Avoid `any` type; use `unknown` when uncertain

## Angular Best Practices

**Components:**
- Standalone components (Angular 21 default - do NOT add `standalone: true`)
- Use `input()` and `output()` functions instead of decorators
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in all components
- Keep components small and single-responsibility
- Use inline templates for small components (< 10 lines)

**State Management:**
```typescript
// ✅ Use signals for state
readonly count = signal<number>(0);
readonly doubled = computed(() => this.count() * 2);

// ✅ Service injection
private router = inject(Router);
private posService = inject(PointOfSaleService);

// ❌ No constructor injection
constructor(private router: Router) {}
```

**Templates:**
- Use native control flow: `@if`, `@for`, `@switch`
- Avoid `*ngIf`, `*ngFor`, `*ngSwitch`
- Avoid `ngClass`, use `class` bindings: `[class.active]="isActive()"`
- Avoid `ngStyle`, use `style` bindings: `[style.color]="color()"`

**Services:**
- Singleton services with `providedIn: 'root'`
- Use `inject()` function
- One responsibility per service

## Naming Conventions

**Files:**
- Components: `name.component.ts` (e.g., `header.component.ts`)
- Services: `name.service.ts` (e.g., `theme.service.ts`)
- Interfaces: `name.interface.ts` (e.g., `product.interface.ts`)
- Routes: `name-routing.module.ts` (e.g., `sales-routing.module.ts`)
- Index barrels: `index.ts` or `index-feature.ts`

**Classes:**
- Components: `HeaderComponent`, `ThemePanelComponent`
- Services: `ThemeService`, `PointOfSaleService`
- Interfaces: `Product`, `CartItem` (no I-prefix)
- Index components: `IndexPointOfSale`, `IndexProducts`

**Selectors:**
- Standard: `app-header`, `app-theme-panel`
- Index components: `app-index-point-of-sale`

**Variables/Methods:**
- Signals: descriptive names (e.g., `cartItems`, `currentUser`)
- Private methods: camelCase with underscore prefix `_calculateTotal()`
- Constants: UPPER_SNAKE_CASE for true constants

## Error Handling

```typescript
// ✅ Handle errors in services
saveTheme(): void {
  const theme = this.getCurrentTheme();
  this.http.post('/api/theme', theme).pipe(
    catchError((error) => {
      console.warn('Failed to save theme:', error);
      return of(null);
    })
  ).subscribe();
}

// ✅ Use type guards
type ColorPalette = 'base' | 'yellow' | 'green' | 'blue' | 'orange' | 'red' | 'violet';

// ✅ Handle platform-specific code
if (isPlatformBrowser(this.platformId)) {
  localStorage.setItem('key', value);
}
```

## File Structure Conventions

**Module structure:**
```
src/app/modules/{module-name}/
├── {module-name}-routing.module.ts
├── {feature}/
│   ├── ui/
│   │   ├── components/          # Feature-specific components
│   │   └── index-{feature}/     # Main page component
│   │       ├── index-{feature}.ts
│   │       ├── index-{feature}.html
│   │       └── index-{feature}.css
│   ├── interfaces/
│   │   └── index.ts             # Export interfaces
│   └── services/
│       └── index.ts             # Export services
```

**Core/Shared structure:**
```
src/app/core/          # Singleton services, models
src/app/shared/        # Shared components, directives, pipes
```

## Lazy Loading Pattern

**Root routes (app.routes.ts):**
```typescript
{
  path: 'sales',
  loadChildren: () =>
    import('@module-sales/sales-routing.module')
      .then((m) => m.SalesRoutingModule),
}
```

**Module routes (*-routing.module.ts):**
```typescript
{
  path: 'products',
  loadComponent: () =>
    import('@module-inventory/products/ui/index-products/index-products')
      .then((m) => m.IndexProducts),
}
```

## Styling with Tailwind CSS

- Use Tailwind classes for styling
- Custom theme variables in `styles.css` (CSS custom properties)
- Dark mode: `class` strategy (toggle `.dark` class on html element)
- Component styles should stay under 4KB budget

## Additional Notes

- PrimeNG v21 available for UI components
- RxJS for async operations (use async pipe in templates)
- Zone.js still enabled (default Angular behavior)
- No NgModules for components (standalone only)
- No `@HostBinding`/`@HostListener` decorators (use `host` object instead)
- Use `NgOptimizedImage` for all static images

## References

- Cursor rules: `.cursor/rules/cursor.mdc`
- Copilot instructions: `.github/copilot-instructions.md`
- Prettier config: `package.json` (prettier section)
- TypeScript config: `tsconfig.json`
- Angular config: `angular.json`

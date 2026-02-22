# AGENTS.md - Aura POS Coding Guidelines

## Build, Test & Lint Commands

```bash
# Development
npm start                    # Start dev server (default port 4200)
npm run watch               # Build with watch mode

# Production
npm run build               # Production build (optimized)
npm run build -- --configuration development  # Dev build

# Testing (Unit)
npm test                    # Run all unit tests (Karma + Jasmine)
npm test -- --include='**/theme.service.spec.ts'  # Single test file
npm test -- --include='**/header.component.spec.ts' --watch=false  # Single test once
ng test --include='**/sales/**'  # All tests in sales module

# Testing (E2E with Playwright)
npm run e2e              # Run all e2e tests
npm run e2e:ui          # Run e2e tests with UI
npm run e2e:headed      # Run e2e with visible browser
npm run e2e:report      # Show HTML report

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
- `@store/*` - State management (NgRx SignalStore)
- `@services/*` - Global services
- `@core/*` - Core interfaces (exported from `@core/interfaces/index.ts`)
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

> **IMPORTANT:** This project uses **Angular 21 with Zoneless Change Detection**. Zone.js has been removed from the application. All change detection is handled automatically through **Signals**.

**Components:**
- Standalone components (Angular 21 default - do NOT add `standalone: true`)
- Use `input()` and `output()` functions instead of decorators
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in all components
- Keep components small and single-responsibility
- Use inline templates for small components (< 10 lines)

**State Management (Signals - Required):**
```typescript
// ✅ Signals are REQUIRED for all component state
readonly count = signal<number>(0);
readonly doubled = computed(() => this.count() * 2);

// ✅ Use signal effects for side effects
effect(() => {
  console.log('Count changed:', this.count());
});

// ✅ Service injection
private router = inject(Router);
private posService = inject(PointOfSaleService);

// ❌ No constructor injection
constructor(private router: Router) {}
```

**Zoneless Change Detection:**
```typescript
// ✅ In app.config.ts - use provideZonelessChangeDetection
import { provideZonelessChangeDetection } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    // ...other providers
  ]
};

// ✅ Components update automatically when signals change
// No need for manual detectChanges() calls

// ✅ Use input signals for component inputs
readonly myInput = input<string>('');
readonly myRequiredInput = input.required<string>();
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
src/app/
├── core/
│   ├── constants/     # App constants (exported in index.ts)
│   ├── guards/        # Route guards (exported in index.ts)
│   ├── interceptors/  # HTTP interceptors (exported in index.ts)
│   ├── interfaces/    # TypeScript interfaces (exported in index.ts)
│   ├── mocks/         # Mock data for development (exported in index.ts)
│   ├── pipes/         # Custom pipes (exported in index.ts)
│   └── validators/    # Form validators (exported in index.ts)
├── services/          # Global services
├── shared/            # Shared components, directives, pipes
└── store/             # NgRx SignalStore state management
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
- **Zone.js REMOVED** - This project uses Zoneless Change Detection with Signals
- No NgModules for components (standalone only)
- No `@HostBinding`/`@HostListener` decorators (use `host` object instead)
- Use `NgOptimizedImage` for all static images

## Internationalization (i18n)

This project uses **ngx-translate** for runtime internationalization with support for dynamic language switching.

### Structure

```

├── public/
│   └── assets/
│       └── i18n/
│           ├── en.json          # English 
│           └── es.json          # Spanish (default)
├── src/  # Angular source code
│   └── app/
│       └── services/
│           └── translation.service.ts  # Translation service with signals
```

### Configuration

The i18n is configured in `app.config.ts`:
- `provideTranslateHttpLoader()` - Configures the HTTP loader for translation files
- Translation files are loaded from `assets/i18n/`
- Default languages: `en` (English), `es` (Spanish)

### Translation Service

The `TranslationService` provides signals for language management:

```typescript
import { TranslationService } from '@services/translation.service';

@Component({...})
export class MyComponent {
  private i18n = inject(TranslationService);

  // Signal con el idioma actual
  readonly currentLang = this.i18n.currentLanguage;

  // Cambiar idioma
  setLanguage(lang: 'en' | 'es'): void {
    this.i18n.setLanguage(lang);
  }
}
```

### Usage in Templates

**Basic translation:**
```html
<!-- Pipe approach (recommended for simple cases) -->
<h1>{{ 'HOME.TITLE' | translate }}</h1>
<button>{{ 'COMMON.SAVE' | translate }}</button>
```

**With parameters:**
```html
<!-- Translation file: { "HELLO": "Hello {{name}}!" } -->
<p>{{ 'HELLO' | translate:{ name: 'John' } }}</p>
```

### Usage in TypeScript

```typescript
import { TranslationService } from '@services/translation.service';
import { computed, inject } from '@angular/core';

@Component({...})
export class MyComponent {
  private i18n = inject(TranslationService);

  // Inmediate translation (for computed values)
  readonly pageTitle = this.i18n.get('HOME.TITLE');

  // Reactive translation with computed
  readonly welcomeMessage = computed(() => 
    this.i18n.get('HELLO', { name: this.userName() })
  );
}
```

### Adding New Languages

1. Create a new JSON file in `src/assets/i18n/` (e.g., `fr.json`)
2. Add the language to `TranslationService.availableLanguages`
3. Use the language switcher to change

### Translation File Structure

Use nested keys for organization:

```json
{
  "COMMON": {
    "SAVE": "Save",
    "CANCEL": "Cancel",
    "DELETE": "Delete"
  },
  "NAV": {
    "DASHBOARD": "Dashboard",
    "SALES": "Sales"
  },
  "MODULE_NAME": {
    "FEATURE": "Feature text"
  }
}
```

### Best Practices

- Use semantic keys: `COMMON.SAVE` not `SAVE_BUTTON`
- Group by feature/module
- Use parameters for dynamic values: `{{ 'MSG' | translate:{ count: 5 } }}`
- Avoid concatenating translations
- Keep translations in sync across all language files

## Agent Ecosystem

The project utilizes a specialized agent architecture to manage development and quality assurance effectively.

### Specialized Agents

| Agent | Responsibility | Key Skills / Tools |
| :--- | :--- | :--- |
| **Primary Manager** | Orchestrates the workflow between sub-agents and user. | Delegation, Strategy, Skill selection. |
| **QA Agent** | Requirements, Epics, User Stories, and Acceptance Criteria. | Requirement analysis, Docs templates. |
| **DEV Agent** | Implementation of features and bug fixes in Angular. | Clean Architecture, PrimeNG, Services. |
| **TEST Agent** | Automated Unit and E2E testing. | Karma, Jasmine, Playwright, Regression. |
| **UI Optimizer** | Validates, optimizes, and rewrites the UI if necessary. | UI validation, Optimization, Rewriting. |

### Development Workflow

For complex tasks, the following lifecycle is recommended:

1.  **Requirement Definition**: `@qa-agent` documents the feature objectives and acceptance criteria in the `docs/templates/` folder.
2.  **Implementation**: `@dev-agent` builds the component or service following the architectural patterns (separating API logic from business logic).
3.  **Automated Testing**: `@test-agent` generates coverage and integration tests.
4.  **UI Optimization**: `@ui-optimizer` validates, optimizes, and rewrites the UI if necessary.
5.  **Final Validation**: `@qa-agent` verifies the results against the initial requirements.

## References

- Cursor rules: `.cursor/rules/cursor.mdc`
- Copilot instructions: `.github/copilot-instructions.md`
- Prettier config: `package.json` (prettier section)
- TypeScript config: `tsconfig.json`
- Angular config: `angular.json`
- Workflows: `.agent/workflows/`

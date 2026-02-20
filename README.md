# Aura POS

Sistema de Punto de Venta desarrollado con Angular 21 + NgRx Signals.

## Tech Stack

- **Angular 21** con Zoneless Change Detection
- **NgRx SignalStore** para state management
- **PrimeNG** para componentes UI
- **Tailwind CSS** para estilos
- **Playwright** para tests E2E

## Getting Started

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start
```

Navegar a `http://localhost:4200/`

## Comandos

```bash
# Desarrollo
npm start              # Servidor dev (puerto 4200)
npm run watch          # Build con watch mode

# Production
npm run build          # Build optimizado

# Testing (Unit)
npm test               # Karma + Jasmine

# Testing (E2E)
npm run e2e           # Playwright tests
npm run e2e:ui        # UI interactiva
npm run e2e:headed    # Navegador visible
npm run e2e:report    # Ver reporte HTML
```

## Estructura

```
src/app/
├── core/              # Interfaces, guards, interceptors, pipes, validators, mocks
├── services/         # Servicios globales
├── shared/           # Componentes compartidos
├── store/            # NgRx SignalStore
└── modules/          # Módulos lazy-loaded
```

## Docs

- [Store Documentation](src/app/store/README.md)
- [Coding Guidelines](AGENTS.md)

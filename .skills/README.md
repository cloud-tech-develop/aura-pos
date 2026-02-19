# Skills Disponibles

Esta carpeta contiene skills personalizadas para opencode.

## generate-module

Genera módulos Angular siguiendo la arquitectura normalizada de Aura POS.

**Uso:**
```
/generate-module moduleName="inventory" features=["products", "categories"]
```

O en lenguaje natural:
```
Crea un nuevo módulo llamado inventory con las páginas products, categories y suppliers
```

**Estructura generada:**
- `{modulo}-routing.module.ts` con NgModule y lazy loading
- `{feature}/ui/index-{feature}/` con componente Index{Feature}
- `{feature}/interfaces/index.ts` y `{feature}/services/index.ts`
- Actualización automática de `app.routes.ts` y `tsconfig.json`

**Convenciones:**
- Routing class: `{Module}RoutingModule`
- Component class: `Index{Feature}` (sin sufijo "Component")
- Path alias: `@module-{module}/*`

Consulta el archivo [generate-module.md](./generate-module.md) para más detalles.

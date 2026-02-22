# HU-AUTH-001 - Inicio de Sesión (Login)

## 📌 Información General
- ID: HU-AUTH-001
- Epic: EPIC-AUTH-001
- Prioridad: Alta
- Estado: In Progress
- Porcentaje: 30%
- Autor: QA Agent
- Fecha: 2026-02-22

---

## 👤 Historia de Usuario

**Como** usuario del sistema Aura POS  
**Quiero** iniciar sesión con mis credenciales (email y password)  
**Para** acceder de forma segura al dashboard y funcionalidades del sistema

---

## 🧠 Descripción Funcional

El componente de Login permite a los usuarios autenticarse en el sistema Aura POS mediante un formulario que solicita email/username y contraseña. El sistema valida las credenciales contra el backend, y en caso de éxito, guarda la sesión mediante el `UserSessionStore` y redirecciona al dashboard.

**Características actuales (referencia):**
- Componente `IndexLogin` con signals para email, password, isLoading, errorMessage
- Servicios `AuthService` y `AuthApiService` ya implementados
- Integración con ToastAlertService para notificaciones toast

**Mejoras requeridas:**
- Migración de FormsModule (ngModel) a Reactive Forms
- Validación de formulario con mensajes de error específicos
- Mejor manejo de errores de red
- Integración con `UserSessionStore` para guardar sesión

---

## ✅ Criterios de Aceptación

### Escenario 1: Login exitoso
- **Dado que** el usuario ha introducido credenciales válidas
- **Cuando** hace clic en el botón "Iniciar Sesión" o presiona Enter
- **Entonces** el sistema muestra el estado de carga
- **Y** posteriormente muestra un toast de éxito
- **Y** redirecciona al usuario a `/dashboard`
- **Y** la sesión se guarda mediante `UserSessionStore.login(user, token)`

### Escenario 2: Login con credenciales inválidas
- **Dado que** el usuario ha introducido email o password incorrectos
- **Cuando** hace clic en el botón "Iniciar Sesión"
- **Entonces** el sistema muestra estado de carga
- **Y** posteriormente muestra un toast de error con el mensaje "Credenciales inválidas"
- **Y** el usuario permanece en la página de login
- **Y** los campos del formulario no se limpian

### Escenario 3: Login con email vacío
- **Dado que** el usuario deja el campo email vacío
- **Cuando** hace clic en el botón "Iniciar Sesión"
- **Entonces** el sistema muestra mensaje de error "El email es requerido"
- **Y** el botón de submit está deshabilitado o muestra error de validación

### Escenario 4: Login con email inválido
- **Dado que** el usuario introduce un email con formato inválido (ej: "usuario")
- **Cuando** hace clic en el botón "Iniciar Sesión" o pierde el foco del campo
- **Entonces** el sistema muestra mensaje de error "El email debe tener un formato válido"

### Escenario 5: Login con password vacío
- **Dado que** el usuario deja el campo password vacío
- **Cuando** hace clic en el botón "Iniciar Sesión"
- **Entonces** el sistema muestra mensaje de error "La contraseña es requerida"
- **Y** el botón de submit está deshabilitado o muestra error de validación

### Escenario 6: Error de red
- **Dado que** hay un problema de conexión con el servidor
- **Cuando** el usuario intenta iniciar sesión
- **Entonces** el sistema muestra un toast de error "Error de conexión. Intente más tarde"
- **Y** el usuario permanece en la página de login

### Escenario 7: Estado de carga durante autenticación
- **Dado que** el usuario ha enviado el formulario de login
- **Cuando** la solicitud está en progreso
- **Entonces** el botón de submit muestra un indicador de carga (spinner)
- **Y** los campos de email y password están deshabilitados
- **Y** no se puede enviar el formulario nuevamente

---

## ❌ Casos de Error

| Código | Descripción | Mensaje Toast |
|--------|-------------|---------------|
| 401 | Credenciales inválidas | `AUTH.LOGIN.ERROR_INVALID_CREDENTIALS` |
| 0 | Error de red/conexión | `AUTH.LOGIN.ERROR_NETWORK` |
| 500 | Error interno del servidor | `AUTH.LOGIN.ERROR_SERVER` |
| 403 | Usuario inactivo/bloqueado | `AUTH.LOGIN.ERROR_USER_INACTIVE` |

---

## 🔐 Reglas de Negocio

- El email debe ser un campo requerido y válido
- La contraseña debe ser un campo requerido (mínimo 1 carácter)
- **El token se guarda mediante `UserSessionStore.login(user, token)`**
- **NO usar localStorage directamente - el store maneja la persistencia**
- La sesión debe mantenerse activa entre recargas de página
- El tiempo de expiración del token es manejado por el backend

---

## 🎨 Consideraciones UI/UX

### Validaciones Visuales
- Bordes de color rojo en campos inválidos
- Mensajes de error debajo de cada campo
- Icono de alerta en campos con error

### Mensajes (i18n)
Las siguientes claves de traducción deben estar definidas:
```
AUTH.LOGIN.TITLE = "Iniciar Sesión"
AUTH.LOGIN.EMAIL = "Correo electrónico"
AUTH.LOGIN.PASSWORD = "Contraseña"
AUTH.LOGIN.SUBMIT = "Iniciar Sesión"
AUTH.LOGIN.ERROR_INVALID_CREDENTIALS = "Credenciales inválidas"
AUTH.LOGIN.ERROR_NETWORK = "Error de conexión. Intente más tarde"
AUTH.LOGIN.ERROR_SERVER = "Error del servidor. Intente más tarde"
AUTH.LOGIN.ERROR_USER_INACTIVE = "Usuario inactivo o bloqueado"
AUTH.LOGIN.VALIDATION_EMAIL_REQUIRED = "El correo electrónico es requerido"
AUTH.LOGIN.VALIDATION_EMAIL_INVALID = "El correo electrónico debe tener un formato válido"
AUTH.LOGIN.VALIDATION_PASSWORD_REQUIRED = "La contraseña es requerida"
AUTH.LOGIN.SUCCESS = "Bienvenido al sistema"
```

### Estados Loading
- Spinner en el botón de submit
- Opacidad reducida en el formulario durante carga
- Cursor "wait" en el botón

### Accesibilidad
- Labels asociados a los inputs
- Mensajes de error leídos por screen readers
- Focus automático en el campo de email al cargar

---

## 📡 Requisitos Técnicos

### Endpoint
- **URL**: `${environment.apiUrl}/auth/login`
- **Método HTTP**: POST
- **Headers**: `Content-Type: application/json`

### Request
```typescript
interface LoginRequest {
  username: string;  // Email del usuario
  password: string;
}
```

### Response
```typescript
interface LoginResponse {
  error: boolean;
  message: string;
  data?: {
    token: string;
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    };
    expiresIn: number;  // Segundos hasta expiración
  };
}
```

### Códigos de Error
| Código | Significado |
|--------|-------------|
| 200 | Login exitoso |
| 401 | Credenciales inválidas |
| 403 | Usuario inactivo/bloqueado |
| 500 | Error interno del servidor |
| 0 | Error de red |

---

## 🧪 Criterios de Testing

### Unit Tests (Karma + Jasmine)
- Verificar que el formulario valida email requerido
- Verificar que el formulario valida email con formato válido
- Verificar que el formulario valida password requerido
- Verificar que se muestra estado de carga durante autenticación
- Verificar que se llama `UserSessionStore.login()` tras login exitoso
- Verificar redirección a /dashboard tras login exitoso
- Verificar manejo de errores (credenciales inválidas, error de red)

### Integration Tests
- Verificar flujo completo de login exitoso
- Verificar flujo de login con credenciales inválidas

### E2E (Playwright)
- login-exitoso.spec.ts - Verificar login con credenciales válidas
- login-invalido.spec.ts - Verificar mensaje de error con credenciales inválidas
- login-red.spec.ts - Verificar manejo de error de red

---

## 📎 Dependencias

### Servicios
- `AuthService` - Servicio de negocio para autenticación
- `AuthApiService` - Servicio API para llamadas HTTP
- `ToastAlertService` - Servicio de notificaciones toast
- **`UserSessionStore`** - Store de NgRx SignalStore para gestión de sesión

### Librerías
- Angular Reactive Forms
- ngx-translate
- PrimeNG (para componentes UI opcionales)
- Tailwind CSS

### Otra HU relacionada
- HU-AUTH-002 - Cierre de Sesión (Logout)
- HU-AUTH-003 - Protección de Rutas (Auth Guard)
- HU-AUTH-004 - Estado Global de Autenticación

---

## 🚫 Fuera de Alcance

- No incluye autenticación OAuth/Google/Facebook
- No incluye "Recordar mi sesión" (checkbox)
- No incluye enlace de "Olvidé mi contraseña"
- No incluye verificación en dos pasos (2FA)
- No incluye registro de nuevos usuarios

---

## 🧠 Generación de Código

**Requerir:**
- [x] Componente: `IndexLogin` (ya existe, necesita mejoras)
- [x] Servicios: `AuthService`, `AuthApiService` (ya existen)
- [ ] Migración a Reactive Forms
- [ ] Integración con `UserSessionStore` para guardar sesión
- [ ] Tests unitarios
- [ ] Tests E2E

---

## 📋 Notas de Implementación

### IMPORTANTE: Gestión de Sesión

**USAR UserSessionStore - NO localStorage directamente**

El componente de Login debe integrar con el `UserSessionStore` existente:

```typescript
import { UserSessionStore } from '@store/user.session';

@Component({...})
export class IndexLogin {
  private userSessionStore = inject(UserSessionStore);
  
  onLoginSuccess(user: User, token: string): void {
    // ✅ Correcto: usar el store
    this.userSessionStore.login(user, token);
    
    // ❌ Incorrecto: NO usar localStorage
    // localStorage.setItem('token', token);
  }
}
```

El `UserSessionStore` ya maneja:
- Persistencia en IndexedDB mediante `StorageService`
- Estado reactivo con Signals
- Métodos: `login()`, `logout()`, `getToken()`, `isLoggedIn`

### Mejoras sugeridas para el componente existente

1. **Migrar a Reactive Forms**: Reemplazar FormsModule con ngModel por ReactiveFormsModule
2. **Validaciones**: Implementar Validators.required, Validators.email
3. **Mensajes de error**: Mostrar errores específicos por campo
4. **Integración con UserSessionStore**: Llamar `userSessionStore.login()` tras éxito
5. **Toast**: Utilizar claves i18n para mensajes de toast

### Estructura de archivos
```
src/app/modules/auth/login/
├── login-routing.module.ts
├── interfaces/
│   └── index.ts
└── ui/
    └── index-login/
        ├── index-login.ts
        ├── index-login.html
        └── index-login.css
```

### Referencias del código actual
- Componente: `src/app/modules/auth/login/ui/index-login/index-login.ts`
- Servicios: `src/app/modules/auth/login/services/auth.service.ts`, `auth-api.service.ts`
- Store: `src/app/store/user.session.ts`
- Storage: `src/app/services/storage.service.ts`

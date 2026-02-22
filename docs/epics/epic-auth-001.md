# EPIC-AUTH-001 - Módulo de Autenticación

## 📌 Información General
- ID: EPIC-AUTH-001
- Estado: In Progress
- Prioridad: Alta
- Fecha inicio: 2026-02-22
- Fecha objetivo: 2026-03-15
- Owner: Equipo de Desarrollo Aura POS
- Porcentaje: 25%

---

## 🎯 Objetivo de Negocio

El módulo de autenticación es la puerta de entrada al sistema Aura POS. Su objetivo es garantizar que solo usuarios autorizados puedan acceder a la aplicación, proporcionando una experiencia de inicio de sesión segura, fluida e intuitiva.

**¿Qué problema resuelve?**
- Control de acceso al sistema mediante credenciales de usuario
- Protección de datos sensibles del negocio
- Experiencia de usuario profesional en el proceso de autenticación

**¿Qué valor genera?**
- Seguridad para los datos del punto de venta
- Reducción de accesos no autorizados
- Mejora en la percepción de calidad del sistema

---

## 👥 Stakeholders

- Usuario final: Empleados y administradores del punto de venta
- Equipo técnico: Desarrolladores Angular, Backend API
- Producto: Product Manager Aura POS

---

## 🧠 Descripción Funcional General

El módulo de autenticación gestiona todo el ciclo de vida de la sesión del usuario, incluyendo:
- Inicio de sesión (Login) con credenciales
- Cierre de sesión (Logout)
- Persistencia de sesión
- Renovación de token
- Gestión de estado de autenticación global

Este módulo utiliza JWT para la autenticación y mantiene el estado de sesión utilizando Angular Signals y NgRx SignalStore (`UserSessionStore`).

---

## 📦 Alcance

**Incluye:**
- Formulario de inicio de sesión con validación
- Autenticación contra API backend
- Persistencia de token mediante `StorageService` (IndexedDB)
- Redirección automática tras login exitoso
- Manejo de errores de autenticación
- Estados de carga (loading)
- Cierre de sesión
- Guard (Route Guard) para rutas protegidas
- Estado global de autenticación

**No incluye:**
- Autenticación OAuth/Google/Facebook
- Registro de nuevos usuarios (futuro)
- Recuperación de contraseña (futuro)
- Autenticación de dos factores (2FA) (futuro)
- Sesión biométrica

---

## 🧩 Historias de Usuario Asociadas

- [x] EPIC-AUTH-001 - Módulo de Autenticación (esta Epic)
- [ ] HU-AUTH-001 - Inicio de Sesión (Login)
- [ ] HU-AUTH-002 - Cierre de Sesión (Logout)
- [ ] HU-AUTH-003 - Protección de Rutas (Auth Guard)
- [ ] HU-AUTH-004 - Estado Global de Autenticación

---

## 🐞 Bugs Asociados

No hay bugs reportados actualmente.

---

## 🔐 Reglas de Negocio Globales

- Todas las sesiones expiran según configuración del backend (típicamente 24h)
- Se utiliza JWT (JSON Web Token) para autenticación
- Se requiere HTTPS en producción
- Las credenciales se validan en el backend
- **El token se almacena mediante StorageService (IndexedDB), NO en localStorage**
- El estado de autenticación se gestiona globalmente mediante `UserSessionStore`

---

## 🧱 Arquitectura Relacionada

**Frontend:**
- Angular 21 con Zoneless Change Detection
- Signals para estado reactivo
- NgRx SignalStore (`UserSessionStore`) para gestión de sesión
- Reactive Forms para validación de formularios
- PrimeNG para componentes UI
- Tailwind CSS para estilos
- ngx-translate para internacionalización

**Backend:**
- API RESTful para autenticación
- JWT para tokens de sesión
- Endpoints: `/auth/login`, `/auth/logout`, `/auth/refresh`

**Almacenamiento de Sesión:**
- **NO usar localStorage/sessionStorage directamente**
- Usar `UserSessionStore` en `src/app/store/user.session.ts`
- El store utiliza `StorageService` con IndexedDB

---

## 📊 Métricas de Éxito

- % de login exitosos: > 95%
- Tiempo promedio de autenticación: < 2 segundos
- Tasa de error de autenticación: < 5%
- Satisfacción de usuario en el login: > 4/5

---

## 🚧 Riesgos

- Dependencia del backend para autenticación
- Posibles problemas de red durante el login
- Expiración de token durante uso activo

---

## 📝 Notas Técnicas

- El componente de Login actual utiliza FormsModule con ngModel
- **MIGRACIÓN REQUERIDA**: Migrar a Reactive Forms para mejor validación
- Integrar con ToastAlertService para notificaciones
- **USAR UserSessionStore** para persistencia de sesión (NO localStorage)
- Utilizar Route Guards para proteger rutas
- El StorageService ya está configurado con IndexedDB para persistencia segura

# 🏛️ HUB PRINCIPAL · PORTALES SALFA PILOTOS & SUPER-APP MÓVIL
**Ecosistema: Portales Salfa Pilotos · Salfa Montajes / SalfaCorp**  
*Página Principal, Control Centralizado de Accesos y Aplicación Móvil Android Super-App*

---

## 1. Repositorio Oficial y Enlaces

| Elemento | Enlace |
| :--- | :--- |
| **Sitio Web en Vivo (GitHub Pages)** | [https://sjroca-salfa.github.io/salfa-pilotos/](https://sjroca-salfa.github.io/salfa-pilotos/) |
| **Repositorio Frontend del Hub** | [github.com/sjroca-salfa/salfa-pilotos](https://github.com/sjroca-salfa/salfa-pilotos) (Cuenta oficial: `sjroca-salfa`) |
| **Repositorio Backend de Accesos** | [github.com/sjroca-salfa/hub-accesos](https://github.com/sjroca-salfa/hub-accesos) |
| **Base de Datos (Google Sheets)** | Hoja *Accesos Portales Salfa Pilotos* (generada al ejecutar `configurar()`) |
| **Aplicación Móvil Android Nativa** | `E:\Claude\Portales-Salfa-Pilotos\00-portal-hub\android\` |

---

## 2. Arquitectura Super-App Móvil Android (`00-portal-hub/android/`)

La aplicación Android (`com.salfamontajes.hub`) actúa como un **contenedor maestro (Super-App)** para todo el ecosistema de Salfa Montajes:

```text
┌────────────────────────────────────────────────────────┐
│  📱 App Android: Portales Salfa (com.salfamontajes.hub)│
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 🏛️ HUB PRINCIPAL (hubWebView)                    │  │
│  │ • Single Sign-On Salfa                           │  │
│  │ • Catálogo de 8+ Portales Pilotos                │  │
│  │ • Búsqueda, filtros por gerencia y métricas      │  │
│  └────────────────────────┬─────────────────────────┘  │
│                           │ Tap en "Abrir Portal"      │
│                           ▼                            │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 🔝 Barra Superior In-App                         │  │
│  │ [← Volver al Hub]   [06 · Salfa Flow]  [🔀 Portales]│  │
│  ├──────────────────────────────────────────────────┤  │
│  │ 🌐 CONTENEDOR DE PORTAL HIJO (portalWebView)     │  │
│  │ • Ejecución fluida sin salir de la app           │  │
│  │ • Aceleración por hardware y modo offline        │  │
│  │ • Soporte de cámara para fotos de obra           │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

### Flujo de Navegación Unificada:
1. **Acceso al Catálogo:** El usuario abre la app y visualiza todos los portales autorizados.
2. **Entrada a Portales In-App:** Al presionar "Abrir", el portal se despliega inmediatamente en el contenedor interno, manteniendo el Hub cargado en memoria de fondo.
3. **Transición entre Portales (`🔀 Cambiar Portal`):** Con un toque en el botón "Portales", se despliega un selector nativo para saltar de un portal a otro (ej. de *Salfa Flow* a *Autodesk ACC* o al *Agente AWP*) sin recargar ni salir de la app.
4. **Retorno Inmediato (`← Volver al Hub`):** Permite volver al catálogo del Hub instantáneamente.

---

## 3. Portafolio Completo de Portales Pilotos Integrados

| N° | Portal | Área / Gerencia | Estado | URL Relativa / Remota |
| :---: | :--- | :--- | :---: | :--- |
| **01** | Mapa de Procesos BPMN | Gerencia de Operaciones | Activo | `https://sjroca-salfa.github.io/portal-mapa-procesos/` |
| **02** | Control de CV y Competencias | Gestión de Personas | Activo | `02-portal-cv/index.html` |
| **03** | Salfa Work Management | Operaciones / Obras | Activo | `03-portal-gestion-proyectos/index.html` |
| **04** | Indicadores OKR | Planificación y Desarrollo | En desarrollo | `04-portal-indicadores-okr/index.html` |
| **05** | Gestión de la Información | Gobernanza y P&D | Activo | `05-portal-gestion-informacion/index.html` |
| **06** | Salfa Flow (Tareas & Terreno) | Operaciones / P&D | Activo | `06-portal-salfa-flow/index.html` |
| **07** | Autodesk Construction Cloud (ACC) | Operaciones / BIM | Activo | `07-portal-autodesk-construction-cloud-acc/index.html` |
| **08** | Agente AWP (Metodología CII) | Operaciones / AWP | Activo | `08-portal-agente-awp/index.html` |

---

## 4. Compilación e Instalación de la App Android

1. **Abrir en Android Studio:**
   - Abrir `E:\Claude\Portales-Salfa-Pilotos\00-portal-hub\android\`.
   - Esperar la sincronización de Gradle.
2. **Compilar APK:**
   - Menú **Build -> Build Bundle(s) / APK(s) -> Build APK(s)**.
   - El APK generado quedará en:
     `00-portal-hub/android/app/build/outputs/apk/debug/app-debug.apk`
3. **Instalación directa en celular:**
   ```powershell
   adb install "E:\Claude\Portales-Salfa-Pilotos\00-portal-hub\android\app\build\outputs\apk\debug\app-debug.apk"
   ```
   O ejecutando `compilar-android.bat`.

---

## 5. Sincronización Corporativa Google Drive
Todos los cambios se replican unidireccionalmente hacia la nube corporativa ejecutando:
```powershell
powershell.exe -ExecutionPolicy Bypass -File "E:\Claude\Portales-Salfa-Pilotos\sincronizar-drive.ps1"
```

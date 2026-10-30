# 🏛️ HUB PRINCIPAL · PORTALES SALFA PILOTOS

Página principal y sistema centralizado de control de acceso para el ecosistema de pilotos de Salfa Montajes.

---

## 1. Repositorio Oficial y Enlaces

| Elemento | Enlace |
| :--- | :--- |
| **Sitio Web en Vivo (GitHub Pages)** | [https://sjroca-salfa.github.io/salfa-pilotos/](https://sjroca-salfa.github.io/salfa-pilotos/) |
| **Repositorio Frontend del Hub** | [github.com/sjroca-salfa/salfa-pilotos](https://github.com/sjroca-salfa/salfa-pilotos) (Cuenta oficial: `sjroca-salfa`) |
| **Repositorio Backend de Accesos** | [github.com/sjroca-salfa/hub-accesos](https://github.com/sjroca-salfa/hub-accesos) |
| **Base de Datos (Google Sheets)** | Hoja *Accesos Portales Salfa Pilotos* (generada al ejecutar `configurar()`) |

---

## 2. Arquitectura de Funcionamiento

```text
[ Usuario en Navegador ]
          │
          ▼
┌──────────────────────────────────────┐
│  Frontend: GitHub Pages              │
│  (sjroca-salfa/salfa-pilotos)        │
│  • HTML/CSS/JS autocontenido         │
│  • Identidad Salfa (SVG y Assets)    │
│  • Login, Registro, Recordarme       │
└──────────────────┬───────────────────┘
                   │ HTTPS / Fetch (JSON)
                   ▼
┌──────────────────────────────────────┐
│  Backend: Google Apps Script Web App │
│  (sjroca-salfa/hub-accesos)          │
│  • Validación por código (6 dígitos) │
│  • Hash PBKDF2-HMAC-SHA256           │
│  • Aprobación y asignación de roles  │
└──────────────────┬───────────────────┘
                   │ Lectura / Escritura
                   ▼
┌──────────────────────────────────────┐
│  Almacenamiento: Google Sheets       │
│  Hoja "Accesos Portales Salfa"       │
│  (Accesos, Sesiones, Registro)       │
└──────────────────────────────────────┘
```

---

## 3. Dónde se Configura Cada Parámetro

1. **En el Frontend (`index.html`):**
   - `API_URL`: URL de la Web App de Apps Script terminada en `/exec`. Permite que el frontend se comunique con el servicio de autenticación.
   - `GOOGLE_CLIENT_ID`: (Opcional) ID de cliente OAuth de Google Cloud configurado con el origen `https://sjroca-salfa.github.io`.

2. **En las Propiedades del Script (Apps Script Editor > Configuración del proyecto > Propiedades del script):**
   - `ADMINS`: Correos electrónicos de los administradores que aprueban solicitudes, separados por coma.
   - `CONTACTO_A`: Correo que recibe los mensajes enviados a través del botón de Contacto.
   - `PIMIENTA`: Clave secreta generada automáticamente por `configurar()` para el hashing robusto de contraseñas.

---

## 4. Gestión de Accesos (Aprobar o Revocar)

1. **Auto-registro del Colaborador:**
   - El colaborador ingresa al Hub y completa el formulario de registro con su correo institucional.
   - Recibe un código de verificación de 6 dígitos por correo para confirmar titularidad.
   - Una vez verificado, su estado pasa a `Pendiente`.

2. **Aprobación por Administrador:**
   - Un administrador ingresa al Hub con sus credenciales autorizadas.
   - Accede a la pestaña **Gestión de accesos** dentro del Hub o directamente en la hoja de cálculo *Accesos Portales Salfa Pilotos*.
   - Selecciona el rol correspondiente y los portales autorizados para el usuario, cambiando el estado a `Activo`.
   - Para revocar el acceso en cualquier momento, basta con cambiar el estado a `Revocado` o `Inactivo`.

---

## 5. Portafolio de Portales Salfa Pilotos

| Portal | Módulo | Estado |
| :--- | :--- | :--- |
| **01** | Mapa de Procesos | **Activo / En Producción** |
| **02** | Control de CV | **En desarrollo** |
| **03** | Gestión AWP & Construcción | **Próximamente** |

---

## 6. Despliegue y Publicación

- **Frontend:** Cualquier cambio en `index.html` o `assets/` se sube al repositorio `sjroca-salfa/salfa-pilotos` en la rama `main`. GitHub Pages actualiza el sitio en 30 a 60 segundos automáticamente.
- **Backend:** Los cambios en `Code.gs` o `appsscript.json` dentro de `hub-accesos` se suben con `git push origin main`. GitHub Actions sincroniza vía Clasp (`clasp push` y `clasp deploy`) actualizando la versión de producción sin modificar la URL `/exec`.

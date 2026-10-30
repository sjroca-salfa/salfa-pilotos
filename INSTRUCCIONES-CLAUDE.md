# 📋 INSTRUCCIONES DE INICIO RÁPIDO PARA CLAUDE
**Ecosistema: Portales Salfa Pilotos (Salfa Montajes)**
*Ubicación local:* `E:\Claude\Proyectos\Laboral\Proyectos de P&D\Actividades de Área\Portales Salfa Pilotos`

---

## 🎯 Instrucción Inicial para pegar en el nuevo Proyecto de Claude:

Copia y pega el siguiente bloque como **Instrucción de Proyecto** (Project Instructions) o como primer mensaje en Claude:

```text
Actúas como desarrollador y diseñador frontend/backend para el ecosistema de "Portales Salfa Pilotos" de Salfa Montajes.

UBICACIÓN DE TRABAJO:
E:\Claude\Proyectos\Laboral\Proyectos de P&D\Actividades de Área\Portales Salfa Pilotos\

ANTES DE CUALQUIER ACCIÓN:
1. Lee obligatoriamente el archivo maestro de coordinación:
   `E:\Claude\Proyectos\Laboral\Proyectos de P&D\Actividades de Área\Portales Salfa Pilotos\README.md`
2. Si trabajas en un portal específico, lee el README.md de su subcarpeta:
   - Hub Central Web: `salfa-pilotos\index.html`
   - Mapa de Procesos: `01-portal-mapa-procesos\README.md`
   - Futuros portales: `02-[nombre]\README.md`

PROTOCOLO OBLIGATORIO DE DESARROLLO Y CONFIRMACIÓN:
1. REGLA DE VISUALIZACIÓN LOCAL PREVIA:
   - Cada vez que hagas un cambio de diseño, gráficos, tarjetas, colores o maquetación, NUNCA hagas push directo a producción.
   - Aplica los cambios localmente en los archivos y permite al usuario abrir el archivo local en su navegador (ej. con doble clic o ruta local `file:///...`) para revisar y validar el resultado visual.
2. CONFIRMACIÓN ANTES DE PUBLICAR (PUSH):
   - Una vez que el usuario revise y esté satisfecho con la visualización local, pregúntale explícitamente:
     "¿Deseas que publique estos cambios en GitHub para actualizar el sitio en vivo?"
   - Solo cuando el usuario responda afirmativamente, ejecuta `git add`, `git commit` y `git push origin main`.

ARQUITECTURA Y REGLAS DE SEGURIDAD:
- Hub Principal: Web alojada en GitHub Pages (`salfa-pilotos/index.html`) con login protegido, hash SHA-256 para contraseñas y filtrado de acceso según roles.
- Backend de Portales (Apps Script): Ejecuta bajo la cuenta de prueba, pero restringiendo estrictamente por software el acceso a cuentas @salfamontajes.com más las cuentas administradoras configuradas (sroca.ot@gmail.com y sjroca@salfamontajes.com).
- Frontend: HTML/CSS/JS responsivo con identidad gráfica de Salfa Montajes:
  * Rojo: #B01E24
  * Burdeos: #5E0F13
  * Fondo oscuro: #0F172A / #1E293B
  * Tipografías: 'Montserrat' y 'Barlow'
- Base de datos y almacenamiento: Google Sheets y Google Drive.

REPOSITORIOS Y ENLACES ACTUALES:
- Hub Principal (Acceso Simple):
  * URL en vivo: https://sjroca-salfa.github.io/salfa-pilotos/
  * GitHub: https://github.com/sjroca-salfa/salfa-pilotos
- Portal 01 (Mapa de Procesos):
  * URL en vivo: https://script.google.com/macros/s/AKfycbxWCGH8Fh7qUEn3AwTm4i_Yq3gBxp9bUx6ZXHbm-cBTTiafHAhKsWnqWrLoIDu8Y8Wq/exec
  * GitHub: https://github.com/sjroca-salfa/portal-mapa-procesos
```

---

## 🛠️ Cómo agregar un Nuevo Portal a futuro (Guía paso a paso):

Cuando quieras crear un nuevo portal (ejemplo: `02-portal-riesgos`):

1. **Crear la carpeta en este directorio:**
   - Crear `02-portal-riesgos\proyecto`
2. **Copiar la plantilla CI/CD:**
   - Copiar la carpeta `.github/` y `.gitignore` desde `00-portal-hub` hacia `02-portal-riesgos/`.
3. **Crear el script en Apps Script:**
   - Dentro de `proyecto/` ejecutar `clasp create --type standalone --title "Portal [Nombre]"`.
   - Subir el código inicial con `clasp push --force`.
   - Crear el deployment web con `clasp deploy --description "Despliegue inicial"`.
4. **Vincular a GitHub:**
   - Crear el repositorio privado: `gh repo create portal-[nombre] --private --source=. --remote=origin --push`.
   - Configurar los 3 secretos: `CLASPRC_BASE64`, `SCRIPT_ID` y `DEPLOYMENT_ID`.
5. **Conectarlo al Hub:**
   - Abrir la [Planilla de Base de Datos del Hub](https://docs.google.com/spreadsheets/d/1pCh60ugRfFNbYCqyH9dsNBf0GnwQL0b5JxcOE-x8hwA/edit) y agregar una nueva fila en la pestaña `Portales` con el nombre, descripción y URL `/exec` del nuevo portal. Aparecerá en el Hub de inmediato.

# INSTRUCCIONES DE INICIO PARA CLAUDE · Portales Salfa Pilotos

Ubicación local: `E:\Claude\Proyectos\Laboral\Proyectos de P&D\Actividades de Área\Portales Salfa Pilotos\`

## Antes de cualquier acción
1. Lee `README.md` (maestro) y el `README.md` del portal que toques (`00-portal-hub\`, `01-portal-mapa-procesos\`, `hub-accesos\`).
2. Recuerda el Procedimiento Acceso Herramientas IA de SalfaCorp: base del uso correcto de la IA en la empresa.

## Protocolo de desarrollo y confirmación
1. Todo cambio visual se aplica primero en local para que el usuario lo revise en su navegador. Nunca se hace push directo a producción.
2. Tras la revisión pregunta: "¿Deseas que publique estos cambios en GitHub para actualizar el sitio en vivo?". Solo con respuesta afirmativa se ejecuta `git add`, `git commit` y `git push origin main`.
3. Claude no ejecuta Git ni despliegues: entrega un paquete `entrega-[nombre].zip` con `INSTRUCCIONES-ANTIGRAVITY.md` y Antigravity lo aplica.

## Arquitectura y reglas
- Backend: Google Apps Script V8, modo ANYONE, con restricción por software a `@salfamontajes.com` más administradores definidos en la propiedad `ADMINS`.
- Frontend: HTML/CSS/JS responsivo con Rojo #B01E24, Burdeos #5E0F13, Grafito #1E2229; Montserrat, Barlow y Barlow Condensed. Usa solo colores de la guía de identidad.
- Datos: Google Sheets y Drive. Despliegue: GitHub Actions + clasp al hacer push a `main`. Nunca se edita código en el navegador de Apps Script.
- Prohibido en código y documentación: correos personales o de administradores, claves, pimienta, huellas de credenciales.

## Repositorios (cuenta oficial `sjroca-salfa`)
- Hub: github.com/sjroca-salfa/salfa-pilotos · https://sjroca-salfa.github.io/salfa-pilotos/
- Accesos: github.com/sjroca-salfa/hub-accesos
- Portal 01: github.com/sjroca-salfa/portal-mapa-procesos

## Nuevo portal
1. Crear `02-[nombre]\proyecto\` con su propio repositorio y workflow copiado de `01-portal-mapa-procesos`.
2. Agregar su tarjeta en `PORTALES` del `index.html` del Hub (id, nombre, descripción, url, roles, estado).
3. Registrar el portal en `README.md` maestro y en `CONFIG.PILOTOS` de `hub-accesos`.
4. Previsualizar en local, pedir confirmación y publicar.

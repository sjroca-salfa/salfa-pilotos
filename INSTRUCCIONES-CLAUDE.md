# INSTRUCCIONES OFICIALES DE TRABAJO · CLAUDE & ANTIGRAVITY
**Ecosistema: Portales Salfa Pilotos (Salfa Montajes / SalfaCorp)**
*Última actualización: 2026-10-30*

---

Actúas como desarrollador y arquitecto de software de Salfa Montajes para el ecosistema de "Portales Salfa Pilotos".

**RECUERDA:** en SalfaCorp rige el **Procedimiento Acceso Herramientas IA**, base del uso correcto de la IA en la empresa.

---

## 1. UBICACIÓN DE TRABAJO (FUENTE DE LA VERDAD ÚNICA)
`E:\Claude\Proyectos\Laboral\Proyectos de P&D\Actividades de Área\Portales Salfa Pilotos\`  
Aquí residen los repositorios Git, el historial de versiones y la terminal de Antigravity.

## 2. ESPEJO CORPORATIVO (SOLO LECTURA PARA COLABORADORES)
`G:\Mi unidad\Portales Salfa Pilotos\` (Google Drive corporativo de Salfa).  
Sirve de respaldo y para que los colaboradores vean los documentos. Antigravity lo mantiene sincronizado desde `E:\` con un script automatizado, **en un solo sentido (E hacia G)**. Nunca se sincroniza de G hacia E y nunca se copian carpetas `.git`.

---

## 3. CUENTAS Y ACCESO (DECISIÓN VIGENTE)
- Se eliminó toda cuenta personal. El ecosistema usa exclusivamente la cuenta institucional de Salfa Montajes.
- **Administrador único institucional:** `sjroca@salfamontajes.com`.
- **Dominio corporativo exclusivo:** `@salfamontajes.com`.
- **GitHub oficial:** cuenta `sjroca-salfa`. Google Drive corporativo de Salfa.
- Los correos de administración se definen solo en las propiedades del script de Apps Script (`ADMINS`, `CONTACTO_A`). Nunca en el código, README ni GitHub.

---

## 4. ANTES DE CUALQUIER ACCIÓN
1. Lee obligatoriamente el archivo maestro de coordinación:  
   `E:\Claude\Proyectos\Laboral\Proyectos de P&D\Actividades de Área\Portales Salfa Pilotos\README.md`
2. Si trabajas en un portal específico, lee el README.md de su subcarpeta:
   - Hub Central: `00-portal-hub\README.md`
   - Backend de accesos: `hub-accesos\README.md`
   - Mapa de Procesos: `01-portal-mapa-procesos\README.md`
   - Futuros portales: `02-[nombre]\README.md`

---

## 5. ARQUITECTURA Y REGLAS DE ORO
- **Backend:** Google Apps Script (V8) ejecutando en modo ANYONE bajo la cuenta institucional de Salfa Montajes, pero restringiendo estrictamente por software el acceso al dominio exclusivo `@salfamontajes.com` y al administrador único institucional definido en `ADMINS`.
- **Frontend:** HTML/CSS/JS responsivo con identidad gráfica de Salfa Montajes (Rojo `#B01E24`, Burdeos `#5E0F13`, Grafito `#1E2229`).
- **Base de datos y almacenamiento:** Google Sheets y Google Drive.
- **Despliegue Automático (CI/CD):** cada portal es un repositorio Git independiente vinculado a GitHub (`sjroca-salfa`). Cualquier modificación en los archivos de la carpeta `proyecto/` se despliega automáticamente a producción en Apps Script al hacer `git push origin main` mediante GitHub Actions. Nunca edites código manualmente en el navegador web de Apps Script.

---

## 6. REPOSITORIOS Y ENLACES ACTUALES
- **Hub Principal (frontend, GitHub Pages):**  
  * URL: [https://sjroca-salfa.github.io/salfa-pilotos/](https://sjroca-salfa.github.io/salfa-pilotos/)  
  * GitHub: [https://github.com/sjroca-salfa/salfa-pilotos](https://github.com/sjroca-salfa/salfa-pilotos)
- **Backend de accesos (Apps Script):**  
  * GitHub: [https://github.com/sjroca-salfa/hub-accesos](https://github.com/sjroca-salfa/hub-accesos)
- **Portal 01 (Mapa de Procesos):**  
  * URL: [https://script.google.com/macros/s/AKfycbxWCGH8Fh7qUEn3AwTm4i_Yq3gBxp9bUx6ZXHbm-cBTTiafHAhKsWnqWrLoIDu8Y8Wq/exec](https://script.google.com/macros/s/AKfycbxWCGH8Fh7qUEn3AwTm4i_Yq3gBxp9bUx6ZXHbm-cBTTiafHAhKsWnqWrLoIDu8Y8Wq/exec)  
  * GitHub: [https://github.com/sjroca-salfa/portal-mapa-procesos](https://github.com/sjroca-salfa/portal-mapa-procesos)

---

## 7. DIVISIÓN DE ROLES
- **Claude (Arquitecto de Software y Diseñador Frontend/Backend):**  
  Genera y diseña el código frontend (HTML/CSS/JS), el backend de Apps Script (`.gs`) y la arquitectura.  
  NO tiene terminal, Git, Clasp ni despliegues directos. No intenta ejecutar comandos, hacer push ni generar scripts de despliegue.
- **Antigravity (Ingeniero de Ejecución Local):**  
  Corre en la máquina del usuario con PowerShell, Git CLI autenticado con `sjroca-salfa`, acceso a `E:\` y a `G:\`.  
  Se encarga de la terminal, Git, GitHub Actions y Clasp. Aplica las entregas, replica a `G:\`, levanta el servidor de prueba local (`localhost:5500`), muestra el resultado al usuario, pide confirmación y hace el `git push origin main`.

---

## 8. PROTOCOLO OBLIGATORIO DE DESARROLLO Y CONFIRMACIÓN
1. **REGLA DE VISUALIZACIÓN LOCAL PREVIA:**  
   Cada vez que hagas un cambio de diseño, gráficos, tarjetas, colores o maquetación, NUNCA se hace push directo a producción.  
   Los cambios se aplican localmente y el usuario los revisa en su navegador (archivo local o `http://localhost:5500`) para validar el resultado visual.
2. **CONFIRMACIÓN ANTES DE PUBLICAR (PUSH):**  
   Una vez que el usuario revise y esté satisfecho con la visualización local, se le pregunta explícitamente:  
   *"¿Deseas que publique estos cambios en GitHub para actualizar el sitio en vivo?"*  
   Solo cuando el usuario responda afirmativamente, Antigravity ejecuta `git add`, `git commit` y `git push origin main`.

---

## 9. CADA VEZ QUE CLAUDE TERMINE UN DISEÑO, CÓDIGO O CAMBIO
1. No intentes ejecutar comandos ni asumas que puedes hacer push.
2. Genera una carpeta `entrega-[nombre]\` y su paquete `entrega-[nombre].zip` con todos los archivos modificados o creados, respetando la estructura del proyecto.
3. Incluye dentro un archivo llamado `INSTRUCCIONES-ANTIGRAVITY.md` donde indiques a Antigravity:
   - Qué archivos se modificaron o agregaron y a qué carpeta van (ej: `00-portal-hub`, `hub-accesos`, `01-portal-mapa-procesos`).
   - Qué repositorios de GitHub involucra.
   - Qué variables o secretos requiere (sin incluir contraseñas ni correos en texto plano).
   - Qué debe verificar localmente antes de desplegar.
   - Que debe aplicar la carpeta en `E:\`, replicarla a `G:\`, levantar `localhost:5500`, mostrar el resultado, pedir confirmación y recién entonces hacer el push.
4. Entrega un mensaje corto al usuario diciendo:  
   *"Paquete listo. Descarga 'entrega-[nombre].zip', descomprímelo en la carpeta del proyecto y dile a Antigravity: 'Aplica la entrega [nombre]'."*

---

## 10. GUÍA DE IDENTIDAD VISUAL · COLORES, LOGOS Y TIPOGRAFÍAS (SALFA MONTAJES / SALFACORP)
**Uso:** Instrucciones de diseño para Claude y Antigravity al crear portales, documentos Word, presentaciones y piezas gráficas.

### 10.1 Jerarquía de Marcas
- **SalfaCorp (matriz):** Define colores oficiales, grilla y usos incorrectos del logo. Toda regla de color de Salfa Montajes parte de esa paleta.
- **Salfa Montajes (empresa operativa):** Logotipo propio con "SALFA" en rojo y "MONTAJES" en gris o blanco. Lo usan portales, documentos del SGI y presentaciones.

### 10.2 Logotipos
- **Blanco o claro:** SALFA rojo + MONTAJES gris grafito, con ® arriba a la derecha. (Versión principal).
- **Oscuro (grafito, burdeos, negro):** SALFA rojo + MONTAJES blanco. (Versión estándar en bandas de encabezado).
- **Acero (`#4A525C`):** SALFA rojo claro `#EC4048` + MONTAJES blanco.
- **Un solo color:** Todo rojo, todo gris, todo negro o todo blanco (solo si el soporte no admite dos colores).
- **Usos incorrectos:** Invertir colores, usar porcentajes desvaídos, deformar, recortar o cambiar la tipografía (Verdana Bold en SalfaCorp).

### 10.3 Paleta de Diseño Digital Salfa Montajes
- `--rojo`: `#B01E24` (Acento, líneas, cifras destacadas, serie destacada en gráficos)
- `--rojo-oficial`: `#B3272D` (Pantone 1805 C manual SalfaCorp)
- `--rojo-ficha`: `#C8242B` (Ficha numerada de capítulo)
- `--rojo-claro`: `#E23B42` (Números y textos sobre fondo oscuro)
- `--burdeos`: `#5E0F13` (Fin de degradado)
- `--burdeos-banda`: `#7A1218`
- `--grafito`: `#1E2229` (Texto principal, fondos oscuros)
- `--grafito-claro`: `#3A414A` (Pie de página, barras secundarias)
- `--gris`: `#5A6771` (Series secundarias en gráficos, texto de apoyo)
- `--linea`: `#D3D7DC` (Bordes y divisores)
- `--fondo`: `#EEF0F2` (Filas alternadas de tabla, fondos suaves)
- `--blanco`: `#FFFFFF` (Fondo de contenido, texto sobre oscuro)

### 10.4 Tipografías
- **Títulos y cifras principales:** `Montserrat` (800 / Negrita extrema), mayúsculas en títulos.
- **Cuerpo, viñetas y tablas:** `Barlow` (400 / Normal).
- **Rótulos, pies de página y descripciones:** `Barlow Condensed` (600 / Seminegrita), mayúsculas con interletraje amplio.
- **Word:** Títulos en `Calibri` negrita, texto corrido en `Cambria` 11 pt (justificado, interlineado 1,35).

### 10.5 Reglas para Portales Web
- Usar solo variables de la paleta corporativa.
- El rojo es exclusivamente acento (botones primarios, filetes, llamadas de atención). Fondos grandes en grafito o blanco.
- Pantallas de login: ajustadas al 100% de la ventana sin scroll de página, con textos y tarjeta perfectamente centrados.

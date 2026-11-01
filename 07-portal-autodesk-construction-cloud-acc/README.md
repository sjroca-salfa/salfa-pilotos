# AUTODESK CONSTRUCTION CLOUD (ACC) — 1:1 REPLICA & CLONE
**Original Target:** `https://acc.autodesk.com/` (Autodesk Construction Cloud — `ACCExoSkeleton` v1088)
**Local Workspace:** `E:\Claude\Portales-Salfa-Pilotos\07-portal-autodesk-construction-cloud-acc\`
**Google Drive Mirror:** `G:\Mi unidad\Portales Salfa Pilotos\07-portal-autodesk-construction-cloud-acc\`
**Active User Profile:** `sjroca@salfamontajes.com` (Salfa Montajes · Enterprise)

---

## 1. Fidelidad Visual y Gráfica 1:1
A petición expresa del usuario, esta versión replica la interfaz gráfica y experiencia exacta de **Autodesk Construction Cloud (ACC)** original, sin alteraciones a paleta corporativa Salfa roja ni numeraciones de portal en la interfaz:
- **Barra Superior Autodesk (48px):** Fondo negro `#121212` con botón 9-dots (App Launcher), isotipo oficial geométrico Autodesk + "AUTODESK" wordmark, separador sutil y texto "Construction Cloud". Selector de cuenta "Salfa Montajes", buscador global, ayuda, notificaciones y avatar de usuario con iniciales **"SR"** (`sjroca@salfamontajes.com`).
- **Paleta de Colores Oficial Autodesk:** Azul primario `#0696D7` (hover: `#0472A5`, active: `#035882`), superficies limpias `#FFFFFF`, fondos `#F7F8FA`, bordes `#E5E8EC`, textos `#1E1E1E` y `#68727D`.
- **Tipografía Oficial:** `Artifakt Element` y `Open Sans` cargadas directamente desde los CDNs de Autodesk.
- **Botón de Acción Principal:** `+ Create project` con el estilo y microinteracciones de ACC.

---

## 2. Estructura de Archivos
```text
07-portal-autodesk-construction-cloud-acc/
├── index.html                                  # Clon 1:1 de Autodesk Construction Cloud (Projects, Docs, Build, Cost, LMV)
├── assets/                                     # Recursos gráficos
├── proyecto/
│   ├── Codigo.gs                               # Backend Google Apps Script V8 (6 hojas relacionales + LockService)
│   └── appsscript.json                         # Manifiesto V8 (America/Santiago)
├── docs/
│   └── ANALISIS-REPLICA-Y-WORKSPACE.md         # Informe Maestro de Ingeniería Inversa (15 secciones) y Consultoría Workspace
└── README.md                                   # Ficha técnica y documentación
```

---

## 3. Módulos Funcionales Reconstruidos
1. **Projects (Project Directory — `accProjectList` `/projects`):**
   - Columnas exactas extraídas del bundle: `NAME`, `NUMBER`, `TYPE`, `DEFAULT ACCESS`, `CREATED ON`, `ACTIONS`.
   - Badges oficiales de plataforma: `Autodesk Construction Cloud` y `BIM 360`.
   - Filtros en tiempo real por nombre, número de obra, plataforma y estado.
2. **Docs (CDE ISO 19650 — `accDocs` / `accSheets` `/docs/files`):**
   - Árbol de carpetas ISO 19650 (`01-WIP`, `02-SHARED`, `03-PUBLISHED (APC)`, `04-ARCHIVED`).
   - Matriz de planos y modelos (`.rvt`, `.dwg`, `.nwd`, `.pdf`) con versiones (`V1`, `V2`, `V3`) y estados de aprobación.
   - Visor 2D/BIM interactivo (*Large Model Viewer - LMV*) con barra flotante inferior y marcadores de incidencias.
3. **Build (Terreno — `accRfis`, `accSubmittals`, `accIssues`, `accAssets` `/build`):**
   - Submódulos: RFIs (Consultas Técnicas), Submittals (Entregas), Incidencias (Issues QA/QC/HSE) y Activos de Obra (Assets).
   - Chips de estado: `OPEN`, `IN_REVIEW`, `ANSWERED`, `CLOSED`.
4. **Cost Management (`accCost` `/cost/budget`):**
   - Matriz presupuestaria WBS y Órdenes de Cambio Potenciales (PCO) con cálculo de montos.
5. **Architecture Analysis:**
   - Panel de consulta con el mapeo de los 46 micro-frontends de ACC y los 37.128 nodos AST analizados por REA.

---

## 4. Persistencia y Backend
- **Local:** `localStorage` (`salfa_acc_production_v2`) con semilla de datos precargada y función de restauración instantánea.
- **Google Workspace (Apps Script):** `Codigo.gs` con sincronización a Google Sheets (`OBRAS_ACC`, `DOCS_CDE`, `BUILD_TERRENO`, `COST_WBS`, `BITACORA`, `CONFIG`).

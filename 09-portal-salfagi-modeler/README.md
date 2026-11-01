# PORTAL SALFAGI MODELER · ARQUITECTURA DE PROCESOS BPMN 2.0 (AS-IS)
**Ecosistema:** Portales Salfa Pilotos (Salfa Montajes / SalfaCorp)  
**Fecha de Implementación:** 2026-11-01  
**Estándares de Referencia:** BPMN 2.0 (ISO/IEC 19510) · OMG BPMNDI · ABPMP BPM CBOK v4.0 · 100% Bizagi Modeler Compliant · Sistema BRASA 2A  
**Especialista / Autor:** Sebastián Roca G. (+56993543447 | sjroca@salfamontajes.com)  
**Código de Diagrama:** `10000000-SAL-00000-DOC-DIA-00001` | **Procedimiento Rector:** `10000000-PRO-EST-001 (Rev. 0)`

---

## 1. Ubicaciones Oficiales y Fuente de la Verdad

- **Unidad Local (Fuente de la Verdad y Git):** `E:\Claude\Portales-Salfa-Pilotos\09-portal-salfagi-modeler\`
- **Espejo Corporativo en Google Drive:** `G:\Mi unidad\Portales Salfa Pilotos\09-portal-salfagi-modeler\`
- **URL de Consulta y Pruebas Local:** `http://localhost:5500/09-portal-salfagi-modeler/index.html`
- **Portal Hub Central:** `http://localhost:5500/00-portal-hub/index.html`
- **Administrador:** `sjroca@salfamontajes.com`

---

## 2. Propósito y Modelo Metodológico

El **Portal Salfagi Modeler** es el centro de arquitectura y modelado de procesos operacionales de Salfa Montajes S.A., implementado para formalizar, auditar y difundir los procedimientos rectores de la compañía bajo el estándar internacional **BPMN 2.0 (ISO/IEC 19510)**.

El sistema modela el caso central de aplicación corporativa:
- **Procedimiento Rector:** `10000000-PRO-EST-001 (Rev. 0)` — *Gestión de Tareas Metodología Lean Construction / Last Planner System*.
- **Plataformas de Operación:** Oracle Primavera Cloud (OPC), Primavera P6 EPPM y Power BI.
- **Interacción Inter-Proceso:** Acoplamiento bidireccional entre la Planificación Táctica (`PROC-01`) y la Gestión y Liberación de Restricciones en Terreno (`PROC-02`), gobernado mediante `Call Activity`, flujos de mensaje y SLA de 48 horas.

---

## 3. Compatibilidad 100% Garantizada con Bizagi Modeler

El modelo ha sido diseñado y validado contra el motor de importación de **Bizagi Modeler (v4.0+)**:
1. **Topología Geométrica BPMNDI Completa:** 46 formas gráficas (`<bpmndi:BPMNShape>`) y 30 flujos de secuencia y mensajes (`<bpmndi:BPMNEdge>`) con coordenadas ortogonales `<di:waypoint>` matemáticamente verificadas (0 errores de importación).
2. **Eventos Canónicos de Mensaje:** Invocación desacoplada y retorno formal de paquetes desbloqueados.
3. **Doble Formato de Intercambio:**
   - `Modelo_Procesos_SALFA.bpmn`: Archivo estándar OMG BPMN 2.0 XML.
   - `Modelo_Procesos_SALFA.bpm`: Archivo de proyecto nativo de Bizagi Modeler de apertura directa con doble clic.

---

## 4. Estructura de Pestañas y Módulos del Portal

| Pestaña | Descripción | Funcionalidad Clave |
|---|---|---|
| **🌐 Modelador BPMN 2.0** | Visor dinámico interactivo con SVG Retina | Pan & Zoom, 3 vistas (Macroproceso, PROC-01, PROC-02), toggle de artefactos, inspector lateral con RACI, VA/TR/CT y descargas directas (.BPMN, .BPM, PNG, SVG). |
| **📋 Matriz de Hand-Offs** | Tabla de trazabilidad y contratos de interfaz | Mapeo exhaustivo de actividades, disparadores, precondiciones, salidas y botones de salto directo al diagrama. |
| **📜 Procedimiento Rector** | Lector navegable del estándar `PRO-EST-001` | Índice lateral fijado, artículos, tablas normativas y enlaces interactivos `[Ver en Diagrama]`. |
| **🤖 Skills & Prompts IA** | Centro metodológico y prompts para LLMs | Prompt Maestro Universal (copiable con 1 clic), Skill BPMN 2.0, Descomposición Jerárquica y Anexo Plantillas. |
| **📦 Repositorio de Descargas** | Catálogo de entregables y modelos | Descarga directa de archivos BPMN, BPM, diagramas vectoriales e insumos procedimentales en PDF. |
| **☁️ Conexión Workspace** | Panel de gobernanza y sincronización | Semáforo de espejo Google Drive, modelo de datos Sheets y backend Google Apps Script V8. |

---

## 5. Componentes y Código del Proyecto

```text
09-portal-salfagi-modeler/
├── index.html                      # Aplicación web unificada SPA con identidad Salfa y visualizador interactivo
├── Modelo_Procesos_Interactivo.html # Visor interactivo standalone portable
├── assets/                         # Logotipos Salfa Montajes oficiales (SVG y PNG)
├── docs/
│   └── ANALISIS-REPLICA-Y-WORKSPACE.md # Informe técnico de arquitectura, BPMN y Workspace
├── proyecto/
│   ├── Codigo.gs                   # Backend Google Apps Script V8 (doGet, doPost, API)
│   └── appsscript.json             # Manifiesto corporativo con zona horaria America/Santiago
├── 00_Guia_Tecnica_y_Auditoria/    # Guía técnica y metodológica del proyecto
├── 01_Skill_y_Prompts_IA/          # Skills, reglas duras y Prompt Maestro universal
├── 02_Documentos_Fuente_Input/     # PDFs procedimentales oficiales y anexos A001 al A008
├── 03_Entregables_Generados_por_IA/# Modelos .bpmn, .bpm, SVGs, PNGs e informes técnicos
└── README.md                       # Esta ficha técnica oficial
```

---

## 6. Sincronización y Mantenimiento

Para replicar cambios locales hacia el espejo oficial en Google Drive:
```powershell
powershell.exe -ExecutionPolicy Bypass -File "E:\Claude\Portales-Salfa-Pilotos\sincronizar-drive.ps1"
```

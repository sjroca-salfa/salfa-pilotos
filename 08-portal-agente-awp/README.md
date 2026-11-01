# 08 - PORTAL AGENTE AWP · ADVANCED WORK PACKAGING
**Ecosistema:** Portales Salfa Pilotos (Salfa Montajes / SalfaCorp)  
**Fecha de Implementación:** 2026-10-31  
**Estándares de Referencia:** Construction Industry Institute (CII RT-272, RT-319, RT-390)  

---

## 1. Ubicaciones Oficiales y Fuente de la Verdad

- **Unidad Local (Fuente de la Verdad y Git):** `E:\Claude\Portales-Salfa-Pilotos\08-portal-agente-awp\`
- **Espejo Corporativo en Google Drive:** `G:\Mi unidad\Portales Salfa Pilotos\08-portal-agente-awp\`
- **URL de Consulta y Pruebas Local:** `http://localhost:5500/08-portal-agente-awp/index.html`
- **Portal Hub Central:** `http://localhost:5500/00-portal-hub/index.html`
- **Administrador:** `sjroca@salfamontajes.com`

---

## 2. Propósito y Modelo Metodológico

El **Agente AWP Salfa** es un asistente consultivo, tutor formativo y evaluador operativo de paquetes de trabajo diseñado para transferir e institucionalizar la metodología **Advanced Work Packaging (AWP)** en las obras de Salfa Montajes.

Opera con dos motores sincronizados:
1. **La IA del Usuario (Google Gemini API):** Integración nativa con la API Key del usuario (`gemini-2.5-flash`, `gemini-2.5-pro`, `gemini-1.5-pro`) guardada de forma segura en su `localStorage`. Si no dispone de clave, conmuta automáticamente a un **Motor Experto Residente Offline** basado en el cuerpo de conocimiento del CII.
2. **Centro de Libretas Google NotebookLM:** Las fuentes de verdad documentales primarias (los manuales del CII en poder del usuario) residen en sus libretas de NotebookLM vinculadas con enlaces profundos (*Deep-Links*), permitiendo auditoría y lectura sin riesgo de filtración.

---

## 3. Reglas de Integridad y Guardrails Anti-Dumping

Por políticas de propiedad intelectual del **Construction Industry Institute (CII)** y directrices de Salfa Montajes:
- **Prohibición Estricta de Volcado Masivo:** La IA no transcribe ni copia capítulos completos o manuales íntegros ante órdenes como *"copia el manual"* o *"escribe el libro completo"*.
- **Modelo de Asistencia Pedagógica:** El agente sintetiza, explica conceptos (Path of Construction, WBS, CWP, EWP, PWP, IWP), asesora a planificadores y supervisores de terreno, y cita las normas con precisión.
- **Tablas y Esquemas por Consulta:** Las tablas metodológicas y diagramas interactivos se despliegan únicamente ante consultas que lo requieran o por navegación directa en el catálogo de esquemas.

---

## 4. Estructura de Módulos del Portal

| Módulo | Descripción | Funcionalidad Clave |
|---|---|---|
| **💬 Tutor IA Consultivo** | Chat interactivo con IA de usuario y guardrails | Respuestas pedagógicas, chips de preguntas frecuentes, citas CII y render de tablas |
| **📓 Libretas NotebookLM** | Conector con las libretas de Google NotebookLM del usuario | Enlaces directos a RT-272, RT-319, RT-390, AWP Salfa y gestión de URLs |
| **📊 Tablas & Esquemas CII** | Catálogo visual de estándares AWP | Jerarquía CWA/CWP/EWP/IWP, Matriz de 7 Restricciones, Cronograma PoC y Niveles de Madurez |
| **🛠️ Simulador de IWPs** | Evaluador de restricciones de paquetes | Semáforo de autorización para cuadrilla, auditoría de las 7 restricciones y diagnóstico IA |
| **⚙️ Configuración & Clave** | Gobernanza de la IA | Ingreso seguro de Gemini API Key, selector de modelo y panel de guardrails |

---

## 5. Componentes y Código del Proyecto

- `index.html`: Aplicación web moderna (SPA), responsiva, con paleta oficial Salfa Montajes (`#B01E24`, `#1E2229`, `#F4F6F8`), tipografías Montserrat y Barlow, topbar universal y modales.
- `proyecto/Codigo.gs`: Backend Google Apps Script V8 con `doGet` para servicio WebApp y `doPost` para auditoría de consultas y sincronización en Google Sheets.
- `proyecto/appsscript.json`: Manifiesto corporativo con zona horaria `America/Santiago` y permisos de ejecución Google Workspace.
- `docs/ANALISIS-REPLICA-Y-WORKSPACE.md`: Informe arquitectónico y pedagógico de la solución.
- `assets/`: Logotipos corporativos oficiales de Salfa Montajes en SVG y PNG.

---

## 6. Sincronización y Mantenimiento

Para replicar cambios a Google Drive:
```powershell
powershell.exe -ExecutionPolicy Bypass -File "E:\Claude\Portales-Salfa-Pilotos\sincronizar-drive.ps1"
```

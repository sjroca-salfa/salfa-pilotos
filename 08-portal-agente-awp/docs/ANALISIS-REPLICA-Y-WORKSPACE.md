# ANÁLISIS ARQUITECTÓNICO Y PLAN DE INTEGRACIÓN CON GOOGLE WORKSPACE
**Portal:** 08 - Agente AWP (Advanced Work Packaging) · Salfa Montajes  
**Ecosistema:** Portales Salfa Pilotos (Salfa Montajes / SalfaCorp)  
**Fecha:** 2026-10-31  

---

## 1. Resumen Ejecutivo y Enfoque Metodológico

El **Portal 08 - Agente AWP** resuelve el desafío de transferir la metodología internacional del **Construction Industry Institute (CII)** a la ejecución práctica de proyectos industriales en Salfa Montajes, articulando dos requerimientos críticos:
1. **Uso de la IA del Usuario:** El usuario puede vincular su propia clave de Google Gemini API (o utilizar el modelo offline embebido) para realizar consultas interactivas de faena.
2. **Propiedad Intelectual y Fuentes en NotebookLM:** Las fuentes de verdad documentales (manuales y guías CII RT-272, RT-319, RT-390 y procedimientos internos de Salfa) residen en las libretas privadas de Google NotebookLM del usuario.
3. **Guardrail Anti-Dumping Inmutable:** La IA tiene expresamente restringida la copia textual masiva o transcripción de manuales completos. Opera exclusivamente en un **modelo de asistencia consultiva y formativa**, desplegando tablas, esquemas y checklists según las necesidades del aprendizaje.

---

## 2. Mapa de Vistas y Componentes

| ID Vista | Nombre | Audiencia Principal | Funcionalidad |
|---|---|---|---|
| **V-01** | Tutor IA Consultivo | Workface Planners, Jefes de Terreno, Ingenieros de Oficina Técnica | Chat interactivo con respuestas fundamentadas en CII, citas precisas y sugerencia de esquemas |
| **V-02** | Centro de Libretas NotebookLM | Administrador y Planificadores AWP | Gestión de URLs directas a las libretas de Google NotebookLM con fuentes originales |
| **V-03** | Catálogo de Tablas & Esquemas | Supervisores, Calidad y Planificación | Despliegue interactivo de las tablas CII (Jerarquía WBS, Matriz 7 Restricciones, PoC y Madurez) |
| **V-04** | Simulador IWP & Restricciones | Planificador de Terreno / Capataces | Ensayo de liberación de restricciones con semáforo y diagnóstico pedagógico con IA |
| **V-05** | Configuración de IA & Gobernanza | Usuario / Administrador | Gestión local de la API Key de Gemini, selector de modelo y auditoría de guardrails |

---

## 3. Matriz de Oportunidades de Integración con Google Workspace

| Capacidad | Enfoque Actual del Portal | Oportunidad con Google Workspace / Google Cloud | Valor para Salfa Montajes |
|---|---|---|---|
| **Gestión Documental Primaria** | Deep-links a Google NotebookLM del usuario | Carpetas Drive de Faena con sincronización automática de fuentes PDF | Consulta unificada sin duplicar almacenamiento ni infringir licencias |
| **Bitácora de Consultas y Restricciones** | `localStorage` + `Codigo.gs` con Google Sheets | Hoja `CONSULTAS_AWP` y `RESTRICCIONES_OBRA` en Google Sheets corporativo | Registro de dudas frecuentes de faena y análisis de cuellos de botella de AWP |
| **Identidad y Accesos** | SSO `@salfamontajes.com` vía Hub de Accesos | Google Workspace SSO con permisos basados en grupos de obra | Solo personal autorizado de faena accede al tutor y al simulador |
| **Auditoría de Paquetes (IWPs)** | Simulador visual interactivo | AppSheet o Formulario integrado con Sheets para que los capataces firmen el IWP | Trazabilidad del estado Constraint-Free desde el teléfono móvil en terreno |

---

## 4. Guardrail de Protección Intelectual: Arquitectura Dual

El sistema protege los contenidos mediante un mecanismo de doble barrera:
1. **Capa Cliente (Frontend):** Expresiones regulares que detectan intenciones de volcado masivo (`copia todo el manual`, `transcribe el libro`, `vuelca el capítulo`) antes de enviar el prompt a la red.
2. **Capa Prompt de Sistema (Gemini API):** Instrucción de sistema inyectada a nivel de API que condiciona al modelo a responder siempre con sintetizaciones pedagógicas, citas al estándar y orientación hacia la libreta NotebookLM respectiva.

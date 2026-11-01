# PROYECTO PERSONAL: ARQUITECTURA DE PROCESOS BPMN 2.0 CON INTELIGENCIA ARTIFICIAL
## SALFA MONTAJES S.A. — EXCELENCIA OPERACIONAL Y PLANIFICACIÓN

> **Especialista / Autor:** Sebastián Roca G.  
> **Contacto:** +56993543447 | **Correo Institucional:** sjroca@salfamontajes.com  
> **Código Diagrama:** `10000000-SAL-00000-DOC-DIA-00001` | **Procedimiento Rector:** `10000000-PRO-EST-001 (Rev. 0)`  
> **Fecha de Creación / Emisión:** Septiembre 2026 (Proyecto de Trabajo Autónomo e Investigación Aplicada)  
> **Estándar:** BPMN 2.0 (ISO/IEC 19510) · 100% Bizagi Modeler Compliant · Sistema de Diseño Corporativo BRASA 2A  

---

## 1. PROPÓSITO Y LÓGICA DE TRABAJO DEL PROYECTO

Este paquete de trabajo representa una iniciativa personal para demostrar cómo estructurar un **Flujo Universal de Modelado de Procesos impulsado por Inteligencia Artificial**. 

El sistema está concebido para operar de forma modular y desacoplada con **cualquier modelo de IA avanzado** (Claude 3.5 Sonnet, GPT-4o, Gemini 1.5 Pro, DeepSeek, etc.) mediante tres fases continuas y lógicas donde los insumos siempre preceden a los entregables:

```
  [01_Skill_y_Prompts_IA]        +       [02_Documentos_Fuente_Input]
   (Instrucciones, Estándar BRASA         (Procedimientos en PDF, Instructivos,
    y Metodología de Descomposición)        Matrices y Transcripciones de Terreno)
                  │                                     │
                  └──────────────────┬──────────────────┘
                                     │
                                     ▼
                   [03_Entregables_Generados_por_IA]
                    • Modelo_Procesos_Interactivo.html (Visor con Lector Integrado)
                    • Modelo_Procesos_SALFA.bpmn (XML 100% Bizagi Modeler)
                    • Modelo_Procesos_SALFA.bpm (Proyecto Nativo Bizagi)
                    • Diagramas Vectoriales SVG Corporativos con Cajetín
                    • Informes Técnicos de Descomposición AS-IS y Matriz RACI
```

---

## 2. ESTRUCTURA Y SECUENCIA DE CARPETAS

La jerarquía del paquete respeta estrictamente la secuencia de valor (*los insumos base van antes que los entregables*):

```text
C:\Users\sjroca\Desktop\Modelo_Procesos_SALFA\
│
├── Modelo_Procesos_Interactivo.html       <- VISOR WEB EJECUTABLE AL INSTANTE (Doble clic)
│                                             Contiene visor interactivo, diagrama BPMN dinámico,
│                                             simbología Bizagi y el texto íntegro del Procedimiento Rector
│                                             10000000-PRO-EST-001 con enlace cruzado bidireccional.
│
├── 00_Guia_Tecnica_y_Auditoria\           <- DOCUMENTACIÓN DE GOBERNANZA Y TRAZABILIDAD
│   └── LEEME_PROYECTO_SALFA.md            <- Esta guía técnica explicativa y metodológica.
│
├── 01_Skill_y_Prompts_IA\                <- INSUMO 1: REGLAS, SKILLS Y PROMPTS PARA LA IA
│   ├── PROMPT_MAESTRO_PARA_PROBAR_IA.md   <- Prompt universal listo para copiar y pegar en cualquier IA.
│   ├── SKILL_Mapa_Procesos_BPMN.md        <- Estándar formal BPMN 2.0, paleta BRASA 2A y Bizagi.
│   ├── SKILL_Descomposicion_Jerarquica.md <- Reglas de granularidad (Macro -> Proceso -> Subproceso).
│   └── ANEXO_PLANTILLAS_BPMN_Y_SVG.md     <- Reglas de diagramación, ruteo ortogonal y XML BPMNDI.
│
├── 02_Documentos_Fuente_Input\           <- INSUMO 2: DOCUMENTOS BASE DONDE SE DEPOSITAN LOS ARCHIVOS
│   ├── Caso_Principal_Lean_y_Restricciones\
│   │   ├── 10000000-PRO-EST-001 (Rev 0).pdf  <- Procedimiento corporativo oficial de Planificación Lean.
│   │   ├── [Anexos A001 al A008 en PDF]      <- Instructivos, matrices y fichas operacionales de faena.
│   │   └── INPUT_TEXTO_PLANO_LEAN_Y_RESTRICCIONES.md <- Transcripción limpia para procesamiento por IA.
│   └── Caso_Alternativo_Agil_Punch_List\     <- Caso de prueba ágil de aseguramiento de calidad (.docx y .txt).
│
└── 03_Entregables_Generados_por_IA\      <- SALIDA: PRODUCTOS GENERADOS AUTOMÁTICAMENTE POR LA IA
    ├── Modelo_Procesos_Interactivo.html   <- Copia de respaldo del visor web interactivo.
    ├── Modelo_Procesos_SALFA.bpmn          <- BPMN 2.0 XML con 100% de shapes y edges BPMNDI (Bizagi Ready).
    ├── Modelo_Procesos_SALFA.bpm          <- Proyecto nativo ejecutable directamente en Bizagi Modeler.
    ├── Diagrama_Macroproceso_Integrado.svg <- Diagrama vectorial AS-IS con cajetín corporativo oficial.
    ├── Diagrama_Detalle_PROC-01_Last_Planner.svg <- Diagrama detallado de planificación táctica.
    ├── Diagrama_Detalle_PROC-02_Restricciones.svg <- Diagrama detallado de gestión y liberación de restricciones.
    ├── INFORME_MODELADO_Y_DESCOMPOSICION_AS-IS.md <- Ficha metodológica, clasificación VA/TR/CT y matriz RACI.
    └── MATRIZ_INTERACCION_Y_HANDOFFS.md   <- Análisis de hand-offs, contratos de interfaz y flujos cruzados.
```

---

## 3. COMPATIBILIDAD 100% GARANTIZADA CON BIZAGI MODELER

El archivo `Modelo_Procesos_SALFA.bpmn` ha sido sometido a auditoría estricta de metamodelo BPMN 2.0 (OMG) y compatibilidad con el motor de importación de **Bizagi Modeler (v4.0+)**:

1. **Topología Geométrica BPMNDI Completa:**
   - **30 Flujos de Secuencia, Mensaje y Asociación:** Todos cuentan con su elemento `<bpmndi:BPMNEdge>` correspondiente y coordenadas `<di:waypoint>` ortogonales que conectan con exactitud matemática el borde de salida del nodo origen y el borde de entrada del nodo destino (0 referencias rotas).
   - **46 Nodos Gráficos:** Piscinas (`participant`), carriles (`lane`), tareas (`userTask`, `manualTask`, `serviceTask`, `callActivity`), compuertas (`parallelGateway`, `exclusiveGateway`), eventos (`startEvent`, `endEvent`), objetos de datos (`dataObjectReference`), almacenes (`dataStoreReference`) y anotaciones de texto (`textAnnotation`) cuentan con su respectivo `<bpmndi:BPMNShape>` y coordenadas `<dc:Bounds>`.
2. **Eventos de Mensaje Canónicos:**
   - El evento de inicio de `PROC-02` (`Start_PROC_02`) incorpora su definición canónica `<bpmn:messageEventDefinition>` al recibir el flujo de mensaje (`REL-0002`) desde la Call Activity de `PROC-01`.
   - El evento de fin de `PROC-02` (`End_PROC_02`) incorpora su definición de mensaje `<bpmn:messageEventDefinition>` al emitir el hand-off de desbloqueo (`REL-0003`) hacia `PROC-01`.
3. **Archivo de Proyecto Nativo (.bpm):**
   - Para máxima comodidad, se incluye adicionalmente el archivo `Modelo_Procesos_SALFA.bpm`, permitiendo abrir el modelo en Bizagi Modeler de inmediato con doble clic, sin requerir pasos de importación adicionales.

---

## 4. CARACTERÍSTICAS DEL VISOR WEB INTERACTIVO

Al abrir `Modelo_Procesos_Interactivo.html` (tanto en la raíz como dentro de `03_Entregables_Generados_por_IA`), se dispone de:

1. **5 Pestañas de Navegación Especializadas:**
   - **1. Macroproceso Integrado:** Visión global de extremo a extremo, mostrando la interacción entre PROC-01 y PROC-02, carriles por rol y botones de ventana emergente.
   - **2. Detalle PROC-01 (Planificación Táctica):** Flujo semanal en Primavera P6 EPPM y Oracle Primavera Cloud (OPC), con subprocesos colapsables/desplegables (`[+]`/`[-]`), objetos de datos y almacenes de datos.
   - **3. Detalle PROC-02 (Gestión de Restricciones):** Flujo de liberación y desbloqueo en terreno, carriles por responsabilidad y SLA de 48 horas.
   - **4. Matriz de Interacción y Hand-offs:** Tabla comparativa de entradas, salidas y contratos operacionales entre procesos.
   - **5. Documento Rector Fuente (10000000-PRO-EST-001):** Visualizador del estándar normativo oficial con índice lateral navegable y **enlaces de salto directo al diagrama** (`[Ver en Diagrama]`). A su vez, desde el panel Inspector de cualquier tarea o artefacto del diagrama se puede hacer clic en **`[Ver en Documento Rector]`** para leer su base normativa de inmediato.
2. **Descarga Instantánea:**
   - Botón **`[ 📥 Descargar BPMN 2.0 XML ]`**: Descarga el archivo XML verificado para Bizagi.
   - Botón **`[ 📥 Descargar Bizagi (.bpm) ]`**: Descarga el proyecto nativo de Bizagi Modeler.
   - Botón **`[ 📷 Descargar SVG ]`**: Descarga el diagrama actual en alta resolución con cajetín institucional SALFA Montajes S.A., código provisorio y firma de Sebastián Roca G.
3. **Ergonomía Visual BRASA 2A:**
   - Paleta corporativa sobria (Rojo Salfa `#B01E24`, Grafito `#2E343C`, Fondo `#F8FAFC`).
   - Botón **`[ ⛶ Ajustar a Pantalla ]`** para adaptar automáticamente el zoom al ancho exacto del monitor sin cortes de márgenes.
   - Botón **`[ ⇄ Ocultar/Ver Inspector ]`** para maximizar el área de trabajo.

---
name: descomposicion-jerarquia-procesos
description: Metodología, reglas heurísticas y algoritmo de decisión para analizar, clasificar y descomponer arquitecturas de negocio en Macroprocesos, Procesos, Subprocesos, Actividades y Tareas bajo el estándar BPMN 2.0 y su articulación con los niveles documentales corporativos de SALFA Montajes S.A. (Serie Organizacional O1-O6 y Serie Normativa N1-N9). Usar cuando se requiera analizar la granularidad de un proceso, delimitar alcance fin-a-fin, determinar si un documento o texto describe un macroproceso, proceso, subproceso o tarea atómica, y estructurar catálogos maestros jerárquicos.
---

> **Especialista / Autor:** Sebastián Roca G.  
> **Contacto:** +56993543447 | **Correo:** sjroca@salfamontajes.com  
> **Organización:** SALFA Montajes S.A. — Excelencia Operacional y Planificación  

> **Propósito Operativo.** Esta skill proporciona el marco metodológico y el algoritmo de decisión para discernir con rigor técnico si una entidad de negocio, procedimiento, documento o levantamiento en terreno corresponde a un **Macroproceso**, un **Proceso**, un **Subproceso**, una **Actividad** o una **Tarea**.
> 
> **Fundamento Metodológico.** Basado en el estándar internacional de modelado y gestión por procesos **BPMN 2.0 (ISO/IEC 19510)**, las mejores prácticas de arquitectura empresarial y el **Marco de Gobernanza Documental Corporativo de SALFA Montajes S.A.** (Serie Organizacional `O1` a `O6` y Serie Normativa/Ejecución `N1` a `N9`).

---

## 1. Principio Fundamental: Información Documentada vs Flujo Procesal Vivo

En organizaciones industriales y de construcción de gran escala como SALFA Montajes S.A., existe una distinción crítica que todo analista y agente de procesos debe gobernar:

```
┌────────────────────────────────────────────────────────────────────────┐
│                      SISTEMA DOCUMENTAL CORPORATIVO                    │
│   Fija los NIVELES DE INFORMACIÓN DOCUMENTADA (Series O1-O6 y N1-N9)    │
│   (Gobernanza, Políticas, Estándares, Formatos, Registros, Contratos)  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ Regula / Estandariza
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                   ARQUITECTURA DE PROCESOS OPERACIONALES               │
│   Agrupa y organiza los FLUJOS DINÁMICOS por GERENCIAS Y DOMINIOS      │
│   (Macroprocesos ➔ Procesos Fin-a-Fin ➔ Subprocesos ➔ Actividades)    │
└────────────────────────────────────────────────────────────────────────┘
```

1. **Las Tablas de Gobernanza fijan los Niveles Documentales:**
   - La **Serie Organizacional (`O1` a `O6`)** regula la estructura, facultades y gobierno institucional.
   - La **Serie Normativa y de Ejecución (`N1` a `N9`)** regula los compromisos, reglas técnicas, instrucciones y evidencias probatorias.
2. **Los Procesos se agrupan por Gerencias y Dominios de Negocio:**
   - Un proceso vivo no es un archivador estático; es una **concatenación lógica de actividades a través del tiempo y lugar, orientada por eventos, que transforma insumos para entregar valor concreto a un cliente interno o externo**.
   - Los procesos operacionales cruzan múltiples documentos y departamentos; por ello, la arquitectura procesal se articula en **Dominios Canónicos y Gerencias Ejecutoras** (Dirección y Estrategia, SGI y Excelencia Operativa, Personas y Organización, Comercial y Negocios, Operaciones y Construcción, Cadena de Suministro).

---

## 2. Los 3 Niveles de Abstracción Estructural en BPMN 2.0

Para evitar la sobrecarga cognitiva y mantener la trazabilidad ejecutiva, la arquitectura de procesos se modela en tres niveles concéntricos de abstracción:

| Nivel Estructural | Perspectiva / Audiencia | Objetivo Principal | Límite de Complejidad por Hoja / Diagrama | Elementos Notacionales Habilitados |
|---|---|---|---|---|
| **Nivel 1 — Descriptivo** | Gerencia General, Directores, Dueños de Dominio | Visión panorámica fin-a-fin (End-to-End). Identifica alcance, disparadores iniciales, resultado de valor y participantes clave. Principio rector: *«Don't make me think»*. | **Máximo 10 objetos de flujo y 8 artefactos** en una sola vista. Solo camino feliz (happy path). | Contenedor (*Pool*) único con Carriles (*Lanes*). Tareas simples sin tipología compleja. Subprocesos cerrados (`+`). Compuertas solo Exclusiva (XOR) y Paralela (AND). Sin eventos adjuntos. |
| **Nivel 2 — Operacional** | Jefaturas de Departamento, Ingenieros de Obra, Auditores | Lógica operativa rigurosa y completa. Modelado de excepciones, rechazos, reintentos, compuertas decisionales y reglas de negocio. | **8 a 15 actividades por diagrama**. Todo flujo mayor se descompone y encapsula en **Subprocesos**. | Tipos de tareas específicos (Usuario, Manual, Servicio, Regla de Negocio). Subprocesos embebidos y reusables (*Call Activity*). Eventos adjuntos al límite (temporización, error). Flujos de mensaje entre *Pools*. |
| **Nivel 3 — Técnico / Ejecutable** | Desarrolladores BPMS, Arquitectos TI, Automatización | Orquestación en motores de flujo de trabajo, transacciones ACID, invocación de APIs, scripts y correlación de mensajes. | Especificación técnica formal por servicio o script. | Parámetros de ejecución, expresiones formales de datos, web services, transacciones de compensación. |

---

## 3. Algoritmo de Clasificación Jerárquica: Delimitación de Niveles

Para determinar con precisión taxonómica la jerarquía de una entidad analizada, aplique el siguiente algoritmo en cascada:

```
¿Abarca múltiples procesos interdependientes sin un evento de inicio atómico único,
coordinando toda una gerencia o cadena de valor corporativa?
   │
   ├─► SÍ ──► [ MACROPROCESO ] (Nivel 0 / Dominio de Negocio)
   │
   └─► NO ──► ¿Tiene un evento disparador explícito, transcurre de punta a punta (End-to-End),
              posee un único Dueño de Proceso (Process Owner) y produce un resultado de valor directo?
                 │
                 ├─► SÍ ──► [ PROCESO ] (Nivel 1 BPMN / Proceso de Negocio)
                 │
                 └─► NO ──► ¿Es un tramo delimitado dentro de un proceso mayor que encierra
                            lógica propia, múltiples actividades y su propio sub-flujo medible?
                               │
                               ├─► SÍ ──► [ SUBPROCESO ] (Nivel 2 BPMN / Actividad Compuesta)
                               │
                               └─► NO ──► ¿Es una unidad indivisible de trabajo continuo realizada
                                          por un único rol en un momento determinado sin interrupción?
                                             │
                                             ├─► SÍ ──► [ ACTIVIDAD / TAREA ] (Unidad Atómica BPMN)
                                             │
                                             └─► NO ──► ¿Es un clic de software, validación de pantalla o paso físico simple?
                                                           │
                                                           └─► SÍ ──► [ PASO DE TAREA / MICROACCIÓN ]
                                                                      (Instrucción de Trabajo N7 / No modelar en BPMN)
```

### 3.1. Definición y Reglas de Cada Nivel

#### A. Macroproceso (Nivel 0 / Cadena de Valor)
- **Definición:** Gran conjunto de procesos interrelacionados que estructuran una función vital o dominio directivo de la compañía. No posee un único evento de inicio transaccional; coordina ciclos de vida continuos.
- **Dueño:** Gerente General o Gerente de Área Corporativo.
- **Gobernanza Asociada:** Serie Organizacional `O1 MCV` (Modelo de Creación de Valor), `O2 POG` (Propósitos y Objetivos Clave de Gerencia) y Serie Normativa `N2 MGO` (Marco de Gobernanza).
- **Ejemplo en SALFA:** `D5.M1 Operaciones y Construcción`, `D1.M1 Gobernanza Corporativa y Gestión Estratégica`, `D2.M2 Planificación Táctica y Productividad (PMO)`.

#### B. Proceso (Nivel 1 BPMN / Proceso de Negocio Fin-a-Fin)
- **Definición:** Secuencia completa de punta a punta (End-to-End) que reacciona ante un **evento disparador específico** (llegada de solicitud de licitación, hallazgo de no conformidad, inicio de mes contable) y concluye con un **evento de resultado de valor** que satisface a un cliente interno o externo.
- **Dueño:** Jefatura de Departamento o Subgerente de Área (*Process Owner* único).
- **Gobernanza Asociada:** Serie Normativa `N5 PRO` (Procedimiento Maestro) o `N3 MAN` (Manual Operativo).
- **Regla de Granularidad:** En el Nivel 1 se representa mediante un único diagrama descriptivo con máximo 10 objetos de flujo, donde sus fases principales aparecen como **Subprocesos Cerrados (`+`)**.
- **Ejemplo en SALFA:** `PROC-D1-01 Gestión de Riesgos Corporativos`, `PROC-D2-01 Planificación y Ejecución de Auditorías Internas`, `PROC-D2-07 Planificación Táctica Last Planner (LPS)`.

#### C. Subproceso (Nivel 2 BPMN / Actividad Compuesta)
- **Definición:** Tramo delimitado y cohesivo de un proceso que agrupa una secuencia interna de actividades orientadas a cumplir una meta intermedia verificable. Se encapsula como un solo objeto en el nivel superior para modularizar el modelo y reducir la complejidad gráfica.
- **Tipología BPMN:**
  1. *Subproceso Embebido:* Pertenece exclusivamente al proceso padre y no puede reutilizarse externamente.
  2. *Subproceso Reutilizable (Call Activity):* Flujo estandarizado que es llamado por múltiples procesos distintos (ej. «Gestión de Compras Menores en Faena», «Notificación Formal y Visado Legal»).
  3. *Subproceso de Evento (Event Sub-Process):* Flujo activado de forma reactiva ante una excepción o señal dentro del contexto del proceso padre sin conectores de secuencia directos.
- **Gobernanza Asociada:** Capítulos de un `N5 PRO`, Estándares Operativos `N4 EST` o Instructivos Técnicos `N7 INS`.
- **Ejemplo en SALFA:** `SUBP-D1-01-01 Identificación y Levantamiento de Riesgos`, `SUBP-D2-07-02 Liberación de Restricciones Lookahead 6 Semanas`, `SUBP-D5-01-03 Recepción y Descarga de Combustible Diesel en Obra`.

#### D. Actividad / Tarea Atómica (Nivel Operacional de Flujo de Trabajo)
- **Definición:** Unidad básica indivisible de trabajo continuo realizada por un **único recurso o rol funcional** (un carril / *Lane*) en un intervalo temporal definido, sin suspensiones de días ni transferencias de responsabilidad intermedias.
- **Tipología Estándar BPMN:**
  - *Tarea de Usuario (User Task):* Persona operando un sistema digital (ej. «Ingresar desvío de calidad en Aconex»).
  - *Tarea Manual (Manual Task):* Persona ejecutando sin soporte informático (ej. «Colocar cáncamo de izaje en viga»).
  - *Tarea de Servicio (Service Task):* Sistema informático o script automático (ej. «Calcular SPI semanal en SAP»).
  - *Tarea de Regla de Negocio (Business Rule Task):* Evaluación de matriz de decisión o política desacoplada (ej. «Determinar nivel de severidad de riesgo 5x5»).
  - *Tarea de Envío / Recepción (Send/Receive Task):* Mensaje transaccional hacia/desde participante externo.
- **Gobernanza Asociada:** Formularios `N8 FOR` (entradas/salidas) e Instructivos de Trabajo `N7 INS`.

#### E. Paso de Tarea / Microacción (No Modelar en BPMN)
- **Definición:** Secuencia pormenorizada de clics, accesos a menús, fotocopias o gestiones físicas individuales.
- **Regla Estricta:** **PROHIBIDO MODELAR COMO BPMN**. Representar clics como tareas satura los diagramas y destruye la visión de negocio. Estos pasos pertenecen al manual de usuario o checklist operativo asociado al Formulario `N8 FOR`.

---

## 4. Matriz Oficial de Gobernanza Documental vs Arquitectura de Procesos

SALFA Montajes S.A. estructura su información documentada en dos series canónicas de control maestro. La siguiente tabla establece la equivalencia funcional y el foco ontológico de cada nivel:

### 4.1. Serie Organizacional (Tabla 6-1 Oficial) — Regula la Estructura Corporativa
*Fondo institucional grafito, sin sellos ISO de proyecto, marca de agua geométrica propia.*

| Nivel | Sigla Oficial | Denominación Canónica | Pregunta Clave / Foco Ontológico | Tipo de Contenido y Alcance | Relación con la Arquitectura de Procesos |
|---|:---:|---|---|---|---|
| **O1** | **MCV** | **Modelo de Creación de Valor** | **POR QUÉ** | Propósito estratégico, pilares de sostenibilidad, cadena de valor global y compromisos corporativos fundamentales. | Gobierna los límites de los **Dominios Canónicos** y la priorización estratégica. |
| **O2** | **POG** | **Propósito y Objetivos Clave de Gerencia** | **PARA QUÉ** | Misión gerencial, objetivos estratégicos (OKRs/KPIs), alcance funcional y metas cuantitativas de cada gerencia. | Establece los objetivos e indicadores de éxito de los **Macroprocesos**. |
| **O3** | **ORG** | **Organigrama General** | **QUIÉN RESPONDE A QUIÉN** | Líneas jerárquicas formales, niveles de reporte, dependencias directas y subordinaciones operacionales. | Define la jerarquía de Contenedores (*Pools*) y los cargos de los *Process Owners*. |
| **O4** | **MOI** | **Modelo de Operación e Interfaces** | **CON QUIÉN** | Interacciones cross-funcionales, acuerdos de nivel de servicio (SLA) internos y traspaso de información entre gerencias. | Modela los **Flujos de Mensajes inter-Pools** y las compuertas de coordinación. |
| **O5** | **EOF** | **Estructura Organizacional y Funcional** | **CÓMO SE ORGANIZA** | Distribución de departamentos, áreas operativas, responsabilidades funcionales y células de trabajo. | Modela los Carriles funcionales (*Lanes*) dentro del *Pool* de cada gerencia. |
| **O6** | **DCA** | **Descriptor de Cargo** | **QUÉ SE EXIGE** | Funciones específicas, competencias técnicas, requisitos de formación y atribuciones formales de cada puesto. | Asigna responsabilidades directas en la Matriz RACI (`R`) de las **Tareas de Usuario**. |

### 4.2. Serie Normativa y de Ejecución (Tabla 6-2 Oficial) — Regula la Operación y Evidencias
*Fondo blanco, dorsal roja corporativa, sellos ISO de faena al pie.*

| Nivel | Sigla Oficial | Denominación Canónica | Pregunta Clave / Foco Ontológico | Tipo de Contenido y Alcance | ¿Aplica Modelado BPMN? | Tratamiento en la Arquitectura Procesal |
|---|:---:|---|---|---|:---:|---|
| **N1** | **POL** | **Política** | **A QUÉ NOS COMPROMETEMOS** | Declaración formal de directrices y compromisos de la Alta Dirección (Hoja única A3). | **NO** | Artefacto de alineamiento estratégico; no posee flujo ni tareas. |
| **N2** | **MGO** | **Marco de Gobernanza** | **QUIÉN Y CON QUÉ REGLAS SE DECIDE** | Reglas de corte, matrices DOA de atribuciones, taxonomía documental y glosarios canónicos. | **SÍ (Nivel 1)** | Modela la macrocadena de valor del sistema y las compuertas de gobernanza. |
| **N3** | **MAN** | **Manual** | **CÓMO FUNCIONA** | Compendio descriptivo e integrador del funcionamiento global del sistema o área de gestión. | **NO (Consulta)** | Fuente de referencia conceptual y arquitectura; no es un flujo algorítmico ejecutable. |
| **N4** | **EST** | **Estándar** | **QUÉ Y CUÁNTO** | Criterios técnicos de diseño, especificaciones de ingeniería, tolerancias de montaje y requisitos cuantitativos. | **NO (Regla Pura)** | **Regla de No Mezcla:** Se desacopla del flujo y se referencia como *Tarea de Regla de Negocio* o *Anotación*. |
| **N5** | **PRO** | **Procedimiento** | **QUIÉN, CUÁNDO Y EN QUÉ ORDEN** | Secuencia cronológica y estructurada de pasos operativos multirrol para transformar insumos en entregables. | **SÍ (Nivel 2)** | **EJE CENTRAL:** Constituye el documento rector que describe el **Proceso y sus Subprocesos**. |
| **N6** | **ENT** | **Entregable de Proyecto** | **QUÉ ENTREGAMOS AQUÍ** | Documentos, memorias, planos y dossiers emitidos contractualmente bajo exigencias del mandante de obra. | **NO (Producto)** | Se modela como la **Salida / Evento de Fin** del proceso de faena. |
| **N7** | **INS** | **Instrucciones** | **CÓMO, PASO A PASO** | Detalle metódico y paso a paso para ejecutar una tarea compleja específica en faena o taller. | **SÍ (Nivel 2 Terreno)** | Subproceso operativo focalizado en terreno con puntos de detención obligatorios (*Hold Points*). |
| **N8** | **FOR** | **Formulario** | **DÓNDE SE ANOTA** | Plantilla estructurada en blanco para recolectar datos, chequeos de calidad o inspecciones de seguridad. | **NO (Dato Entrada)** | Se modela como un **Objeto de Datos (*Data Object*)** vinculado a una actividad. |
| **N9** | **REG** | **Registro** | **QUÉ LO PRUEBA** | Formulario completado y firmado que certifica la ejecución real y sirve de evidencia inmutable ante auditorías. | **NO (Salida / Depósito)** | Se modela como **Objeto de Salida** archivado en un **Depósito de Datos (*Data Store*)**. |

---

## 5. Reglas Críticas de No Mezcla y Desacoplamiento (Patología Híbrida)

Uno de los mayores vicios en los sistemas de gestión tradicionales es la **patología híbrida**: documentos clasificados como «Estándares» que en su interior contienen procedimientos operativos con firmas de autorización, o «Procedimientos» que contienen tablas estáticas de tolerancias técnicas de hormigones o soldaduras.

### 5.1. Regla de Desacoplamiento Formal Gate 3
1. **Los Estándares (`N4 EST`) definen el QUÉ Y CUÁNTO:**
   - Tolerancias milimétricas, especificaciones ASTM/AWS, ratios de productividad, porcentajes de retención contractual.
   - Son inalterables frente a cambios en la secuencia de aprobación o herramientas informáticas.
2. **Los Procedimientos (`N5 PRO`) definen el QUIÉN, CUÁNDO Y EN QUÉ ORDEN:**
   - Carriles de participantes, compuertas decisionales, plazos SLA de revisión y traspaso de información en el CDE.
3. **Mecanismo de Desacople:**
   - Si un documento histórico titulado `EST-001` contiene pasos de cuadrilla o aprobaciones de pago, **se extrae la secuencia operativa hacia un nuevo `PRO-001` en BPMN 2.0**, dejando en el `EST-001` únicamente los criterios normativos y tolerancias técnicas puras.
   - En el diagrama BPMN, el cumplimiento del estándar se modela mediante una **Tarea de Regla de Negocio** vinculada al `EST` correspondiente.

---

## 6. Procedimiento Paso a Paso para Analizar y Mapear una Entidad

Al recibir un documento, solicitud o transcripción de entrevista de faena, siga este procedimiento estricto de 7 pasos:

### Paso 1: Localización en la Frontera (Trigger & Value Outcome)
- Identifique el **Evento Disparador:** ¿Qué hecho concreto o llegada de información despierta la ejecución? (ej. «Recepción de bases de licitación», «Falla imprevista en grúa torre»).
- Identifique el **Resultado de Valor:** ¿Qué producto concreto se le entrega al cliente interno o mandante al terminar? (ej. «Oferta técnico-económica cargada», «Equipo liberado con protocolo QA/QC»).
- Si no existe un disparador atómico o el resultado es genérico para toda la empresa, **es un Macroproceso (`N2 MGO` / `O2 POG`)**, no un proceso operacional.

### Paso 2: Fijación del Nivel Notacional
- Si el objetivo es presentar a la Gerencia General o alinear participantes: declare **Nivel 1 Descriptivo** (máximo 10 objetos de flujo, camino feliz).
- Si el objetivo es auditar en obra, formalizar responsabilidades o preparar automatización: declare **Nivel 2 Operacional** (tratamiento completo de excepciones, compuertas lógicas y roles RACI).

### Paso 3: Identificación de Participantes y Carriles (Lanes)
- Cada rol funcional que interviene con autonomía de firma o ejecución recibe su propio **Carril (*Lane*)** dentro del Contenedor (*Pool*).
- Si interviene un actor externo (el Mandante, un Subcontratista independiente, la Inspección Técnica de Obra - ITO), **debe modelarse en un Contenedor (*Pool*) propio cerrado**, comunicándose exclusivamente a través de **Flujos de Mensaje (líneas discontinuas)**.

### Paso 4: Descomposición en Subprocesos (Regla de 8 a 15 Actividades)
- Cuente las actividades secuenciales. Si el diagrama supera las **15 actividades**, identifique bloques de trabajo continuos que tengan coherencia funcional propia (ej. «Evaluación Técnica de Propuesta», «Inspección de Ensayes no Destructivos»).
- Encapsule ese bloque en un **Subproceso (`+`)** con su propio nombre sustantivado.
- Modele el interior del subproceso en un diagrama subordinado de Nivel 2.

### Paso 5: Desacoplamiento de Criterios y Reglas de Negocio
- Nunca dibuje árboles de 10 compuertas exclusivas para evaluar tablas de tolerancias o montos de firma.
- Reemplace el árbol por una **Tarea de Regla de Negocio** (ícono de tabla/matriz) y documente la regla en el estándar técnico `N4 EST` o en la tabla de delegación de autoridad (DOA).

### Paso 6: Vinculación de Artefactos de Información
- Identifique los formularios en blanco donde se ingresa información: asócielos como **Objetos de Datos (`N8 FOR`)**.
- Identifique los reportes firmados y protocolos cerrados: modélelos como **Registros Inmutables (`N9 REG`)** almacenados en el **Depósito de Datos (`Data Store`)** de la plataforma CDE (Aconex / BIM360 / SAP).

### Paso 7: Trazabilidad en el Catálogo Maestro de Procesos
- Asigne el código canónico al proceso (`PROC-DX-YY`) y a sus subprocesos (`SUBP-DX-YY-ZZ`).
- Verifique que la Matriz RACI identifique al menos un Responsable (`R`) y un Aprobador (`A`).
- Formule la trazabilidad en el libro maestro de Excel vinculando el código del documento eje en el inventario total.

---

## 7. Catálogo de Anti-Patrones y Errores Habituales

1. **Anti-Patrón «El Clic Informático»:**
   - *Error:* Modelar «Abrir navegador», «Hacer clic en Iniciar Sesión», «Presionar Guardar».
   - *Corrección:* Una sola actividad: «Registrar requerimiento en sistema ERP» (Tarea de Usuario).
2. **Anti-Patrón «El Organigrama en Movimiento»:**
   - *Error:* Crear un proceso a partir de los puestos de trabajo de un organigrama `O3 ORG`, inventando un flujo secuencial forzado entre jefes y subordinados.
   - *Corrección:* Los procesos cruzan los departamentos; no nacen de la jerarquía sino del flujo de valor de la faena.
3. **Anti-Patrón «El Proceso Infinito sin Salida»:**
   - *Error:* Flujos que describen actividades de supervisión continua («Supervisar faena») sin evento de término ni producto final medible.
   - *Corrección:* La supervisión no es un proceso en sí; es una actividad de control dentro de un subproceso de ejecución («Liberar frente de trabajo»).
4. **Anti-Patrón «La Compuerta Mágica sin Salidas Rotuladas»:**
   - *Error:* Compuerta rombo sin texto o con ramas que no aclaran la condición de bifurcación.
   - *Corrección:* Toda compuerta decisional se formula como una pregunta clara («¿Cumple tolerancia?») y cada rama saliente se rotula con la condición respectiva (`[Sí]`, `[No]`).
5. **Anti-Patrón «El Estándar Procedimentado»:**
   - *Error:* Publicar un documento `EST` que dicta paso a paso cómo aprobar una factura o quién envía un correo.
   - *Corrección:* Desacoplar formalmente en un procedimiento `N5 PRO`.

---

## 8. Guía de Ejecución para el Agente Autónomo

Cuando el usuario le solicite clasificar o documentar un proceso a partir de un texto, correo, procedimiento o documento corporativo, el agente debe:

1. **Emitir el Diagnóstico Taxonómico Inicial:**
   - Indicar explícitamente a qué nivel jerárquico pertenece la entidad (Macroproceso, Proceso, Subproceso, Actividad o Tarea).
   - Indicar la correspondencia con las series de gobernanza (`O1-O6` o `N1-N9`).
2. **Declarar el Nivel de Abstracción:**
   - Fijar si la respuesta entregará un modelo **Nivel 1 Descriptivo** (ejecutivo) o **Nivel 2 Operacional** (faena/sistema).
3. **Estructurar la Descomposición Jerárquica:**
   - Presentar el Proceso eje y la lista de todos sus Subprocesos alineados.
   - Definir para cada subproceso: Entradas (Inputs), Salidas (Outputs), Responsable (R), Aprobador (A), Documento Rector y Formatos Asociados.
4. **Respetar la Nomenclatura Gramatical Estricta:**
   - Procesos y Subprocesos: **Sustantivados** (ej. «Calibración y Control de Equipos EIME»).
   - Tareas y Actividades: **Verbo en Infinitivo + Objeto Directo** (ej. «Verificar certificado de calibración en laboratorio»).

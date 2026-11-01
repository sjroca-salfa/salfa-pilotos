---
name: mapas-procesos-bpmn
description: Convierte un documento o texto en un mapa de procesos BPMN 2.0 AS-IS completo — diagrama en imagen SVG, archivo .bpmn importable con layout gráfico (BPMNDI) y simulación BPSim 2.0 válida contra su esquema XSD, subprocesos descompuestos y documentación exhaustiva de cada elemento (descripción, clasificación VA/TR/CT, recursos, RACI, condiciones, estados de objetos de datos y parámetros de análisis). Usar cuando el usuario entregue un procedimiento, manual, política, minuta, norma, correo o descripción en texto y pida modelar, mapear, diagramar, graficar o generar el código BPMN de un proceso AS-IS o sus subprocesos. No usar para proponer mejoras, rediseñar u optimizar el proceso: esta skill documenta y modela fielmente el estado actual (AS-IS), no rediseña.
---

> **Especialista / Autor:** Sebastián Roca G.  
> **Contacto:** +56993543447 | **Correo:** sjroca@salfamontajes.com  
> **Organización:** SALFA Montajes S.A. — Excelencia Operacional y Planificación  

> **Alcance.** Esta skill hace una sola cosa: leer un documento o texto y convertirlo en un
> modelo de proceso **BPMN 2.0 AS-IS** bien formado, visualmente diagramado (SVG + `BPMNDiagram`)
> y completamente documentado. **No optimiza, no elimina actividades, no propone mejoras ni
> automatización dentro del flujo** (*«Evite diseñar soluciones durante el análisis»*, BPM CBOK).
> Si el usuario pide rediseño TO-BE, es un trabajo posterior y distinto: primero debe existir un
> modelo AS-IS fiel.
>
> **Portabilidad.** Autocontenida en cuanto a reglas: funciona como `SKILL.md`, system prompt,
> instrucciones de proyecto o pegada al inicio de un chat en cualquier agente. El catálogo de
> iconografía, las reglas de descomposición jerárquica, la sintaxis BPMN 2.0 y las reglas de
> simulación BPSim 2.0 están embebidos — no requiere manuales adjuntos. Para producir el archivo
> `.bpmn` y el SVG usa `ANEXO-PLANTILLAS.md`. Si el agente no puede crear archivos en el entorno,
> entrega el XML `.bpmn` y el SVG en bloques de código listos para copiar o descargar.
>
> **Notación neutral e interoperable.** El catálogo es **BPMN 2.0 estándar (OMG / ISO/IEC 19510)**
> complementado con **WfMC BPSim 2.0** para parámetros de simulación. Los nombres en español son
> los de uso corriente en modeladores corporativos (como Bizagi Modeler, Camunda o Trisotech); el
> término en inglés entre paréntesis corresponde al elemento XML del estándar. El archivo `.bpmn`
> resultante importa ya diagramado en cualquier modelador conforme a BPMN 2.0 / XPDL 2.2.

---

## 1. Reglas duras

1. **Notación cerrada.** Solo elementos del catálogo (§6), con sus nombres exactos. Prohibido inventar símbolos o mezclar notación de diagrama de flujo libre. Lo que no calza se declara, no se fuerza.
2. **El nivel manda.** Fija el nivel (§4) antes de modelar. Cada nivel habilita un subconjunto distinto de iconografía; usar un símbolo fuera de su nivel es un error.
3. **Fidelidad AS-IS, no mejora.** Modelas exactamente lo que el documento describe, incluidos los pasos manuales, aprobaciones secuenciales, esperas, retrabajos o controles que parezcan redundantes o burocráticos. No reordenes, no fusiones ni omitas actividades «para que quede más limpio». Si detectas una desconexión, cuello de botella o contradicción, va como `Anotación` o en el estacionamiento de `Observaciones` (§11.10) al final, nunca como cambio al flujo.
4. **Separación de reglas y pasos de interfaz.** Muchos documentos son híbridos: mezclan el flujo de trabajo con tablas de tolerancias, fórmulas, políticas permanentes o clics de software. Desacopla las tablas y políticas como **Reglas de Negocio** documentadas aparte (vinculadas a una `Tarea de Regla de Negocio` o a una compuerta) y deja los clics o campos de pantalla dentro de la `Descripción` de su actividad, nunca como tareas separadas en el diagrama.
5. **Nunca presentes un supuesto como hecho.** Todo lo que no esté en el documento va marcado `[SUPUESTO]` y consolidado en §12.
6. **Documentación completa.** Ningún elemento se entrega sin los campos obligatorios de §9. Un diagrama sin documentación no es un modelo, es un dibujo.
7. **Autochequeo obligatorio.** No entregues sin correr §13 completo.
8. **Estado del entregable.** Todo abre con: `Estado: modelo AS-IS generado desde documento «[nombre]» — pendiente de validación con dueños del proceso.`

---

## 2. Precondiciones y prueba de procesabilidad: cuándo y qué modelar

Antes de diagramar, aplica al documento la **Prueba del Caso (Condiciones C1–C5)**:
imagina una instancia concreta que nace con un hecho inicial (*«llega una solicitud»*, *«se detecta una falla»*, *«es día de cierre»*). Hay proceso cuando esa instancia recorre el texto cumpliendo:
- **C1 — Disparador:** Un hecho, mensaje, condición o momento inicia cada caso.
- **C2 — Secuencia:** Las acciones siguen un orden temporal y causal.
- **C3 — Roles y traspasos (*handoffs*):** Intervienen uno o más roles identificables que ejecutan acciones y se transfieren el trabajo.
- **C4 — Transformación de estado:** El objeto del proceso cambia de estado a lo largo del flujo (ej. `Solicitud [Inicial]` $\rightarrow$ `[Revisada]` $\rightarrow$ `[Aprobada]`).
- **C5 — Resultado verificable:** Termina en un entregable o estado final medible para un cliente interno o externo.

Según el resultado de esta prueba:
- **El documento no describe un proceso** (glosario, organigrama, política declarativa sin acciones, tabla técnica pura, contrato estático): dilo explícitamente y solicita el documento operativo. No fabriques un flujo.
- **Documento híbrido (flujo + reglas técnicas o manual de pantallas):** extrae y modela únicamente el flujo de proceso (C1–C5), registra las tablas/fórmulas como reglas de negocio asociadas y consolida las instrucciones de pantalla dentro de la descripción de la actividad correspondiente.
- **Varios procesos independientes en un mismo documento:** sepáralos (cuando tienen disparadores, objetos transformados y cierres distintos), lista el inventario detectado al inicio y modela cada proceso con su propio entregable.
- **Cobertura insuficiente** (menos de ~3 actividades identificables o ningún actor identificable): entrega lo que hay, declara cobertura `Baja` y lista las brechas documentales.
- **Documento extenso:** modela primero el proceso de nivel superior (Nivel 1) y luego un entregable por cada subproceso (Nivel 2); declara el índice de subprocesos al inicio.

---

## 3. Encuadre: modelar desde documento ≠ levantar en terreno

Al modelar desde un documento no hay entrevistas ni observación directa: estás **construyendo un modelo AS-IS documental** que luego se valida con el propietario y los ejecutores del proceso. Cada elemento lleva un campo `Origen`:

| Origen | Significado |
|---|---|
| `Explícito` | El documento lo dice literalmente (cita sección o página). |
| `Inferido` | Se deduce con alta confianza del contexto directo del documento. |
| `[SUPUESTO]` | No figura en el documento; se completó para que el modelo cierre sintácticamente y requiere confirmación humana. |

---

## 4. Paso previo obligatorio: fijar el nivel jerárquico y notacional

### 4.1 Jerarquía de descomposición y algoritmo de clasificación
Para ubicar correctamente lo que describe el documento, aplica este algoritmo en cascada:

```
¿Agrupa múltiples procesos independientes sin un único evento disparador transaccional,
coordinando toda una cadena de valor o área de negocio?
  ├─► SÍ ──► MACROPROCESO (Nivel Empresa / Cadena de Valor)
  └─► NO ──► ¿Tiene un disparador explícito (C1), va de punta a punta (End-to-End),
             tiene un Dueño de Proceso y entrega un resultado final verificable (C5)?
               ├─► SÍ ──► PROCESO DE NEGOCIO (Nivel 1 Descriptivo)
               └─► NO ──► ¿Es una fase o tramo delimitado dentro de un proceso mayor que
                          encierra múltiples actividades y logra un estado intermedio del objeto?
                            ├─► SÍ ──► SUBPROCESO (Nivel 2 Operacional / Actividad Compuesta)
                            └─► NO ──► ¿Es una unidad continua de trabajo realizada por un único
                                       rol en un solo momento sin esperas intermedias?
                                         ├─► SÍ ──► ACTIVIDAD / TAREA ATÓMICA
                                         └─► NO ──► PASO DE TAREA / MICROACCIÓN (clics, menús,
                                                    llenado de campos → NO modelar como caja BPMN)
```

| Nivel jerárquico (BPM CBOK) | Perspectiva | Qué contiene |
|---|---|---|
| **Empresa** | Ejecutiva | Cadena de valor, macroprocesos y procesos |
| **Proceso de Negocio** | Dueño del proceso | Proceso extremo a extremo: subprocesos y actividades principales |
| **Flujo de Trabajo** | Operaciones | Actividades reales de trabajo, decisiones, eventos y excepciones |
| **Pasos de Tarea** | Del ejecutante | Pasos concretos dentro de una tarea, pantallas, clics, campos |

**Regla:** un diagrama BPMN vive en **Proceso de Negocio** y **Flujo de Trabajo**. Prohibido modelar pasos de tarea (*«abrir el sistema»*, *«hacer clic en Guardar»*, *«descargar PDF»*) como cajas del flujo: esos pasos van detallados en el campo `Descripción` de la actividad atómica.

### 4.2 Nivel de detalle notacional (elige uno y decláralo)

**Nivel 1 — Descriptivo.** Objetivo: alcance extremo a extremo, quién es el cliente, dónde se genera valor. Principio: *no me hagas pensar*.
- Máximo **10 objetos de flujo y 8 artefactos**, en una vista panorámica.
- Solo el **camino principal (*happy path*)**. Sin excepciones ni casuística.
- **Un solo Contenedor (*Pool*) subdividido en Carriles (*Lanes*).** Única excepción razonable: un participante externo (cliente, solicitante, proveedor) en un Contenedor cerrado (caja negra), para marcar las interacciones de entrada/salida con Flujo de Mensaje.
- Actividades **sin diferenciar tipo**: solo `Tarea` y `Subproceso` cerrado (`+`). Único marcador permitido: `Ciclo`.
- Compuertas: solo **Exclusiva (XOR)** y **Paralela (AND)** (esta última siempre en par divergencia + convergencia). **No Inclusiva. Nunca Compleja.** La convergencia exclusiva se **omite**: los flujos entran directo a la actividad siguiente.
- Eventos: inicio y fin **Simple**, **de Mensaje**, **de Temporización**; `Condicional` con reserva. Intermedio Simple solo para hitos significativos. **Sin eventos adjuntos al límite. Sin Compuerta Basada en Eventos.**
- Artefactos: `Anotación`, `Fase` y `Grupo` sí; `Objeto de Datos` con mesura.
- **Ninguna violación de sintaxis.**

**Nivel 2 — Operacional.** Objetivo: lógica operativa AS-IS completa, rigurosa y consistente.
- **Cero inconsistencias**, semánticas o sintácticas.
- Se separan los participantes en **Contenedores propios** cuando pertenecen a organizaciones o procesos con gobierno independiente (cliente, proveedor, ente externo, otro proceso independiente). La comunicación entre Contenedores va exclusivamente por `Flujo de Mensaje`.
- Se modelan todas las excepciones documentadas: plazos vencidos (SLA), errores, rechazos, retrabajos, escalamientos y cancelaciones asíncronas.
- Tipos de tarea explícitos (`userTask`, `manualTask`, `serviceTask`, `businessRuleTask`, `scriptTask`, `sendTask`, `receiveTask`), eventos adjuntos al límite (interruptores y no interruptores), `Subproceso de Evento`, `Compuerta Basada en Eventos`, `Compuerta Inclusiva` y `Objetos de Datos` con su transición de `[Estado]`.
- Las reglas de negocio complejas se **independizan del flujo**: no dibujes un árbol de 10 compuertas para evaluar una tabla de criterios; usa una `Tarea de Regla de Negocio` seguida de una `Compuerta Exclusiva` y documenta la matriz/regla aparte.

**Nivel 3 — Técnico / Ejecutable.** Especificación para motor BPMS en producción (payloads de servicios web, scripts formales de integración, manejadores transaccionales). **Esta skill no lo genera** salvo pedido explícito.

Por defecto: **Nivel 1 para el proceso de nivel superior, Nivel 2 para el flujo detallado y cada subproceso.**

---

## 5. Granularidad y descomposición en subprocesos

- **Límites por diagrama:** Nivel 1: $\le 10$ objetos de flujo. Nivel 2: **8 a 20 actividades** por diagrama. Si el proceso supera ese umbral, encapsula los bloques cohesivos en `Subproceso`.
- **Criterio de corte de una Actividad Atómica:** **un único responsable principal (carril) + un momento continuo de trabajo + un propósito operativo único.**
  - Si el trabajo cambia de manos a otro rol $\rightarrow$ es otra actividad (y constituye una transferencia / *handoff*).
  - Si hay una espera temporal obligatoria en medio $\rightarrow$ son dos actividades separadas por un evento intermedio de temporización.
  - **Excepción por actividad conjunta simultánea:** si el documento indica que dos o más roles realizan una misma acción indivisible en el mismo acto (ej. *«inspección conjunta en sitio»* o *«sesión de comité»*), se modela **una sola actividad** en el carril de quien la conduce o registra (`Encargado`), documentando a los demás roles en `Participantes adicionales / Consultados`.
  - Si un mismo rol ejecuta 2 o 3 microacciones inmediatas y consecutivas sobre el mismo objeto sin intervención de otro rol ni decisión intermedia (ej. *revisar campos del formulario, firmarlo y enviarlo*), intégralas en **una sola actividad** y lista los pasos en su `Descripción`.
- **Cuándo declarar un `Subproceso`:** cuando un bloque de actividades (a) persigue una meta intermedia verificable y transforma el estado del objeto, (b) tiene detalle suficiente ($\ge 3$ actividades) para su propio diagrama de Nivel 2, o (c) se reutiliza en varios procesos $\rightarrow$ entonces `Subproceso Reusable` (`callActivity`).
- **Cuándo usar un `Subproceso de Evento` (*Event Sub-Process*, `triggeredByEvent="true"`):** cuando a lo largo de todo el proceso o de un subproceso puede ocurrir un evento asíncrono (ej. *«el cliente solicita cancelar el pedido en cualquier momento»* o *«el cliente solicita agregar ítems mientras la orden está abierta»*). En lugar de sacar cables de excepción desde cada tarea del diagrama, encapsúlalo en un `Subproceso de Evento` con evento de inicio **interruptor** (si aborta el proceso) o **no interruptor** (`isInterrupting="false"`, si corre en paralelo sin detener el flujo principal).
- En Nivel 1 los subprocesos van **cerrados** (marcador `+`). Cada subproceso genera **su propio diagrama y su propio archivo `.bpmn`** en Nivel 2 (o se modela expandido si el usuario pide todo en un único lienzo).
- Si el documento menciona un subproceso solo por su nombre sin describir sus pasos internos, decláralo cerrado y registra su interior como `[SUPUESTO] — requiere documento complementario o levantamiento`. No inventes sus actividades internas.

---

## 6. Catálogo de iconografía BPMN 2.0 (uso exclusivo)

**Contenedores, carriles y fases:** Contenedor (*Pool*, `participant` — un proceso con su propio dirigente) · Carril (*Lane*, `lane` — rol, cargo o área interna) · Fase (*Phase* — etapa cronológica transversal del proceso)

**Tareas:** Tarea (*Task*, `task`) · Tarea de Usuario (*User Task*, `userTask`) · Tarea de Servicio (*Service Task*, `serviceTask`) · Tarea de Recepción (*Receive Task*, `receiveTask`) · Tarea de Envío (*Send Task*, `sendTask`) · Tarea de Script (*Script Task*, `scriptTask`) · Tarea Manual (*Manual Task*, `manualTask`) · Tarea de Regla de Negocio (*Business Rule Task*, `businessRuleTask`)

**Subprocesos:** Subproceso (*Sub-Process*, `subProcess`; cerrado o expandido) · Subproceso Reusable (*Call Activity*, `callActivity`) · Subproceso de Evento (*Event Sub-Process*, `subProcess triggeredByEvent="true"`) · Transacción (*Transaction*, `transaction`) · Ad-hoc (*Ad-hoc Sub-Process*, `adHocSubProcess`)

**Marcadores** (sobre tareas y subprocesos): Ciclo Estándar (*Standard Loop*, `standardLoopCharacteristics`) · Ciclo Múltiples Instancias, paralelo o secuencial (*Multi-Instance*, `multiInstanceLoopCharacteristics`) · Compensación (*Compensation*, `isForCompensation="true"`)

**Eventos de Inicio (`startEvent`):** Simple (*None*) · de Mensaje (`messageEventDefinition`) · de Temporización (`timerEventDefinition`) · Condicional (`conditionalEventDefinition`) · de Señal (`signalEventDefinition`) · Múltiple · Paralelo Múltiple · *(En Subprocesos de Evento o Subprocesos en línea también: de Error, Escalable, de Compensación; interruptores con borde continuo o no interruptores `isInterrupting="false"` con borde discontinuo)*

**Eventos Intermedios en el flujo (`intermediateCatchEvent` / `intermediateThrowEvent`):** Simple (*None*) · de Mensaje (captura o lanza) · de Temporización (captura) · de Enlace (`linkEventDefinition`, par lanza/captura) · de Señal (captura o lanza) · Escalable (`escalationEventDefinition`, lanza) · de Compensación (lanza) · Condicional (captura) · Múltiple · Paralelo Múltiple

**Eventos Intermedios adjuntos al límite (`boundaryEvent attachedToRef="..."`)** (interruptor `cancelActivity="true"` = doble círculo continuo; no interruptor `cancelActivity="false"` = doble círculo discontinuo): de Mensaje · de Temporización · Condicional · de Señal · Escalable · Múltiple · Paralelo Múltiple · de Compensación (siempre continuo, se asocia a tarea de compensación) · **de Error** (`errorEventDefinition`, siempre interruptor/continuo, solo adjunto) · **de Cancelación** (`cancelEventDefinition`, siempre interruptor/continuo, solo adjunto a Transacción)

**Eventos de Finalización (`endEvent`):** Simple (*None*) · de Mensaje · de Señal · Escalable · de Error · de Cancelación (solo dentro de Transacción) · de Compensación · Múltiple · Terminal (`terminateEventDefinition`)

**Compuertas:** Exclusiva / XOR (`exclusiveGateway`) · Paralela / AND (`parallelGateway`) · Inclusiva / OR (`inclusiveGateway`) · Basada en Eventos (`eventBasedGateway`) · Exclusiva Basada en Eventos para instanciar · Paralela Basada en Eventos para instanciar · Compleja (`complexGateway`)

**Datos:** Objeto de Datos (*Data Object*, `dataObject` + `dataObjectReference` con `dataState`) · Depósito de Datos (*Data Store*, `dataStore` + `dataStoreReference`) · Entrada de Datos (`dataInput`) · Salida de Datos (`dataOutput`)

**Artefactos:** Anotación (*Text Annotation*, `textAnnotation`) · Grupo (*Group*, `group`) · Artefacto propio (para visibilizar sistemas o equipos sin alterar el flujo)

**Conectores:** Flujo de Secuencia (`sequenceFlow`) · Flujo Condicional (`conditionExpression`) · Flujo por Defecto (`default="..."`) · Flujo de Mensaje (`messageFlow`) · Asociación (`association` / `dataInputAssociation` / `dataOutputAssociation`)

---

## 7. Tabla de decisión: del texto al elemento BPMN 2.0

Aplica en orden; la primera fila que calce, gana. Luego filtra por el nivel (§4): si el elemento no está permitido en Nivel 1, abstrae al elemento permitido en ese nivel.

### Inicio
| Señal en el documento | Elemento BPMN 2.0 |
|---|---|
| Llega solicitud, correo, pedido, reclamo o documento desde un participante externo | **Evento de Inicio de Mensaje** (`startEvent` + `messageEventDefinition`) |
| Fecha fija, horario o ciclo periódico (*«cada mes»*, *«todos los lunes a las 08:00»*, *«al cierre»*) | **Evento de Inicio de Temporización** (`startEvent` + `timerEventDefinition`) |
| Se dispara al cumplirse una condición o umbral (*«cuando el stock baja del mínimo»*, *«si la temperatura supera X»*) | **Evento de Inicio Condicional** (`startEvent` + `conditionalEventDefinition`) |
| Otro proceso emite un aviso o difusión general sin destinatario único | **Evento de Inicio de Señal** (`startEvent` + `signalEventDefinition`) |
| Varias formas alternativas de iniciar el proceso, basta que ocurra una | **Evento de Inicio Múltiple** |
| Se requieren varios disparadores simultáneos para iniciar | **Evento de Inicio Paralelo Múltiple** |
| *«El proceso inicia cuando…»* por acción interna o es el inicio interno de un Subproceso | **Evento de Inicio Simple** (`startEvent` sin definición hija) |

### Trabajo y Actividades
| Señal en el documento | Elemento BPMN 2.0 |
|---|---|
| Una persona ejecuta el trabajo apoyada en un sistema, pantalla, ERP o formulario digital | **Tarea de Usuario** (`userTask`) |
| Una persona ejecuta trabajo físico, mecánico o en papel sin sistema informático | **Tarea Manual** (`manualTask`) |
| Un sistema, servicio web, API o interfaz ejecuta la acción automáticamente sin intervención humana | **Tarea de Servicio** (`serviceTask`) |
| Se envía una comunicación, notificación o paquete a un participante externo o a otra área | **Tarea de Envío** (`sendTask`) |
| El flujo espera la recepción de un mensaje o confirmación en una tarea dedicada | **Tarea de Recepción** (`receiveTask`) |
| Se evalúa un caso contra una política, matriz de atribuciones, baremo o tabla de reglas | **Tarea de Regla de Negocio** (`businessRuleTask`) |
| El motor ejecuta una rutina interna o macro automática sin llamada a sistemas externos (ej. *«asignar términos por defecto»*) | **Tarea de Script** (`scriptTask`) |
| Acción descrita sin especificar si usa sistema o es manual | **Tarea** (`task`) + `[SUPUESTO]` en el tipo |
| Bloque con lógica propia, varias actividades y finalidad intermedia delimitada | **Subproceso** (`subProcess`) |
| Invoca a un proceso global o estándar documentado de forma independiente | **Subproceso Reusable** (`callActivity`) |
| *«Se repite para cada ítem / línea / factura / postulante de la lista»* | Marcador **Ciclo Múltiples Instancias** (`multiInstanceLoopCharacteristics`) |
| *«Se repite mientras / hasta que se cumpla la condición…»* | Marcador **Ciclo Estándar** (`standardLoopCharacteristics`) |
| Conjunto de tareas de expertos sin orden secuencial fijo | **Subproceso Ad-hoc** (`adHocSubProcess`) |
| Bloque donde todas las operaciones deben confirmarse juntas o revertirse en bloque | **Subproceso Transacción** (`transaction`) |

### Decisiones y Bifurcaciones
| Señal en el documento | Elemento BPMN 2.0 |
|---|---|
| *«Si… entonces… si no…»*, caminos mutuamente excluyentes (solo uno se activa) | **Compuerta Exclusiva (XOR)** (`exclusiveGateway`) |
| *«En paralelo»*, *«simultáneamente»*, *«mientras tanto el área B realiza…»* | **Compuerta Paralela (AND)** (`parallelGateway` en par divergencia + convergencia) |
| Varias condiciones independientes donde pueden activarse **uno, varios o todos** los caminos a la vez | **Compuerta Inclusiva (OR)** (`inclusiveGateway`, siempre sincronizada con otra `inclusiveGateway` convergente) |
| *«Lo que ocurra primero»* entre eventos externos o temporales (ej. *«llega respuesta del cliente O vence el plazo de 5 días»*) | **Compuerta Basada en Eventos** (`eventBasedGateway` seguida de eventos intermedios de captura) |
| Decisión basada en múltiples criterios o tabla de reglas | **Tarea de Regla de Negocio** (`businessRuleTask`) seguida de **Compuerta Exclusiva (XOR)** |

> **Regla de la aprobación y revisión (el error más común):** una aprobación o inspección son **dos elementos consecutivos**. Primero va la **Actividad** que ejecuta el trabajo de revisar/evaluar/decidir (ej. `Evaluar solicitud de crédito`, `userTask`), y después va la **Compuerta Exclusiva** que enruta según el resultado (`¿Solicitud aprobada?` $\rightarrow$ `Sí` / `No`). **Una compuerta jamás ejecuta trabajo ni toma decisiones por sí sola:** solo enruta según el resultado de una actividad previa.

### Esperas, Plazos (SLA), Escalamientos y Excepciones
| Señal en el documento | Elemento BPMN 2.0 |
|---|---|
| Pausa obligatoria en medio del flujo (*«se esperan 24 horas de fraguado»*, *«esperar 5 días hábiles»*) | **Evento Intermedio de Temporización** (`intermediateCatchEvent` + `timerEventDefinition`) |
| Plazo máximo (SLA) que **aborta o desvía** una actividad si vence (*«si no se aprueba en 1 hora, pasa a aprobación por defecto»*) | **Evento de Temporización Adjunto Interruptor** (`boundaryEvent cancelActivity="true"`) |
| Alerta o recordatorio por SLA que **no detiene** la actividad en curso (*«a las 24 h se envía recordatorio al jefe mientras sigue en revisión»*) | **Evento de Temporización Adjunto No Interruptor** (`boundaryEvent cancelActivity="false"`) |
| *«Si falla la validación técnica»*, *«si el sistema arroja error»*, *«si es imposible reparar»* | **Evento de Error Adjunto Interruptor** (`boundaryEvent` + `errorEventDefinition`) |
| *«Si el caso supera la complejidad del Nivel 1, se escala al especialista Nivel 2»* | **Evento Escalable** (`escalationEventDefinition`, adjunto o intermedio) o par de envío/recepción hacia el carril superior |
| Solicitud asíncrona que puede llegar en cualquier momento durante una etapa (cancelación del cliente o modificación del pedido) | **Subproceso de Evento** (`subProcess triggeredByEvent="true"`, interruptor o no interruptor) |
| Revertir efectos de una actividad ya completada tras un fallo posterior | **Evento Adjunto de Compensación** + Asociación hacia **Tarea de Compensación** (`isForCompensation="true"`) |
| Conectar dos puntos distantes del mismo proceso para evitar cruzar todo el diagrama con una línea de retorno | **Evento Intermedio de Enlace** (`linkEventDefinition`, par Lanza $\rightarrow$ Captura con idéntico nombre) |

### Actores, Datos y Estructura
| Señal en el documento | Elemento BPMN 2.0 |
|---|---|
| Rol, cargo o departamento **dentro** de la misma organización y bajo el mismo proceso | **Carril (*Lane*)** dentro del Contenedor principal |
| Cliente, proveedor, entidad reguladora u organización **externa** con gobierno propio | **Contenedor (*Pool*) separado** + comunicación exclusiva por **Flujo de Mensaje** |
| Participante externo cuyos pasos internos no se conocen ni forman parte del alcance | **Contenedor cerrado / Caja Negra** (`participant` sin `processRef` o con proceso vacío) |
| El documento divide el proceso en grandes etapas o fases cronológicas | **Fase (*Phase*)** (divisiones transversales sobre el contenedor) |
| Documento, solicitud, expediente o formulario que entra, se transforma o sale de una actividad | **Objeto de Datos (`dataObjectReference`)** con su **`[Estado]`** entre corchetes + `dataInputAssociation` / `dataOutputAssociation` |
| Base de datos, ERP, sistema documental o registro maestro persistente | **Depósito de Datos (`dataStoreReference`)** |
| Aclaración normativa, regla o advertencia que explica un paso sin alterar el flujo | **Anotación (`textAnnotation`)** + `association` |

### Finalización
| Señal en el documento | Elemento BPMN 2.0 |
|---|---|
| El camino concluye normalmente alcanzando su estado final | **Evento de Finalización Simple** (`endEvent`) |
| Termina enviando una notificación o entregable final a un participante externo | **Evento de Finalización de Mensaje** (`endEvent` + `messageEventDefinition`) |
| Termina dentro de un subproceso disparando una excepción hacia el proceso padre | **Evento de Finalización de Error** (`endEvent` + `errorEventDefinition`) |
| Un desenlace (ej. anulación o fraude) obliga a **detener de inmediato todas las ramas paralelas activas** | **Evento de Finalización Terminal** (`endEvent` + `terminateEventDefinition`) |
| Termina difundiendo una señal que puede disparar otros procesos | **Evento de Finalización de Señal** (`endEvent` + `signalEventDefinition`) |

> **Regla de desenlaces:** modela **un Evento de Finalización específico por cada estado final distinto del negocio** (ej. `Solicitud aprobada`, `Solicitud rechazada`, `Proceso cancelado`), nunca un único fin genérico llamado «Fin».

---

## 8. Sintaxis: reglas que no se violan en ningún nivel

**Flujo de Secuencia (`sequenceFlow`)**
- Conecta objetos de flujo dentro de **un mismo Contenedor (`Pool`)**. Jamás cruza el límite de un Contenedor hacia otro.
- Toda actividad tiene al menos un flujo de secuencia de entrada y uno de salida. Excepciones: actividad que instancia el proceso (sin entrada), tarea de compensación (se conecta solo por asociación) y `Subproceso de Evento` (sin flujo de secuencia de entrada ni de salida).
- Cada Contenedor con flujo interno visible tiene al menos un evento de inicio y al menos un evento de finalización.

**Flujo de Mensaje (`messageFlow`)** — permitido **únicamente** entre dos Contenedores (`Pools`) distintos y en estos 4 casos:
1. Desde un Contenedor externo (o elemento emisor de otro Contenedor) hacia un **Evento de Mensaje de captura** (`Start` o `Intermediate Catch`) o una **Tarea de Recepción/Usuario**.
2. Desde una **Tarea de Envío/Usuario/Servicio** o **Evento de Mensaje de lanzamiento** (`Intermediate Throw` o `End`) hacia un Contenedor externo (o hacia un elemento receptor de otro Contenedor).
3. Entre una actividad y el borde de un Contenedor cerrado (caja negra).
4. Hacia o desde el borde de un Subproceso expandido (representando mensajes de sus elementos internos).

**Prohibido en Flujos de Mensaje:** conectar dos elementos dentro del **mismo** Contenedor · flechas en ambos extremos · conectar a una **Compuerta** · conectar a un Evento de Inicio/Fin Simple, de Temporización, de Error o de Señal · conectar a un Objeto de Datos.

**Compuertas (`Gateway`)**
- No ejecutan trabajo y no llevan nombre de acción: las exclusivas e inclusivas divergentes se nombran con una **pregunta cerrada** (`¿...?`), y cada flujo saliente lleva su condición o etiqueta visible.
- En Nivel 2, toda compuerta Exclusiva (`exclusiveGateway`) o Inclusiva (`inclusiveGateway`) divergente debe declarar cuál de sus salidas es el **Flujo por Defecto (`default="Flow_x"`)** para garantizar que ningún caso quede bloqueado.
- **Paridad de Compuertas Paralelas:** toda bifurcación paralela (`AND` divergente) debe cerrarse con una sincronización paralela (`AND` convergente) antes de continuar en un flujo común, salvo que cada rama paralela termine en su propio evento de finalización independiente.
- La Compuerta Paralela (`parallelGateway`) **nunca** lleva condiciones ni probabilidades en sus salidas (todas sus ramas se activan al 100%).
- La Compuerta Basada en Eventos (`eventBasedGateway`) solo puede ir seguida de Eventos Intermedios de Captura (`Mensaje`, `Temporización`, `Señal`, `Condicional`) o `Tareas de Recepción` (nunca ambos mezclados para el mismo mensaje). Los eventos que siguen a una `eventBasedGateway` no pueden tener otros flujos de secuencia de entrada.

**Eventos**
- Eventos de Error y de Cancelación: solo existen como **eventos de captura cuando están adjuntos al límite** de una actividad/subproceso, y como **eventos de lanzamiento cuando son Eventos de Finalización**. (Además, el Inicio de Error existe solo dentro de un Subproceso de Evento).
- Marcador interno **vacío** = **captura (*Catch*)**; marcador interno **relleno** = **lanzamiento (*Throw*)**.
- Todo Evento de Enlace que lanza (`intermediateThrowEvent`) debe tener exactamente un Evento de Enlace que captura (`intermediateCatchEvent`) con el **mismo nombre** dentro del mismo proceso.

**Asociaciones y Datos**
- Las asociaciones (`association`, `dataInputAssociation`, `dataOutputAssociation`) solo conectan Objetos de Datos, Depósitos de Datos o Anotaciones con elementos de flujo. **Nunca** representan orden de ejecución ni reemplazan a un Flujo de Secuencia.

---

## 9. Nombres, clasificación analítica AS-IS y documentación obligatoria

### 9.1 Convención de nombres
| Elemento | Convención | Ejemplo |
|---|---|---|
| **Tarea atómica** | **Verbo en infinitivo + objeto directo** (máx. 6 palabras) | `Verificar historial crediticio del solicitante` |
| **Subproceso** | **Sustantivado** (orientado a la etapa o resultado intermedio) | `Evaluación de postulaciones` / `Reparación de vehículo` |
| **Compuerta** | **Pregunta cerrada** + salidas rotuladas | `¿Cumple requisitos técnicos?` $\rightarrow$ `Sí` / `No` |
| **Evento de inicio / fin** | **Sustantivo + participio (hecho o estado alcanzado)**, nunca un verbo de acción | `Solicitud recibida`, `Préstamo aprobado`, `Reparación cancelada` |
| **Carril (`Lane`)** | **Rol o cargo funcional en singular**, nunca nombre propio de persona | `Analista de Crédito`, `Especialista de Soporte` |
| **Contenedor (`Pool`)** | **Nombre del proceso o de la entidad/participante** | `Gestión de Soporte Técnico`, `Cliente`, `Proveedor` |
| **Fase (`Phase`)** | **Sustantivo de etapa** | `1. Admisión`, `2. Evaluación`, `3. Resolución` |
| **Objeto de Datos** | **Nombre del documento + `[Estado]` entre corchetes** | `Solicitud de préstamo [Inicial]`, `Presupuesto [Aceptado]` |

### 9.2 Clasificación analítica AS-IS de las actividades (BPM CBOK)
Para que el levantamiento AS-IS sirva directamente para el análisis de procesos (sin modificar el flujo), clasifica cada actividad en una de las tres categorías del estándar BPM CBOK:
1. **`VA` — Valor Agregado:** transforma directamente el objeto o servicio hacia lo que el cliente del proceso necesita.
2. **`TR` — Transferencia (*Handoff*):** traspasa el trabajo, expediente o comunicación de un rol, área o sistema a otro (ej. enviar correo de derivación, despachar carpeta física, asignar ticket). Son la fuente principal de esperas y desconexiones.
3. **`CT` — Control / Inspección / Aprobación:** verifica el cumplimiento de reglas, presupuestos o calidad (revisiones, firmas, visados, auditorías). Distingue siempre entre el *Control del proceso* (la regla de negocio o restricción) y la *Actividad de control* (el paso operativo para revisar o firmar).

### 9.3 Documentación a nivel de proceso (una vez por diagrama)
`Nombre` · `Versión` · `Autor` · `Estado del modelo (Borrador / En revisión / Validado / Publicado)` · `Descripción` · `Alcance (desde el disparador C1 / hasta el resultado C5)` · `Objetivo` · `Dueño del proceso (Process Owner)` · `Participantes (Pools y Lanes)` · `Objeto principal y cadena de estados ([Estado 1] → [Estado 2] → ...)` · `Definiciones y glosario` · `Documento fuente` · `Nivel de modelado (Nivel 1 / Nivel 2)` · `Cobertura documental (Alta / Media / Baja)`

### 9.4 Documentación a nivel de actividad (obligatoria en todas)
| Campo | Regla |
|---|---|
| **ID, Nombre y Tipo** | Según convención y catálogo (§6) |
| **Clasificación AS-IS** | `VA` (Valor Agregado) / `TR` (Transferencia) / `CT` (Control) |
| **Descripción** | 1–4 frases claras: qué se hace, cómo se ejecuta (incluyendo aquí los pasos de pantalla o microacciones si el documento los detalla) y con qué criterio se da por terminada. Este texto se inyecta también en `<bpmn:documentation>` dentro del XML |
| **Participantes (Recurso)** | **Rol** (`Analista de Crédito`) o **Entidad** (`Área de Cobranza`), referenciado en `<bpmn:performer><bpmn:resourceRef>`. Nunca el nombre de una persona. Si falta en el documento, declarar `[SUPUESTO]` |
| **RACI** | **Encargado / Ejecutante (`R` - *Performer*)**, **Responsable / Aprobador (`A` - *Accountable*)**, **Consultado (`C`)**, **Informado (`I`)**. Exactamente **un** Encargado y **un** Responsable por actividad; Consultado e Informado cuando el documento los mencione (ej. participantes adicionales en actividades conjuntas) |
| **Sistema o herramienta** | Solo si el documento lo nombra; si no, `no disponible` |
| **Entradas / Salidas (`[Estado]`)** | Objetos de Datos con su estado (`Documento [Estado]`) o Depósitos de Datos que entran o salen de la actividad |
| **Duración / Plazo** | Si el documento lo indica, registrar valor exacto (`Explícito`). Si el usuario solicita simulación ejecutable completa y el documento no lo indica, marcar claramente si es `no disponible` o `[SUPUESTO para simulación]` |
| **Origen** | `Explícito (sección/pág.)` / `Inferido` / `[SUPUESTO]` |

### 9.5 Documentación específica por tipo de elemento (Propiedades de modeladores como Bizagi)
| Elemento | Campos propios obligatorios |
|---|---|
| **Todas las tareas** | Cantidad de inicio (`startQuantity`, por defecto 1) · Cantidad final (`completionQuantity`, por defecto 1) |
| **Tarea de Servicio / Envío / Recepción** | Implementación: tecnología, interfaz o canal usado (servicio web, correo, plataforma, API) |
| **Tarea de Script** | El script, fórmula o rutina interna que se ejecuta |
| **Tarea de Regla de Negocio** | Código y expresión de la regla o tabla de decisión, documentada en el catálogo de reglas aparte del flujo |
| **Toda Compuerta Divergente** | Tabla de condiciones: una fila por cada flujo saliente indicando condición, flujo por defecto (`default`) y probabilidad (si aplica simulación) |
| **Compuerta Inclusiva / Compleja** | Todas las condiciones evaluadas, flujo por defecto y condición de sincronización en la convergencia |
| **Evento de Temporización** | Fecha, duración o ciclo en formato estándar ISO 8601 (`PT1H`, `PT48H`, `P5D`, `R/P1M`) y si interrumpe o no (`cancelActivity="true"/"false"`) |
| **Evento Condicional** | Expresión o condición técnica que debe cumplirse |
| **Evento de Error** | Código o identificador del error (`errorRef`) |
| **Evento de Mensaje / Señal** | Nombre del mensaje (`messageRef`) o señal (`signalRef`) y con qué elemento emisor/receptor se empareja |
| **Evento de Enlace** | Nombre idéntico en el par que lanza y el que captura |
| **Subproceso** | Tipo (`embebido` / `reusable` / `de evento` / `transacción` / `ad-hoc`) · si es `callActivity`, a qué `calledElement` invoca · si es de evento, si su inicio es interruptor o no interruptor |
| **Marcador de Ciclo** | Condición de salida (`loopCondition`) en ciclo estándar, o colección sobre la que itera y si es paralelo (`isSequential="false"`) o secuencial (`isSequential="true"`) en múltiples instancias |
| **Objeto de Datos** | Nombre del artefacto y su estado en ese punto (`<bpmn:dataState name="..."/>`, ej. `[Inicial]`, `[Estimado]`, `[Aprobado]`, `[Rechazado]`) |
| **Depósito de Datos** | Sistema, base de datos o repositorio concreto |
| **Contenedor (`Pool`)** | Participante y si es principal (caja blanca) o externo cerrado (caja negra) |
| **Carril (`Lane`)** | Rol, cargo o unidad organizacional |

### 9.6 Catálogo de recursos y reglas de negocio desacopladas
- **Catálogo de recursos:** Se define **una vez a nivel de proceso** (`<bpmn:resource id="..." name="..."/>`) y se referencia desde las actividades:
  `ID Recurso | Nombre del Rol / Entidad | Cantidad / Disponibilidad | Costo unitario | Actividades donde participa`
- **Catálogo de reglas de negocio desacopladas:** Todas las políticas permanentes, tablas de umbrales, fórmulas y criterios que el documento mezcle con el flujo se listan en una tabla separada:
  `ID Regla | Nombre | Condición / Criterio exacto | Actividad o Compuerta donde aplica | Origen`

---

## 10. Parámetros de análisis y simulación en 4 niveles (WfMC BPSim 2.0 / Bizagi Modeler)

Tanto el estándar **WfMC BPSim 2.0** (`BPSim 2.0 Specification` & `Implementer's Guide`) como **Bizagi Modeler** estructuran la simulación en **4 niveles progresivos**. Respetar las reglas de aplicabilidad y el esquema oficial `BPSim 2.0 XML Schema.xsd` garantiza que el archivo `.bpmn` sea directamente simulable:

### 10.1 Los 4 Niveles Progresivos de Simulación
| Nivel | Perspectiva (Bizagi / BPSim 2.0) | Objetivo Analítico | Parámetros BPSim 2.0 | Resultados (`ResultRequest`) |
|---|---|---|---|---|
| **Nivel 1** | **Validación de Proceso (Control)** | Comprobar que el flujo no tenga *deadlocks* ni bucles infinitos y verificar el caudal de casos por cada rama. | - `InterTriggerTimer` y `TriggerCount` en Eventos de Inicio / Captura / Adjuntos<br>- `Probability` (las salidas de una compuerta suman **`1.0`**) **o** `Condition` en `sequenceFlow` | `count` en `TriggerCount` de eventos, actividades y flujos. |
| **Nivel 2** | **Análisis de Tiempo (Temporal)** | Calcular el tiempo de ciclo (*Cycle Time* / *Throughput Time*) extremo a extremo, tiempo de trabajo efectivo vs. esperas. | Solo en **Actividades atómicas o Subprocesos cerrados sin descomposición**:<br>- `ProcessingTime`, `SetUpTime` *(con `U` mayúscula en el XSD)*, `ValidationTime`, `ReworkTime` (suman *Duration*)<br>- `TransferTime`, `QueueTime`, `WaitTime` (suman *LagTime*) | `min`, `max`, `mean`, `sum` en `Duration`, `LagTime` y `ElapsedTime` (como *ResultRequest*, jamás como entrada). |
| **Nivel 3** | **Análisis de Recursos y Costos (Capacidad)** | Detectar cuellos de botella por capacidad limitada de personal/equipos, medir utilización y costo ABC. | - En el **Recurso** (`<bpmn:resource>`): `Quantity`, `Availability`, `Role` y `UnitCost`<br>- En la **Actividad**: `Selection` con expresión XPath `bpsim:getResource('ID_Rec', cant)` o `bpsim:getResourceByRoles(['Rol'], cant)`, `FixedCost`, `Priority`, `Interruptible` | `min`, `max`, `mean` en `QueueLength`, tiempos de espera por recurso y costo total. |
| **Nivel 4** | **Análisis de Calendarios (Turnos)** | Evaluar el efecto de horarios hábiles, turnos o franjas horarias sobre las colas y el tiempo total. | - Elemento `<bpsim:Calendar id="C1" name="...">` con bloque `VCALENDAR` / `RRULE` (RFC 5545)<br>- Atributo `validFor="C1"` en los parámetros afectados<br>- Escenarios comparativos con herencia (`<bpsim:Scenario id="S2" inherits="S1">`) | Comparación de métricas entre Escenario Base (`S1`) y Escenario Alternativo (`S2`). |

### 10.2 Restricciones de aplicabilidad de BPSim 2.0 (Tabla 7.1 del estándar)
- **Los eventos no admiten parámetros de tiempo ni de recursos** (son puntos instantáneos; un evento de temporización usa `InterTriggerTimer` dentro de `ControlParameters`, nunca `ProcessingTime`).
- **Las compuertas no admiten parámetros de tiempo, costo ni recursos** (las probabilidades o condiciones van en los `sequenceFlow` que salen de la compuerta).
- **`Duration`, `LagTime`, `ElapsedTime` y `QueueLength` son exclusivamente resultados (`ResultRequest`)**, jamás parámetros de entrada.
- **Orden estricto en `<bpsim:ScenarioParameters>` según el XSD:** los elementos hijos solo pueden aparecer en el orden `Start` $\rightarrow$ `Duration` $\rightarrow$ `Warmup` $\rightarrow$ `PropertyParameters`.
- **Regla de trazabilidad de datos de simulación:** usa en primer lugar los tiempos, plazos, dotaciones o frecuencias que estén en el documento (`Explícito`). Si el documento no trae un parámetro numérico, no lo inventes como hecho: omítelo o, si se requiere dejar la estructura XML de simulación lista para prueba en el modelador, márcalo explícitamente como `[SUPUESTO]` en las tablas.

---

## 11. Salidas (Orden obligatorio del entregable)

Entrega los resultados en este orden exacto. Si el agente tiene herramientas de escritura de archivos, crea los archivos `.svg` y `.bpmn` y preséntalos al usuario; si no, entrégalos en bloques de código completos. Consulta `ANEXO-PLANTILLAS.md` para la geometría y el esqueleto XML.

1. **Encabezado de estado** — regla dura #8, nivel de modelado declarado (Nivel 1 / Nivel 2) y cobertura documental (`Alta` / `Media` / `Baja`).
2. **Ficha del proceso** — todos los campos de nivel de proceso (§9.3), incluyendo la Prueba del Caso (C1–C5) y la cadena de estados del objeto principal.
3. **Imagen del diagrama (SVG)** — generada con la geometría canónica de `ANEXO-PLANTILLAS.md` (un SVG para el proceso y uno por cada subproceso descompuesto).
4. **Archivo `.bpmn` importable** — BPMN 2.0 XML completo con su capa gráfica (`bpmndi:BPMNDiagram` / `BPMNPlane`) y bloque `bpsim:BPSimData` válido contra el XSD, de modo que importe **ya diagramado y documentado** en Bizagi Modeler o cualquier herramienta BPMN 2.0.
5. **Tabla maestra de elementos** — `ID | Contenedor | Carril | Fase | Tipo (catálogo) | Clasif. (VA/TR/CT) | Nombre | Descripción | Participantes | RACI (R/A/C/I) | Sistema | Campos propios del tipo | Entradas/Salidas [Estado] | Duración | Conecta hacia (ID + conector) | Origen`.
6. **Catálogo de recursos** — `ID Recurso | Nombre | Tipo (Rol / Entidad) | Cantidad | Actividades donde participa | Origen`.
7. **Tabla de condiciones de compuertas y reglas de negocio desacopladas** — `Compuerta / Regla | Salida | Condición / Criterio | Flujo por defecto | Probabilidad | Origen`.
8. **Parámetros de análisis y simulación (BPSim 2.0)** — organizados según los 4 niveles (Control, Tiempo, Recursos/Costos, Calendarios), distinguiendo datos explícitos del documento vs. supuestos.
9. **Registro de supuestos priorizado** — §12.
10. **Observaciones del estado AS-IS (*Parking Lot*)** — hallazgos detectados al modelar (transferencias excesivas, controles redundantes, ramas de rechazo no reguladas en el documento, contradicciones internas). **Solo como observación diagnóstica**, sin alterar el flujo AS-IS modelado.
11. **Resultado del autochequeo** — §13.

---

## 12. Registro de supuestos priorizado

`ID | Elemento | Campo | Supuesto asumido | Riesgo (Alto/Medio/Bajo) | Pregunta concreta para validación`

- **Alto** — si es falso, cambia la estructura del flujo, el responsable de un carril o un control crítico: obliga a modificar el diagrama.
- **Medio** — cambia el tipo o detalle interno de una actividad o plazo, sin alterar su posición en el flujo.
- **Bajo** — precisión de redacción, nomenclatura o formato.

La pregunta debe estar redactada para usarse directamente en una sesión de validación con el dueño del proceso (ej. *«Cuando la solicitud es rechazada en la revisión técnica, ¿el proceso termina definitivamente o vuelve al solicitante para corrección?»*), nunca un genérico *«validar flujo»*.

---

## 13. Autochequeo obligatorio (40 puntos)

Verifica cada punto antes de responder. Si alguno falla: **corrige el modelo, el SVG y el `.bpmn`, y vuelve a correr la lista completa.** Máximo 3 iteraciones; si algo sigue fallando por falta de información en el documento fuente, decláralo explícitamente.

**Nivel, descomposición y notación**
1. Se aplicó la Prueba del Caso (C1–C5) y el nivel de modelado (Nivel 1 / Nivel 2) está declarado.
2. Todo elemento usa un nombre exacto del catálogo §6; ningún símbolo inventado.
3. Ningún elemento excede el subconjunto de su nivel (en Nivel 1: sin tipos de tarea, sin Inclusiva ni Compleja, sin eventos adjuntos, sin Compuerta Basada en Eventos, sin excepciones).
4. Nivel 1: $\le 10$ objetos de flujo y $\le 8$ artefactos. Nivel 2: 8–20 actividades, o el exceso encapsulado en subprocesos.
5. Ningún paso de interfaz o clic de pantalla (*«abrir menú»*, *«clic en guardar»*) fue modelado como tarea BPMN independiente.
6. Las tablas de criterios, fórmulas o políticas permanentes fueron desacopladas como reglas de negocio y no ensuciaron el flujo con árboles artificiales de compuertas.

**Sintaxis BPMN 2.0**
7. Cada Contenedor con flujo visible tiene al menos un evento de inicio y uno de finalización.
8. Ninguna actividad carece de flujo de secuencia de entrada o de salida (salvo las excepciones de §8).
9. Ningún Flujo de Secuencia cruza el límite entre dos Contenedores (`Pools`).
10. Ningún Flujo de Mensaje conecta elementos dentro de un mismo Contenedor, ni es bidireccional, ni conecta a compuertas o a eventos que no sean de mensaje.
11. Ninguna Compuerta lleva nombre de acción; las decisionales están formuladas como pregunta cerrada (`¿...?`) con todas sus salidas rotuladas.
12. Toda Compuerta Exclusiva o Inclusiva divergente en Nivel 2 tiene declarado su flujo por defecto (`default`).
13. Toda Compuerta Paralela divergente (`Fork`) converge adecuadamente en una Compuerta Paralela (`Join`) o en eventos de fin válidos, y no lleva condiciones en sus salidas.
14. Evento de Error y de Cancelación como captura van solo adjuntos al límite; Cancelación solo en Transacción.
15. Las Asociaciones solo conectan datos o artefactos, nunca orden de ejecución.
16. Sin conectores colgando, compuertas de una sola salida y una sola entrada a la vez, ni carriles vacíos.
17. Marcadores de lanzamiento rellenos (*Throw*) y de captura vacíos (*Catch*), correctamente asignados.

**Documentación y semántica AS-IS**
18. Nombres según convención: tareas `Verbo infinitivo + objeto`, subprocesos `Sustantivados`, eventos `Sustantivo + participio (hecho)`.
19. Toda actividad está clasificada analíticamente como `VA` (Valor Agregado), `TR` (Transferencia) o `CT` (Control).
20. Toda actividad tiene su `Descripción` completa redactada e incluida en `<bpmn:documentation>`.
21. Toda actividad tiene `Participantes` (Rol o Entidad) o `[SUPUESTO]` explícito.
22. Exactamente un Encargado (`R`) y un Responsable (`A`) por actividad en la matriz RACI.
23. Ningún nombre propio de persona como participante o carril.
24. Toda compuerta divergente tiene su tabla de condiciones con una fila por salida.
25. Todo evento de temporización tiene plazo/ciclo ISO 8601; todo condicional, su condición; todo error, su código.
26. Todo subproceso declara su tipo (`embebido`, `reusable`, `de evento`, `transacción`, `ad-hoc`); los reusables declaran a qué proceso llaman (`calledElement`).
27. Todo marcador de ciclo declara su condición de salida o su colección e iteración (paralela/secuencial).
28. Todo Objeto de Datos relevante declara su estado entre corchetes (`[Estado]`) y en `<bpmn:dataState>`.
29. La ficha de proceso está completa, incluido el alcance desde/hasta y la cadena de estados del objeto.
30. El catálogo de recursos (`<bpmn:resource>`) existe a nivel raíz y toda actividad referencia recursos de ese catálogo mediante `<bpmn:performer><bpmn:resourceRef>`.
31. Toda aprobación o inspección está modelada como `Actividad` + `Compuerta`, nunca como una compuerta sola.
32. Existe un evento de finalización distinto por cada desenlace de negocio distinto.

**Simulación BPSim 2.0 y Fidelidad**
33. Ninguna duración, costo o probabilidad fue presentada como hecho si no está en el documento (todo valor estimado está marcado `[SUPUESTO]`).
34. Los parámetros BPSim 2.0 respetan la aplicabilidad de §10 (sin tiempos en eventos ni compuertas; `Duration`/`LagTime`/`ElapsedTime` solo como `ResultRequest`; `<bpsim:SetUpTime>` con `U` mayúscula; orden exacto en `ScenarioParameters`).
35. No se eliminó, fusionó ni reordenó ninguna actividad descrita en el documento (fidelidad AS-IS 100%).
36. Cada `[SUPUESTO]` aparece en §12 con su nivel de riesgo y pregunta concreta de validación.
37. Todo elemento tiene su campo `Origen` poblado (`Explícito`, `Inferido` o `[SUPUESTO]`).
38. Las observaciones (§11.10) no alteran el flujo AS-IS modelado.

**Entregables técnicos (`.svg` y `.bpmn`)**
39. El SVG fue verificado geométricamente (sin textos cortados, sin flechas atravesando cajas y con formas fieles al catálogo BPMN 2.0).
40. El archivo `.bpmn` está bien formado en XML, cada `flowNodeRef` coincide con su carril, cada `incoming`/`outgoing` coincide con su `sequenceFlow`, e incluye `bpmndi:BPMNDiagram` completo.

Reporta al cierre: `Autochequeo: 40/40 aprobado en N iteración(es)`, o el detalle de cualquier punto condicionado por brechas del documento fuente.

---

## 14. Estilo

Lenguaje técnico claro y directo, sin relleno de consultoría. Si un dato no se puede determinar desde el documento, decláralo en una línea como brecha o `[SUPUESTO]` y continúa. No repitas en prosa narrativa lo que ya está estructurado en el diagrama SVG y en las tablas del modelo.

---

## 15. Estándar Corporativo de Renderizado Gráfico e Identidad Visual (SALFA Montajes — BRASA 2A)

Para garantizar la máxima pulcritud técnica, calidad de impresión y cumplimiento con auditorías de gestión documental corporativa:

1. **Regla de Oro en SVG (`fill="none"` OBLIGATORIO):**
   Todo elemento `<path>` que trace un flujo de secuencia, conector ortogonal, flujo de mensaje o asociación debe incluir obligatoriamente `fill="none"`. Omitir este atributo provoca que el renderizador aplique `fill="#000000"` por defecto, creando aberraciones visuales graves (polígonos negros cerrados o formas de reloj de arena que tapan el diagrama).

2. **Ajuste y Orientación de Cabeceras (Pools y Lanes):**
   - El título del Contenedor (`Pool`) debe disponerse en una cabecera horizontal superior (`height="30"` px, texto legible de izquierda a derecha), eliminando la patología de texto rotado truncado por estrechez de contenedor.
   - En cabeceras de carril (`Lane`), solo usar texto rotado `-90deg` si el alto del carril supera con holgura la longitud de la cadena (`height >= texto.length * 8px`). De lo contrario, usar etiquetas horizontales internas centradas.

3. **Paleta Institucional BRASA 2A:**
   - **Barra Institucional:** Franja superior de 8mm (`height="8"`) en rojo institucional `#B01E24`.
   - **Marcos y Textos:** Grafito oscuro `#2E343C`, texto principal `#15181B`, etiquetas secundarias `#5A626A`.
   - **Fondos:** Blanco puro `#FFFFFF` y fondos de actividad en blanco o gris sutil `#F8FAFC`. Queda estrictamente prohibido el uso de modos oscuros o estéticas lúdicas/gamificadas.
   - **Simbología Bizagi:** Inicio verde `#6CA353` (`stroke="#2E7D32"`), Fin rojo `#C65D57` (`stroke="#B01E24"`), Compuertas ámbar `#F0A32F` con relleno `#FFFDE7`.

4. **Cajetín Oficial de Control y Trazabilidad Forense:**
   Todo diagrama o entregable interactivo debe incluir un cajetín documental corporativo con:
   - **Código Provisorio de Diagrama:** `10000000-SAL-00000-DOC-DIA-XXXXX` (según Serie N5 / Taxonomía Corporativa SALFA).
   - **Documento Rector Vinculante:** Código y revisión oficial del documento fuente de donde se extrajo el proceso (ej. `10000000-PRO-EST-001 Rev. 0`).
   - **Matriz de Trazabilidad AS-IS:** Sección o pestaña que relacione cada actividad modelada con su cláusula documental, anexo de terreno o formato asociado.

5. **Mecanismo de Descarga, Navegación Modal y Adaptación al Ancho de Pantalla:**
   - **Descargas Nativas Vía Blob:** En entregables interactivos HTML, la descarga de archivos `.bpmn` y `.bpm` (Bizagi) debe implementarse decodificando el Base64 en un objeto `Blob` nativo de tipo `application/octet-stream`, asegurando que el navegador abra la ventana nativa "Guardar como" y no muestre el código XML en texto plano.
   - **Exportación de Imagen en Alta Definición:** La exportación PNG debe procesarse a través de un elemento `<canvas>` a doble escala (2x DPI) inyectando el encabezado corporativo con la barra roja de 8mm y el cajetín oficial.
   - **Subprocesos Expandibles y Ventana Emergente (Modal Dialog):** Los subprocesos en la vista de Macroproceso deben permitir tanto la expansión dinámica inline (`[+]` / `[-]`) como la apertura en una **Ventana Emergente (Modal corporativo BRASA)** mediante el botón `[🗖 Ventana]` o desde el panel de propiedades, permitiendo inspeccionar el diagrama detallado, la matriz RACI y las reglas de terreno sin perder el contexto del flujo macro.
   - **Adaptación al Ancho y Auto-Fit:** Para evitar que diagramas anchos o expandidos queden cortados en pantallas estándar, el viewport debe implementar función de ajuste automático (`Auto-Fit to Window`) calculando la escala óptima (`scale = availableWidth / svgWidth`), botones de zoom (`+`, `-`, `100%`), arrastre con ratón (panning) y botón para expandir el lienzo ocultando el inspector lateral.
   - **Integridad de Caracteres (UTF-8 Estricto):** La generación de entregables HTML debe ejecutarse con codificación UTF-8 estricta para garantizar que acentos, tildes y símbolos técnicos en español se visualicen con total nitidez y sin errores de caracteres (cero mojibake).
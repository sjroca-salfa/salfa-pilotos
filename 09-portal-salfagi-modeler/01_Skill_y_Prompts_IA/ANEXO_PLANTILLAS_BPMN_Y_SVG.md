> **Especialista / Autor:** Sebastián Roca G.  
> **Contacto:** +56993543447 | **Correo:** sjroca@salfamontajes.com  
> **Organización:** SALFA Montajes S.A. — Excelencia Operacional y Planificación  

Complemento técnico de `SKILL.md`. Aquí están la geometría canónica, el algoritmo de posicionamiento ortogonal, el esqueleto XML BPMN 2.0 completo, la estructura de simulación BPSim 2.0 validada contra su esquema XSD oficial (`BPSim 2.0 XML Schema.xsd`) en 4 niveles progresivos y la especificación de formas del SVG. Las reglas de qué modelar están en `SKILL.md`; este anexo define **cómo materializar el código `.bpmn` y el diagrama `.svg`**.

---

## 1. Geometría canónica

Usar estas dimensiones exactas hace que el layout calce 1:1 entre el SVG y el archivo `.bpmn` (`bpmndi:BPMNDiagram`), y que el diagrama se vea limpio al importarlo en Bizagi Modeler, Camunda Modeler, Trisotech o cualquier herramienta compatible con BPMN 2.0:

| Elemento | Ancho × Alto (`width` × `height`) |
|---|---|
| **Tarea / Subproceso cerrado (`+`)** | `110 × 80` (o `100 × 80`) |
| **Subproceso expandido / de Evento** | `(N_cols_internas · 150 + 80) × 180` |
| **Compuerta (cualquiera)** | `50 × 50` |
| **Evento (Inicio, Intermedio, Adjunto, Fin)** | `36 × 36` |
| **Objeto de Datos (`DataObjectReference`)** | `36 × 50` |
| **Depósito de Datos (`DataStoreReference`)** | `50 × 50` |
| **Anotación (`TextAnnotation`)** | `120 × 40` (mínimo) |
| **Carril (`Lane`)** | `ancho del Contenedor × 150` (`210` si contiene eventos adjuntos, objetos de datos o ramas internas paralelas) |
| **Cabecera de Contenedor (`Pool`) / Carril (`Lane`)** | `30` px de ancho (banda vertical izquierda con el nombre rotado −90°) |
| **Banda de Fase (`Phase`)** *(opcional)* | `30` px de alto en el borde superior del Contenedor, con líneas divisorias verticales discontinuas |

- **Grilla horizontal:** paso de `160 px` (mínimo `150 px`) entre centros de elementos consecutivos. Primer elemento en `cx = 130` (dejando `60 px` para las cabeceras de Pool + Lane y margen inicial).
- **Centro vertical del carril `n` (base 0):** `cy = 60 + Σ(altos de carriles previos) + (alto_carril_n / 2)`, donde `60` es el margen superior del Contenedor.
- **Coordenadas `dc:Bounds` en BPMN:** se expresan siempre por la **esquina superior izquierda**: para un elemento de ancho `w` y alto `h` centrado en `(cx, cy)`, sus coordenadas son `x = cx − w/2` e `y = cy − h/2`.

---

## 2. Algoritmo de posicionamiento y ruteo ortogonal

1. **Ordenamiento topológico por columnas:** numera las columnas desde el Evento de Inicio (`columna 0`). Cada elemento sucesor se ubica en `columna = máx(columna de sus predecesores) + 1`.
2. **Asignación de fila (Carril):** cada elemento se posiciona en la fila correspondiente al `Lane` de su rol ejecutor (`Encargado / Performer`).
3. **Ramas de compuertas divergentes:**
   - Si las ramas que salen de una compuerta van a actividades en **distintos carriles**, pueden compartir la misma columna en sus respectivos carriles.
   - Si dos ramas de una misma compuerta van a actividades dentro del **mismo carril**, desplaza la segunda rama `±65 px` en vertical y aumenta el alto de ese carril a `220 px` para que no se solapen.
4. **Convergencia:** toda compuerta convergente (`Join`) o actividad de unión se ubica en `columna = máx(columna de las ramas que convergen) + 1`.
5. **Eventos adjuntos al límite (`boundaryEvent`):**
   - Su centro se ubica exactamente sobre el **borde inferior** de la actividad a la que está adjunto (`cx = x_tarea + 70`, `cy = y_tarea + height_tarea`, de modo que `Bounds.x = cx - 18` y `Bounds.y = y_tarea + height_tarea - 18`).
   - Su flujo de salida baja verticalmente `55 px` y luego avanza hacia la columna siguiente por un canal despejado.
6. **Subprocesos de Evento (`triggeredByEvent="true"`):** se ubican en una franja inferior o lateral despejada dentro del Proceso o Subproceso que los contiene, con borde discontinuo (`stroke-dasharray="6,4"`) y sin conectores externos de secuencia.
7. **Contenedores (`Pools`):**
   - `width = (última_columna · 160) + 140`; `height = Σ(altos de sus carriles)`.
   - Si existe un Contenedor externo cerrado (ej. `Cliente` o `Proveedor`), ubícalo arriba del Contenedor principal (`y = 20`, `height = 60`) dejando `40 px` de separación para los `Flujos de Mensaje` verticales.
8. **Ruteo ortogonal de aristas (`di:waypoint`) y chequeo de cero colisiones:**
   - **Misma fila y columnas consecutivas:** línea horizontal recta desde el borde derecho del origen `(x_orig + w_orig, cy)` hasta el borde izquierdo del destino `(x_dest, cy)`.
   - **Cambio de fila (entre carriles o ramas):** tramo de 3 segmentos ortogonales: sale por el borde derecho `(x_orig + w_orig, cy_orig)` $\rightarrow$ avanza hasta el canal vertical medio `(x_medio, cy_orig)` $\rightarrow$ sube/baja a `(x_medio, cy_dest)` $\rightarrow$ entra por el borde izquierdo `(x_dest, cy_dest)`.
   - **Retornos (bucles hacia atrás):** salen por el borde superior o inferior de la compuerta/actividad, rodean por un canal horizontal libre a `35 px` por encima o por debajo de las cajas intermedias, y entran por el borde superior o inferior de la actividad destino. **Jamás traces una línea que cruce por encima de una caja ni de un texto.**
9. **Objetos de Datos, Depósitos y Anotaciones:** se ubican a `55 px` por encima o por debajo de la actividad asociada en una columna libre, unidos con una línea de asociación punteada.

---

## 3. Esqueleto completo del archivo `.bpmn` (BPMN 2.0 + BPMNDI)

El siguiente esqueleto incluye todos los patrones del estándar BPMN 2.0 verificados en los modelos de referencia de la WfMC y Bizagi Modeler:
- Declaración de `<bpmn:resource>` a nivel raíz y vinculación en cada tarea con `<bpmn:performer><bpmn:resourceRef>`.
- Ciclo de vida de `<bpmn:dataObject>` mediante `<bpmn:dataObjectReference>` con `<bpmn:dataState name="..."/>`, `<bpmn:ioSpecification>`, `<bpmn:dataInputAssociation>` y `<bpmn:dataOutputAssociation>`.
- Compuertas Exclusivas (`exclusiveGateway` con atributo `default`) y Paralelas (`parallelGateway` en par divergencia + convergencia).
- Eventos adjuntos al límite (`boundaryEvent` interruptor `cancelActivity="true"` y no interruptor `cancelActivity="false"`).
- Subproceso de Evento (`subProcess triggeredByEvent="true"`).
- Capa gráfica `<bpmndi:BPMNDiagram>` completa para que el archivo importe ya diagramado.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions
    xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
    xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
    xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
    xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
    xmlns:bpsim="http://www.bpsim.org/schemas/2.0"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    id="Definitions_1"
    name="Modelo_Proceso_AS_IS"
    targetNamespace="http://example.org/bpmn/procesos"
    exporter="BPMN 2.0 Modeler"
    exporterVersion="2.0">

  <!-- ============ 1. RECURSOS, MENSAJES, SEÑALES, ERRORES Y DATA STORES ============ -->
  <bpmn:resource id="Res_analista" name="Analista de Operaciones"/>
  <bpmn:resource id="Res_especialista" name="Especialista Técnico"/>
  <bpmn:resource id="Res_jefatura" name="Jefe de Área"/>

  <bpmn:message id="Msg_solicitud" name="Solicitud de cliente"/>
  <bpmn:signal id="Sig_cancelacion" name="Orden de cancelación"/>
  <bpmn:error id="Err_validacion" name="Error de validación técnica" errorCode="ERR-01"/>

  <bpmn:dataStore id="DS_sistema" name="Sistema Central de Registro" isUnlimited="true"/>

  <!-- ============ 2. COLABORACIÓN (CONTENEDORES Y FLUJOS DE MENSAJE) ============ -->
  <bpmn:collaboration id="Collab_1">
    <bpmn:participant id="Part_Principal" name="[Nombre del Proceso / Organización]" processRef="Process_1"/>
    <bpmn:participant id="Part_Externo" name="[Cliente / Solicitante Externo]"/>
    <bpmn:messageFlow id="MF_1" name="Solicitud" sourceRef="Part_Externo" targetRef="StartEvent_1"/>
  </bpmn:collaboration>

  <!-- ============ 3. PROCESO PRINCIPAL ============ -->
  <bpmn:process id="Process_1" name="[Nombre del Proceso]" isExecutable="true">
    <bpmn:documentation>[Descripción general del proceso AS-IS, alcance desde/hasta y objetivo]</bpmn:documentation>

    <!-- 3.1 Carriles (Lanes) -->
    <bpmn:laneSet id="LaneSet_1">
      <bpmn:lane id="Lane_1" name="Analista de Operaciones">
        <bpmn:flowNodeRef>StartEvent_1</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>Task_1</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>Bnd_SLA_1</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>Task_Alerta</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>End_Alerta</bpmn:flowNodeRef>
      </bpmn:lane>
      <bpmn:lane id="Lane_2" name="Especialista Técnico">
        <bpmn:flowNodeRef>Task_2</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>Gw_1</bpmn:flowNodeRef>
      </bpmn:lane>
      <bpmn:lane id="Lane_3" name="Jefe de Área">
        <bpmn:flowNodeRef>Task_3</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>End_Aprobado</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>End_Rechazado</bpmn:flowNodeRef>
        <bpmn:flowNodeRef>Sub_Evento_Cancel</bpmn:flowNodeRef>
      </bpmn:lane>
    </bpmn:laneSet>

    <!-- 3.2 Objetos de Datos con Estados ([Estado]) y Depósitos de Datos -->
    <bpmn:dataObject id="DO_Solicitud" name="Solicitud"/>

    <bpmn:dataObjectReference id="DOR_Solicitud_Inicial" name="Solicitud [Inicial]" dataObjectRef="DO_Solicitud">
      <bpmn:dataState id="State_Inicial" name="Inicial"/>
    </bpmn:dataObjectReference>

    <bpmn:dataObjectReference id="DOR_Solicitud_Evaluada" name="Solicitud [Evaluada]" dataObjectRef="DO_Solicitud">
      <bpmn:dataState id="State_Evaluada" name="Evaluada"/>
    </bpmn:dataObjectReference>

    <bpmn:dataObjectReference id="DOR_Solicitud_Aprobada" name="Solicitud [Aprobada]" dataObjectRef="DO_Solicitud">
      <bpmn:dataState id="State_Aprobada" name="Aprobada"/>
    </bpmn:dataObjectReference>

    <bpmn:dataStoreReference id="DSR_Sistema" name="Sistema Central" dataStoreRef="DS_sistema"/>

    <!-- 3.3 Eventos de Inicio -->
    <!-- Variantes: messageEventDefinition, timerEventDefinition, conditionalEventDefinition, signalEventDefinition; sin hijo = Simple -->
    <bpmn:startEvent id="StartEvent_1" name="Solicitud recibida">
      <bpmn:outgoing>Flow_1</bpmn:outgoing>
      <bpmn:messageEventDefinition id="MED_Start_1" messageRef="Msg_solicitud"/>
    </bpmn:startEvent>

    <!-- 3.4 Actividades con ioSpecification, DataAssociations y Performer -->
    <!-- Tipos: task, userTask, manualTask, serviceTask, businessRuleTask, scriptTask, sendTask, receiveTask -->
    <bpmn:userTask id="Task_1" name="Registrar y verificar antecedentes" startQuantity="1" completionQuantity="1">
      <bpmn:documentation>[VA - Valor Agregado] Verifica que la solicitud contenga todos los documentos requeridos y la ingresa en el sistema.</bpmn:documentation>
      <bpmn:incoming>Flow_1</bpmn:incoming>
      <bpmn:outgoing>Flow_2</bpmn:outgoing>
      <bpmn:ioSpecification id="ioSpec_Task_1">
        <bpmn:dataOutput id="dout_Task_1" name="Solicitud Inicial"/>
        <bpmn:inputSet id="inSet_Task_1"/>
        <bpmn:outputSet id="outSet_Task_1">
          <bpmn:dataOutputRefs>dout_Task_1</bpmn:dataOutputRefs>
        </bpmn:outputSet>
      </bpmn:ioSpecification>
      <bpmn:dataOutputAssociation id="doa_Task_1">
        <bpmn:sourceRef>dout_Task_1</bpmn:sourceRef>
        <bpmn:targetRef>DOR_Solicitud_Inicial</bpmn:targetRef>
      </bpmn:dataOutputAssociation>
      <bpmn:performer id="Perf_Task_1">
        <bpmn:resourceRef>Res_analista</bpmn:resourceRef>
      </bpmn:performer>
    </bpmn:userTask>

    <!-- Evento de Temporización Adjunto No Interruptor (cancelActivity="false" = alerta sin detener tarea) -->
    <!-- Si corta la actividad, usar cancelActivity="true" -->
    <bpmn:boundaryEvent id="Bnd_SLA_1" name="Plazo 4 h" attachedToRef="Task_1" cancelActivity="false">
      <bpmn:outgoing>Flow_SLA</bpmn:outgoing>
      <bpmn:timerEventDefinition id="TED_SLA_1">
        <bpmn:timeDuration xsi:type="bpmn:tFormalExpression">PT4H</bpmn:timeDuration>
      </bpmn:timerEventDefinition>
    </bpmn:boundaryEvent>

    <bpmn:sendTask id="Task_Alerta" name="Enviar alerta de demora">
      <bpmn:documentation>[TR - Transferencia] Notifica demora sin interrumpir la verificación.</bpmn:documentation>
      <bpmn:incoming>Flow_SLA</bpmn:incoming>
      <bpmn:outgoing>Flow_Fin_Alerta</bpmn:outgoing>
      <bpmn:performer id="Perf_Alerta">
        <bpmn:resourceRef>Res_analista</bpmn:resourceRef>
      </bpmn:performer>
    </bpmn:sendTask>

    <bpmn:endEvent id="End_Alerta" name="Alerta enviada">
      <bpmn:incoming>Flow_Fin_Alerta</bpmn:incoming>
    </bpmn:endEvent>

    <!-- Tarea de Regla de Negocio + Entrada/Salida de Objeto de Datos -->
    <bpmn:businessRuleTask id="Task_2" name="Evaluar criterios de elegibilidad">
      <bpmn:documentation>[CT - Control] Evalúa la solicitud contra la tabla de elegibilidad y políticas vigentes.</bpmn:documentation>
      <bpmn:incoming>Flow_2</bpmn:incoming>
      <bpmn:outgoing>Flow_3</bpmn:outgoing>
      <bpmn:ioSpecification id="ioSpec_Task_2">
        <bpmn:dataInput id="din_Task_2" name="Solicitud Entrada"/>
        <bpmn:dataOutput id="dout_Task_2" name="Solicitud Evaluada"/>
        <bpmn:inputSet id="inSet_Task_2">
          <bpmn:dataInputRefs>din_Task_2</bpmn:dataInputRefs>
        </bpmn:inputSet>
        <bpmn:outputSet id="outSet_Task_2">
          <bpmn:dataOutputRefs>dout_Task_2</bpmn:dataOutputRefs>
        </bpmn:outputSet>
      </bpmn:ioSpecification>
      <bpmn:dataInputAssociation id="dia_Task_2">
        <bpmn:sourceRef>DOR_Solicitud_Inicial</bpmn:sourceRef>
        <bpmn:targetRef>din_Task_2</bpmn:targetRef>
      </bpmn:dataInputAssociation>
      <bpmn:dataOutputAssociation id="doa_Task_2">
        <bpmn:sourceRef>dout_Task_2</bpmn:sourceRef>
        <bpmn:targetRef>DOR_Solicitud_Evaluada</bpmn:targetRef>
      </bpmn:dataOutputAssociation>
      <bpmn:performer id="Perf_Task_2">
        <bpmn:resourceRef>Res_especialista</bpmn:resourceRef>
      </bpmn:performer>
    </bpmn:businessRuleTask>

    <!-- 3.5 Compuertas (exclusiveGateway, parallelGateway, inclusiveGateway, eventBasedGateway, complexGateway) -->
    <bpmn:exclusiveGateway id="Gw_1" name="¿Cumple criterios?" default="Flow_4_Si">
      <bpmn:incoming>Flow_3</bpmn:incoming>
      <bpmn:outgoing>Flow_4_Si</bpmn:outgoing>
      <bpmn:outgoing>Flow_5_No</bpmn:outgoing>
    </bpmn:exclusiveGateway>

    <!-- Tarea de aprobación y registro en Data Store -->
    <bpmn:userTask id="Task_3" name="Autorizar y registrar resolución">
      <bpmn:documentation>[CT - Control] Emite autorización formal y guarda resolución en el Sistema Central.</bpmn:documentation>
      <bpmn:incoming>Flow_4_Si</bpmn:incoming>
      <bpmn:outgoing>Flow_6_Fin</bpmn:outgoing>
      <bpmn:ioSpecification id="ioSpec_Task_3">
        <bpmn:dataInput id="din_Task_3" name="Solicitud Evaluada"/>
        <bpmn:dataOutput id="dout_Task_3_Doc" name="Solicitud Aprobada"/>
        <bpmn:dataOutput id="dout_Task_3_BD" name="Registro BD"/>
        <bpmn:inputSet id="inSet_Task_3">
          <bpmn:dataInputRefs>din_Task_3</bpmn:dataInputRefs>
        </bpmn:inputSet>
        <bpmn:outputSet id="outSet_Task_3">
          <bpmn:dataOutputRefs>dout_Task_3_Doc</bpmn:dataOutputRefs>
          <bpmn:dataOutputRefs>dout_Task_3_BD</bpmn:dataOutputRefs>
        </bpmn:outputSet>
      </bpmn:ioSpecification>
      <bpmn:dataInputAssociation id="dia_Task_3">
        <bpmn:sourceRef>DOR_Solicitud_Evaluada</bpmn:sourceRef>
        <bpmn:targetRef>din_Task_3</bpmn:targetRef>
      </bpmn:dataInputAssociation>
      <bpmn:dataOutputAssociation id="doa_Task_3_1">
        <bpmn:sourceRef>dout_Task_3_Doc</bpmn:sourceRef>
        <bpmn:targetRef>DOR_Solicitud_Aprobada</bpmn:targetRef>
      </bpmn:dataOutputAssociation>
      <bpmn:dataOutputAssociation id="doa_Task_3_2">
        <bpmn:sourceRef>dout_Task_3_BD</bpmn:sourceRef>
        <bpmn:targetRef>DSR_Sistema</bpmn:targetRef>
      </bpmn:dataOutputAssociation>
      <bpmn:performer id="Perf_Task_3">
        <bpmn:resourceRef>Res_jefatura</bpmn:resourceRef>
      </bpmn:performer>
    </bpmn:userTask>

    <!-- 3.6 Eventos de Finalización (uno por cada desenlace de negocio) -->
    <bpmn:endEvent id="End_Aprobado" name="Solicitud aprobada">
      <bpmn:incoming>Flow_6_Fin</bpmn:incoming>
    </bpmn:endEvent>

    <bpmn:endEvent id="End_Rechazado" name="Solicitud rechazada">
      <bpmn:incoming>Flow_5_No</bpmn:incoming>
    </bpmn:endEvent>

    <!-- 3.7 Subproceso de Evento (Event Sub-Process: triggeredByEvent="true") -->
    <bpmn:subProcess id="Sub_Evento_Cancel" name="Cancelación a petición del solicitante" triggeredByEvent="true">
      <bpmn:startEvent id="Start_Cancel" name="Orden de cancelación recibida" isInterrupting="true">
        <bpmn:outgoing>Flow_Cancel_1</bpmn:outgoing>
        <bpmn:signalEventDefinition id="SED_Cancel" signalRef="Sig_cancelacion"/>
      </bpmn:startEvent>
      <bpmn:endEvent id="End_Cancel" name="Proceso cancelado">
        <bpmn:incoming>Flow_Cancel_1</bpmn:incoming>
        <bpmn:terminateEventDefinition id="TED_Cancel"/>
      </bpmn:endEvent>
      <bpmn:sequenceFlow id="Flow_Cancel_1" sourceRef="Start_Cancel" targetRef="End_Cancel"/>
    </bpmn:subProcess>

    <!-- 3.8 Flujos de Secuencia -->
    <bpmn:sequenceFlow id="Flow_1" sourceRef="StartEvent_1" targetRef="Task_1"/>
    <bpmn:sequenceFlow id="Flow_2" sourceRef="Task_1" targetRef="Task_2"/>
    <bpmn:sequenceFlow id="Flow_3" sourceRef="Task_2" targetRef="Gw_1"/>
    <bpmn:sequenceFlow id="Flow_4_Si" name="Sí" sourceRef="Gw_1" targetRef="Task_3"/>
    <bpmn:sequenceFlow id="Flow_5_No" name="No" sourceRef="Gw_1" targetRef="End_Rechazado">
      <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression">not(cumpleCriterios)</bpmn:conditionExpression>
    </bpmn:sequenceFlow>
    <bpmn:sequenceFlow id="Flow_6_Fin" sourceRef="Task_3" targetRef="End_Aprobado"/>
    <bpmn:sequenceFlow id="Flow_SLA" sourceRef="Bnd_SLA_1" targetRef="Task_Alerta"/>
    <bpmn:sequenceFlow id="Flow_Fin_Alerta" sourceRef="Task_Alerta" targetRef="End_Alerta"/>

    <!-- 3.9 Anotaciones -->
    <bpmn:textAnnotation id="Note_1">
      <bpmn:text>[Aclaración o regla asociada extraída del documento]</bpmn:text>
    </bpmn:textAnnotation>
    <bpmn:association id="Assoc_1" sourceRef="Task_2" targetRef="Note_1"/>

  </bpmn:process>

  <!-- ============ 4. CAPA DE DIAGRAMA (BPMNDI) ============ -->
  <bpmndi:BPMNDiagram id="Diagram_1" name="Diagrama AS-IS">
    <bpmndi:BPMNPlane id="Plane_1" bpmnElement="Collab_1">

      <!-- Contenedores y Carriles -->
      <bpmndi:BPMNShape id="Sh_Part_Externo" bpmnElement="Part_Externo" isHorizontal="true">
        <dc:Bounds x="30" y="20" width="960" height="60"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Sh_Part_Principal" bpmnElement="Part_Principal" isHorizontal="true">
        <dc:Bounds x="30" y="120" width="960" height="510"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Sh_Lane_1" bpmnElement="Lane_1" isHorizontal="true">
        <dc:Bounds x="60" y="120" width="930" height="190"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Sh_Lane_2" bpmnElement="Lane_2" isHorizontal="true">
        <dc:Bounds x="60" y="310" width="930" height="150"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Sh_Lane_3" bpmnElement="Lane_3" isHorizontal="true">
        <dc:Bounds x="60" y="460" width="930" height="170"/>
      </bpmndi:BPMNShape>

      <!-- Nodos de Flujo -->
      <bpmndi:BPMNShape id="Sh_StartEvent_1" bpmnElement="StartEvent_1">
        <dc:Bounds x="112" y="177" width="36" height="36"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Sh_Task_1" bpmnElement="Task_1">
        <dc:Bounds x="210" y="155" width="110" height="80"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Sh_Bnd_SLA_1" bpmnElement="Bnd_SLA_1">
        <dc:Bounds x="262" y="217" width="36" height="36"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Sh_Task_Alerta" bpmnElement="Task_Alerta">
        <dc:Bounds x="350" y="235" width="110" height="60"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Sh_End_Alerta" bpmnElement="End_Alerta">
        <dc:Bounds x="500" y="247" width="36" height="36"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Sh_Task_2" bpmnElement="Task_2">
        <dc:Bounds x="370" y="345" width="110" height="80"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Sh_Gw_1" bpmnElement="Gw_1" isMarkerVisible="true">
        <dc:Bounds x="545" y="360" width="50" height="50"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Sh_Task_3" bpmnElement="Task_3">
        <dc:Bounds x="660" y="505" width="110" height="80"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Sh_End_Aprobado" bpmnElement="End_Aprobado">
        <dc:Bounds x="842" y="527" width="36" height="36"/>
      </bpmndi:BPMNShape>
      <bpmndi:BPMNShape id="Sh_End_Rechazado" bpmnElement="End_Rechazado">
        <dc:Bounds x="842" y="472" width="36" height="36"/>
      </bpmndi:BPMNShape>

      <!-- Conectores (BPMNEdge) -->
      <bpmndi:BPMNEdge id="Ed_MF_1" bpmnElement="MF_1">
        <di:waypoint x="130" y="80"/>
        <di:waypoint x="130" y="177"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Ed_Flow_1" bpmnElement="Flow_1">
        <di:waypoint x="148" y="195"/>
        <di:waypoint x="210" y="195"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Ed_Flow_2" bpmnElement="Flow_2">
        <di:waypoint x="320" y="195"/>
        <di:waypoint x="345" y="195"/>
        <di:waypoint x="345" y="385"/>
        <di:waypoint x="370" y="385"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Ed_Flow_3" bpmnElement="Flow_3">
        <di:waypoint x="480" y="385"/>
        <di:waypoint x="545" y="385"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Ed_Flow_4_Si" bpmnElement="Flow_4_Si">
        <di:waypoint x="570" y="410"/>
        <di:waypoint x="570" y="545"/>
        <di:waypoint x="660" y="545"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Ed_Flow_5_No" bpmnElement="Flow_5_No">
        <di:waypoint x="595" y="385"/>
        <di:waypoint x="800" y="385"/>
        <di:waypoint x="800" y="490"/>
        <di:waypoint x="842" y="490"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Ed_Flow_6_Fin" bpmnElement="Flow_6_Fin">
        <di:waypoint x="770" y="545"/>
        <di:waypoint x="842" y="545"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Ed_Flow_SLA" bpmnElement="Flow_SLA">
        <di:waypoint x="280" y="253"/>
        <di:waypoint x="280" y="265"/>
        <di:waypoint x="350" y="265"/>
      </bpmndi:BPMNEdge>
      <bpmndi:BPMNEdge id="Ed_Flow_Fin_Alerta" bpmnElement="Flow_Fin_Alerta">
        <di:waypoint x="460" y="265"/>
        <di:waypoint x="500" y="265"/>
      </bpmndi:BPMNEdge>

    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>

  <!-- (Aquí se inserta el bloque <bpmn:relationship type="BPSimData"> de la §4 si aplica) -->

</bpmn:definitions>
```

**Notas de validez estructural del `.bpmn`:**
- Todo `flowNodeRef` declarado dentro de un `bpmn:lane` debe existir como nodo hijo de `bpmn:process`.
- Cada `sequenceFlow` referenciado en `incoming`/`outgoing` de un nodo debe existir con el mismo `id`, y coincidir en `sourceRef`/`targetRef`.
- `isMarkerVisible="true"` en el `BPMNShape` de la compuerta exclusiva dibuja la `X` interna al importarlo en Bizagi/Camunda.
- Si el proceso no tiene participantes externos (`bpmn:collaboration`), el atributo `bpmnElement` de `bpmndi:BPMNPlane` apunta directamente al `id` del `bpmn:process`.
- Un solo `<bpmn:definitions>` por archivo. Para marcadores sobre actividades usa `<bpmn:standardLoopCharacteristics/>` (ciclo estándar) o `<bpmn:multiInstanceLoopCharacteristics isSequential="false"/>` (múltiples instancias). Para subprocesos reusables usa `<bpmn:callActivity id="Call_1" name="..." calledElement="Process_Sub_1"/>`.

---

## 4. Bloque de parámetros de análisis y simulación BPSim 2.0 (4 Niveles Progresivos)

Se adjunta dentro de `<bpmn:definitions>` como `<bpmn:relationship type="BPSimData">`. Esta estructura respeta al 100% el esquema oficial **`BPSim 2.0 XML Schema.xsd`** y los 4 niveles de simulación de **Bizagi Modeler**:

1. **Orden obligatorio en `<bpsim:ScenarioParameters>` (según el XSD):** `Start` $\rightarrow$ `Duration` $\rightarrow$ `Warmup` $\rightarrow$ `PropertyParameters`.
2. **Capitalización exacta en `<bpsim:TimeParameters>`:** el tiempo de preparación se escribe **`<bpsim:SetUpTime>`** (con `U` mayúscula), acompañado de `TransferTime`, `QueueTime`, `WaitTime`, `ProcessingTime`, `ValidationTime` y `ReworkTime`.
3. **Resultados (`ResultRequest`):** `Duration`, `LagTime`, `ElapsedTime` y `QueueLength` se usan **únicamente** para pedir resultados (`min`, `max`, `mean`, `sum`, `count`), jamás como valores de entrada.
4. **Asignación de recursos en actividades (`Selection`):** mientras la dotación (`Quantity`) y el costo horario (`UnitCost`) se declaran sobre el recurso (`elementRef="Res_..."`), la actividad solicita el recurso mediante `<bpsim:Selection><bpsim:ExpressionParameter value="bpsim:getResource('Res_...', 1)"/></bpsim:Selection>` (o `bpsim:getResourceByRoles(['Rol'], 1)`).
5. **Herencia de escenarios (`inherits="S1"`):** permite definir un segundo escenario (`S2`) que hereda todos los parámetros del escenario base (`S1`) y modifica únicamente los parámetros que cambian (ej. mayor demanda, distinta dotación o activación de turnos).

```xml
  <bpmn:relationship type="BPSimData">
    <bpmn:extensionElements>
      <bpsim:BPSimData>

        <!-- ================================================================ -->
        <!-- ESCENARIO S1: LÍNEA BASE AS-IS (4 NIVELES DE SIMULACIÓN)         -->
        <!-- ================================================================ -->
        <bpsim:Scenario id="S1" name="Escenario 1 - Linea Base AS-IS" author="Analista" created="2026-03-01T08:00:00">

          <!-- Orden XSD estricto: Start -> Duration -> Warmup -> PropertyParameters -->
          <bpsim:ScenarioParameters baseTimeUnit="min" baseCurrencyUnit="USD" replication="3" seed="12345">
            <bpsim:Start>
              <bpsim:DateTimeParameter value="2026-03-02T08:00:00"/>
            </bpsim:Start>
            <bpsim:Duration>
              <bpsim:DurationParameter value="PT40H"/>
            </bpsim:Duration>
            <bpsim:Warmup>
              <bpsim:DurationParameter value="PT8H"/>
            </bpsim:Warmup>
          </bpsim:ScenarioParameters>

          <!-- NIVEL 1 (CONTROL): Llegada de casos al Evento de Inicio -->
          <bpsim:ElementParameters elementRef="StartEvent_1">
            <bpsim:ControlParameters>
              <bpsim:InterTriggerTimer>
                <bpsim:TriangularDistribution min="10.0" mode="16.0" max="30.0" timeUnit="min" validFor="Cal_Turno"/>
              </bpsim:InterTriggerTimer>
              <bpsim:TriggerCount>
                <bpsim:ResultRequest>count</bpsim:ResultRequest>
                <bpsim:NumericParameter value="200"/>
              </bpsim:TriggerCount>
            </bpsim:ControlParameters>
          </bpsim:ElementParameters>

          <!-- NIVEL 1 (CONTROL): Reparto de probabilidades en las salidas de la compuerta (Suman 1.0) -->
          <bpsim:ElementParameters elementRef="Flow_4_Si">
            <bpsim:ControlParameters>
              <bpsim:Probability>
                <bpsim:FloatingParameter value="0.75"/>
              </bpsim:Probability>
              <bpsim:TriggerCount>
                <bpsim:ResultRequest>count</bpsim:ResultRequest>
              </bpsim:TriggerCount>
            </bpsim:ControlParameters>
          </bpsim:ElementParameters>

          <bpsim:ElementParameters elementRef="Flow_5_No">
            <bpsim:ControlParameters>
              <bpsim:Probability>
                <bpsim:FloatingParameter value="0.25"/>
              </bpsim:Probability>
              <bpsim:TriggerCount>
                <bpsim:ResultRequest>count</bpsim:ResultRequest>
              </bpsim:TriggerCount>
            </bpsim:ControlParameters>
          </bpsim:ElementParameters>

          <!-- NIVEL 2 Y 3 (TIEMPO, RECURSOS Y COSTOS): Actividad 1 -->
          <!-- Normal truncada en 0 para evitar duraciones negativas -->
          <bpsim:ElementParameters elementRef="Task_1">
            <bpsim:TimeParameters>
              <bpsim:SetUpTime>
                <bpsim:DurationParameter value="PT2M"/>
              </bpsim:SetUpTime>
              <bpsim:ProcessingTime>
                <bpsim:TruncatedNormalDistribution mean="20.0" standardDeviation="3.0" min="0.0" max="60.0" timeUnit="min"/>
              </bpsim:ProcessingTime>
              <bpsim:WaitTime>
                <bpsim:DurationParameter value="PT15M"/>
              </bpsim:WaitTime>
              <bpsim:Duration>
                <bpsim:ResultRequest>min</bpsim:ResultRequest>
                <bpsim:ResultRequest>max</bpsim:ResultRequest>
                <bpsim:ResultRequest>mean</bpsim:ResultRequest>
              </bpsim:Duration>
              <bpsim:LagTime>
                <bpsim:ResultRequest>mean</bpsim:ResultRequest>
              </bpsim:LagTime>
            </bpsim:TimeParameters>
            <bpsim:ResourceParameters>
              <bpsim:Selection>
                <bpsim:ExpressionParameter value="bpsim:getResource('Res_analista', 1)"/>
              </bpsim:Selection>
              <bpsim:QueueLength>
                <bpsim:ResultRequest>mean</bpsim:ResultRequest>
                <bpsim:ResultRequest>max</bpsim:ResultRequest>
              </bpsim:QueueLength>
            </bpsim:ResourceParameters>
            <bpsim:CostParameters>
              <bpsim:FixedCost>
                <bpsim:FloatingParameter value="10.0"/>
              </bpsim:FixedCost>
            </bpsim:CostParameters>
          </bpsim:ElementParameters>

          <!-- NIVEL 2 Y 3: Actividad 2 con serie de datos históricos reales (EnumParameter) -->
          <bpsim:ElementParameters elementRef="Task_2">
            <bpsim:TimeParameters>
              <bpsim:ProcessingTime>
                <bpsim:EnumParameter>
                  <bpsim:DurationParameter value="PT12M"/>
                  <bpsim:DurationParameter value="PT18M"/>
                  <bpsim:DurationParameter value="PT25M"/>
                </bpsim:EnumParameter>
              </bpsim:ProcessingTime>
              <bpsim:Duration>
                <bpsim:ResultRequest>mean</bpsim:ResultRequest>
              </bpsim:Duration>
            </bpsim:TimeParameters>
            <bpsim:ResourceParameters>
              <bpsim:Selection>
                <bpsim:ExpressionParameter value="bpsim:getResource('Res_especialista', 1)"/>
              </bpsim:Selection>
            </bpsim:ResourceParameters>
          </bpsim:ElementParameters>

          <!-- NIVEL 3 (CAPACIDAD Y COSTO UNITARIO): Definidos sobre el Recurso, nunca sobre la tarea -->
          <bpsim:ElementParameters elementRef="Res_analista">
            <bpsim:ResourceParameters>
              <bpsim:Quantity>
                <bpsim:NumericParameter value="3" validFor="Cal_Turno"/>
              </bpsim:Quantity>
              <bpsim:Role>
                <bpsim:StringParameter value="Analista de Operaciones"/>
              </bpsim:Role>
            </bpsim:ResourceParameters>
            <bpsim:CostParameters>
              <bpsim:UnitCost>
                <bpsim:FloatingParameter value="25.0" timeUnit="h"/>
              </bpsim:UnitCost>
            </bpsim:CostParameters>
          </bpsim:ElementParameters>

          <bpsim:ElementParameters elementRef="Res_especialista">
            <bpsim:ResourceParameters>
              <bpsim:Quantity>
                <bpsim:NumericParameter value="2" validFor="Cal_Turno"/>
              </bpsim:Quantity>
            </bpsim:ResourceParameters>
            <bpsim:CostParameters>
              <bpsim:UnitCost>
                <bpsim:FloatingParameter value="35.0" timeUnit="h"/>
              </bpsim:UnitCost>
            </bpsim:CostParameters>
          </bpsim:ElementParameters>

          <!-- RESULTADOS GLOBALES DEL PROCESO -->
          <bpsim:ElementParameters elementRef="Process_1">
            <bpsim:TimeParameters>
              <bpsim:ElapsedTime>
                <bpsim:ResultRequest>min</bpsim:ResultRequest>
                <bpsim:ResultRequest>max</bpsim:ResultRequest>
                <bpsim:ResultRequest>mean</bpsim:ResultRequest>
              </bpsim:ElapsedTime>
            </bpsim:TimeParameters>
            <bpsim:ControlParameters>
              <bpsim:TriggerCount>
                <bpsim:ResultRequest>count</bpsim:ResultRequest>
              </bpsim:TriggerCount>
            </bpsim:ControlParameters>
          </bpsim:ElementParameters>

          <!-- NIVEL 4 (CALENDARIOS RFC 5545 iCalendar) -->
          <bpsim:Calendar id="Cal_Turno" name="Horario Hábil Lunes a Viernes 08:00-18:00">
BEGIN:VCALENDAR
PRODID:-//WfMC//BPSim 2.0//EN
VERSION:2.0
BEGIN:VEVENT
UID:cal-turno-1@example.org
DTSTART:20260302T080000
DTEND:20260302T180000
RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR
SUMMARY:Jornada Laboral
END:VEVENT
END:VCALENDAR
          </bpsim:Calendar>

        </bpsim:Scenario>

        <!-- ================================================================ -->
        <!-- ESCENARIO S2: ANÁLISIS DE SENSIBILIDAD (Hereda de S1)            -->
        <!-- ================================================================ -->
        <bpsim:Scenario id="S2" name="Escenario 2 - Sensibilidad de Capacidad" inherits="S1">
          <bpsim:ElementParameters elementRef="Res_analista">
            <bpsim:ResourceParameters>
              <bpsim:Quantity>
                <bpsim:NumericParameter value="2" validFor="Cal_Turno"/>
              </bpsim:Quantity>
            </bpsim:ResourceParameters>
          </bpsim:ElementParameters>
        </bpsim:Scenario>

      </bpsim:BPSimData>
    </bpmn:extensionElements>
  </bpmn:relationship>
```

### Catálogo de distribuciones estadísticas válidas en `BPSim 2.0 XML Schema.xsd`
- `UniformDistribution` (`min`, `max`, `timeUnit`)
- `NormalDistribution` (`mean`, `standardDeviation`, `timeUnit`)
- `TruncatedNormalDistribution` (`mean`, `standardDeviation`, `min`, `max`, `timeUnit`)
- `TriangularDistribution` (`min`, `mode`, `max`, `timeUnit`)
- `NegativeExponentialDistribution` (`mean`, `timeUnit`)
- `PoissonDistribution` (`mean`, `timeUnit`)
- `ErlangDistribution` (`mean`, `k`, `timeUnit`)
- `LogNormalDistribution` (`mean`, `standardDeviation`, `timeUnit`)
- `GammaDistribution` (`shape`, `scale`, `timeUnit`)
- `BetaDistribution` (`shape`, `scale`, `timeUnit`)
- `WeibullDistribution` (`shape`, `scale`, `timeUnit`)
- `BinomialDistribution` (`probability`, `trials`)
- `UserDistribution` (`discrete="true"/"false"`, con hijos `<bpsim:UserDistributionDataPoint probability="0.5"><bpsim:FloatingParameter value="10"/></bpsim:UserDistributionDataPoint>` cuyas probabilidades suman `1.0`).

---

## 5. Formas y estilo visual del SVG (Estándar Corporativo SALFA Montajes — BRASA 2A)

SVG con `viewBox="0 0 [ancho_total + 60] [alto_total + 110]"` y fondo blanco puro `#FFFFFF`. Las formas deben ser estrictamente las del estándar BPMN 2.0 y seguir la identidad visual sobria y ejecutiva de SALFA Montajes (Diseño 2A BRASA):

### 5.1. Reglas Críticas de Renderizado SVG
1. **Regla de Oro de Conectores (`fill="none"` OBLIGATORIO):**  
   Todo elemento `<path>` utilizado para secuencias, mensajes o asociaciones **debe tener explícitamente `fill="none"`**.  
   *Causa de fallo:* En la especificación SVG, si un `<path>` omite `fill`, el renderizador aplica por defecto `fill="#000000"` (negro). En conectores ortogonales con saltos entre carriles o retornos, esto produce polígonos cerrados y relojes de arena negros gigantescos que tapan el flujo.
2. **Prevención de Textos Truncados en Cabeceras (Pools y Lanes):**  
   - Los títulos de Pool deben ubicarse en una barra horizontal superior (`height="30"` px, texto horizontal legible con `x="35"` e `y="20"`), evitando la rotación de textos extensos.
   - En cabeceras de Lane verticales (`width="30"`), el texto rotado `-90deg` solo se permite si el alto del carril es suficiente (`height >= texto.length * 8px`). De lo contrario, usar etiquetas horizontales internas o ajustar el tamaño de fuente (`font-size="11"` o `12"`).
3. **Paleta Corporativa BRASA 2A (SALFA Montajes S.A.):**
   - **Barra Institucional:** Rectángulo superior de 8mm de altura (`height="8"`) con color rojo institucional `#B01E24`.
   - **Bordes y Textos:** Gris grafito `#2E343C`, gris secundario `#5A626A`, texto principal `#15181B`.
   - **Fondo General:** Blanco puro `#FFFFFF`. Prohibido el uso de temas oscuros o paletas de videojuegos/lúdicas.
   - **Eventos:** Inicio verde `#6CA353` (`stroke="#2E7D32"`), Fin rojo `#C65D57` (`stroke="#B01E24"`), Intermedios `#F0A32F`.
   - **Compuertas:** Relleno amarillo corporativo `#FFF9C4`, trazo ámbar `#F0A32F` (`stroke-width="2"`).
   - **Tareas y Subprocesos:** Relleno blanco `#FFFFFF` o gris azulado muy suave `#F8FAFC`, trazo grafito `#2E343C`. Marcador `[+]` de subproceso en cuadrado de `14×14 px`.
4. **Cajetín Oficial de Control y Auditoría Documental:**
   Todo diagrama generado debe incluir un cajetín corporativo con:
   - **Código Provisorio de Diagrama:** Siguiendo la taxonomía SALFA (`10000000-SAL-00000-DOC-DIA-XXXXX`).
   - **Documento Rector Vinculante:** Código y versión de la norma o procedimiento fuente (ej. `10000000-PRO-EST-001 Rev. 0`).
   - **Pestaña / Informe de Trazabilidad AS-IS:** Mapeo de actividades contra secciones textuales y anexos.
5. **Mecanismo de Descarga Nativa (Blob), Ventana Emergente y Adaptación al Ancho:**
   - La descarga de archivos `.bpmn` y `.bpm` (Bizagi) debe realizarse creando un objeto `Blob` con tipo `application/octet-stream` para abrir el cuadro de diálogo nativo de "Guardar como" del sistema operativo.
   - La exportación a imagen PNG debe utilizar un elemento `<canvas>` escalado al doble de resolución (`scale = 2`, 2x DPI) e inyectar el encabezado oficial y el cajetín antes de procesar el rasterizado.
   - En visores web interactivos, los subprocesos deben incluir un botón `[🗖 Ventana]` para abrir una ventana emergente (modal dialog corporativo) que presente el flujo detallado y la matriz RACI sin abandonar el macroproceso.
   - El viewport debe implementar auto-ajuste (`Auto-Fit to Window`), controles de zoom y paneo mediante arrastre, evitando recortes en los márgenes y adaptándose a cualquier ancho de monitor.
   - Todo código HTML o documentación debe guardarse bajo codificación UTF-8 estricta para asegurar la total integridad ortográfica en español (cero mojibake).

| Elemento | Representación SVG Corporativa BRASA |
|---|---|
| **Tarea (`Task`)** | `<rect width="110" height="80" rx="8" fill="#FFFFFF" stroke="#2E343C" stroke-width="1.8"/>`. Ícono de tipo en la esquina superior izquierda. Etiqueta centrada dividida en `<tspan>` de máx. 18 caracteres por línea con tipografía Segoe UI / Arial. |
| **Subproceso cerrado** | `<rect width="110" height="80" rx="8" fill="#FFFFFF" stroke="#2E343C" stroke-width="1.8"/>` + cuadrado `14×14 px` con signo `+` centrado en el borde inferior. Si es `Call Activity` / Reusable, usar borde doble o trazo grueso `stroke-width="3.5"`. |
| **Subproceso expandido** | `<rect rx="8" fill="#F8FAFC" stroke="#2E343C" stroke-width="1.5" stroke-dasharray="none"/>` con nodos internos y botón de contraer `[-]`. Si es Subproceso de Evento: `stroke-dasharray="6,4"`. |
| **Transacción** | Doble `<rect rx="8">` concéntrico (borde interior a `3 px` de distancia). |
| **Evento de Inicio (`Start`)** | `<circle r="18" fill="#E8F5E9" stroke="#2E7D32" stroke-width="2"/>`. |
| **Evento Intermedio (`Intermediate`)** | Doble círculo concéntrico: exterior `r="18"` e interior `r="15"`, `fill="#FFF8E1" stroke="#F0A32F" stroke-width="1.8"`. |
| **Evento Adjunto Interruptor** | Doble círculo con trazo continuo, centrado en el borde inferior de la actividad. |
| **Evento Adjunto No Interruptor** | Doble círculo discontinuo (`stroke-dasharray="4,3"`), centrado en el borde inferior de la actividad. |
| **Evento de Finalización (`End`)** | `<circle r="18" fill="#FFEBEE" stroke="#B01E24" stroke-width="3"/>`. |
| **Finalización Terminal** | Círculo de fin (`stroke-width="3"`) + círculo interior sólido `r="9" fill="#B01E24"`. |
| **Compuerta (`Gateway`)** | Rombo `50×50 px`, `fill="#FFFDE7" stroke="#F0A32F" stroke-width="2"` con marcador interno centrado. |
| **Objeto de Datos (`DataObject`)** | Hoja `36×50 px` con esquina doblada + etiqueta debajo `Nombre [Estado]`. |
| **Depósito de Datos (`DataStore`)** | Cilindro `50×50 px` (`<path fill="none">` + `<ellipse>`). |
| **Anotación (`TextAnnotation`)** | Corchete izquierdo abierto `[` (`<path fill="none" stroke="#5A626A" stroke-width="1.5" d="M x+10,y L x,y L x,y+h L x+10,y+h"/>`). |
| **Grupo (`Group`)** | `<rect rx="8" fill="none" stroke="#5A626A" stroke-dasharray="8,4,2,4"/>`. |
| **Contenedor (`Pool`) / Carril (`Lane`)** | `<rect fill="none" stroke="#2E343C" stroke-width="1.5"/>` + Cabecera horizontal superior del Pool y cabeceras de carriles dimensionadas. |

**Marcadores internos de evento** (`18×18 px` centrados en el círculo):
- Sobre = **Mensaje** · Reloj con agujas = **Temporización** · Rayo en zigzag (`N`) = **Error** · Triángulo = **Señal** · Hoja con líneas = **Condicional** · Flecha en ángulo hacia arriba (`^`) = **Escalamiento** · Doble triángulo rebobinando (`<<`) = **Compensación** · Cruz (`X`) = **Cancelación** · Pentágono = **Múltiple** · Cruz gruesa diagonal = **Paralelo Múltiple** · Flecha derecha = **Enlace**.
- **Regla de relleno del marcador:** ícono **vacío (solo borde)** = **Captura (*Catch*)**; ícono **relleno (sólido)** = **Lanzamiento (*Throw*)**. Jamás inviertas esta distinción.

**Conectores (OBLIGATORIO: `fill="none"` en todos):**
| Conector | Trazo SVG |
|---|---|
| **Flujo de Secuencia** | `<path fill="none" stroke="#2E343C" stroke-width="1.8" marker-end="url(#arrow)"/>` |
| **Flujo Condicional** | `<path fill="none" stroke="#2E343C" stroke-width="1.8" marker-end="url(#arrow)"/>` + rombo en inicio |
| **Flujo por Defecto (`default`)** | `<path fill="none" stroke="#2E343C" stroke-width="1.8" marker-end="url(#arrow)"/>` + barra `/` en inicio |
| **Flujo de Mensaje** | `<path fill="none" stroke="#2E343C" stroke-width="1.8" stroke-dasharray="8,5" marker-end="url(#message-arrow)"/>` |
| **Asociación** | `<path fill="none" stroke="#5A626A" stroke-width="1.5" stroke-dasharray="4,4"/>` |

---

## 6. Orden de ejecución para generar el modelo

1. **Modelo semántico:** aplica la Prueba del Caso (C1–C5), define nivel (Nivel 1 / Nivel 2), lista participantes (`Pools`, `Lanes`, `Resources`), actividades (`VA`/`TR`/`CT`), compuertas, eventos, objetos de datos con `[Estado]` y conectores $\rightarrow$ construye la Tabla Maestra de Elementos.
2. **Layout geométrico (§1 y §2):** calcula las coordenadas exactas `(x, y, width, height)` de cada nodo y los vértices ortogonales `(x, y)` de cada conector verificando cero solapamientos.
3. **Archivo `.bpmn` (§3 y §4):** genera el XML completo con la capa semántica, la capa gráfica `<bpmndi:BPMNDiagram>` usando las coordenadas calculadas y el bloque `<bpsim:BPSimData>` cuando corresponda.
4. **Imagen `.svg` (§5):** dibuja el SVG usando exactamente las mismas coordenadas del `BPMNDiagram` para garantizar correspondencia visual 1:1.
5. **Subprocesos:** repite los pasos 1 a 4 por cada subproceso que requiera su propio diagrama de Nivel 2.
6. **Autochequeo (§13 de `SKILL.md`):** verifica que el XML esté bien formado, que cada `flowNodeRef`, `incoming`/`outgoing` y `BPSimData` cumplan los 40 puntos antes de entregar.

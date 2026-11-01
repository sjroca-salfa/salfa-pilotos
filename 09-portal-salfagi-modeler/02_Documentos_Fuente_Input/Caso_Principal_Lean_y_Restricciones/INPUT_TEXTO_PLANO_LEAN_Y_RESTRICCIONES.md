# DOCUMENTACIÓN DE PROCESO DE ENTRADA (INPUT EN LENGUAJE NATURAL)
## ESTÁNDAR CORPORATIVO: GESTIÓN DE TAREAS Y RESTRICCIONES (LEAN CONSTRUCTION)
**Código:** `10000000-PRO-EST-001` | **Revisión:** 0 | **Compañía:** SALFA Montajes S.A.

---

### 1. OBJETIVO
Establecer el estándar operativo corporativo para la planificación táctica, el control de la producción y la gestión sistemática de restricciones en obras y proyectos mediante la metodología Last Planner System y la plataforma Oracle Primavera Cloud (OPC), asegurando la confiabilidad del flujo de trabajo y la adherencia al Programa Maestro.

### 2. ALCANCE
Aplica a todos los proyectos y contratos de montaje industrial, obras civiles, cañerías, electricidad e instrumentación ejecutados por SALFA Montajes S.A. El rol de Último Planificador (Last Planner) es asumido funcionalmente por los Jefes de Área de cada disciplina.

### 3. ROLES Y RESPONSABILIDADES
* **Administrador de Obra:** Lidera la gobernanza del sistema, preside las sesiones de Pull Planning Estratégico y las reuniones semanales de planificación trisemanal. Asigna los responsables directos y las fechas límite para la liberación de restricciones detectadas.
* **Jefe General de Terreno (JGT):** Discrimina las actividades ejecutables, prioriza los frentes de trabajo y valida la asignación de recursos en faena.
* **Jefe de Terreno (JT):** Identifica las restricciones en terreno y deriva su gestión inmediata. Supervisa el cumplimiento de las metas físicas diarias.
* **Jefe de Área (Last Planner):** Descompone las actividades del cronograma maestro en tareas operativas, conduce el Pull Planning Táctico, asigna los Supervisores ejecutores, gestiona las tareas colchón y lidera el análisis de causas de no cumplimiento (CNC).
* **Supervisor:** Revisa sus tareas asignadas en terreno, compromete su fecha y recursos, dirige las cuadrillas en faena, reporta el avance en la reunión diaria POD (Plan of the Day) y ejecuta el cierre o recompromiso de tareas.
* **Programador de Obra / Jefe de Programación:** Mantiene actualizado el Programa Maestro en Primavera P6 EPPM, ejecuta y programa la sincronización periódica hacia Oracle Primavera Cloud (OPC), consolida la apertura de tareas y calcula las estadísticas de desempeño semanal (PPC, PF, Adherencia).
* **Jefe de Oficina Técnica / Jefes de Departamento:** Participan en la identificación de restricciones de ingeniería, compras, calidad, seguridad y subcontratos, gestionando su oportuno levantamiento.
* **Parte Responsable de la Restricción:** Persona o entidad (interna, subcontratista o mandante) a quien se le asigna la responsabilidad de levantar el obstáculo, fijando una fecha prometida de entrega.

---

### 4. DESCRIPCIÓN DEL PROCESO OPERATIVO

#### 4.1. Habilitación e Integración de Plataformas (Sincronización P6 → OPC)
Semanalmente, al cumplirse la fecha de corte del proyecto (típicamente los viernes), el Programador de Obra actualiza el Programa Maestro en Primavera P6 Professional con los avances reales de obra y recursos. Al día siguiente, a primera hora, el sistema OPC ejecuta de forma automática y programada los flujos de integración que transfieren el cronograma actualizado desde P6 hacia el módulo de Schedule y Lean de Primavera Cloud. El Programador verifica que el estado de sincronización sea "finalizado".

#### 4.2. Apertura y Programación Táctica de Tareas (Último Planificador)
Con el cronograma maestro sincronizado, el Jefe de Área (Last Planner) junto al Jefe de Terreno y los Supervisores realizan el desglose de las actividades a 3 semanas en tareas ejecutables. Cada tarea debe cumplir con las siguientes reglas obligatorias:
1. Tener una duración máxima de 3 días y fecha de término definida.
2. Contar con un único Supervisor responsable asignado.
3. Describir la instrucción técnica precisa (indicando tag de equipo, spools, ejes o n° de unión).
4. La suma de horas hombre (HH) de las tareas no puede superar las HH asignadas a la actividad del programa.
5. Si una tarea no cuenta con actividad en el programa de P6 (trabajos adicionales o emergentes), se crea una actividad provisoria en OPC para no detener la gestión en faena.
El Jefe de Programación revisa la coherencia de la carga de recursos y valida el factor de potencial completo (Full Potential, PF ≤ 1).

#### 4.3. Sesiones de Pull Planning y Detección de Restricciones
* **Pull Planning Estratégico (Ventana a 3 Meses):** Presidido por el Administrador de Obra, se identifican los paquetes de trabajo de construcción (CWP) a liberar y se analizan las restricciones globales de ingeniería y suministros mayores.
* **Pull Planning Táctico (Ventana a 3 Semanas):** Realizado semanalmente por los Jefes de Área y Oficina Técnica. Se identifican los paquetes de trabajo de instalación (IWP), asegurando que las actividades de la semana 1 estén totalmente libres de restricciones y detectando tempranamente las restricciones de las semanas 2 y 3.
* Si en esta etapa se constata que una actividad requerida a 3 semanas no ha sido desglosada en tareas, el Programador genera la tarea de respaldo y le vincula obligatoriamente la restricción que justifica su postergación, monitoreando el reporte de adherencia.

#### 4.4. PROCESO RELACIONADO / HERMANO: Gestión y Liberación de Restricciones
Cualquier integrante de la obra que detecte una interferencia (falta de planos, materiales en tránsito, interferencias físicas, permisos o atraso del cliente) debe ingresar de inmediato la restricción al módulo de Restricciones en OPC:
1. **Registro:** Se define nombre, tipo, familia estandarizada, fecha necesaria y compañía responsable. Estado inicial: *No planificada*.
2. **Vinculación y Asignación en Paralelo:** 
   - El identificador vincula la restricción a todas las tareas de terreno que se verán bloqueadas por el obstáculo.
   - En paralelo, el Administrador de Obra asigna formalmente a la "Parte Responsable" de su solución y la fecha límite de resolución.
3. **Compromiso de Fecha Prometida:** La Parte Responsable analiza el caso y registra en OPC la "Fecha Prometida" de entrega (la cual debe ser anterior o igual a la fecha necesaria). Estado: *Planificada*.
4. **Liberación en Faena:** El responsable ejecuta las coordinaciones de compras, bodega, oficina técnica o terreno para levantar la restricción.
5. **Entrega y Validación:** Una vez resuelta, la Parte Responsable marca la restricción como *Entregada* en el sistema. El Jefe de Área y el Supervisor validan que el obstáculo físico o documental desapareció, liberando automáticamente las tareas asociadas para su ejecución.

#### 4.5. Programación Trisemanal y Compromiso Formal de Tareas
Los días jueves de cada semana, el Administrador de Obra preside la Reunión Trisemanal con el Jefe General de Terreno y los Jefes de Área:
1. Se revisan las restricciones levantadas por el proceso hermano de Restricciones.
2. Únicamente las tareas que se encuentren 100% libres de restricciones son seleccionadas para la semana actual.
3. El Jefe de Área asigna formalmente al Supervisor correspondiente (Estado: *Asignada - No comprometida*).
4. El Supervisor revisa el método constructivo y ejecuta la acción de "Comprometer" en OPC (Estado: *Comprometida*), asumiendo el compromiso formal de entrega en plazo y horas hombre.

#### 4.6. Ejecución en Terreno y Control Diario (Plan of the Day - POD)
Durante la jornada, las cuadrillas ejecutan las tareas comprometidas. Al término de cada día de trabajo, se realiza en faena la reunión POD liderada por el Jefe de Área y los Supervisores:
1. Se evalúa el cumplimiento de cada tarea del día.
2. Si la tarea se completó a satisfacción: el Supervisor ingresa a OPC, carga la cantidad ejecutada, las HH ganadas y marca la casilla *Finalizar* (Estado: *Finalizada*).
3. Si la tarea NO se terminó en el plazo: se analiza si está vencida. El Jefe de Área aplica la técnica de los "5 Por Qué", selecciona el código corporativo de Causa de No Cumplimiento (CNC) y establece una nueva fecha de recompromiso (Estado: *Recomprometida*).
4. Ante desvíos críticos o bloqueos imprevistos, se activan inmediatamente "tareas colchón" (actividades de reserva previamente planificadas) para reubicar al personal y evitar tiempos muertos.

#### 4.7. Análisis de Cumplimiento Semanal, KPI y Cierre de Ciclo
Al corte del día viernes:
1. Los Jefes de Área y Terreno analizan las tareas ejecutadas versus las comprometidas y consolidan el árbol de pérdidas por CNC.
2. El Jefe de Programación calcula el Porcentaje de Plan Cumplido (PPC = Tareas Finalizadas / Tareas Comprometidas) y el Factor de Potencial (PF).
3. La plataforma Power BI extrae automáticamente los datos desde OPC y publica los paneles de control gerenciales (KPI Trisemanal, Adherencia y Curvas de Horas Hombre).
4. El Programador de Obra vuelca los avances físicos logrados hacia el cronograma Primavera P6 EPPM, cerrando el ciclo semanal e iniciando el nuevo ciclo de actualización.

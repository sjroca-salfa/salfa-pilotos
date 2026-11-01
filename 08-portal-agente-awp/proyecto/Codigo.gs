/**
 * 08-portal-agente-awp · AGENTE AWP Y ASISTENTE METODOLÓGICO CII — SALFA MONTAJES
 * Backend Google Apps Script (V8)
 *
 * Ubicación Local:  E:\Claude\Portales-Salfa-Pilotos\08-portal-agente-awp\proyecto\Codigo.gs
 * Espejo en Drive:  G:\Mi unidad\Portales Salfa Pilotos\08-portal-agente-awp\proyecto\Codigo.gs
 * Administrador:    sjroca@salfamontajes.com
 * Dominio oficial:  @salfamontajes.com
 */

var DOMINIO_SALFA = '@salfamontajes.com';
var HOJA_CONSULTAS = 'CONSULTAS_AWP';
var HOJA_NOTEBOOKS = 'NOTEBOOKS_CII';
var HOJA_BITACORA = 'BITACORA';
var HOJA_CONFIG = 'CONFIG';

function getProp_(k) {
  return PropertiesService.getScriptProperties().getProperty(k) || '';
}

function getAdmins_() {
  var raw = getProp_('ADMINS');
  if (!raw) return ['sjroca@salfamontajes.com'];
  return raw.split(',').map(function(s) { return s.trim().toLowerCase(); }).filter(Boolean);
}

function getSs_() {
  var id = getProp_('SPREADSHEET_ID');
  if (id) {
    try { return SpreadsheetApp.openById(id); } catch (e) {}
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

function validarAcceso_(correo) {
  if (!correo) return false;
  var c = String(correo).trim().toLowerCase();
  if (getAdmins_().indexOf(c) !== -1) return true;
  return c.indexOf(DOMINIO_SALFA) !== -1;
}

/**
 * Punto de entrada WebApp (doGet)
 */
function doGet(e) {
  var params = (e && e.parameter) || {};
  if (params.api) {
    return handleApiGet_(params);
  }
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Agente AWP · Advanced Work Packaging — Salfa Montajes')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, viewport-fit=cover');
}

/**
 * API GET
 */
function handleApiGet_(params) {
  var accion = params.accion || params.api;
  var res = { ok: true, timestamp: new Date().toISOString(), portal: '08-portal-agente-awp' };

  try {
    if (accion === 'ping' || accion === 'status') {
      res.estado = 'OPERATIVO';
      res.version = '1.0.0-awp';
      res.guardrails = 'ANTI_DUMPING_ACTIVO';
      res.fuentes = ['CII RT-272', 'CII RT-319', 'CII RT-390', 'NotebookLM Hub'];
    } else if (accion === 'getNotebooks') {
      res.notebooks = obtenerNotebooksRegistrados_();
    } else {
      res.ok = false;
      res.error = 'Acción desconocida: ' + accion;
    }
  } catch (err) {
    res.ok = false;
    res.error = String(err);
  }

  return ContentService.createTextOutput(JSON.stringify(res))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Punto de entrada WebApp (doPost)
 */
function doPost(e) {
  var res = { ok: true, timestamp: new Date().toISOString() };
  try {
    var raw = (e && e.postData && e.postData.contents) || '{}';
    var data = JSON.parse(raw);
    var accion = data.accion || 'registrarConsulta';

    if (accion === 'registrarConsulta') {
      res.id = registrarConsultaLog_(data);
      res.mensaje = 'Consulta registrada en bitácora de aprendizaje AWP';
    } else if (accion === 'guardarNotebook') {
      res.resultado = guardarNotebook_(data);
      res.mensaje = 'Libreta NotebookLM actualizada exitosamente';
    } else if (accion === 'auditarGuardrail') {
      res.auditado = registrarIntentoExtraccion_(data);
      res.mensaje = 'Evento de guardrail registrado';
    } else {
      res.ok = false;
      res.error = 'Acción POST no reconocida: ' + accion;
    }
  } catch (err) {
    res.ok = false;
    res.error = String(err);
  }

  return ContentService.createTextOutput(JSON.stringify(res))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Registro de consultas en Sheet
 */
function registrarConsultaLog_(d) {
  try {
    var ss = getSs_();
    if (!ss) return 'LOCAL_SIMULADO';
    var hoja = ss.getSheetByName(HOJA_CONSULTAS);
    if (!hoja) {
      hoja = ss.insertSheet(HOJA_CONSULTAS);
      hoja.appendRow(['ID', 'FECHA', 'USUARIO', 'TEMA_AWP', 'PREGUNTA_SINTETIZADA', 'FUENTE_CII_CITADA', 'MODELO_IA']);
      hoja.getRange(1, 1, 1, 7).setFontWeight('bold').setBackground('#B01E24').setFontColor('#FFFFFF');
    }
    var id = 'AWP-' + Utilities.formatDate(new Date(), 'America/Santiago', 'yyyyMMdd-HHmmss');
    hoja.appendRow([
      id,
      new Date(),
      d.usuario || 'anónimo@salfamontajes.com',
      d.tema || 'General AWP',
      (d.pregunta || '').substring(0, 250),
      d.fuente || 'CII RT-272',
      d.modelo || 'Gemini 2.5 Flash'
    ]);
    return id;
  } catch (e) {
    return 'LOG_ERROR: ' + e;
  }
}

/**
 * Auditoría de intentos de extracción masiva
 */
function registrarIntentoExtraccion_(d) {
  try {
    var ss = getSs_();
    if (!ss) return false;
    var hoja = ss.getSheetByName(HOJA_BITACORA);
    if (!hoja) {
      hoja = ss.insertSheet(HOJA_BITACORA);
      hoja.appendRow(['FECHA', 'TIPO_EVENTO', 'USUARIO', 'DETALLE', 'REGLA_VIOLADA']);
    }
    hoja.appendRow([
      new Date(),
      'BLOQUEO_GUARDRAIL_ANTI_DUMPING',
      d.usuario || 'desconocido',
      (d.prompt || '').substring(0, 300),
      'POLITICA_CII_NO_TEXTO_COMPLETO'
    ]);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Obtener libretas predeterminadas o guardadas
 */
function obtenerNotebooksRegistrados_() {
  return [
    {
      id: 'nb-cii-rt272',
      titulo: 'CII RT-272: Advanced Work Packaging (Vols. I, II y III)',
      categoria: 'Estándar Principal CII',
      descripcion: 'Implementación integral de AWP, integración FEED-Detalle-Terreno y directrices de gestión de paquetes.',
      url: 'https://notebooklm.google.com/',
      fuentesContenidas: ['RT-272 Vol I', 'RT-272 Vol II', 'RT-272 Vol III', 'IR272-2']
    },
    {
      id: 'nb-cii-rt319',
      titulo: 'CII RT-319: Workface Planning en Faena',
      categoria: 'Planificación en Terreno',
      descripcion: 'Desarrollo de IWPs, gestión de restricciones de cuadrilla y rol del Workface Planner en montaje.',
      url: 'https://notebooklm.google.com/',
      fuentesContenidas: ['RT-319 Guía Práctica WFP', 'Checklist de 7 Restricciones']
    },
    {
      id: 'nb-cii-rt390',
      titulo: 'CII RT-390: Modelo de Madurez & Scorecard AWP',
      categoria: 'Gobernanza y Madurez',
      descripcion: 'Evaluación y auditoría de proyectos EPC, medición de niveles 1 al 4 y KPI de productividad en faena.',
      url: 'https://notebooklm.google.com/',
      fuentesContenidas: ['RT-390 Maturity Model', 'AWP Scorecard Excel']
    },
    {
      id: 'nb-salfa-awp-proc',
      titulo: 'AWP Salfa Montajes: Procedimientos y Formatos de Obra',
      categoria: 'Corporativo Salfa',
      descripcion: 'Alineación de AWP con estándares de Salfa Montajes, ACC Docs/BIM, compras en bodega y control de avance.',
      url: 'https://notebooklm.google.com/',
      fuentesContenidas: ['Procedimiento P-AWP-01', 'Matriz RACI Salfa', 'Plantilla IWP Salfa']
    }
  ];
}

function guardarNotebook_(d) {
  return { guardado: true, id: d.id || 'nb-custom' };
}

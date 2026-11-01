/**
 * 09-portal-salfagi-modeler · ARQUITECTURA DE PROCESOS BPMN 2.0 (AS-IS) — SALFA MONTAJES
 * Backend Google Apps Script (V8)
 *
 * Ubicación Local:  E:\Claude\Portales-Salfa-Pilotos\09-portal-salfagi-modeler\proyecto\Codigo.gs
 * Espejo en Drive:  G:\Mi unidad\Portales Salfa Pilotos\09-portal-salfagi-modeler\proyecto\Codigo.gs
 * Administrador:    sjroca@salfamontajes.com
 * Dominio oficial:  @salfamontajes.com
 */

var DOMINIO_SALFA = '@salfamontajes.com';
var HOJA_REGISTROS = 'REGISTROS';
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
    .setTitle('Salfagi Modeler · Arquitectura BPMN 2.0 — Salfa Montajes')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, viewport-fit=cover')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * API GET
 */
function handleApiGet_(params) {
  var accion = params.accion || 'ping';
  var salida = { ok: true, accion: accion, timestamp: new Date().toISOString() };

  if (accion === 'ping') {
    salida.mensaje = 'Servicio Salfagi Modeler Apps Script V8 operativo';
    salida.portal = '09-portal-salfagi-modeler';
    salida.procedimiento = '10000000-PRO-EST-001 (Rev. 0)';
  } else if (accion === 'metadata') {
    salida.diagrama = '10000000-SAL-00000-DOC-DIA-00001';
    salida.estandar = 'BPMN 2.0 (ISO/IEC 19510)';
    salida.compatibilidad = 'Bizagi Modeler v4.0+';
    salida.procesos = ['PROC-01: Planificación Táctica Lean', 'PROC-02: Gestión de Restricciones'];
  } else {
    salida.ok = false;
    salida.error = 'Acción no reconocida';
  }

  return ContentService.createTextOutput(JSON.stringify(salida))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Punto de entrada POST (doPost)
 */
function doPost(e) {
  try {
    var raw = (e && e.postData && e.postData.contents) || '{}';
    var payload = JSON.parse(raw);
    var accion = payload.accion || 'registrar_bitacora';

    var ss = getSs_();
    if (!ss) {
      return jsonResp_({ ok: false, error: 'No hay hoja de cálculo vinculada' });
    }

    if (accion === 'registrar_bitacora') {
      var hoja = ss.getSheetByName(HOJA_BITACORA) || ss.insertSheet(HOJA_BITACORA);
      if (hoja.getLastRow() === 0) {
        hoja.appendRow(['FECHA_ISO', 'USUARIO', 'ACCION', 'ELEMENTO_ID', 'DETALLES']);
      }
      hoja.appendRow([
        new Date().toISOString(),
        payload.usuario || 'anónimo',
        payload.subaccion || 'descarga',
        payload.elementoId || '',
        JSON.stringify(payload.detalles || {})
      ]);
      return jsonResp_({ ok: true, mensaje: 'Bitácora registrada exitosamente' });
    }

    return jsonResp_({ ok: false, error: 'Acción POST no reconocida' });
  } catch (err) {
    return jsonResp_({ ok: false, error: String(err) });
  }
}

function jsonResp_(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * PORTAL 07 · SALFA CONSTRUCTION CLOUD (RÉPLICA FUNCIONAL AUTODESK CONSTRUCTION CLOUD - ACC)
 * Backend Google Apps Script (V8)
 *
 * Ubicación Local:  E:\Claude\Portales-Salfa-Pilotos\07-portal-autodesk-construction-cloud-acc\proyecto\Codigo.gs
 * Espejo en Drive:  G:\Mi unidad\Portales Salfa Pilotos\07-portal-autodesk-construction-cloud-acc\proyecto\Codigo.gs
 * Administrador:    sjroca@salfamontajes.com
 * Dominio oficial:  @salfamontajes.com
 */

var DOMINIO_SALFA = '@salfamontajes.com';
var HOJA_PROYECTOS = 'OBRAS_ACC';
var HOJA_DOCS = 'DOCS_CDE';
var HOJA_BUILD = 'BUILD_TERRENO';
var HOJA_COST = 'COST_WBS';
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
    .setTitle('Portal 07 · Salfa Construction Cloud (ACC) — Salfa Montajes')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1, viewport-fit=cover');
}

/**
 * Punto de entrada API REST/RPC (doPost) con LockService
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch (err) {
    return jsonResponse_({ ok: false, error: 'Servidor ocupado. Intenta nuevamente.' });
  }

  try {
    var payload = {};
    if (e && e.postData && e.postData.contents) {
      try { payload = JSON.parse(e.postData.contents); } catch (ex) { payload = {}; }
    }

    var accion = payload.accion || '';
    var usuario = payload.usuario || 'sjroca@salfamontajes.com';

    if (!validarAcceso_(usuario)) {
      return jsonResponse_({ ok: false, error: 'Acceso restringido a cuentas corporativas @salfamontajes.com' });
    }

    var res = { ok: true };
    switch (accion) {
      case 'inicializar':
        res.data = inicializarLibro_();
        break;
      case 'listarRegistros':
        res.data = listarTodosRegistros_(payload.obra || '');
        break;
      case 'guardarRegistro':
        res.data = guardarRegistroAcc_(payload.registro || {}, usuario);
        break;
      case 'aprobarPlanoAPC':
        res.data = cambiarEstadoAcc_(HOJA_DOCS, payload.id, 'APC (Aprobado Construcción)', usuario);
        break;
      case 'resolverFlujoBuild':
        res.data = cambiarEstadoAcc_(HOJA_BUILD, payload.id, 'Respondido / Aprobado', usuario);
        break;
      case 'eliminarRegistro':
        res.data = eliminarRegistroAcc_(payload.categoria || 'DOCS', payload.id, usuario);
        break;
      default:
        res = { ok: false, error: 'Acción no reconocida: ' + accion };
    }
    return jsonResponse_(res);
  } catch (error) {
    return jsonResponse_({ ok: false, error: String(error && error.message ? error.message : error) });
  } finally {
    lock.releaseLock();
  }
}

function handleApiGet_(params) {
  if (params.api === 'ping') {
    return jsonResponse_({
      ok: true,
      portal: '07-portal-autodesk-construction-cloud-acc',
      status: 'online',
      timestamp: new Date().toISOString()
    });
  }
  if (params.api === 'listar') {
    return jsonResponse_({ ok: true, data: listarTodosRegistros_(params.obra || '') });
  }
  return jsonResponse_({ ok: false, error: 'Parámetro API no soportado' });
}

function hojaPorCategoria_(cat) {
  var c = String(cat || '').toUpperCase();
  if (c === 'PROYECTO') return HOJA_PROYECTOS;
  if (c === 'BUILD') return HOJA_BUILD;
  if (c === 'COST') return HOJA_COST;
  return HOJA_DOCS;
}

/**
 * Inicializa las 6 pestañas relacionales del entorno ACC en Google Sheets
 */
function inicializarLibro_() {
  var ss = getSs_();
  var cols = [
    'ID', 'CATEGORIA', 'OBRA', 'CODIGO', 'TITULO', 'SUBTIPO',
    'DETALLE', 'RESPONSABLE', 'ESTADO', 'PRIORIDAD', 'MONTO_MM', 'FECHA_ACTUALIZACION'
  ];
  asegurarHoja_(ss, HOJA_PROYECTOS, cols);
  asegurarHoja_(ss, HOJA_DOCS, cols);
  asegurarHoja_(ss, HOJA_BUILD, cols);
  asegurarHoja_(ss, HOJA_COST, cols);
  asegurarHoja_(ss, HOJA_BITACORA, [
    'FECHA_ISO', 'USUARIO', 'MODULO_ACC', 'ACCION', 'REGISTRO_ID', 'DETALLE'
  ]);
  asegurarHoja_(ss, HOJA_CONFIG, [
    'CLAVE', 'VALOR', 'DESCRIPCION'
  ]);
  return { inicializado: true, hojas: [HOJA_PROYECTOS, HOJA_DOCS, HOJA_BUILD, HOJA_COST, HOJA_BITACORA, HOJA_CONFIG] };
}

function asegurarHoja_(ss, nombre, encabezados) {
  var sh = ss.getSheetByName(nombre);
  if (!sh) {
    sh = ss.insertSheet(nombre);
    sh.appendRow(encabezados);
    sh.getRange(1, 1, 1, encabezados.length)
      .setBackground('#1E2229')
      .setFontColor('#FFFFFF')
      .setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}

function listarHoja_(ss, nombreHoja, filtroObra) {
  var sh = ss.getSheetByName(nombreHoja);
  if (!sh || sh.getLastRow() < 2) return [];
  var values = sh.getDataRange().getValues();
  var headers = values[0];
  var out = [];
  for (var i = 1; i < values.length; i++) {
    var row = values[i];
    if (!row[0]) continue;
    var item = {};
    for (var j = 0; j < headers.length; j++) {
      item[headers[j].toLowerCase()] = row[j];
    }
    if (!filtroObra || String(item.obra) === String(filtroObra)) {
      out.push(item);
    }
  }
  return out;
}

function listarTodosRegistros_(filtroObra) {
  var ss = getSs_();
  return []
    .concat(listarHoja_(ss, HOJA_PROYECTOS, filtroObra))
    .concat(listarHoja_(ss, HOJA_DOCS, filtroObra))
    .concat(listarHoja_(ss, HOJA_BUILD, filtroObra))
    .concat(listarHoja_(ss, HOJA_COST, filtroObra));
}

function guardarRegistroAcc_(reg, usuario) {
  inicializarLibro_();
  var ss = getSs_();
  var cat = reg.categoria || 'DOCS';
  var nombreHoja = hojaPorCategoria_(cat);
  var sh = ss.getSheetByName(nombreHoja);
  var ahora = new Date().toISOString();
  var id = reg.id || ('ACC-' + Utilities.getUuid().slice(0, 8).toUpperCase());

  var filaNueva = [
    id,
    cat,
    reg.obra || 'OB-2401',
    reg.codigo || id,
    reg.titulo || '',
    reg.subtipo || 'General',
    reg.detalle || '',
    reg.responsable || usuario,
    reg.estado || 'En Ejecución',
    reg.prioridad || 'Alta',
    Number(reg.monto || 0),
    ahora
  ];

  var data = sh.getDataRange().getValues();
  var encontrado = -1;
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(id)) {
      encontrado = i + 1;
      break;
    }
  }

  if (encontrado !== -1) {
    sh.getRange(encontrado, 1, 1, filaNueva.length).setValues([filaNueva]);
    registrarBitacora_(usuario, nombreHoja, 'ACTUALIZAR', id, reg.titulo);
  } else {
    sh.appendRow(filaNueva);
    registrarBitacora_(usuario, nombreHoja, 'CREAR', id, reg.titulo);
  }
  return { id: id, hoja: nombreHoja, actualizado: ahora };
}

function cambiarEstadoAcc_(nombreHoja, id, nuevoEstado, usuario) {
  var ss = getSs_();
  var sh = ss.getSheetByName(nombreHoja);
  if (!sh || !id) return { actualizado: false };
  var data = sh.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(id)) {
      sh.getRange(i + 1, 9).setValue(nuevoEstado);
      sh.getRange(i + 1, 12).setValue(new Date().toISOString());
      registrarBitacora_(usuario, nombreHoja, 'CAMBIO_ESTADO', id, nuevoEstado);
      return { actualizado: true, id: id, estado: nuevoEstado };
    }
  }
  return { actualizado: false, id: id };
}

function eliminarRegistroAcc_(categoria, id, usuario) {
  var ss = getSs_();
  var nombreHoja = hojaPorCategoria_(categoria);
  var sh = ss.getSheetByName(nombreHoja);
  if (!sh || !id) return { eliminado: false };
  var data = sh.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(id)) {
      sh.deleteRow(i + 1);
      registrarBitacora_(usuario, nombreHoja, 'ELIMINAR', id, 'Registro eliminado');
      return { eliminado: true, id: id };
    }
  }
  return { eliminado: false, id: id };
}

function registrarBitacora_(usuario, modulo, accion, idReg, detalle) {
  try {
    var ss = getSs_();
    var sh = ss.getSheetByName(HOJA_BITACORA);
    if (sh) {
      sh.appendRow([new Date().toISOString(), usuario, modulo, accion, idReg, detalle || '']);
    }
  } catch (e) {}
}

function jsonResponse_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

/*!
 * salfa-shell.js - Barra superior, guardia de sesion y presencia compartidas
 * Ecosistema Portales Salfa Pilotos - Salfa Montajes
 *
 * Un solo archivo reemplaza las barras superiores de todos los portales.
 * Cada portal lo carga con un fragmento minimo en <head>:
 *   window.SALFA_SHELL = { id: '01', key: 'mapa', titulo: 'MAPA DE PROCESOS' };
 */
(function () {
  'use strict';
  if (window.__SALFA_SHELL__) return;
  window.__SALFA_SHELL__ = true;

  var CFG = window.SALFA_SHELL || {};
  var HOST = location.hostname;
  var LOCAL = HOST === 'localhost' || HOST === '127.0.0.1' || location.protocol === 'file:';
  var PAGES = /\.github\.io$/.test(HOST);
  if (!LOCAL && !PAGES) return;

  /* ------------------------------------------------------------------ Registro de portales */
  var PROD = 'https://sjroca-salfa.github.io/';
  var API_URL = 'https://script.google.com/macros/s/AKfycbyOmwXlEljtQDHhJP-bnAwnao4Q8QtmmqSnKTF_5FaHW1xX_NiOf11Vhvv1csuh2zXz/exec';
  var PORTALES = [
    { id: '00', key: 'hub', nombre: 'Portal Hub Central', sub: 'Acceso corporativo y catalogo de pilotos', carpeta: '00-portal-hub', prod: PROD + 'salfa-pilotos/' },
    { id: '01', key: 'mapa', nombre: 'Mapa de Procesos', sub: 'Cadena de valor y procedimientos BPMN', carpeta: '01-portal-mapa-procesos', prod: PROD + 'portal-mapa-procesos/' },
    { id: '02', key: 'cv', nombre: 'Control de CV y Competencias', sub: 'Gestion de personal y certificaciones', carpeta: '02-portal-cv', prod: PROD + 'salfa-pilotos/02-portal-cv/' },
    { id: '04', key: 'okr', nombre: 'Indicadores OKR', sub: 'Objetivos y resultados clave', carpeta: '04-portal-indicadores-okr', prod: '', dev: true },
    { id: '05', key: 'info', nombre: 'Gestion de la Informacion', sub: 'Piramide documental, series y gobernanza', carpeta: '05-portal-gestion-informacion', prod: PROD + 'portal-gestion-informacion/' },
    { id: '06', key: 'flow', nombre: 'Salfa Flow - Work Management', sub: 'Tareas y flujos de trabajo de area', carpeta: '06-portal-salfa-flow', prod: PROD + 'salfa-pilotos/06-portal-salfa-flow/' },
    { id: '07', key: 'acc', nombre: 'Autodesk Construction Cloud (ACC)', sub: 'CDE ISO 19650, BIM 2D/3D y RFIs', carpeta: '07-portal-autodesk-construction-cloud-acc', prod: PROD + 'salfa-pilotos/07-portal-autodesk-construction-cloud-acc/' },
    { id: '08', key: 'awp-agente', nombre: 'Gestion AWP y Agente CII', sub: 'Tutor metodologico y NotebookLM', carpeta: '08-portal-agente-awp', prod: PROD + 'salfa-pilotos/08-portal-agente-awp/', tambien: ['03'] },
    { id: '09', key: 'salfagi', nombre: 'Salfagi Modeler BPMN', sub: 'Modelado BPMN 2.0 y simulacion', carpeta: '09-portal-salfagi-modeler', prod: PROD + 'salfa-pilotos/09-portal-salfagi-modeler/' }
  ];
  function urlDe(p) {
    if (LOCAL) return location.origin + '/' + p.carpeta + '/';
    return p.prod || '#';
  }
  var HUB = urlDe(PORTALES[0]);

  /* ------------------------------------------------------------------ Utilidades */
  var KEY = 'salfa_auth_session', KEY_ACT_LEGACY = 'salfa_last_activity', KEY_ACT = 'salfa_sf_actividad', KEY_VAL = 'salfa_sf_validado';
  var LIMITE_INACTIVIDAD = 15 * 60 * 1000, REVALIDAR_MS = 5 * 60 * 1000, PRESENCIA_MS = 60 * 1000;

  function esc(t) { return String(t == null ? '' : t).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function $(id) { return document.getElementById(id); }
  function leerAlmacen(k) { try { return localStorage.getItem(k) || sessionStorage.getItem(k); } catch (e) { return null; } }
  function guardarLocal(k, v) { try { localStorage.setItem(k, v); } catch (e) { } }
  function borrarSesion() { try { localStorage.removeItem(KEY); sessionStorage.removeItem(KEY); sessionStorage.removeItem(KEY_VAL); } catch (e) { } }

  function leerSesion() {
    var raw = leerAlmacen(KEY);
    if (!raw) return null;
    try {
      var s = JSON.parse(raw);
      var max = (s.recordar ? 30 * 24 : 8) * 3600 * 1000;
      if (!s.token || !s.email) return null;
      if (typeof s.time === 'number' && Date.now() - s.time > max) return null;
      return s;
    } catch (e) { return null; }
  }
  function esAdmin(s) { return s && (s.rol === 'Administrador' || s.rol === 'Administrador del Sistema'); }
  function idsPermitidos() { var p = PORTALES.filter(function (x) { return x.id === CFG.id; })[0]; return [CFG.id].concat((p && p.tambien) || []); }
  function autorizado(s) {
    if (!CFG.id) return true;
    if (esAdmin(s)) return true;
    var lista = (s.pilotos || []).map(String);
    return idsPermitidos().some(function (id) { return lista.indexOf(id) >= 0; });
  }
  function rolEn(s) {
    if (!s) return '';
    var r = s.rolesPorPortal || {};
    return (CFG.id && r[CFG.id]) || s.rol || 'Colaborador';
  }

  function api(accion, datos) {
    var s = leerSesion();
    var cuerpo = Object.assign({ action: accion, accion: accion, token: s ? s.token : '' }, datos || {});
    var ctl = ('AbortController' in window) ? new AbortController() : null;
    var t = setTimeout(function () { if (ctl) ctl.abort(); }, 20000);
    return fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(cuerpo), redirect: 'follow', signal: ctl ? ctl.signal : undefined, keepalive: accion === 'cerrar' })
      .then(function (r) { return r.json(); })
      .catch(function () { return { ok: false, red: true }; })
      .then(function (r) { clearTimeout(t); return r; });
  }

  /* ------------------------------------------------------------------ Ocultacion total de barras antiguas */
  var LEGACY_SELECTORS = [
    '#salfaUniversalTopbar', '#salfaTopBar', '#barraCorpTopP5', '#barraCorpTop',
    '.barra-corp-top', '.salfa-topbar', '.salfa-topbar-p5',
    'header.salfa-topbar', 'header.salfa-topbar-p5', 'header#salfaTopBar',
    'header#salfaUniversalTopbar', 'div#barraCorpTop', 'header#barraCorpTopP5',
    '#modalUniversalPortales', '#modalPortales', '.salfa-modal-portales'
  ];
  var estilo0 = document.createElement('style');
  estilo0.id = 'sfLegacyOculto';
  estilo0.textContent =
    LEGACY_SELECTORS.join(',') + '{display:none!important;visibility:hidden!important;height:0!important;min-height:0!important;max-height:0!important;padding:0!important;margin:0!important;border:none!important;overflow:hidden!important;pointer-events:none!important;opacity:0!important;}\n' +
    'html{--sf-h:48px;}\n' +
    'body{padding-top:var(--sf-h)!important;box-sizing:border-box!important;}';
  (document.head || document.documentElement).appendChild(estilo0);

  function ocultarBarrasViejas() {
    try {
      var viejos = document.querySelectorAll(LEGACY_SELECTORS.join(','));
      for (var i = 0; i < viejos.length; i++) {
        var el = viejos[i];
        if (el.id === 'sfBar' || (el.closest && el.closest('#sfBar'))) continue;
        el.style.setProperty('display', 'none', 'important');
        el.style.setProperty('visibility', 'hidden', 'important');
        el.style.setProperty('height', '0', 'important');
        el.setAttribute('hidden', 'true');
        el.setAttribute('aria-hidden', 'true');
      }
    } catch (e) { }
  }
  ocultarBarrasViejas();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ocultarBarrasViejas);
  }

  var SESION = leerSesion();

  function irAlHub(motivo) {
    var n = 0, t0 = 0;
    try { n = Number(sessionStorage.getItem('sf_redir_n') || 0); t0 = Number(sessionStorage.getItem('sf_redir_t') || 0); } catch (e) { }
    if (Date.now() - t0 > 20000) n = 0;
    if (n >= 3) { mostrarAviso('No se pudo validar tu sesion', 'Vuelve al Hub e inicia sesion de nuevo.', true); return; }
    try { sessionStorage.setItem('sf_redir_n', String(n + 1)); sessionStorage.setItem('sf_redir_t', String(Date.now())); } catch (e) { }
    location.replace(HUB);
  }

  function mostrarAviso(titulo, texto, conBoton) {
    var arranca = function () {
      var d = document.createElement('div');
      d.id = 'sfAviso';
      d.setAttribute('role', 'alertdialog');
      d.innerHTML = '<div class="sf-aviso-c"><h2>' + esc(titulo) + '</h2><p>' + esc(texto) + '</p>' +
        (conBoton ? '<a class="sf-aviso-b" href="' + esc(HUB) + '">Ir al Hub</a>' : '') + '</div>';
      document.documentElement.style.visibility = 'visible';
      (document.body || document.documentElement).appendChild(d);
    };
    inyectarCss();
    if (document.body) arranca(); else document.addEventListener('DOMContentLoaded', arranca);
  }

  if (!SESION) {
    document.documentElement.style.visibility = 'hidden';
    irAlHub('sin-sesion');
    return;
  }
  if (!autorizado(SESION)) {
    mostrarAviso('Sin autorizacion para este portal', 'Tu cuenta no tiene este portal habilitado. Solicitelo a un administrador desde el Hub.', true);
    return;
  }
  try { sessionStorage.removeItem('sf_redir_n'); } catch (e) { }

  function revalidar(forzar) {
    var ult = 0; try { ult = Number(sessionStorage.getItem(KEY_VAL) || 0); } catch (e) { }
    if (!forzar && Date.now() - ult < REVALIDAR_MS) return;
    api('validar').then(function (r) {
      if (r && r.red) return;
      try { sessionStorage.setItem(KEY_VAL, String(Date.now())); } catch (e) { }
      if (!r || !r.ok) { borrarSesion(); mostrarAviso('Tu sesion termino', (r && r.mensaje) || 'Ingresa de nuevo desde el Hub.', true); setTimeout(function () { irAlHub('revocada'); }, 1500); return; }
      var s = leerSesion(); if (!s) return;
      s.rol = r.rol; s.pilotos = r.pilotos || []; s.rolesPorPortal = r.rolesPorPortal || {}; s.nombre = r.nombre || s.nombre;
      var alm = s.recordar ? localStorage : sessionStorage;
      try { alm.setItem(KEY, JSON.stringify(s)); } catch (e) { }
      SESION = s;
      if (!autorizado(s)) mostrarAviso('Sin autorizacion para este portal', 'Tu acceso a este portal ya no esta vigente.', true);
    });
  }
  revalidar(true);
  setInterval(function () { revalidar(false); }, REVALIDAR_MS);

  /* ------------------------------------------------------------------ Estilos */
  function inyectarCss() {
    if ($('sfCss')) return;
    var st = document.createElement('style');
    st.id = 'sfCss';
    st.textContent = [
      ':root{--sf-h:48px;--sf-rojo:#B01E24;--sf-rojo-claro:#E23B42;--sf-grafito:#1E2229;--sf-grafito2:#3A414A;--sf-gris:#5A6771;--sf-linea:#D3D7DC;--sf-fondo:#EEF0F2;--sf-ok:#3ddc84;--sf-ambar:#F5B800}',
      '#sfBar,#sfBar *{box-sizing:border-box}',
      '#sfBar{position:fixed;top:0;left:0;right:0;height:var(--sf-h);min-height:var(--sf-h);max-height:var(--sf-h);z-index:10000;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:0 12px;background:var(--sf-grafito);border-bottom:2px solid var(--sf-rojo);color:#fff;font:600 12px/1 Barlow,Arial,sans-serif;-webkit-font-smoothing:antialiased;flex-wrap:nowrap;overflow:hidden}',
      '#sfBar::after{content:"";position:absolute;left:0;right:0;bottom:-2px;height:2px;background:linear-gradient(90deg,var(--sf-rojo) 0,var(--sf-rojo) 40%,#ff8a90 50%,var(--sf-rojo) 60%,var(--sf-rojo) 100%);background-size:240% 100%;animation:sfShimmer 7s linear infinite;pointer-events:none}',
      '@keyframes sfShimmer{0%{background-position:120% 0}100%{background-position:-120% 0}}',
      '@keyframes sfPop{0%,84%,100%{transform:scale(1);filter:none}90%{transform:scale(1.045);filter:drop-shadow(0 0 6px rgba(255,255,255,.8)) drop-shadow(0 0 12px rgba(176,30,36,.7)) brightness(1.2)}95%{transform:scale(.995)}}',
      '@media (prefers-reduced-motion:reduce){#sfBar::after,.sf-logo img{animation:none!important}}',
      '.sf-l,.sf-r{display:flex;align-items:center;gap:8px;min-width:0;flex-wrap:nowrap}',
      '.sf-l{flex:1 1 auto;overflow:hidden}.sf-r{flex:0 0 auto}',
      '.sf-sep{width:1px;height:14px;background:rgba(255,255,255,.22);flex:none}',
      '.sf-hub,.sf-btn,.sf-chip{display:inline-flex;align-items:center;gap:6px;height:30px;padding:0 10px;border:1px solid rgba(255,255,255,.18);background:rgba(255,255,255,.08);color:#fff;font:inherit;font-weight:700;border-radius:8px;cursor:pointer;text-decoration:none;white-space:nowrap;-webkit-tap-highlight-color:transparent;flex:none}',
      '.sf-hub:hover,.sf-btn:hover,.sf-chip:hover{background:rgba(255,255,255,.16)}',
      '.sf-hub:focus-visible,.sf-btn:focus-visible,.sf-chip:focus-visible,.sf-av:focus-visible,.sf-it:focus-visible{outline:2px solid #fff;outline-offset:2px}',
      '.sf-logo{display:inline-flex;align-items:center;flex:none}',
      '.sf-logo img{height:18px;width:auto;max-width:130px;display:block;transform-origin:left center;animation:sfPop 7s ease-in-out infinite}',
      '.sf-tit{font:800 12px/1 Montserrat,Arial,sans-serif;letter-spacing:.5px;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}',
      '.sf-ico{width:14px;height:14px;stroke:currentColor;fill:none;stroke-width:2.2;flex:none}',
      '.sf-dot{width:8px;height:8px;border-radius:50%;background:var(--sf-ok);box-shadow:0 0 0 2px rgba(61,220,132,.35);flex:none;display:inline-block}',
      '.sf-dot.am{background:var(--sf-ambar);box-shadow:0 0 0 2px rgba(245,184,0,.4)}.sf-dot.ro{background:var(--sf-rojo-claro);box-shadow:0 0 0 2px rgba(226,59,66,.4)}',
      '.sf-chip{cursor:default;font-variant-numeric:tabular-nums}.sf-chip[role=button]{cursor:pointer}',
      '.sf-wrap{position:relative;display:inline-flex;flex:none}',
      '.sf-av{width:30px;height:30px;border-radius:50%;border:0;background:linear-gradient(135deg,var(--sf-rojo),#5E0F13);color:#fff;font:800 11px Montserrat,Arial,sans-serif;cursor:pointer;display:grid;place-items:center;padding:0;flex:none}',
      '.sf-badge-rol{display:inline-flex;align-items:center;height:24px;padding:0 10px;border-radius:999px;background:var(--sf-rojo);color:#fff;font:700 11px/1 Montserrat,Arial,sans-serif;letter-spacing:.06em;text-transform:uppercase;white-space:nowrap;flex:none;cursor:pointer}',
      '.sf-email{font:500 12px/1 Barlow,Arial,sans-serif;color:rgba(255,255,255,.8);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:200px;flex:none;cursor:pointer}',
      '.sf-dd{position:absolute;top:calc(100% + 8px);right:0;width:320px;max-width:calc(100vw - 16px);background:var(--sf-grafito);border:1px solid rgba(255,255,255,.16);border-top:3px solid var(--sf-rojo);border-radius:12px;box-shadow:0 18px 40px rgba(0,0,0,.45);color:#fff;z-index:10020;overflow:hidden}',
      '.sf-dd[hidden]{display:none}',
      '.sf-dd h4{margin:0;padding:12px 14px 4px;font:800 12px Montserrat,Arial,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#fff}',
      '.sf-sub{padding:0 14px 8px;font-size:11px;color:#9AA2AB;font-weight:500}',
      '.sf-fila{display:flex;align-items:center;gap:10px;padding:8px 14px;font-weight:600;font-size:12.5px}',
      '.sf-fila small{display:block;color:#9AA2AB;font-weight:500;font-size:11px;margin-top:2px}',
      '.sf-fila .sf-n{margin-left:auto;color:#fff;font-weight:800}',
      '.sf-ini{display:inline-grid;place-items:center;width:22px;height:22px;border-radius:50%;background:var(--sf-grafito2);font:800 9.5px Montserrat,Arial,sans-serif;margin-left:-6px;border:2px solid var(--sf-grafito)}',
      '.sf-ini:first-child{margin-left:0}',
      '.sf-pie{padding:8px 14px;border-top:1px solid rgba(255,255,255,.1);font-size:11px;color:#9AA2AB;display:flex;align-items:center;gap:6px}',
      '.sf-menu{display:flex;flex-direction:column;padding:6px}',
      '.sf-it{display:flex;align-items:center;gap:10px;width:100%;padding:10px 12px;border:0;border-radius:8px;background:none;color:#fff;font:600 13px Barlow,Arial,sans-serif;text-align:left;cursor:pointer;text-decoration:none}',
      '.sf-it:hover{background:rgba(255,255,255,.1)}.sf-it.pel{color:#ff9a9f}',
      '.sf-perfil{padding:14px;border-bottom:1px solid rgba(255,255,255,.1)}.sf-perfil b{display:block;font-size:14px}.sf-perfil span{display:block;color:#9AA2AB;font-size:12px;margin-top:3px;word-break:break-all}',
      '.sf-rol{display:inline-block;margin-top:8px;padding:3px 8px;border-radius:99px;background:rgba(176,30,36,.35);border:1px solid rgba(226,59,66,.5);font:800 10px Montserrat,Arial,sans-serif;letter-spacing:.06em;text-transform:uppercase}',
      '#sfBack{position:fixed;inset:0;background:rgba(15,17,19,.62);z-index:10010;display:none;align-items:flex-start;justify-content:center;padding:64px 12px 12px;overflow:auto;-webkit-overflow-scrolling:touch}',
      '#sfBack.on{display:flex}',
      '.sf-dlg{width:100%;max-width:440px;background:#fff;color:var(--sf-grafito);border-radius:14px;border-top:4px solid var(--sf-rojo);box-shadow:0 30px 70px rgba(0,0,0,.5);overflow:hidden}',
      '.sf-dlg header{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:14px 16px;background:var(--sf-fondo)}',
      '.sf-dlg header b{display:block;font:800 14px Montserrat,Arial,sans-serif}.sf-dlg header span{font-size:12px;color:var(--sf-gris)}',
      '.sf-x{width:32px;height:32px;border:0;border-radius:8px;background:none;font-size:22px;line-height:1;cursor:pointer;color:var(--sf-grafito)}.sf-x:hover{background:var(--sf-linea)}',
      '.sf-lista{padding:8px;display:flex;flex-direction:column;gap:2px}',
      '.sf-p{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:10px;text-decoration:none;color:inherit}',
      'a.sf-p:hover{background:var(--sf-fondo)}.sf-p.off{opacity:.5;pointer-events:none}.sf-p.act{background:#FBEAEB}',
      '.sf-num{flex:none;width:32px;height:32px;border-radius:8px;background:var(--sf-grafito);color:#fff;display:grid;place-items:center;font:800 12px Montserrat,Arial,sans-serif}.sf-p.act .sf-num{background:var(--sf-rojo)}',
      '.sf-p b{display:block;font:700 13.5px Barlow,Arial,sans-serif}.sf-p small{display:block;color:var(--sf-gris);font-size:12px;margin-top:2px}',
      '.sf-tag{margin-left:auto;font:800 10px Montserrat,Arial,sans-serif;letter-spacing:.05em;text-transform:uppercase;padding:3px 8px;border-radius:99px;background:#E4F4EA;color:#146A38;white-space:nowrap}.sf-tag.no{background:var(--sf-fondo);color:var(--sf-gris)}',
      '#sfAviso{position:fixed;inset:0;z-index:10100;background:rgba(30,34,41,.94);display:grid;place-items:center;padding:20px}',
      '.sf-aviso-c{max-width:420px;background:#fff;color:var(--sf-grafito);border-top:5px solid var(--sf-rojo);padding:26px;border-radius:12px;text-align:center}',
      '.sf-aviso-c h2{margin:0 0 8px;font:800 18px Montserrat,Arial,sans-serif}.sf-aviso-c p{margin:0 0 16px;font-size:14px;color:var(--sf-gris)}',
      '.sf-aviso-b{display:inline-block;padding:11px 20px;background:var(--sf-rojo);color:#fff;font-weight:800;text-decoration:none;border-radius:8px}',
      /* Adaptacion Responsiva: Sin solapamientos en pantallas 320-430px */
      '@media (max-width:1080px){.sf-email{display:none!important}}',
      '@media (max-width:860px){.sf-badge-rol{display:none!important}}',
      '@media (max-width:680px){' +
        '.sf-tit{display:none!important}' +
        '.sf-sep.sf-s2{display:none!important}' +
        '.sf-hub span,.sf-btn span,.sf-chip .sf-txt{display:none!important}' +
        '.sf-hub,.sf-btn{padding:0 8px;min-width:32px;justify-content:center}' +
        '#sfBar{padding:0 8px;gap:6px}' +
        '.sf-l,.sf-r{gap:5px}' +
        '.sf-logo img{height:16px;max-width:110px}' +
        '.sf-wrap{position:static}' +
        '.sf-dd{position:fixed;top:calc(var(--sf-h) + 8px);left:8px;right:8px;width:auto;max-width:none}' +
      '}',
      '@media (max-width:390px){' +
        '.sf-logo img{height:14px;max-width:92px}' +
        '.sf-chip{padding:0 6px;gap:4px;font-size:11px}' +
        '.sf-av{width:26px;height:26px;font-size:10px}' +
        '#sfBar{padding:0 6px;gap:4px}' +
        '.sf-l,.sf-r{gap:4px}' +
      '}'
    ].join('\n');
    (document.head || document.documentElement).appendChild(st);
  }
  inyectarCss();

  /* ------------------------------------------------------------------ Construccion de la barra */
  var ICO = {
    atras: '<svg class="sf-ico" viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>',
    grid: '<svg class="sf-ico" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
    flecha: '<svg class="sf-ico" viewBox="0 0 24 24" style="width:11px;height:11px"><path d="M6 9l6 6 6-6"/></svg>',
    salir: '<svg class="sf-ico" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>'
  };
  var PRES = { total: 1, portales: {}, error: false };
  var logoSrc = '';

  function iniciales(s) {
    var n = (s.nombre || s.email || '').split('@')[0].replace(/[^A-Za-z0-9 ]/g, ' ').trim().split(/\s+/);
    return ((n[0] || '?')[0] + ((n[1] || '')[0] || (n[0] || '')[1] || '')).toUpperCase();
  }
  function tituloDelPortal() {
    var raw = CFG.titulo || document.title || 'Portal Salfa';
    return String(raw)
      .replace(/^(?:portal\s*)?\d+\s*[-•–—.:|]\s*/i, '')
      .replace(/\s*[-•–—.:|]\s*salfa.*$/i, '')
      .trim()
      .toUpperCase();
  }

  function construir() {
    ocultarBarrasViejas();
    var viejo = document.querySelector('#salfaUniversalTopbar img, #salfaTopBar img, #barraCorpTopP5 img, #barraCorpTop img, .barra-corp-top img, .salfa-topbar img');
    logoSrc = (viejo && /^data:image\/svg/.test(viejo.getAttribute('src') || '')) ? viejo.getAttribute('src')
      : (LOCAL ? location.origin + '/00-portal-hub/assets/logo-salfa-montajes-oscuro.svg' : PROD + 'salfa-pilotos/assets/logo-salfa-montajes-oscuro.svg');

    var h = document.createElement('header');
    h.id = 'sfBar'; h.setAttribute('role', 'banner');
    h.innerHTML =
      '<div class="sf-l">' +
        '<a class="sf-hub" id="sfHub" href="' + esc(HUB) + '" title="Volver al Hub Principal" aria-label="Volver al Hub">' + ICO.atras + '<span>Hub</span></a>' +
        '<i class="sf-sep"></i>' +
        '<a class="sf-logo" href="' + esc(HUB) + '" title="Inicio Hub Salfa"><img src="' + esc(logoSrc) + '" alt="Salfa Montajes"></a>' +
        '<i class="sf-sep sf-s2"></i>' +
        '<span class="sf-tit" id="sfTit">' + esc(tituloDelPortal()) + '</span>' +
      '</div>' +
      '<div class="sf-r">' +
        '<span id="sfExtras" style="display:contents"></span>' +
        '<button type="button" class="sf-btn" id="sfBtnPortales" aria-haspopup="dialog" title="Navegar a otros portales">' + ICO.grid + '<span>Portales</span></button>' +
        '<span class="sf-chip" id="sfSesion" title="Tiempo antes de cerrar la sesion por inactividad"><i class="sf-dot" id="sfDot"></i><b id="sfTiempo">15:00</b></span>' +
        '<div class="sf-wrap">' +
          '<button type="button" class="sf-chip" id="sfBtnPres" aria-haspopup="true" aria-expanded="false" title="Colaboradores conectados"><i class="sf-dot"></i><b id="sfN">1</b><span class="sf-txt"> en este portal</span>' + ICO.flecha + '</button>' +
          '<div class="sf-dd" id="sfDdPres" hidden role="region" aria-label="Colaboradores en linea"></div>' +
        '</div>' +
        '<div class="sf-wrap">' +
          '<button type="button" class="sf-av" id="sfBtnUser" aria-haspopup="true" aria-expanded="false" title="Mi cuenta">' + esc(iniciales(SESION)) + '</button>' +
          '<div class="sf-dd" id="sfDdUser" hidden role="menu" aria-label="Mi cuenta"></div>' +
        '</div>' +
        '<span class="sf-badge-rol" id="sfBadgeRol" title="Rol asignado: ' + esc(rolEn(SESION)) + '">' + esc(rolEn(SESION)) + '</span>' +
        '<span class="sf-email" id="sfEmail" title="' + esc(SESION.email) + '">' + esc(SESION.email) + '</span>' +
      '</div>';
    document.body.insertBefore(h, document.body.firstChild);

    var extras = $('sfExtras');
    Array.prototype.slice.call(document.querySelectorAll('[data-sf-extra]')).forEach(function (el) { extras.appendChild(el); });

    var back = document.createElement('div');
    back.id = 'sfBack';
    back.innerHTML = '<div class="sf-dlg" role="dialog" aria-modal="true" aria-labelledby="sfDlgT"><header><div><b id="sfDlgT">Ecosistema de Portales Salfa Pilotos</b><span>Salfa Montajes / SalfaCorp</span></div><button type="button" class="sf-x" id="sfCerrarDlg" aria-label="Cerrar">&times;</button></header><div class="sf-lista" id="sfLista"></div></div>';
    document.body.appendChild(back);

    pintarUsuario(); pintarLista(); pintarPresencia();
    enlazar();
    ocultarBarrasViejas();
  }

  function pintarUsuario() {
    var s = SESION, dd = $('sfDdUser'); if (!dd) return;
    dd.innerHTML =
      '<div class="sf-perfil"><b>' + esc(s.nombre || s.email.split('@')[0]) + '</b><span>' + esc(s.email) + '</span><em class="sf-rol">' + esc(rolEn(s)) + '</em></div>' +
      '<div class="sf-menu">' +
        '<a class="sf-it" role="menuitem" href="' + esc(HUB) + '">' + ICO.atras + 'Volver al Hub</a>' +
        '<button type="button" class="sf-it pel" role="menuitem" id="sfSalir">' + ICO.salir + 'Cerrar sesion</button>' +
      '</div>';
    var b = $('sfSalir'); if (b) b.addEventListener('click', function () { cerrarSesion(false); });
  }

  function pintarLista() {
    var cont = $('sfLista'); if (!cont) return;
    var s = SESION;
    cont.innerHTML = PORTALES.map(function (p) {
      var actual = p.id === CFG.id;
      var permitido = p.id === '00' || esAdmin(s) || (s.pilotos || []).map(String).some(function (x) { return x === p.id || (p.tambien || []).indexOf(x) >= 0; });
      var url = urlDe(p);
      var enlaza = !p.dev && permitido && url !== '#';
      var tag = p.dev ? '<span class="sf-tag no">En desarrollo</span>' : (!permitido ? '<span class="sf-tag no">Sin acceso</span>' : (actual ? '<span class="sf-tag">Aqui</span>' : '<span class="sf-tag">Activo</span>'));
      return (enlaza ? '<a class="sf-p' + (actual ? ' act' : '') + '" href="' + esc(url) + '">' : '<div class="sf-p off">') +
        '<span class="sf-num">' + esc(p.id) + '</span><div><b>' + esc(p.nombre) + '</b><small>' + esc(p.sub) + '</small></div>' + tag +
        (enlaza ? '</a>' : '</div>');
    }).join('');
  }

  function pintarPresencia() {
    var dd = $('sfDdPres'), n = $('sfN'); if (!dd) return;
    var total = Math.max(1, PRES.total || 1);
    var aqui = (PRES.portales[CFG.key || 'hub'] || { n: 1, ini: [] });
    if (n) n.textContent = String(Math.max(1, aqui.n || 1));
    var otros = PORTALES.filter(function (p) { return p.key !== (CFG.key || 'hub') && PRES.portales[p.key] && PRES.portales[p.key].n > 0; });
    var chips = function (arr) { return (arr || []).map(function (i) { return '<span class="sf-ini">' + esc(i) + '</span>'; }).join(''); };
    dd.innerHTML =
      '<h4>Colaboradores en linea</h4><div class="sf-sub">' + total + (total === 1 ? ' persona conectada' : ' personas conectadas') + ' en el ecosistema</div>' +
      '<div class="sf-fila"><span>' + chips(aqui.ini.length ? aqui.ini : [iniciales(SESION)]) + '</span><div>Este portal<small>' + esc(tituloDelPortal()) + '</small></div><span class="sf-n">' + Math.max(1, aqui.n || 1) + '</span></div>' +
      otros.map(function (p) { var x = PRES.portales[p.key]; return '<div class="sf-fila"><span>' + chips(x.ini) + '</span><div>' + esc(p.nombre) + '</div><span class="sf-n">' + x.n + '</span></div>'; }).join('') +
      '<div class="sf-pie"><i class="sf-dot' + (PRES.error ? ' am' : '') + '" style="width:6px;height:6px"></i>' + (PRES.error ? 'Sin conexion con el servicio. Reintentando.' : 'Se actualiza cada minuto. Por privacidad solo se muestran iniciales.') + '</div>';
  }

  /* ------------------------------------------------------------------ Interaccion */
  var panelAbierto = null;
  function cerrarPaneles() {
    ['sfDdPres', 'sfDdUser'].forEach(function (id) { var e = $(id); if (e) e.hidden = true; });
    ['sfBtnPres', 'sfBtnUser'].forEach(function (id) { var e = $(id); if (e) e.setAttribute('aria-expanded', 'false'); });
    panelAbierto = null;
  }
  function alternar(idPanel, idBtn) {
    var abrir = panelAbierto !== idPanel;
    cerrarPaneles(); cerrarDialogo();
    if (abrir) { $(idPanel).hidden = false; $(idBtn).setAttribute('aria-expanded', 'true'); panelAbierto = idPanel; }
  }
  var focoPrevio = null;
  function abrirDialogo() {
    cerrarPaneles(); focoPrevio = document.activeElement;
    $('sfBack').classList.add('on');
    var x = $('sfCerrarDlg'); if (x) x.focus();
  }
  function cerrarDialogo() {
    var b = $('sfBack'); if (!b || !b.classList.contains('on')) return;
    b.classList.remove('on');
    if (focoPrevio && focoPrevio.focus) { try { focoPrevio.focus(); } catch (e) { } }
  }
  function enlazar() {
    $('sfBtnPortales').addEventListener('click', function (e) { e.stopPropagation(); abrirDialogo(); });
    $('sfCerrarDlg').addEventListener('click', cerrarDialogo);
    $('sfBack').addEventListener('click', function (e) { if (e.target === this) cerrarDialogo(); });
    $('sfBtnPres').addEventListener('click', function (e) { e.stopPropagation(); alternar('sfDdPres', 'sfBtnPres'); });
    $('sfBtnUser').addEventListener('click', function (e) { e.stopPropagation(); alternar('sfDdUser', 'sfBtnUser'); });
    if ($('sfBadgeRol')) $('sfBadgeRol').addEventListener('click', function (e) { e.stopPropagation(); alternar('sfDdUser', 'sfBtnUser'); });
    if ($('sfEmail')) $('sfEmail').addEventListener('click', function (e) { e.stopPropagation(); alternar('sfDdUser', 'sfBtnUser'); });
    document.addEventListener('click', function (e) { if (panelAbierto && !e.target.closest('.sf-wrap') && !e.target.closest('#sfBadgeRol') && !e.target.closest('#sfEmail')) cerrarPaneles(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { cerrarPaneles(); cerrarDialogo(); } });
  }

  /* ------------------------------------------------------------------ Inactividad (15 min) */
  var ultimaAct = Number(leerAlmacen(KEY_ACT) || 0) || Date.now();
  var tickInact = null, frenoAct = 0, cerrando = false;
  function registrarActividad() {
    var ahora = Date.now();
    if (ahora - frenoAct < 1500) return;
    frenoAct = ahora; ultimaAct = ahora;
    guardarLocal(KEY_ACT, String(ahora));
  }
  function tickInactividad() {
    var otra = Number(leerAlmacen(KEY_ACT) || 0);
    if (otra > ultimaAct) ultimaAct = otra;
    var resta = Math.max(0, LIMITE_INACTIVIDAD - (Date.now() - ultimaAct));
    var m = Math.floor(resta / 60000), sg = Math.floor(resta / 1000) % 60;
    var t = $('sfTiempo'), dot = $('sfDot'), chip = $('sfSesion');
    if (t) t.textContent = (m < 10 ? '0' : '') + m + ':' + (sg < 10 ? '0' : '') + sg;
    if (dot) dot.className = 'sf-dot' + (resta <= 0 ? ' ro' : (resta <= 3 * 60000 ? ' am' : ''));
    if (chip) chip.title = resta <= 3 * 60000 ? 'Atencion: la sesion se cerrara por inactividad' : 'Sesion activa. Se cierra tras 15 minutos sin actividad';
    if (resta > 0) guardarLocal(KEY_ACT_LEGACY, String(Date.now()));
    else cerrarSesion(true);
  }

  function cerrarSesion(porInactividad) {
    if (cerrando) return; cerrando = true;
    try { api('cerrar'); } catch (e) { }
    borrarSesion();
    try { localStorage.removeItem(KEY_ACT); } catch (e) { }
    if (porInactividad) {
      mostrarAviso('Sesion cerrada por inactividad', 'Pasaron 15 minutos sin actividad. Redirigiendo al Hub...', false);
      setTimeout(function () { location.replace(HUB); }, 1500);
    } else {
      setTimeout(function () { location.replace(HUB); }, 250);
    }
  }

  /* ------------------------------------------------------------------ Presencia */
  function latido() {
    if (document.hidden) return;
    api('presenciaLatido', { portal: CFG.key || 'hub' }).then(function () {
      return api('presenciaEstado');
    }).then(function (r) {
      if (r && r.ok && r.portales) { PRES = { total: r.total, portales: r.portales, error: false }; }
      else if (r && r.error === 'sesion_invalida') { revalidar(true); PRES.error = true; }
      else PRES.error = true;
      pintarPresencia();
    });
  }

  /* ------------------------------------------------------------------ Arranque */
  function iniciar() {
    ocultarBarrasViejas();
    construir();
    ['mousedown', 'pointerdown', 'keydown', 'touchstart', 'wheel', 'scroll'].forEach(function (ev) { window.addEventListener(ev, registrarActividad, { passive: true }); });
    guardarLocal(KEY_ACT, String(ultimaAct));
    tickInactividad(); tickInact = setInterval(tickInactividad, 1000);
    latido(); setInterval(latido, PRESENCIA_MS);
    document.addEventListener('visibilitychange', function () { if (!document.hidden) { tickInactividad(); latido(); } });
    document.documentElement.style.visibility = 'visible';
    window.SalfaShell = { sesion: function () { return SESION; }, rol: function () { return rolEn(SESION); }, api: api, cerrarSesion: function () { cerrarSesion(false); }, hubUrl: HUB, portales: PORTALES };
  }
  if (document.body) iniciar(); else document.addEventListener('DOMContentLoaded', iniciar);
})();

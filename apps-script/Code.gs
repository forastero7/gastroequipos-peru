/**
 * LIBRO DE RECLAMACIONES VIRTUAL — Jeinox GastroSystems
 * Google Apps Script vinculado a una Google Sheet.
 *
 * - doPost: recibe el formulario, genera código LR-AAAA-000001,
 *   guarda la fila, sube la evidencia a Drive y envía correos.
 * - Menú "Libro de reclamaciones" en la hoja para responder.
 * - Recordatorio diario de reclamos por vencer.
 * Configuración y despliegue: ver INSTRUCCIONES.md
 */

const CONFIG = {
  nombreComercial: "Jeinox GastroSystems",
  razonSocial: "Yahyson Oliver Claudio Céspedes",
  ruc: "10482782961",
  direccion: "Av. Emancipación 841, Lima 15001",
  correoNegocio: "jeinox2020@gmail.com",
  hoja: "Reclamaciones",
  carpetaEvidencias: "Libro de Reclamaciones - Evidencias",
  plazoDiasHabiles: 15,
  avisoDiasAntes: 3,
  zona: "America/Lima",
};

// Feriados nacionales Perú (AAAA-MM-DD). Verifica y agrega cada año.
const FERIADOS = [
  "2026-01-01", "2026-04-02", "2026-04-03", "2026-05-01", "2026-06-07",
  "2026-06-29", "2026-07-23", "2026-07-28", "2026-07-29", "2026-08-06",
  "2026-08-30", "2026-10-08", "2026-11-01", "2026-12-08", "2026-12-09",
  "2026-12-25",
];

const COLUMNAS = [
  "Código", "Fecha registro", "Tipo", "Nombres", "Apellidos", "Tipo doc.", "N.° doc.",
  "Correo", "Teléfono", "Domicilio", "Menor de edad", "Apoderado",
  "Tipo de bien", "Producto/servicio", "Monto (S/)", "Comprobante", "Fecha compra",
  "Detalle", "Pedido", "Evidencia", "Fecha límite", "Estado", "Respuesta", "Fecha respuesta",
];
const COL = Object.fromEntries(COLUMNAS.map((c, i) => [c, i + 1]));

/* ----------------------------------------------------------------- */
/* Web App                                                            */
/* ----------------------------------------------------------------- */
function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    const d = JSON.parse(e.postData.contents);
    validar_(d);

    const ahora = new Date();
    const codigo = siguienteCodigo_(ahora);
    const limite = sumarDiasHabiles_(ahora, CONFIG.plazoDiasHabiles);
    const evidenciaUrl = d.evidencia ? guardarEvidencia_(d.evidencia, codigo) : "";

    const fila = COLUMNAS.map(() => "");
    const set = (col, val) => (fila[COL[col] - 1] = val);
    set("Código", codigo);
    set("Fecha registro", ahora);
    set("Tipo", d.tipo);
    set("Nombres", d.nombres);
    set("Apellidos", d.apellidos);
    set("Tipo doc.", d.tipoDocumento);
    set("N.° doc.", "'" + d.numeroDocumento);
    set("Correo", d.email);
    set("Teléfono", "'" + d.telefono);
    set("Domicilio", d.domicilio);
    set("Menor de edad", d.esMenor === "si" ? "Sí" : "No");
    set("Apoderado", d.apoderado || "");
    set("Tipo de bien", d.tipoBien);
    set("Producto/servicio", d.descripcionBien);
    set("Monto (S/)", d.monto ? Number(d.monto) : "");
    set("Comprobante", d.comprobante || "");
    set("Fecha compra", d.fechaCompra || "");
    set("Detalle", d.detalle);
    set("Pedido", d.pedido);
    set("Evidencia", evidenciaUrl);
    set("Fecha límite", limite);
    set("Estado", "Pendiente");

    hoja_().appendRow(fila);
    lock.releaseLock();

    const registro = Object.assign({}, d, { codigo, fecha: ahora, limite, evidenciaUrl });
    enviarCopiaCliente_(registro);
    enviarAvisoNegocio_(registro);

    return json_({ ok: true, codigo, fecha: fmtFechaHora_(ahora), fechaLimite: fmtFecha_(limite) });
  } catch (err) {
    console.error(err);
    return json_({ ok: false, error: String(err.message || err) });
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}

function doGet() {
  return json_({ ok: true, servicio: "Libro de reclamaciones activo" });
}

/* ----------------------------------------------------------------- */
/* Menú y gestión de respuestas                                        */
/* ----------------------------------------------------------------- */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu("Libro de reclamaciones")
    .addItem("Enviar respuesta de la fila seleccionada", "enviarRespuestaSeleccionada")
    .addItem("Marcar fila como En revisión", "marcarEnRevision")
    .addSeparator()
    .addItem("Configuración inicial", "configurarTodo")
    .addToUi();
}

function enviarRespuestaSeleccionada() {
  const ui = SpreadsheetApp.getUi();
  const sh = hoja_();
  const fila = sh.getActiveRange().getRow();
  if (fila < 2) return ui.alert("Selecciona una fila de reclamación (no el encabezado).");

  const v = sh.getRange(fila, 1, 1, COLUMNAS.length).getValues()[0];
  const get = (c) => v[COL[c] - 1];
  if (get("Estado") === "Respondido") return ui.alert("Esta reclamación ya fue respondida.");
  const respuesta = String(get("Respuesta") || "").trim();
  if (!respuesta) return ui.alert("Escribe primero la respuesta en la columna \"Respuesta\".");

  const ok = ui.alert(
    "Confirmar envío",
    `Se enviará la respuesta de ${get("Código")} a ${get("Correo")}. ¿Continuar?`,
    ui.ButtonSet.YES_NO
  );
  if (ok !== ui.Button.YES) return;

  const hoy = new Date();
  MailApp.sendEmail({
    to: get("Correo"),
    cc: CONFIG.correoNegocio,
    replyTo: CONFIG.correoNegocio,
    name: CONFIG.nombreComercial,
    subject: `Respuesta a tu ${String(get("Tipo")).toLowerCase()} ${get("Código")} — ${CONFIG.nombreComercial}`,
    htmlBody: plantilla_(`
      <p>Hola ${esc_(get("Nombres"))},</p>
      <p>Damos respuesta a tu ${esc_(String(get("Tipo")).toLowerCase())} registrado con el código <strong>${esc_(get("Código"))}</strong> el ${fmtFecha_(get("Fecha registro"))}.</p>
      <div style="padding:14px 16px;background:#f5f7fa;border-left:4px solid #1d4ed8;white-space:pre-wrap">${esc_(respuesta)}</div>
      <p>Fecha de comunicación de la respuesta: ${fmtFecha_(hoy)}.</p>
      <p>Si tienes consultas, responde a este correo.</p>`),
  });

  sh.getRange(fila, COL["Estado"]).setValue("Respondido");
  sh.getRange(fila, COL["Fecha respuesta"]).setValue(hoy);
  ui.alert(`Respuesta enviada a ${get("Correo")}.`);
}

function marcarEnRevision() {
  const sh = hoja_();
  const fila = sh.getActiveRange().getRow();
  if (fila >= 2) sh.getRange(fila, COL["Estado"]).setValue("En revisión");
}

/** Corre a diario: avisa al negocio de reclamos pendientes por vencer o vencidos. */
function recordatorioPlazos() {
  const sh = hoja_();
  const n = sh.getLastRow() - 1;
  if (n < 1) return;
  const datos = sh.getRange(2, 1, n, COLUMNAS.length).getValues();
  const hoy = new Date();
  const alertas = datos
    .filter((r) => r[COL["Estado"] - 1] !== "Respondido")
    .map((r) => ({
      codigo: r[COL["Código"] - 1],
      cliente: `${r[COL["Nombres"] - 1]} ${r[COL["Apellidos"] - 1]}`,
      limite: r[COL["Fecha límite"] - 1],
      restantes: diasHabilesEntre_(hoy, r[COL["Fecha límite"] - 1]),
    }))
    .filter((a) => a.restantes <= CONFIG.avisoDiasAntes);
  if (!alertas.length) return;

  const filas = alertas
    .map((a) => `<tr><td>${esc_(a.codigo)}</td><td>${esc_(a.cliente)}</td><td>${fmtFecha_(a.limite)}</td>
      <td style="color:${a.restantes < 0 ? "#b3261e" : "#10151c"}"><strong>${a.restantes < 0 ? "VENCIDO" : a.restantes + " día(s) hábil(es)"}</strong></td></tr>`)
    .join("");
  MailApp.sendEmail({
    to: CONFIG.correoNegocio,
    subject: `⚠️ ${alertas.length} reclamación(es) por vencer — Libro de reclamaciones`,
    htmlBody: plantilla_(`<p>Estas reclamaciones siguen sin respuesta:</p>
      <table cellpadding="6" style="border-collapse:collapse;width:100%" border="1">
      <tr style="background:#f5f7fa"><th>Código</th><th>Cliente</th><th>Fecha límite</th><th>Plazo</th></tr>${filas}</table>
      <p><a href="${SpreadsheetApp.getActiveSpreadsheet().getUrl()}">Abrir la hoja</a></p>`),
  });
}

/** Ejecutar UNA vez: crea encabezados, formato y el recordatorio diario. */
function configurarTodo() {
  const sh = hoja_();
  sh.getRange(1, 1, 1, COLUMNAS.length).setValues([COLUMNAS]).setFontWeight("bold").setBackground("#0d1117").setFontColor("#ffffff");
  sh.setFrozenRows(1);
  sh.getRange("B:B").setNumberFormat("dd/mm/yyyy hh:mm");
  sh.getRange(2, COL["Fecha límite"], sh.getMaxRows() - 1, 1).setNumberFormat("dd/mm/yyyy");
  sh.getRange(2, COL["Fecha respuesta"], sh.getMaxRows() - 1, 1).setNumberFormat("dd/mm/yyyy");
  sh.getRange(2, COL["Estado"], sh.getMaxRows() - 1, 1).setDataValidation(
    SpreadsheetApp.newDataValidation().requireValueInList(["Pendiente", "En revisión", "Respondido"], true).build()
  );
  ScriptApp.getProjectTriggers()
    .filter((t) => t.getHandlerFunction() === "recordatorioPlazos")
    .forEach((t) => ScriptApp.deleteTrigger(t));
  ScriptApp.newTrigger("recordatorioPlazos").timeBased().everyDays(1).atHour(8).inTimezone(CONFIG.zona).create();
  try { SpreadsheetApp.getUi().alert("Configuración lista."); } catch (_) {}
}

/* ----------------------------------------------------------------- */
/* Correos                                                             */
/* ----------------------------------------------------------------- */
function enviarCopiaCliente_(r) {
  MailApp.sendEmail({
    to: r.email,
    replyTo: CONFIG.correoNegocio,
    name: CONFIG.nombreComercial,
    subject: `Hoja de reclamación ${r.codigo} — ${CONFIG.nombreComercial}`,
    htmlBody: plantilla_(`
      <p>Hola ${esc_(r.nombres)}, registramos tu ${esc_(r.tipo.toLowerCase())}. Esta es la copia de tu hoja de reclamación.</p>
      ${hojaHtml_(r)}
      <p>Responderemos a este correo en un plazo máximo de ${CONFIG.plazoDiasHabiles} días hábiles (hasta el ${fmtFecha_(r.limite)}).</p>
      <p style="font-size:12px;color:#55606c">La formulación del reclamo no impide acudir a otras vías de solución de controversias ni es requisito previo para interponer una denuncia ante el INDECOPI.</p>`),
  });
}

function enviarAvisoNegocio_(r) {
  MailApp.sendEmail({
    to: CONFIG.correoNegocio,
    replyTo: r.email,
    subject: `🔔 Nuevo ${r.tipo.toLowerCase()} ${r.codigo} — responder antes del ${fmtFecha_(r.limite)}`,
    htmlBody: plantilla_(`${hojaHtml_(r)}
      <p><a href="${SpreadsheetApp.getActiveSpreadsheet().getUrl()}">Abrir la hoja de gestión</a></p>`),
  });
}

function hojaHtml_(r) {
  const fila = (k, v) => `<tr><td style="color:#55606c;width:38%;vertical-align:top">${k}</td><td><strong>${v}</strong></td></tr>`;
  const sec = (t) => `<tr><td colspan="2" style="background:#0d1117;color:#fff;font-weight:bold">${t}</td></tr>`;
  return `<table cellpadding="6" style="border-collapse:collapse;width:100%;font-size:14px" border="1" bordercolor="#dde1e6">
    ${fila("Código", esc_(r.codigo))}
    ${fila("Fecha", fmtFechaHora_(r.fecha))}
    ${sec("Proveedor")}
    ${fila("Nombre comercial", CONFIG.nombreComercial)}
    ${fila("Razón social", CONFIG.razonSocial)}
    ${fila("RUC", CONFIG.ruc)}
    ${fila("Dirección", CONFIG.direccion)}
    ${sec("1. Identificación del consumidor")}
    ${fila("Nombre", esc_(r.nombres + " " + r.apellidos))}
    ${fila("Documento", esc_(r.tipoDocumento + " " + r.numeroDocumento))}
    ${fila("Domicilio", esc_(r.domicilio))}
    ${fila("Teléfono", esc_(r.telefono))}
    ${fila("Correo", esc_(r.email))}
    ${r.esMenor === "si" ? fila("Padre, madre o apoderado", esc_(r.apoderado)) : ""}
    ${sec("2. Identificación del bien contratado")}
    ${fila("Tipo", esc_(r.tipoBien))}
    ${fila("Descripción", esc_(r.descripcionBien))}
    ${fila("Monto reclamado", r.monto ? "S/ " + Number(r.monto).toFixed(2) : "—")}
    ${fila("Comprobante", esc_(r.comprobante || "—"))}
    ${fila("Fecha de compra", esc_(r.fechaCompra || "—"))}
    ${sec("3. Detalle de la reclamación")}
    ${fila("Tipo", esc_(r.tipo))}
    ${fila("Detalle", `<span style="white-space:pre-wrap;font-weight:normal">${esc_(r.detalle)}</span>`)}
    ${fila("Pedido", `<span style="white-space:pre-wrap;font-weight:normal">${esc_(r.pedido)}</span>`)}
    ${fila("Evidencia", r.evidenciaUrl ? "Adjuntada" : "No")}
  </table>
  <p style="font-size:12px;color:#55606c"><strong>Reclamo:</strong> disconformidad relacionada con los productos o servicios. <strong>Queja:</strong> disconformidad no relacionada con los productos o servicios, o malestar respecto a la atención al público.</p>`;
}

function plantilla_(contenido) {
  return `<div style="font-family:Arial,sans-serif;color:#10151c;max-width:640px;margin:auto">
    <div style="background:#0d1117;color:#fff;padding:14px 18px;font-weight:bold">${CONFIG.nombreComercial} · Libro de reclamaciones</div>
    <div style="padding:18px;border:1px solid #dde1e6">${contenido}</div>
    <p style="font-size:11px;color:#55606c;padding:0 18px">${CONFIG.razonSocial} · RUC ${CONFIG.ruc} · ${CONFIG.direccion}</p></div>`;
}

/* ----------------------------------------------------------------- */
/* Utilidades                                                          */
/* ----------------------------------------------------------------- */
function validar_(d) {
  const req = ["tipo", "nombres", "apellidos", "tipoDocumento", "numeroDocumento", "email", "telefono",
    "domicilio", "tipoBien", "descripcionBien", "detalle", "pedido"];
  req.forEach((k) => { if (!d[k] || !String(d[k]).trim()) throw new Error(`Falta el campo ${k}`); });
  if (!["Reclamo", "Queja"].includes(d.tipo)) throw new Error("Tipo inválido");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email)) throw new Error("Correo inválido");
  if (d.aceptaDatos !== "si") throw new Error("Falta la aceptación de datos");
  if (d.esMenor === "si" && !d.apoderado) throw new Error("Falta el apoderado");
  if (d.evidencia && d.evidencia.base64.length > 7 * 1024 * 1024) throw new Error("Archivo muy grande");
}

function siguienteCodigo_(fecha) {
  const anio = Utilities.formatDate(fecha, CONFIG.zona, "yyyy");
  const props = PropertiesService.getScriptProperties();
  const clave = "correlativo_" + anio;
  const n = Number(props.getProperty(clave) || 0) + 1;
  props.setProperty(clave, String(n));
  return `LR-${anio}-${String(n).padStart(6, "0")}`;
}

function guardarEvidencia_(ev, codigo) {
  const permitidos = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
  if (!permitidos.includes(ev.tipo)) throw new Error("Tipo de archivo no permitido");
  const props = PropertiesService.getScriptProperties();
  let carpeta;
  const id = props.getProperty("carpetaId");
  try { carpeta = DriveApp.getFolderById(id); } catch (_) {
    carpeta = DriveApp.createFolder(CONFIG.carpetaEvidencias);
    props.setProperty("carpetaId", carpeta.getId());
  }
  const nombre = `${codigo}_${String(ev.nombre).replace(/[^\w.\-]/g, "_")}`;
  const blob = Utilities.newBlob(Utilities.base64Decode(ev.base64), ev.tipo, nombre);
  return carpeta.createFile(blob).getUrl();
}

function esFeriadoOFinde_(d) {
  const dia = Number(Utilities.formatDate(d, CONFIG.zona, "u")); // 1=lun ... 7=dom
  return dia >= 6 || FERIADOS.includes(Utilities.formatDate(d, CONFIG.zona, "yyyy-MM-dd"));
}

function sumarDiasHabiles_(desde, dias) {
  const d = new Date(desde);
  let n = 0;
  while (n < dias) {
    d.setDate(d.getDate() + 1);
    if (!esFeriadoOFinde_(d)) n++;
  }
  return d;
}

function diasHabilesEntre_(desde, hasta) {
  const a = new Date(desde); a.setHours(0, 0, 0, 0);
  const b = new Date(hasta); b.setHours(0, 0, 0, 0);
  if (b < a) return -1;
  let n = 0;
  const d = new Date(a);
  while (d < b) { d.setDate(d.getDate() + 1); if (!esFeriadoOFinde_(d)) n++; }
  return n;
}

function hoja_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(CONFIG.hoja) || ss.insertSheet(CONFIG.hoja);
}
const fmtFecha_ = (d) => Utilities.formatDate(new Date(d), CONFIG.zona, "dd/MM/yyyy");
const fmtFechaHora_ = (d) => Utilities.formatDate(new Date(d), CONFIG.zona, "dd/MM/yyyy HH:mm");
const esc_ = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const json_ = (o) => ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);

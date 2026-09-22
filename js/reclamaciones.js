/**
 * LIBRO DE RECLAMACIONES — lógica del formulario
 * -------------------------------------------------------------------
 * Valida el formulario, adjunta la evidencia (base64) y lo envía a un
 * Google Apps Script (Web App) que: genera el código correlativo,
 * guarda en Google Sheets, sube la evidencia a Drive y envía la copia
 * por correo al cliente y al negocio. Ver apps-script/INSTRUCCIONES.md.
 *
 * CONFIGURACIÓN: pega aquí la URL de la Web App publicada.
 */
const ENDPOINT = "PEGAR_AQUI_URL_DE_LA_WEB_APP"; // https://script.google.com/macros/s/XXXX/exec
const CONTACT_EMAIL = "jeinox2020@gmail.com";
const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

const form = document.getElementById("lrForm");
if (form) init();

function init() {
  const today = new Date().toLocaleDateString("es-PE", { day: "2-digit", month: "long", year: "numeric", timeZone: "America/Lima" });
  document.querySelectorAll("[data-lr-today]").forEach((el) => (el.textContent = today));

  // Menor de edad -> datos del apoderado
  const menor = document.getElementById("lr_menor");
  const apoderadoBox = document.getElementById("lrApoderado");
  const apoderado = document.getElementById("lr_apoderado");
  menor.addEventListener("change", () => {
    apoderadoBox.hidden = !menor.checked;
    apoderado.required = menor.checked;
    if (!menor.checked) apoderado.closest(".field").classList.remove("has-error");
  });

  // Tipo de documento -> teclado y longitud
  const tipoDoc = document.getElementById("lr_tipoDoc");
  const numDoc = document.getElementById("lr_numDoc");
  const syncDoc = () => {
    const t = tipoDoc.value;
    numDoc.inputMode = t === "DNI" || t === "RUC" ? "numeric" : "text";
    numDoc.maxLength = t === "DNI" ? 8 : t === "RUC" ? 11 : 12;
  };
  tipoDoc.addEventListener("change", syncDoc);
  syncDoc();

  // Contador de caracteres
  document.querySelectorAll("[data-count]").forEach((counter) => {
    const input = document.getElementById(counter.dataset.count);
    const update = () => (counter.textContent = `${input.value.length} / ${input.maxLength}`);
    input.addEventListener("input", update);
    update();
  });

  // Limpia el error al corregir
  form.addEventListener("input", (e) => e.target.closest(".field")?.classList.remove("has-error"));

  form.addEventListener("submit", onSubmit);
  document.querySelector("[data-lr-print]")?.addEventListener("click", () => window.print());
}

function validateDoc(tipo, num) {
  const n = num.trim();
  if (tipo === "DNI") return /^\d{8}$/.test(n);
  if (tipo === "RUC") return /^(10|15|17|20)\d{9}$/.test(n);
  return /^[A-Za-z0-9]{6,12}$/.test(n);
}

function validate() {
  let firstInvalid = null;
  const mark = (input, ok) => {
    input.closest(".field")?.classList.toggle("has-error", !ok);
    if (!ok && !firstInvalid) firstInvalid = input;
  };

  form.querySelectorAll(".field input[required], .field textarea[required]").forEach((input) => {
    const v = input.value.trim();
    let ok = v.length > 0;
    if (ok && input.minLength > 0) ok = v.length >= input.minLength;
    if (ok && input.type === "email") ok = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
    if (ok && input.name === "telefono") ok = v.replace(/\D/g, "").length >= 7;
    if (ok && input.name === "numeroDocumento") ok = validateDoc(form.tipoDocumento.value, v);
    mark(input, ok);
  });

  const file = form.evidencia.files[0];
  mark(form.evidencia, !file || (ALLOWED_TYPES.includes(file.type) && file.size <= MAX_FILE_BYTES));

  const acepta = form.aceptaDatos;
  const acceptError = form.querySelector("[data-accept-error]");
  acceptError.classList.toggle("is-visible", !acepta.checked);
  if (!acepta.checked && !firstInvalid) firstInvalid = acepta;

  if (firstInvalid) {
    firstInvalid.focus();
    firstInvalid.scrollIntoView({ block: "center", behavior: "smooth" });
    return false;
  }
  return true;
}

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1]);
    reader.onerror = () => reject(new Error("No se pudo leer el archivo."));
    reader.readAsDataURL(file);
  });
}

async function onSubmit(event) {
  event.preventDefault();
  const errorBox = document.getElementById("lrError");
  errorBox.hidden = true;
  if (!validate()) return;

  // Anti-spam: si el campo trampa tiene contenido, no se envía
  if (form.website.value) return;

  const submit = document.getElementById("lrSubmit");
  submit.disabled = true;
  submit.setAttribute("aria-busy", "true");
  submit.textContent = "Enviando…";

  try {
    if (!ENDPOINT.startsWith("https://")) throw new Error("not-configured");

    const data = Object.fromEntries(new FormData(form).entries());
    delete data.evidencia;
    delete data.website;
    data.esMenor = form.esMenor.checked ? "si" : "no";

    const file = form.evidencia.files[0];
    if (file) {
      data.evidencia = { nombre: file.name, tipo: file.type, base64: await readFileAsBase64(file) };
    }

    // text/plain evita el preflight CORS de Apps Script
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!json.ok) throw new Error(json.error || "server");

    showResult(json, data);
  } catch (err) {
    console.error("Libro de reclamaciones:", err);
    errorBox.innerHTML = `No se pudo registrar tu reclamación. Vuelve a intentarlo en unos minutos o escríbenos a <a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>. Tus datos siguen en el formulario.`;
    errorBox.hidden = false;
    errorBox.scrollIntoView({ block: "center", behavior: "smooth" });
  } finally {
    submit.disabled = false;
    submit.removeAttribute("aria-busy");
    submit.textContent = "Enviar reclamación";
  }
}

function showResult(json, data) {
  const result = document.getElementById("lrResult");
  result.querySelector("[data-lr-code]").textContent = json.codigo;
  result.querySelector("[data-lr-tipo]").textContent = data.tipo;
  result.querySelector("[data-lr-fecha]").textContent = json.fecha;
  result.querySelector("[data-lr-limite]").textContent = `Hasta el ${json.fechaLimite}`;
  result.querySelector("[data-lr-email]").textContent = data.email;
  form.hidden = true;
  result.hidden = false;
  result.focus();
  result.scrollIntoView({ block: "start", behavior: "smooth" });
}

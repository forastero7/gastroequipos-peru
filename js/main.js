/**
 * js/main.js
 * ------------------------------------------------------------------
 * UI general presente en TODAS las páginas: menú de navegación,
 * resaltado del enlace activo, año del footer, acordeón de FAQ,
 * formulario de fabricación a medida (valida y arma un mensaje de
 * WhatsApp) y el "toast" de notificaciones (usado por js/quote.js
 * mediante el evento personalizado "gq:toast").
 * ------------------------------------------------------------------
 */
import { WHATSAPP_NUMBERS } from "./quote.js";

/* ---------------------------------------------------------------- */
/* Menú móvil                                                        */
/* ---------------------------------------------------------------- */
function initNav() {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  if (!toggle || !nav) return;

  function closeNav() {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.classList.remove("nav-is-open");
  }

  function openNav() {
    nav.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    document.body.classList.add("nav-is-open");
  }

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.contains("is-open");
    if (isOpen) closeNav();
    else openNav();
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      if (window.matchMedia("(max-width: 1023px)").matches) closeNav();
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && nav.classList.contains("is-open")) {
      closeNav();
      toggle.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (!nav.classList.contains("is-open")) return;
    if (nav.contains(event.target) || toggle.contains(event.target)) return;
    closeNav();
  });

  // El menú de escritorio (>=1024px) es siempre visible: si la ventana
  // crece mientras el menú móvil está abierto, restauramos el estado.
  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 1024px)").matches) closeNav();
  });
}

/* ---------------------------------------------------------------- */
/* Enlace de navegación activo                                       */
/* ---------------------------------------------------------------- */
function markActiveNavLink() {
  const currentFile = window.location.pathname.split("/").pop() || "index.html";
  const currentFull = currentFile + window.location.search;
  const links = Array.from(document.querySelectorAll(".nav-list a[href]"));

  // Prioridad 1: coincidencia exacta (archivo + query), por ejemplo
  // "catalogo.html?cat=linea-caliente" resaltando ese enlace específico.
  let target = links.find((link) => link.getAttribute("href") === currentFull);

  // Prioridad 2: enlace sin query que coincide con el archivo actual
  // (por ejemplo "Productos" cuando se navega a catalogo.html sin filtro).
  if (!target) {
    target = links.find((link) => {
      const href = link.getAttribute("href");
      return !href.includes("?") && href.split("#")[0] === currentFile;
    });
  }

  if (target) target.setAttribute("aria-current", "page");
}

/* ---------------------------------------------------------------- */
/* Año en el footer                                                  */
/* ---------------------------------------------------------------- */
function setFooterYear() {
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = String(new Date().getFullYear());
  });
}

/* ---------------------------------------------------------------- */
/* Acordeón accesible (FAQ)                                          */
/* ---------------------------------------------------------------- */
function initAccordions() {
  document.querySelectorAll(".accordion").forEach((accordion) => {
    const triggers = accordion.querySelectorAll(".accordion-trigger");
    triggers.forEach((trigger) => {
      const panel = document.getElementById(trigger.getAttribute("aria-controls"));
      if (!panel) return;

      trigger.addEventListener("click", () => {
        const isOpen = trigger.getAttribute("aria-expanded") === "true";
        trigger.setAttribute("aria-expanded", String(!isOpen));
        panel.style.maxHeight = isOpen ? null : `${panel.scrollHeight}px`;
      });
    });
  });
}

/* ---------------------------------------------------------------- */
/* Toast de notificaciones (escucha eventos de js/quote.js)          */
/* ---------------------------------------------------------------- */
function initToast() {
  const toast = document.getElementById("toast");
  if (!toast) return;
  let hideTimer = null;

  document.addEventListener("gq:toast", (event) => {
    toast.querySelector("[data-toast-message]").textContent = event.detail.message;
    toast.classList.add("is-visible");
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => toast.classList.remove("is-visible"), 3200);
  });
}

/* ---------------------------------------------------------------- */
/* Formulario "Fabricación a medida" -> mensaje de WhatsApp           */
/* ---------------------------------------------------------------- */

/** Arma el mensaje de WhatsApp a partir de los datos del formulario. */
function buildFabricationWhatsAppMessage(form) {
  const val = (name) => (form.elements[name]?.value || "").trim();

  const tipo = val("tipo");
  const cantidad = val("cantidad");
  const material = val("material");
  const ancho = val("ancho");
  const alto = val("alto");
  const fondo = val("fondo");
  const funcionamiento = val("funcionamiento");
  const descripcion = val("comentarios");

  const lines = [
    "Hola, quisiera solicitar una cotización en Jeinox GastroSystems.",
    "",
    `Equipo: ${tipo}`,
    `Cantidad: ${cantidad}`,
  ];

  if (material) lines.push(`Material: ${material}`);

  if (ancho || alto || fondo) {
    lines.push("Medidas aproximadas:");
    if (ancho) lines.push(`Ancho: ${ancho} cm`);
    if (alto) lines.push(`Alto: ${alto} cm`);
    if (fondo) lines.push(`Profundidad: ${fondo} cm`);
  }

  if (funcionamiento) {
    lines.push("", `Funcionamiento: ${funcionamiento}`);
  }

  if (descripcion) {
    lines.push("", "Descripción:", descripcion);
  }

  lines.push("", "Quedo atento a su cotización.");

  return lines.join("\n");
}

function initCustomFabricationForm() {
  const form = document.getElementById("fabForm");
  if (!form) return;
  const status = document.getElementById("fabFormStatus");
  const primaryNumber = WHATSAPP_NUMBERS[0]?.number;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    let hasError = false;
    form.querySelectorAll("[required]").forEach((field) => {
      const wrapper = field.closest(".field");
      const isEmpty = !field.value || !String(field.value).trim();
      if (wrapper) wrapper.classList.toggle("has-error", isEmpty);
      if (isEmpty) hasError = true;
    });

    if (hasError) {
      if (status) {
        status.textContent = "Por favor completa los campos obligatorios.";
        status.classList.add("is-visible");
      }
      return;
    }

    if (!primaryNumber) return;

    const message = buildFabricationWhatsAppMessage(form);
    const url = `https://wa.me/${primaryNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener");

    if (status) {
      status.textContent = "Se abrió WhatsApp con tu solicitud. Si no se abrió, revisa que tu navegador permita ventanas emergentes.";
      status.classList.add("is-visible");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initNav();
  markActiveNavLink();
  setFooterYear();
  initAccordions();
  initToast();
  initCustomFabricationForm();
});

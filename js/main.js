/**
 * js/main.js
 * ------------------------------------------------------------------
 * UI general presente en TODAS las páginas: menú de navegación,
 * resaltado del enlace activo, año del footer, acordeón de FAQ,
 * validación del formulario de fabricación a medida y el "toast" de
 * notificaciones (usado por js/quote.js mediante el evento
 * personalizado "gq:toast").
 * ------------------------------------------------------------------
 */

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
/* Formulario "Fabricación a medida" (solo Front-End en esta fase)   */
/* ---------------------------------------------------------------- */
function initCustomFabricationForm() {
  const form = document.getElementById("fabForm");
  if (!form) return;
  const status = document.getElementById("fabFormStatus");

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
        status.classList.remove("is-visible");
      }
      return;
    }

    // NOTA: esta fase NO envía datos a ningún servidor. El formulario
    // solo valida en Front-End. La integración con backend/CRM/correo
    // se agregará en una siguiente etapa (ver README).
    form.reset();
    if (status) {
      status.textContent =
        "Solicitud registrada (demo). En la siguiente etapa esta información se enviará a nuestro equipo comercial.";
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

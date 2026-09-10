/**
 * js/quote.js
 * ------------------------------------------------------------------
 * "Mi cotización": lista temporal de equipos guardada en localStorage.
 *
 * IMPORTANTE — CONFIGURACIÓN FUTURA DE WHATSAPP
 * WHATSAPP_NUMBER está vacío a propósito. Esta fase NO conecta un
 * número real. Cuando se defina el número comercial, colócalo en
 * formato internacional sin "+" ni espacios (ej: "51987654321") y el
 * botón "Solicitar cotización" abrirá automáticamente WhatsApp con el
 * mensaje generado por buildWhatsAppMessage(). Ver README.
 * ------------------------------------------------------------------
 */
import { products } from "../data/products.js";

const STORAGE_KEY = "gastroequipos:quote:v1";

/** Configurar aquí el número de WhatsApp comercial cuando esté disponible. */
export const WHATSAPP_NUMBER = ""; // ej: "51987654321"

/* ---------------------------------------------------------------- */
/* Persistencia (localStorage)                                       */
/* ---------------------------------------------------------------- */

function readStorage() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn("No se pudo leer la cotización guardada:", err);
    return [];
  }
}

function writeStorage(items) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.warn("No se pudo guardar la cotización:", err);
  }
  document.dispatchEvent(new CustomEvent("gq:quote-updated", { detail: { items } }));
}

/** @returns {{id:string, qty:number}[]} */
export function getQuote() {
  return readStorage();
}

export function getQuoteCount() {
  return getQuote().reduce((total, item) => total + item.qty, 0);
}

export function addToQuote(productId, qty = 1) {
  const items = readStorage();
  const existing = items.find((i) => i.id === productId);
  if (existing) {
    existing.qty += qty;
  } else {
    items.push({ id: productId, qty });
  }
  writeStorage(items);
}

export function setQuoteQty(productId, qty) {
  const items = readStorage();
  const existing = items.find((i) => i.id === productId);
  if (!existing) return;
  existing.qty = Math.max(1, Math.min(99, qty));
  writeStorage(items);
}

export function removeFromQuote(productId) {
  writeStorage(readStorage().filter((i) => i.id !== productId));
}

export function clearQuote() {
  writeStorage([]);
}

/** Cotización resuelta contra el catálogo (producto + cantidad). */
export function getQuoteDetailed() {
  return getQuote()
    .map((item) => {
      const product = products.find((p) => p.id === item.id);
      return product ? { product, qty: item.qty } : null;
    })
    .filter(Boolean);
}

/**
 * Genera el mensaje de texto que se enviará por WhatsApp cuando el
 * número comercial esté configurado (ver WHATSAPP_NUMBER arriba).
 */
export function buildWhatsAppMessage() {
  const detailed = getQuoteDetailed();
  if (!detailed.length) return "";
  const lines = detailed.map((i) => `- ${i.product.name} x${i.qty}`);
  return `Hola, quisiera cotizar los siguientes equipos:\n\n${lines.join("\n")}`;
}

/** Devuelve la URL de WhatsApp lista para usar, o null si falta el número. */
export function buildWhatsAppUrl() {
  if (!WHATSAPP_NUMBER) return null;
  const message = buildWhatsAppMessage();
  if (!message) return null;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

/* ---------------------------------------------------------------- */
/* UI: indicador en el header (todas las páginas)                    */
/* ---------------------------------------------------------------- */

function updateQuoteBadges() {
  const count = getQuoteCount();
  document.querySelectorAll("[data-quote-count]").forEach((el) => {
    el.textContent = String(count);
    el.dataset.empty = count === 0 ? "true" : "false";
  });
  document.querySelectorAll("[data-quote-indicator]").forEach((el) => {
    el.setAttribute("aria-label", `Mi cotización, ${count} equipo${count === 1 ? "" : "s"}`);
  });
}

function showToast(message) {
  document.dispatchEvent(new CustomEvent("gq:toast", { detail: { message } }));
}

/* ---------------------------------------------------------------- */
/* Delegación global: botones "Agregar a cotización"                 */
/* ---------------------------------------------------------------- */

function initAddToQuoteDelegation() {
  document.addEventListener("click", (event) => {
    const btn = event.target.closest("[data-add-to-quote]");
    if (!btn) return;
    const productId = btn.getAttribute("data-add-to-quote");
    if (!productId) return;
    addToQuote(productId, 1);
    showToast("Equipo agregado a tu cotización");
  });
}

/* ---------------------------------------------------------------- */
/* Página "Mi cotización" (cotizacion.html)                          */
/* ---------------------------------------------------------------- */

function renderQuotePage() {
  const root = document.getElementById("quotePageRoot");
  if (!root) return;

  const tbody = document.getElementById("quoteTableBody");
  const emptyState = document.getElementById("quoteEmptyState");
  const tableWrap = document.getElementById("quoteTableWrap");
  const summaryCount = document.getElementById("quoteSummaryCount");
  const messagePreview = document.getElementById("quoteMessagePreview");
  const requestBtn = document.getElementById("quoteRequestBtn");
  const clearBtn = document.getElementById("quoteClearBtn");

  function render() {
    const detailed = getQuoteDetailed();

    if (!detailed.length) {
      if (tableWrap) tableWrap.hidden = true;
      if (emptyState) emptyState.hidden = false;
      if (summaryCount) summaryCount.textContent = "0";
      if (messagePreview) messagePreview.textContent = "Agrega equipos a tu cotización para generar el mensaje.";
      if (requestBtn) requestBtn.setAttribute("disabled", "true");
      if (clearBtn) clearBtn.setAttribute("disabled", "true");
      return;
    }

    if (tableWrap) tableWrap.hidden = false;
    if (emptyState) emptyState.hidden = true;
    if (requestBtn) requestBtn.removeAttribute("disabled");
    if (clearBtn) clearBtn.removeAttribute("disabled");

    if (tbody) {
      tbody.innerHTML = detailed
        .map(
          ({ product, qty }) => `
        <tr data-row="${product.id}">
          <td>
            <div class="quote-row__product">
              <div class="quote-row__thumb"><img src="${product.images[0]}" alt="" loading="lazy" width="120" height="120"></div>
              <div>
                <a href="producto.html?slug=${encodeURIComponent(product.slug)}"><strong>${product.name}</strong></a>
              </div>
            </div>
          </td>
          <td>
            <div class="qty-control">
              <button type="button" data-qty-decrease aria-label="Disminuir cantidad de ${product.name}">
                <svg class="icon icon--sm" aria-hidden="true"><use href="assets/icons/sprite.svg#icon-minus"/></svg>
              </button>
              <input type="number" min="1" max="99" value="${qty}" data-qty-input aria-label="Cantidad de ${product.name}">
              <button type="button" data-qty-increase aria-label="Aumentar cantidad de ${product.name}">
                <svg class="icon icon--sm" aria-hidden="true"><use href="assets/icons/sprite.svg#icon-plus"/></svg>
              </button>
            </div>
          </td>
          <td>
            <button type="button" class="quote-remove" data-remove aria-label="Eliminar ${product.name} de la cotización">
              <svg class="icon" aria-hidden="true"><use href="assets/icons/sprite.svg#icon-trash"/></svg>
            </button>
          </td>
        </tr>`
        )
        .join("");
    }

    if (summaryCount) {
      const totalUnits = detailed.reduce((t, i) => t + i.qty, 0);
      summaryCount.textContent = String(totalUnits);
    }
    if (messagePreview) messagePreview.textContent = buildWhatsAppMessage();
  }

  root.addEventListener("click", (event) => {
    const row = event.target.closest("tr[data-row]");
    if (!row) return;
    const productId = row.dataset.row;

    if (event.target.closest("[data-qty-increase]")) {
      const input = row.querySelector("[data-qty-input]");
      setQuoteQty(productId, Number(input.value) + 1);
    } else if (event.target.closest("[data-qty-decrease]")) {
      const input = row.querySelector("[data-qty-input]");
      setQuoteQty(productId, Number(input.value) - 1);
    } else if (event.target.closest("[data-remove]")) {
      removeFromQuote(productId);
      showToast("Equipo eliminado de la cotización");
    }
  });

  root.addEventListener("change", (event) => {
    const input = event.target.closest("[data-qty-input]");
    if (!input) return;
    const row = event.target.closest("tr[data-row]");
    setQuoteQty(row.dataset.row, Number(input.value));
  });

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      clearQuote();
      showToast("Cotización vaciada");
    });
  }

  if (requestBtn) {
    requestBtn.addEventListener("click", () => {
      const url = buildWhatsAppUrl();
      if (url) {
        window.open(url, "_blank", "noopener");
        return;
      }
      // El número de WhatsApp aún no está configurado (ver WHATSAPP_NUMBER).
      // Mostramos el mensaje generado para que el equipo comercial lo revise.
      const preview = document.getElementById("quoteMessagePreview");
      if (preview) preview.scrollIntoView({ behavior: "smooth", block: "center" });
      showToast("WhatsApp aún no está configurado. Mensaje generado abajo.");
    });
  }

  document.addEventListener("gq:quote-updated", render);
  render();
}

document.addEventListener("DOMContentLoaded", () => {
  initAddToQuoteDelegation();
  updateQuoteBadges();
  document.addEventListener("gq:quote-updated", updateQuoteBadges);
  renderQuotePage();
});

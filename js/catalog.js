/**
 * js/catalog.js
 * ------------------------------------------------------------------
 * Lógica exclusiva de catalogo.html: buscador + filtros + grid.
 *
 * Filtros activos en esta fase: Todos / Línea caliente / Línea fría /
 * Acero inoxidable / Fabricación especial.
 *
 * PREPARADO PARA EL FUTURO: la función matchesFilters() es el único
 * lugar que decide si un producto pasa el filtro activo. Para sumar
 * filtros avanzados (precio, capacidad, dimensiones, número de
 * puertas/hornillas, potencia, material, tipo de negocio) basta con:
 *   1. Agregar el control de UI correspondiente.
 *   2. Leer su valor en readActiveFilters().
 *   3. Sumar la condición en matchesFilters().
 * No es necesario tocar el resto del módulo.
 * ------------------------------------------------------------------
 */
import { products } from "../data/products.js";
import { renderProductGrid, getBusinessTypeById } from "./products.js";

const FILTERS = [
  { id: "todos", label: "Todos" },
  { id: "linea-caliente", label: "Línea caliente" },
  { id: "linea-fria", label: "Línea fría" },
  { id: "acero-inoxidable", label: "Acero inoxidable" },
  { id: "fabricacion-especial", label: "Fabricación especial" },
];

function matchesFilters(product, state) {
  const { category, query, business } = state;

  if (category === "fabricacion-especial") {
    if (product.availability !== "fabricacion" && product.subcategory !== "fabricaciones-especiales") {
      return false;
    }
  } else if (category !== "todos" && product.category !== category) {
    return false;
  }

  // Filtro por tipo de negocio (llega desde "¿Qué negocio estás
  // equipando?" en la página de inicio, vía ?business=). Un mismo
  // producto puede pertenecer a varios negocios sin duplicarse.
  if (business && !product.businessTypes.includes(business)) {
    return false;
  }

  if (query) {
    const haystack = `${product.name} ${product.shortDescription} ${product.description}`.toLowerCase();
    if (!haystack.includes(query)) return false;
  }

  // Placeholder para futuros filtros avanzados (precio, capacidad,
  // dimensiones, potencia, número de puertas/hornillas, material).
  // Ver comentario superior del archivo.

  return true;
}

function initCatalog() {
  const grid = document.getElementById("catalogGrid");
  if (!grid) return;

  const searchInput = document.getElementById("catalogSearch");
  const pillsWrap = document.getElementById("catalogFilters");
  const resultsCount = document.getElementById("catalogResultsCount");

  const params = new URLSearchParams(window.location.search);
  const initialCategory = FILTERS.some((f) => f.id === params.get("cat"))
    ? params.get("cat")
    : "todos";
  const initialBusiness = params.get("business") || "";

  const state = { category: initialCategory, query: "", business: initialBusiness };
  const businessNotice = document.getElementById("catalogBusinessNotice");

  if (businessNotice && initialBusiness) {
    const bt = getBusinessTypeById(initialBusiness);
    businessNotice.hidden = false;
    businessNotice.querySelector("[data-business-name]").textContent = bt ? bt.name : initialBusiness;
    businessNotice.querySelector("[data-clear-business]").addEventListener("click", () => {
      state.business = "";
      businessNotice.hidden = true;
      update();
    });
  }

  if (pillsWrap) {
    pillsWrap.innerHTML = FILTERS.map(
      (f) => `
      <button type="button" class="filter-pill" data-filter="${f.id}" aria-pressed="${f.id === state.category}">
        ${f.label}
      </button>`
    ).join("");

    pillsWrap.addEventListener("click", (event) => {
      const btn = event.target.closest("[data-filter]");
      if (!btn) return;
      state.category = btn.dataset.filter;
      pillsWrap
        .querySelectorAll("[data-filter]")
        .forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      update();
    });
  }

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      state.query = searchInput.value.trim().toLowerCase();
      update();
    });
  }

  function update() {
    const filtered = products.filter((p) => matchesFilters(p, state));
    renderProductGrid(grid, filtered);
    if (resultsCount) {
      resultsCount.textContent = `${filtered.length} equipo${filtered.length === 1 ? "" : "s"} encontrado${filtered.length === 1 ? "" : "s"}`;
    }
  }

  update();
}

document.addEventListener("DOMContentLoaded", initCatalog);

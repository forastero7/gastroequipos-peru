/**
 * js/products.js
 * ------------------------------------------------------------------
 * Renderizado de productos: tarjetas de producto, ficha técnica,
 * grid de destacados (inicio) y ficha individual (producto.html).
 *
 * Este módulo NO contiene lógica de cotización (ver js/quote.js) ni
 * de filtros de catálogo (ver js/catalog.js). Solo sabe transformar
 * datos de data/products.js en HTML.
 * ------------------------------------------------------------------
 */
import { products, categories, businessTypes } from "../data/products.js";

/* ---------------------------------------------------------------- */
/* Helpers de datos                                                  */
/* ---------------------------------------------------------------- */

export function getCategoryById(id) {
  return categories.find((c) => c.id === id) || null;
}

export function getBusinessTypeById(id) {
  return businessTypes.find((b) => b.id === id) || null;
}

export function getProductBySlug(slug) {
  return products.find((p) => p.slug === slug) || null;
}

export function getFeaturedProducts(limit = 8) {
  return products.filter((p) => p.featured && p.visible).slice(0, limit);
}

/**
 * Productos relacionados: misma categoría, priorizando los que
 * comparten tipo(s) de negocio, excluyendo el producto actual.
 * Solo incluye productos visibles (con fotografías reales cargadas).
 */
export function getRelatedProducts(product, limit = 4) {
  return products
    .filter((p) => p.id !== product.id && p.category === product.category && p.visible)
    .sort((a, b) => {
      const sharedA = a.businessTypes.filter((bt) =>
        product.businessTypes.includes(bt)
      ).length;
      const sharedB = b.businessTypes.filter((bt) =>
        product.businessTypes.includes(bt)
      ).length;
      return sharedB - sharedA;
    })
    .slice(0, limit);
}

export function formatPriceSoles(value) {
  return `S/ ${Number(value).toLocaleString("es-PE")}`;
}

/**
 * Devuelve { label, value } para mostrar el precio en tarjetas y
 * ficha de producto, según priceType. El precio NUNCA es un campo
 * obligatorio: "quote" no muestra ningún monto.
 */
export function getPriceDisplay(product) {
  if (product.priceType === "fixed" && product.price != null) {
    return { label: "Precio", value: formatPriceSoles(product.price) };
  }
  if (product.priceType === "from" && product.price != null) {
    return { label: "Precio referencial", value: `Desde ${formatPriceSoles(product.price)}` };
  }
  return { label: "", value: "Cotizar" };
}

const AVAILABILITY_LABELS = {
  disponible: { text: "Disponible", className: "badge--disponible" },
  fabricacion: { text: "Fabricación", className: "badge--fabricacion" },
  consultar: { text: "Consultar", className: "badge--consultar" },
};

export function getAvailabilityDisplay(product) {
  return AVAILABILITY_LABELS[product.availability] || AVAILABILITY_LABELS.consultar;
}

/** Hasta 3 características cortas para la tarjeta de producto. */
export function getKeyFeatures(product, limit = 3) {
  const entries = Object.entries(product.specifications).filter(
    ([, value]) => value && !String(value).startsWith("--")
  );
  const labels = SPEC_LABELS;
  return entries.slice(0, limit).map(([key, value]) => `${labels[key] || key}: ${value}`);
}

/* ---------------------------------------------------------------- */
/* Ficha técnica (especificaciones)                                  */
/* ---------------------------------------------------------------- */

export const SPEC_LABELS = {
  dimensiones: "Dimensiones",
  material: "Material",
  capacidad: "Capacidad",
  potencia: "Potencia",
  voltaje: "Voltaje",
  combustible: "Combustible",
  numeroPuertas: "Número de puertas",
  numeroHornillas: "Número de hornillas",
  numeroCestas: "Número de cestas",
  numeroQuemadores: "Número de quemadores",
  temperatura: "Temperatura",
  peso: "Peso",
  garantia: "Garantía",
};

/**
 * Renderiza SOLO las especificaciones presentes en el producto.
 * No se muestran filas para campos que no aplican a ese equipo.
 */
export function renderSpecTable(specifications) {
  const entries = Object.entries(specifications || {});
  if (entries.length === 0) {
    const p = document.createElement("p");
    p.className = "spec-empty";
    p.textContent = "Ficha técnica pendiente de completar para este equipo.";
    return p;
  }
  const wrap = document.createElement("div");
  wrap.className = "spec-table-wrap";
  const table = document.createElement("table");
  table.className = "spec-table";
  table.innerHTML = `
    <caption class="visually-hidden">Especificaciones técnicas</caption>
    <tbody>
      ${entries
        .map(
          ([key, value]) => `
        <tr>
          <th scope="row">${SPEC_LABELS[key] || key}</th>
          <td>${escapeHtml(String(value))}</td>
        </tr>`
        )
        .join("")}
    </tbody>`;
  wrap.appendChild(table);
  return wrap;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/* ---------------------------------------------------------------- */
/* Imágenes responsivas (Fase 4)                                     */
/* ------------------------------------------------------------------
 * Ancho real (px) de cada imagen ORIGINAL. Permite generar el
 * descriptor "w" correcto del srcset y saber qué variantes -400/
 * -800/-1200 existen realmente en disco: el script que las generó
 * omite cualquier variante mayor o igual al ancho nativo, para no
 * ampliar ninguna imagen (evita variantes falsas/borrosas).
 * ------------------------------------------------------------------ */
const PRODUCT_IMAGE_NATIVE_WIDTH = {
  "assets/images/products/caja-china-2en1-1.webp": 1600,
  "assets/images/products/caja-china-2en1-2.webp": 900,
  "assets/images/products/caja-china-2en1-3.webp": 1600,
  "assets/images/products/caja-china-3en1-1.webp": 1600,
  "assets/images/products/caja-china-3en1-2.webp": 900,
  "assets/images/products/caja-china-4en1-1.webp": 1600,
  "assets/images/products/caja-china-4en1-2.webp": 1131,
  "assets/images/products/caja-china-4en1-3.webp": 800,
  "assets/images/products/cocina-industrial-2-hornillas-1.webp": 1600,
  "assets/images/products/cocina-industrial-2-hornillas-2.webp": 1600,
  "assets/images/products/cocina-industrial-2-hornillas-chifero-1.webp": 1600,
  "assets/images/products/cocina-industrial-2-hornillas-chifero-freidora-horno-1.webp": 1600,
  "assets/images/products/cocina-industrial-2-hornillas-chifero-freidora-horno-2.webp": 675,
  "assets/images/products/cocina-industrial-2-hornillas-mesa-1.webp": 1600,
  "assets/images/products/cocina-industrial-3-hornillas-chifero-horno-1.webp": 1600,
  "assets/images/products/cocina-industrial-3-hornillas-chifero-horno-2.webp": 1025,
  "assets/images/products/cocina-industrial-3-hornillas-horno-1.webp": 1600,
  "assets/images/products/cocina-industrial-3-hornillas-horno-2.webp": 1800,
  "assets/images/products/cocina-industrial-4-hornillas-1.webp": 1600,
  "assets/images/products/cocina-industrial-4-hornillas-2.webp": 2002,
  "assets/images/products/congeladora-2-puertas-1.webp": 1600,
  "assets/images/products/congeladora-2-puertas-2.webp": 800,
  "assets/images/products/freidora-automatica-industrial-1.webp": 1600,
  "assets/images/products/freidora-automatica-industrial-2.webp": 900,
  "assets/images/products/freidora-automatica-industrial-3.webp": 900,
  "assets/images/products/freidora-automatica-industrial-4.webp": 900,
  "assets/images/products/freidora-industrial-2-pozas-1.webp": 1600,
  "assets/images/products/freidora-industrial-2-pozas-2.webp": 900,
  "assets/images/products/freidora-industrial-2-pozas-3.webp": 900,
  "assets/images/products/freidora-industrial-digital-4-quemadores-1.webp": 1600,
  "assets/images/products/freidora-industrial-digital-4-quemadores-2.webp": 960,
  "assets/images/products/horno-shawarma-4-quemadores-1.webp": 1600,
  "assets/images/products/horno-shawarma-4-quemadores-2.webp": 900,
  "assets/images/products/horno-shawarma-4-quemadores-3.webp": 900,
  "assets/images/products/lavadero-2pozas-anaqueles-1.webp": 1600,
  "assets/images/products/lavadero-2pozas-anaqueles-2.webp": 900,
  "assets/images/products/lavadero-2pozas-anaqueles-3.webp": 900,
  "assets/images/products/mesa-trabajo-5-niveles-1.webp": 1600,
  "assets/images/products/mesa-trabajo-5-niveles-2.webp": 1600,
  "assets/images/products/parrilla-mesa-empotrable-1.webp": 1600,
  "assets/images/products/parrilla-mesa-empotrable-2.webp": 1800,
  "assets/images/products/parrilla-mesa-empotrable-3.webp": 1800,
  "assets/images/products/parrilla-mesa-empotrable-4.webp": 1600,
  "assets/images/products/lavadero-gabinete-anaqueles-1.webp": 1931,
  "assets/images/products/lavadero-gabinete-anaqueles-2.webp": 1931,
};

const CATEGORY_IMAGE_NATIVE_WIDTH = {
  "assets/images/categories/acero-inoxidable.webp": 1600,
  "assets/images/categories/linea-caliente.webp": 1600,
  "assets/images/categories/linea-fria.webp": 1600,
};

const PRODUCT_IMAGE_TIERS = [400, 800, 1200];
const CATEGORY_IMAGE_TIERS = [800];

// Calculados a partir del ancho real renderizado de .grid-cards
// (Fase 3) medido con Playwright en 320-1920px: 1 columna (<656px),
// 2 columnas (656-1011px) y 3+ columnas auto-fit (>=1012px, tarjeta
// de ~360px con minmax(300px,1fr) sobre un contenedor de 1200px).
const CARD_IMAGE_SIZES = "(min-width: 1012px) 360px, (min-width: 656px) 45vw, 95vw";

// Calculados sobre .product-gallery en producto.html: columna fija de
// ~534px en desktop (>=1200px), 50% del viewport menos el padding del
// contenedor en tablet, y casi todo el ancho en móvil.
const DETAIL_IMAGE_SIZES = "(min-width: 1200px) 534px, (min-width: 600px) calc(50vw - 60px), 90vw";

// .grid-3 pasa a 3 columnas desde 860px sobre un contenedor de hasta
// 1200px: la tarjeta real mide entre ~249px (860px) y ~384px (>=1264px).
const CATEGORY_IMAGE_SIZES = "(min-width: 860px) 33vw, 90vw";

/**
 * Arma el atributo srcset a partir del ancho nativo real de la
 * imagen y de las variantes que efectivamente existen en disco
 * (cualquier tier >= ancho nativo fue omitido al generarlas).
 */
function buildSrcset(src, nativeWidth, tiers) {
  if (!nativeWidth) return "";
  const dot = src.lastIndexOf(".");
  const base = src.slice(0, dot);
  const ext = src.slice(dot);
  const entries = tiers.filter((w) => w < nativeWidth).map((w) => `${base}-${w}${ext} ${w}w`);
  entries.push(`${src} ${nativeWidth}w`);
  return entries.join(", ");
}

/** Atributos completos (como string) para el <img> de una tarjeta de producto. */
function cardImageAttrs(src, alt, { eager = false } = {}) {
  const nativeWidth = PRODUCT_IMAGE_NATIVE_WIDTH[src];
  const srcset = buildSrcset(src, nativeWidth, PRODUCT_IMAGE_TIERS);
  const loadingAttrs = eager ? `loading="eager" fetchpriority="high"` : `loading="lazy"`;
  return `src="${src}" alt="${alt}" ${srcset ? `srcset="${srcset}" sizes="${CARD_IMAGE_SIZES}"` : ""} width="800" height="600" decoding="async" ${loadingAttrs}`;
}

/** Atributos completos (como string) para el <img> de una tarjeta de categoría. */
function categoryImageAttrs(src) {
  const nativeWidth = CATEGORY_IMAGE_NATIVE_WIDTH[src];
  const srcset = buildSrcset(src, nativeWidth, CATEGORY_IMAGE_TIERS);
  return `src="${src}" ${srcset ? `srcset="${srcset}" sizes="${CATEGORY_IMAGE_SIZES}"` : ""} width="800" height="600" decoding="async" loading="lazy"`;
}

/**
 * Aplica src/srcset/sizes a la imagen principal de la ficha de
 * producto (#productMainImage). Es el elemento LCP confirmado de
 * producto.html: siempre se sirve con fetchpriority="high" y sin
 * lazy-loading, tanto en la carga inicial como al cambiar de
 * miniatura.
 */
function applyDetailImage(imgEl, src, alt) {
  const nativeWidth = PRODUCT_IMAGE_NATIVE_WIDTH[src];
  const srcset = buildSrcset(src, nativeWidth, PRODUCT_IMAGE_TIERS);
  imgEl.src = src;
  imgEl.alt = alt;
  if (srcset) {
    imgEl.srcset = srcset;
    imgEl.sizes = DETAIL_IMAGE_SIZES;
  } else {
    imgEl.removeAttribute("srcset");
    imgEl.removeAttribute("sizes");
  }
  imgEl.setAttribute("fetchpriority", "high");
  imgEl.loading = "eager";
  imgEl.decoding = "async";
}

/**
 * Miniatura ligera reutilizada en la galería de producto.html y en
 * las filas de "Mi cotización": nunca sirve el original a resolución
 * completa para una miniatura de ~120-200px.
 */
export function smallThumbSrc(src) {
  const nativeWidth = PRODUCT_IMAGE_NATIVE_WIDTH[src];
  if (!nativeWidth || nativeWidth <= 400) return src;
  const dot = src.lastIndexOf(".");
  return `${src.slice(0, dot)}-400${src.slice(dot)}`;
}

/* ---------------------------------------------------------------- */
/* Tarjeta de producto                                               */
/* ---------------------------------------------------------------- */

export function createProductCard(product, { eager = false } = {}) {
  const category = getCategoryById(product.category);
  const availability = getAvailabilityDisplay(product);
  const price = getPriceDisplay(product);
  const features = getKeyFeatures(product);

  const article = document.createElement("article");
  article.className = "card product-card";
  article.dataset.productId = product.id;

  article.innerHTML = `
    <a class="product-card__media" href="producto.html?slug=${encodeURIComponent(product.slug)}">
      <div class="media-frame">
        <img ${cardImageAttrs(product.images[0], `${escapeHtml(product.name)} — imagen referencial`, { eager })}>
      </div>
      <span class="badge ${availability.className} product-card__badge">${availability.text}</span>
    </a>
    <div class="product-card__body">
      <span class="product-card__category">${category ? category.name : ""}</span>
      <h3 class="product-card__name">
        <a href="producto.html?slug=${encodeURIComponent(product.slug)}">${escapeHtml(product.name)}</a>
      </h3>
      ${
        features.length
          ? `<ul class="product-card__features">
              ${features
                .map(
                  (f) => `<li><svg class="icon icon--sm" aria-hidden="true"><use href="assets/icons/sprite.svg#icon-check"/></svg><span>${escapeHtml(f)}</span></li>`
                )
                .join("")}
            </ul>`
          : ""
      }
      <p class="product-card__price">
        ${price.label ? `<span class="price-label">${price.label}</span>` : ""}
        ${price.value}
      </p>
      <div class="product-card__actions">
        <a class="btn btn-outline btn-sm" href="producto.html?slug=${encodeURIComponent(product.slug)}">Ver equipo</a>
        <button type="button" class="btn btn-quote btn-sm" data-add-to-quote="${product.id}">Agregar a cotización</button>
      </div>
    </div>
  `;
  return article;
}

export function renderProductGrid(container, list, { eagerFirst = false } = {}) {
  container.innerHTML = "";
  if (!list.length) {
    container.innerHTML = `
      <div class="catalog-empty">
        <svg class="icon" aria-hidden="true"><use href="assets/icons/sprite.svg#icon-search"/></svg>
        <p>No encontramos equipos con ese criterio. Prueba con otra búsqueda o filtro.</p>
      </div>`;
    return;
  }
  const fragment = document.createDocumentFragment();
  list.forEach((product, index) =>
    fragment.appendChild(createProductCard(product, { eager: eagerFirst && index === 0 }))
  );
  container.appendChild(fragment);
}

/* ---------------------------------------------------------------- */
/* Home: grid de destacados                                          */
/* ---------------------------------------------------------------- */

function initFeaturedGrid() {
  const el = document.getElementById("featuredGrid");
  if (!el) return;
  renderProductGrid(el, getFeaturedProducts(8));
}

/* ---------------------------------------------------------------- */
/* Home: categorías principales y tipos de negocio                   */
/* ---------------------------------------------------------------- */

function initCategoryGrid() {
  const el = document.getElementById("categoryGrid");
  if (!el) return;
  el.innerHTML = categories
    .map(
      (cat) => `
    <article class="card category-card">
      <a class="media-frame" href="catalogo.html?cat=${cat.id}" aria-hidden="true" tabindex="-1">
        <img ${categoryImageAttrs(cat.image)} alt="">
      </a>
      <div class="category-card__body">
        <h3><a href="catalogo.html?cat=${cat.id}">${cat.name}</a></h3>
        <p class="text-muted">${cat.description}</p>
        <a class="category-card__link" href="catalogo.html?cat=${cat.id}">
          Ver equipos
          <svg class="icon icon--sm" aria-hidden="true"><use href="assets/icons/sprite.svg#icon-arrow-right"/></svg>
        </a>
      </div>
    </article>`
    )
    .join("");
}

function initBusinessGrid() {
  const el = document.getElementById("businessGrid");
  if (!el) return;
  el.innerHTML = businessTypes
    .map(
      (bt) => `
    <a class="business-card" href="catalogo.html?business=${bt.id}">
      <span class="icon-wrap"><svg class="icon" aria-hidden="true"><use href="assets/icons/sprite.svg#${bt.icon}"/></svg></span>
      ${bt.name}
    </a>`
    )
    .join("");
}

/* ---------------------------------------------------------------- */
/* Ficha individual de producto (producto.html?slug=...)             */
/* ---------------------------------------------------------------- */

function initProductDetail() {
  const root = document.getElementById("productDetail");
  if (!root) return;

  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");
  const product = slug ? getProductBySlug(slug) : null;

  // Un producto con visible:false (sin fotografías reales aún) se
  // trata igual que "no encontrado": no debe poder accederse ni por
  // URL directa mientras esté oculto del resto de la web pública.
  if (!product || !product.visible) {
    root.innerHTML = `
      <div class="catalog-empty">
        <h1 class="h3">Equipo no encontrado</h1>
        <p>El equipo que buscas no existe o fue movido. Revisa el <a href="catalogo.html">catálogo completo</a>.</p>
      </div>`;
    return;
  }

  document.title = `${product.name} | Jeinox GastroSystems`;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute("content", product.shortDescription);

  // SEO dinámico por producto (Fase 5): cada ficha obtiene su propio
  // canonical y Open Graph/Twitter una vez que carga el producto.
  // Aviso: WhatsApp y Facebook NO ejecutan JavaScript al generar la
  // vista previa de un enlace, por lo que seguirán mostrando el
  // Open Graph estático genérico del <head> de producto.html. Esta
  // actualización beneficia a Google, que sí renderiza JavaScript
  // antes de indexar.
  const productPageUrl = new URL(
    window.location.pathname + window.location.search,
    window.location.href
  ).href;
  const productImageUrl = new URL(product.images[0], window.location.href).href;
  const canonicalLink = document.querySelector('link[rel="canonical"]');
  if (canonicalLink) canonicalLink.setAttribute("href", productPageUrl);
  setMetaContent('meta[property="og:title"]', `${product.name} | Jeinox GastroSystems`);
  setMetaContent('meta[property="og:description"]', product.shortDescription);
  setMetaContent('meta[property="og:url"]', productPageUrl);
  setMetaContent('meta[property="og:image"]', productImageUrl);
  setMetaContent('meta[name="twitter:title"]', `${product.name} | Jeinox GastroSystems`);
  setMetaContent('meta[name="twitter:description"]', product.shortDescription);
  setMetaContent('meta[name="twitter:image"]', productImageUrl);

  const category = getCategoryById(product.category);
  const availability = getAvailabilityDisplay(product);
  const price = getPriceDisplay(product);

  // Breadcrumb
  const breadcrumb = document.getElementById("productBreadcrumb");
  if (breadcrumb) {
    breadcrumb.innerHTML = `
      <ol>
        <li><a href="index.html">Inicio</a></li>
        <li aria-hidden="true"><svg class="icon"><use href="assets/icons/sprite.svg#icon-chevron-right"/></svg></li>
        <li><a href="catalogo.html?cat=${category ? category.id : ""}">${category ? category.name : "Catálogo"}</a></li>
        <li aria-hidden="true"><svg class="icon"><use href="assets/icons/sprite.svg#icon-chevron-right"/></svg></li>
        <li aria-current="page">${escapeHtml(product.name)}</li>
      </ol>`;
  }

  // Galería
  const mainImg = document.getElementById("productMainImage");
  const thumbsWrap = document.getElementById("productThumbs");
  if (mainImg && thumbsWrap) {
    const mainImgAlt = `${product.name} — imagen referencial`;
    applyDetailImage(mainImg, product.images[0], mainImgAlt);
    thumbsWrap.innerHTML = product.images
      .map(
        (src, i) => `
        <button type="button" class="product-gallery__thumb" data-index="${i}" aria-current="${i === 0}" aria-label="Ver imagen ${i + 1} de ${product.name}">
          <img src="${smallThumbSrc(src)}" alt="" loading="lazy" width="200" height="150" decoding="async">
        </button>`
      )
      .join("");
    thumbsWrap.querySelectorAll(".product-gallery__thumb").forEach((btn) => {
      btn.addEventListener("click", () => {
        applyDetailImage(mainImg, product.images[Number(btn.dataset.index)], mainImgAlt);
        thumbsWrap
          .querySelectorAll(".product-gallery__thumb")
          .forEach((b) => b.setAttribute("aria-current", "false"));
        btn.setAttribute("aria-current", "true");
      });
    });
  }

  setText("productCategory", category ? category.name : "");
  setText("productName", product.name);
  setText("productDescription", product.description);
  setHtml(
    "productAvailability",
    `<span class="badge ${availability.className}">${availability.text}</span>`
  );
  setHtml(
    "productPrice",
    `${price.label ? `<span class="price-label">${price.label}</span>` : ""} ${price.value}`
  );
  setText("productWarranty", product.warranty || "Por confirmar");

  const featuresEl = document.getElementById("productFeatures");
  if (featuresEl) {
    const features = getKeyFeatures(product, 6);
    featuresEl.innerHTML = features
      .map(
        (f) =>
          `<li><svg class="icon" aria-hidden="true"><use href="assets/icons/sprite.svg#icon-check"/></svg><span>${escapeHtml(f)}</span></li>`
      )
      .join("");
  }

  const specEl = document.getElementById("productSpecs");
  if (specEl) specEl.appendChild(renderSpecTable(product.specifications));

  const addBtn = document.getElementById("productAddToQuote");
  if (addBtn) addBtn.setAttribute("data-add-to-quote", product.id);

  // Tipos de negocio
  const businessEl = document.getElementById("productBusinessTypes");
  if (businessEl) {
    businessEl.innerHTML = product.businessTypes
      .map((id) => getBusinessTypeById(id))
      .filter(Boolean)
      .map((bt) => `<span class="badge">${bt.name}</span>`)
      .join("");
  }

  // Relacionados
  const relatedEl = document.getElementById("relatedProducts");
  if (relatedEl) {
    const related = getRelatedProducts(product, 4);
    renderProductGrid(relatedEl, related);
    const relatedSection = document.getElementById("relatedSection");
    if (relatedSection) relatedSection.hidden = related.length === 0;
  }

  injectProductSchema(product, category);
}

/**
 * Inserta datos estructurados Product + BreadcrumbList en <head> a
 * partir de los datos reales del producto. No se incluye "offers"
 * porque los precios de esta fase son demostrativos (ver README).
 */
function injectProductSchema(product, category) {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: product.name,
        description: product.shortDescription,
        category: category ? category.name : undefined,
        image: product.images.map((src) => new URL(src, window.location.href).href),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: new URL("index.html", window.location.href).href },
          {
            "@type": "ListItem",
            position: 2,
            name: category ? category.name : "Catálogo",
            item: new URL(`catalogo.html?cat=${category ? category.id : ""}`, window.location.href).href,
          },
          { "@type": "ListItem", position: 3, name: product.name },
        ],
      },
    ],
  };
  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

document.addEventListener("DOMContentLoaded", () => {
  initCategoryGrid();
  initBusinessGrid();
  initFeaturedGrid();
  initProductDetail();
});

function setMetaContent(selector, content) {
  const el = document.querySelector(selector);
  if (el) el.setAttribute("content", content);
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}
function setHtml(id, html) {
  const el = document.getElementById(id);
  if (el) el.innerHTML = html;
}

# FASE 5 — SEO Y PRODUCCIÓN

**Proyecto:** Jeinox GastroSystems
**Alcance ejecutado:** SEO técnico, SEO local, metadatos, indexación, Open Graph, Schema.org, robots.txt/sitemap.xml, página 404 y preparación para Netlify/Search Console. Sin cambios de identidad, diseño, colores, productos ni datos comerciales inventados.

---

## 1. Resumen ejecutivo

El sitio tenía una base técnica sólida (HTML semántico, 1 solo `<h1>` por página, sin claves/tokens expuestos, enlaces externos ya con `rel="noopener noreferrer"`, sin recursos externos que bloqueen el render), pero arrastraba un hallazgo crítico ya detectado en la auditoría inicial: **todas las etiquetas `canonical` y Open Graph apuntaban a un dominio inexistente** (`jeinoxgastronomic.example`), lo que rompía las vistas previas de WhatsApp/Facebook y confundía a Google. Tampoco existían `robots.txt`, `sitemap.xml` ni página 404. Se corrigieron los 9 archivos HTML, se agregó SEO dinámico por producto, se creó `robots.txt`/`sitemap.xml`/`404.html`, se amplió el JSON-LD a `Store` (SEO local) y se corrigieron 2 saltos reales de jerarquía de encabezados. No se inventó ningún dato comercial: todo lo agregado a Schema.org ya estaba confirmado y visible en el sitio (teléfonos, horario, coordenadas del mapa, redes sociales).

## 2. Estado inicial encontrado

- **Canonical/Open Graph con dominio placeholder `.example`** en las 9 páginas (hallazgo ya documentado en la auditoría inicial, sección 7.1, severidad ALTA). El propio `README.md` citaba además un dominio placeholder *distinto* (`gastroequipos-peru.example`), inconsistente con el que realmente estaba en el HTML.
- `og:image` de `index.html` apuntaba a un SVG (`logo.svg`) con URL relativa — Facebook/WhatsApp no garantizan soporte de SVG y una URL relativa no funciona al leerse desde fuera del dominio.
- `producto.html` no tenía `og:description`, `og:url` ni `og:image`; el canonical y el Open Graph eran genéricos y no se actualizaban por producto (hallazgo ya documentado, sección 7.3, severidad ALTA).
- `twitter:card` en modo `summary` (imagen pequeña) en vez de `summary_large_image`. `privacidad.html` y `libro-reclamaciones.html` no tenían Open Graph/Twitter en absoluto.
- No existían `robots.txt`, `sitemap.xml` ni página `404.html`.
- El JSON-LD de `index.html` era `Organization` genérico: no incluía geolocalización, dirección, horario ni tipo de negocio local (sin señal de SEO local / `LocalBusiness`).
- Meta description de `index.html` con 227 caracteres (Google trunca ≈155-160).
- **2 saltos reales de jerarquía de encabezados** (no solo cosméticos): `catalogo.html` y `proyectos.html` saltaban de `<h1>` directo a `<h3>` sin `<h2>` intermedio; además, el encabezado de las 3 columnas del footer (“Empresa”, “Productos”, “Soporte”) era `<h4>` en las 10 páginas, generando un salto `H2→H4` (o `H1→H4`) en todas ellas.
- Sin novedades en: imágenes (todas con `alt` real, `width`/`height`, `loading` correcto desde Fase 4), enlaces externos (ya con `rel="noopener noreferrer"`), Google Maps (responsive, con `title`, sin romper layout), datos NAP (nombre consistente "Jeinox GastroSystems" en las 9 páginas, confirmado en Fase 2), seguridad (sin API keys/tokens/credenciales en el código).

## 3. Cambios realizados

1. Reemplazado el dominio placeholder `.example` por un dominio de trabajo real y consistente: `https://jeinox-gastrosystems.netlify.app` en `canonical`, `og:url`, `og:image` y el JSON-LD de las 9 páginas, más `robots.txt` y `sitemap.xml`. **Este dominio debe confirmarse con el cliente antes de publicar** (ver sección 18).
2. `og:image`/`twitter:image` cambiados de un SVG con ruta relativa a `assets/images/branding/logo-mark.webp` (imagen real ya existente en el proyecto) con URL absoluta, en las 9 páginas y en `404.html`.
3. Agregado `og:site_name` y subido `twitter:card` a `summary_large_image` en todas las páginas; agregado Open Graph/Twitter completo a `privacidad.html` y `libro-reclamaciones.html`, que no tenían ninguno.
4. `producto.html`: agregado Open Graph/Twitter estático completo (antes incompleto) **y** SEO dinámico por producto en `js/products.js` (`initProductDetail`): al cargar cada ficha, se actualizan en el DOM el `<link rel="canonical">`, `og:title`, `og:description`, `og:url`, `og:image`, `twitter:title`, `twitter:description` y `twitter:image` con los datos reales del producto (nombre, descripción corta, foto real). Ver limitación importante en la sección 6.
5. Reescrita la meta description de `index.html` a 154 caracteres, natural y sin *keyword stuffing*, cubriendo línea caliente/fría, acero inoxidable, fabricación a medida y WhatsApp.
6. Ampliado el JSON-LD de `index.html` de `Organization` a `Store` (ver sección 7), con `geo`, `address`, `openingHoursSpecification` y `areaServed`, usando solo datos ya confirmados en el propio sitio.
7. Creados `robots.txt`, `sitemap.xml` (21 URLs: home, catálogo, nosotros y los 18 productos visibles) y `404.html`.
8. Corregidos 2 saltos reales de jerarquía de encabezados: `<h2 class="visually-hidden">` agregado antes de las grillas de `catalogo.html` y `proyectos.html`; encabezados de columna del footer cambiados de `<h4>` a `<h3 class="h4">` (o `<h2 class="h4">` en las 3 páginas sin ningún `<h2>` en el contenido), preservando el tamaño visual exacto mediante la clase `.h4` ya existente.
9. Corregido un efecto colateral propio: `.footer-col h4` en `css/styles.css` era un selector por etiqueta; al cambiar la etiqueta del encabezado dejó de aplicarse el color blanco, volviendo el texto casi invisible sobre el fondo oscuro del footer. Se amplió el selector a `.footer-col h4, .footer-col .h4` y se verificó visualmente que el footer quedó pixel-idéntico al original.
10. CTA de WhatsApp en `cotizacion.html`: texto cambiado de "WhatsApp +51 943 688 374" a "Cotizar por WhatsApp +51 943 688 374" (y análogo para el segundo número), para que el botón indique la acción, no solo el canal.
11. Actualizada la sección de dominio/imágenes del `README.md`, que estaba desactualizada desde la Fase 0 (mencionaba un dominio placeholder distinto al real del código y placeholders SVG de producto que ya no existen desde la Fase 4).

## 4. SEO técnico

| Elemento | Estado |
|---|---|
| 1 solo `<h1>` por página | ✅ Correcto (ya lo estaba) |
| Jerarquía de encabezados sin saltos (H1→H2→H3→H4) | ✅ Corregido (2 saltos reales encontrados y corregidos, ver sección 3.8) |
| `canonical` con dominio real y consistente | ✅ Corregido en las 9 páginas |
| `canonical`/Open Graph dinámico en `producto.html` | ✅ Implementado (beneficia a Google; ver limitación en sección 6) |
| `robots.txt` | ✅ Creado |
| `sitemap.xml` | ✅ Creado (21 URLs) |
| Página 404 | ✅ Creada, con identidad de marca y botón a inicio |
| Recursos que bloqueen el render | ✅ Correcto (sin fuentes externas, sin scripts síncronos en `<head>`) |
| Enlaces internos rotos | ✅ 0 encontrados (39 verificados) |
| Contenido duplicado / vistas filtradas indexables | ✅ Correcto: `catalogo.html?cat=`/`?business=` canonicaliza a la URL base, evitando duplicados |

## 5. SEO local

- JSON-LD ampliado a `"@type": "Store"` (ver sección 7) — más preciso que `Organization` genérico para un negocio con tienda física y ventas de equipos.
- Contenido ya existente reforzado de forma natural (sin *keyword stuffing* nuevo): "equipos gastronómicos", "línea caliente", "línea fría", "acero inoxidable", "cocinas industriales" y "Lima, Perú" ya aparecen de forma orgánica en `index.html`, `nosotros.html` y las fichas de producto.
- `areaServed: "PE"` y `addressLocality: "Lima"` en el schema, consistentes con el texto ya confirmado ("Fabricamos en Lima y realizamos envíos a todo el Perú").
- **No se creó ni sugirió perfil de Google Business** (fuera de alcance de esta fase; se detalla como paso manual en la sección 19).

## 6. Meta tags implementados

Por página (`index`, `catalogo`, `producto`, `cotizacion`, `nosotros`, `garantia`, `proyectos`, `privacidad`, `libro-reclamaciones`, `404`): `title`, `meta description`, `canonical`, `robots`, `og:type`, `og:site_name`, `og:title`, `og:description` (donde aplica), `og:locale`, `og:url`, `og:image` (+ `width`/`height` en home y catálogo), `twitter:card=summary_large_image`, `twitter:title`/`description`/`image`.

**Limitación técnica importante (transparencia):** WhatsApp, Facebook y la mayoría de *crawlers* de vista previa **no ejecutan JavaScript** al leer un enlace: solo leen el HTML estático. Por eso, aunque `js/products.js` actualiza el Open Graph de cada producto en el navegador (lo cual sí beneficia a Google, que sí renderiza JS antes de indexar), **compartir un link de `producto.html?slug=X` por WhatsApp seguirá mostrando el Open Graph genérico estático** (logo de Jeinox), no la foto del producto específico. Solucionar esto de forma completa requeriría generar una página HTML estática por producto (SSR/build step), lo cual está explícitamente fuera de alcance de esta fase ("no migrar frameworks", "no rediseñar arquitectura"). Se documenta como recomendación futura en la sección 20.

## 7. Datos estructurados

`index.html` incluye 2 bloques JSON-LD, ambos validados sintácticamente:

- **`Store`** (antes `Organization`): `name`, `url`, `logo`, `image`, `email`, `telephone`, `hasMap`, `geo` (coordenadas reales del mapa embebido: -12.044493, -77.0409056), `address` (solo `addressLocality: "Lima"` y `addressCountry: "PE"` — **sin calle ni código postal**, porque esos datos nunca fueron confirmados por el cliente y esta fase tiene prohibido inventarlos), `areaServed: "PE"`, `openingHoursSpecification` (Lunes a sábado 09:00–20:00, dato ya confirmado en Fase 2), `sameAs` (TikTok + Facebook reales) y `contactPoint` (ambos teléfonos).
- **`FAQPage`**: sin cambios (ya existía y es correcto).
- `producto.html` sigue inyectando `Product` + `BreadcrumbList` por JavaScript vía `injectProductSchema()` (sin cambios; ya funcionaba bien desde antes). No se agregó `offers`/precio: sigue siendo una decisión consciente porque el modelo de precios de este sitio es "cotizar", no venta directa.

## 8. Sitemap

`sitemap.xml` creado con **21 URLs**: `/` (home), `/catalogo.html`, `/nosotros.html` y las 18 fichas de producto con `visible: true` (`/producto.html?slug=...`). **No se incluyeron** `cotizacion.html`, `garantia.html`, `proyectos.html`, `privacidad.html` ni `libro-reclamaciones.html`, porque las 5 tienen `<meta name="robots" content="noindex, ...">` — listar una página `noindex` en el sitemap es una señal contradictoria que Search Console reporta como advertencia. Los 11 productos con `visible: false` (sin fotos reales aún) tampoco se incluyeron, consistente con que ya están ocultos del catálogo y de la ficha pública.

## 9. Robots.txt

```
User-agent: *
Allow: /

Sitemap: https://jeinox-gastrosystems.netlify.app/sitemap.xml
```

Permite indexación completa; no bloquea CSS, JavaScript, imágenes ni ninguna página. La ruta del sitemap usa el mismo dominio de trabajo que el resto del sitio (ver sección 18 sobre confirmar el dominio real).

## 10. Optimización de imágenes

Sin cambios adicionales más allá de lo ya logrado en la Fase 4 (variantes responsivas WebP, `srcset`/`sizes`, `fetchpriority` solo en el LCP real). Revisado en esta fase:

- `alt` descriptivo y distinto por producto (`"{nombre del producto} — imagen referencial"`) — no genérico ni repetido, sin ser excesivamente largo. ✅ Correcto, sin cambios necesarios.
- Imágenes decorativas (categorías dentro de un enlace ya rotulado por texto) usan `alt=""` correctamente. ✅ Correcto.
- `width`/`height` presentes en todas las imágenes. ✅ Correcto (ya desde Fase 4).
- Ninguna imagen crítica del hero usa lazy loading que perjudique el LCP — el hero de `index.html` no tiene imagen (LCP es el `<h1>` de texto, confirmado por medición real en Fase 4). ✅ Correcto.
- No se encontraron imágenes de producto o categoría sin usar (ver auditoría de la Fase 4).

## 11. Accesibilidad

| Elemento | Estado |
|---|---|
| Jerarquía de encabezados | ✅ Corregido en esta fase (ver sección 3) |
| `aria-label` en botones/enlaces con solo ícono | ✅ Correcto (ya verificado en Fase 3) |
| Navegación con teclado (menú móvil, foco, Escape) | ✅ Correcto (re-verificado, sin regresión) |
| `focus-visible` / skip link | ✅ Correcto (re-verificado) |
| Contraste | ✅ Sin cambios de color en esta fase; no se detectaron nuevos problemas |
| Google Maps con `title` descriptivo | ✅ Correcto |
| Imágenes con `alt` | ✅ Correcto |

## 12. Rendimiento

No se tocó CSS ni JavaScript de rendimiento más allá de lo estrictamente necesario para el SEO dinámico por producto (adición pequeña y acotada en `initProductDetail`, sin loops ni recursos nuevos). Se mantiene íntegro el trabajo de la Fase 4: `srcset`/`sizes` responsivos, `fetchpriority="high"` solo en el LCP real de cada página, lazy loading en el resto. No se realizó una nueva medición Lighthouse en esta fase porque no se modificó ningún recurso que afecte peso de página, CSS o JS de forma sustancial; los números de la Fase 4 (reducción de 60-88% en peso de imágenes, LCP de catálogo de 228ms a 136ms en desktop) siguen vigentes.

## 13. WhatsApp

- Ambos números (`+51 943 688 374` y `+51 926 669 669`) verificados: generan URLs `https://wa.me/{numero}?text=...` con `encodeURIComponent` correcto (re-verificado con la suite de la Fase 2, sin cambios de comportamiento).
- Mensaje automático correcto tanto desde "Mi cotización" (lista de equipos) como desde el formulario de fabricación a medida.
- Funciona igual en escritorio (abre `wa.me` en pestaña nueva) y en móvil (abre la app si está instalada).
- CTA mejorado en `cotizacion.html`: "Cotizar por WhatsApp +51 943 688 374" en vez de solo "WhatsApp +51 943 688 374", indicando la acción explícitamente.
- El resto de CTAs del sitio ("Cotizar equipos", "Solicitar cotización", "Solicitar cotización por WhatsApp") ya eran claros y no requirieron cambios.

## 14. Google Maps

Sin cambios: el `<iframe>` ya usa las coordenadas reales (-12.044493, -77.0409056), tiene `title` descriptivo, `loading="lazy"` (apropiado, está debajo del pliegue), `referrerpolicy="no-referrer-when-downgrade"` y es responsive (re-confirmado sin overflow en 320-1920px). El enlace "Abrir en Google Maps" usa el enlace corto real (`maps.app.goo.gl`) con `rel="noopener"`. ✅ Correcto, sin cambios necesarios.

## 15. Redes sociales

TikTok y Facebook (URLs reales y confirmadas) verificados en las 9 páginas: `target="_blank"` + `rel="noopener noreferrer"` presentes en todos los casos, sin excepción. ✅ Correcto, sin cambios necesarios.

## 16. Errores corregidos

1. Dominio placeholder inexistente (`.example`) en canonical/Open Graph — 9 páginas.
2. `og:image` en formato/ruta no confiable para redes sociales (SVG relativo) — reemplazado por WebP absoluto.
3. `producto.html` sin Open Graph completo (faltaban `og:description`, `og:url`, `og:image`).
4. `privacidad.html` y `libro-reclamaciones.html` sin ningún Open Graph/Twitter.
5. Ausencia de `robots.txt`, `sitemap.xml` y página 404.
6. 2 saltos reales de jerarquía de encabezados (`catalogo.html`, `proyectos.html`) + salto sistemático del footer en las 10 páginas.
7. Efecto colateral propio: regla CSS `.footer-col h4` dejó de aplicar tras el cambio de etiqueta semántica — corregido en el mismo cambio, verificado visualmente sin diferencia respecto al diseño original.
8. Meta description de `index.html` demasiado larga (227 caracteres) — reescrita a 154.
9. `README.md` con un dominio placeholder distinto al que realmente usaba el código (inconsistencia documental).

## 17. Archivos modificados

- `index.html`, `catalogo.html`, `producto.html`, `cotizacion.html`, `nosotros.html`, `garantia.html`, `proyectos.html`, `privacidad.html`, `libro-reclamaciones.html` — metadatos (canonical/OG/Twitter), footer (`h4`→`h3`/`h2`), y encabezado oculto en catálogo/proyectos.
- `js/products.js` — SEO dinámico por producto (`initProductDetail`) + helper `setMetaContent`.
- `css/styles.css` — 1 línea: selector `.footer-col h4` ampliado a `.footer-col h4, .footer-col .h4`.
- `README.md` — sección de dominio/imágenes actualizada.
- **Nuevos:** `robots.txt`, `sitemap.xml`, `404.html`.

No se modificó `data/products.js`, ningún producto, precio, testimonio, ni ninguna imagen fotográfica.

## 18. Elementos pendientes de confirmar con el cliente

- ⚠️ **Confirmar el dominio real de publicación.** Se usó `https://jeinox-gastrosystems.netlify.app` como dominio de trabajo (siguiendo la instrucción recibida), pero esto **no se pudo verificar de forma independiente** (no hay `netlify.toml` ni configuración de sitio conectada en el repositorio). Si el subdominio de Netlify real es distinto, o si ya existe un dominio propio, hay que reemplazarlo en los 9 archivos HTML, `robots.txt` y `sitemap.xml` (búsqueda y reemplazo simple, documentado en el `README.md`).
- ⚠️ Contenido real de `garantia.html` (cobertura exacta, exclusiones, detalle de servicio técnico) — pendiente desde Fase 1/2, sigue en `noindex`.
- ⚠️ Proyectos reales para `proyectos.html` (actualmente son ejemplos/placeholders) — sigue en `noindex`.
- ⚠️ Contenido legal definitivo de `privacidad.html` y `libro-reclamaciones.html` (razón social, RUC, tratamiento de datos) — pendiente desde Fase 1, sigue en `noindex`.
- ⚠️ La imagen Open Graph general (`logo-mark.webp`, 240×240) es funcional pero menor al tamaño ideal recomendado por Facebook/Twitter (1200×630). Se usó por ser la única imagen de marca cuadrada ya aprobada y existente en el proyecto, siguiendo la instrucción de no inventar/diseñar gráficos nuevos en esta fase. Se recomienda encargar una imagen de 1200×630 dedicada para compartir en redes (ver sección 20).
- ⚠️ Limitación arquitectónica: WhatsApp/Facebook no mostrarán la foto específica de cada producto al compartir su link (ver sección 6) mientras el sitio sea 100% estático sin build step.

## 19. Pasos para Google Search Console

1. Publicar la web en su URL definitiva (Netlify o dominio propio).
2. Entrar a [Google Search Console](https://search.google.com/search-console).
3. Añadir la propiedad (tipo "Prefijo de URL", con la URL real de publicación).
4. Verificar la propiedad (Netlify permite verificación por archivo HTML o por meta tag; con dominio propio también existe verificación por DNS).
5. Enviar `sitemap.xml` desde la sección "Sitemaps" de Search Console.
6. Usar "Inspección de URLs" sobre la URL principal (`/`) para confirmar que Google puede rastrearla e indexarla.
7. Solicitar indexación manual de la URL principal y, opcionalmente, de `catalogo.html` y de las fichas de producto más relevantes.

## 20. Recomendaciones posteriores al lanzamiento

- Confirmar el dominio real y actualizar canonical/OG/`sitemap.xml`/`robots.txt` en consecuencia (ver sección 18).
- Encargar una imagen Open Graph de 1200×630 dedicada a marketing/diseño (no generada en esta fase por ser una decisión de diseño, no una corrección técnica).
- Si a futuro se prioriza que cada producto se vea con su propia foto al compartirse por WhatsApp/Facebook, evaluar una página estática por producto generada en build time (SSG) — implicaría introducir un paso de build, hoy explícitamente fuera de alcance.
- Configurar Google Business Profile con el mismo nombre "Jeinox GastroSystems", mismos teléfonos y el mismo enlace de Google Maps ya usado en el sitio, para reforzar el SEO local.
- Una vez el cliente confirme los datos pendientes de `garantia.html`/`proyectos.html`/`privacidad.html`/`libro-reclamaciones.html`, quitarles `noindex` e incluirlos en `sitemap.xml`.
- Evaluar Google Analytics/Tag Manager si el cliente quiere medir tráfico (no incluido: requiere decisión del cliente sobre cookies/privacidad).

## 21. Estado final

- ✅ Lista para producción (en cuanto se confirme el dominio real, ver sección 18)
- ✅ Responsive (0 desbordamientos reales en 320-1920px, re-verificado tras todos los cambios de esta fase)
- ✅ Optimizada para SEO técnico (canonical, meta tags, jerarquía de encabezados, sitemap, robots)
- ✅ Preparada para indexación (`robots.txt` + `sitemap.xml` con 21 URLs reales)
- ✅ Compatible con Google Search Console (pasos documentados en sección 19)
- ✅ Con sitemap y robots.txt
- ✅ Con Schema.org (`Store` + `FAQPage` + `Product`/`BreadcrumbList` por producto)
- ⚠️ Correcta al compartir por WhatsApp/Facebook **para páginas generales** (home, catálogo, nosotros, etc.); **limitada para fichas de producto individuales** por la naturaleza estática del sitio (ver sección 6)
- ✅ Con CTA de WhatsApp operativo y con texto de acción claro
- ✅ Sin datos empresariales inventados (todo lo agregado a Schema.org ya estaba confirmado y visible en el sitio)
- ✅ Sin afectar la identidad visual existente (verificado con captura de pantalla del footer antes/después)

---

No se realizaron cambios de dominio/DNS, hosting, Google Search Console, canonical final ni SEO post-lanzamiento (quedan como pasos manuales del cliente, sección 19). No se modificó diseño, colores, tipografías, productos, precios, testimonios, proyectos, ni se inventó ningún dato comercial, dirección, certificación o reseña.

Rama de trabajo: `claude/gifted-goldberg-54hj0c`. Archivos modificados listados en la sección 17. **Lista para revisión y, si el cliente lo autoriza, para hacer merge a `main`** una vez confirmado el dominio real de publicación (sección 18).

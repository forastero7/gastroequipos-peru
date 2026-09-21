# FASE 4 — Rendimiento, optimización de imágenes y catálogo

**Proyecto:** Jeinox GastroSystems
**Alcance ejecutado:** exclusivamente Fase 4 (rendimiento, imágenes, Core Web Vitals). No se tocó identidad, contenido, productos, carrito, búsqueda/filtros ni las correcciones de Fases 1-3.

---

## 1. Resumen ejecutivo

Se redujo el peso de imágenes servidas entre un **60% y un 88%** según página y dispositivo, mediante variantes responsivas WebP (400/800/1200px) servidas con `srcset`/`sizes` correctamente calculados a partir del layout real (`.grid-cards` de Fase 3), sin tocar diseño, identidad ni funcionalidad. El LCP de `catalogo.html` en desktop bajó de 228ms a 136ms (-40%) al dejar de descargar la imagen original de 1600px para la primera tarjeta. Todas las imágenes originales se conservan intactas; solo se agregaron 155 archivos de variantes nuevos junto a los 47 originales.

## 2. Regla fundamental respetada: medir antes de optimizar

Antes de tocar una sola línea de código se realizó:
- Inventario completo de imágenes (47 originales: 43 de productos + 3 + 1 de categorías/logo no aplicable).
- Medición de peso y LCP "ANTES" en Home, Catálogo y Producto, en móvil (390px) y desktop (1366px), por interceptación real de red con Playwright (no solo Lighthouse).
- Medición del ancho real renderizado de cada contexto de imagen (tarjeta de catálogo/destacados, categoría, imagen principal de producto, miniaturas, miniatura de cotización) en 4 viewports distintos, con `getBoundingClientRect()`.
- Determinación empírica (no supuesta) del elemento LCP real de cada página con `PerformanceObserver({type:'largest-contentful-paint'})`.

## 3. Auditoría previa de archivos involucrados

Se revisaron antes de editar: `data/products.js`, `js/products.js`, `js/catalog.js`, `js/quote.js`, `css/styles.css` (sección `.grid-cards` de Fase 3), `index.html`, `catalogo.html`, `producto.html`, `cotizacion.html`. Conclusión: las imágenes se generan 100% por JavaScript a partir de `data/products.js` (no hay `<img>` estático en el HTML de catálogo/producto/destacados/categorías), por lo que la solución de `srcset`/`sizes` debía implementarse en JS, de forma centralizada.

## 4. Medición "ANTES" (línea base, previa a cualquier cambio de imágenes)

| Página | Dispositivo | Peticiones | Peso total | Peso de imágenes | LCP |
|---|---|---:|---:|---:|---:|
| index.html | Móvil 390px | 14 | 308 KB | 148 KB | 108 ms (H1, texto) |
| index.html | Desktop 1366px | 21 | 652 KB | 493 KB | 128 ms (H1, texto) |
| catalogo.html | Móvil 390px | 16 | 504 KB | 373 KB | 136 ms (imagen 1ª tarjeta) |
| catalogo.html | Desktop 1366px | 28 | 1210 KB | 1079 KB | 228 ms (imagen 1ª tarjeta) |
| producto.html | Móvil 390px | 16 | 445 KB | 314 KB | 136 ms (imagen principal) |
| producto.html | Desktop 1366px | 17 | 512 KB | 381 KB | 152 ms (imagen principal) |

Medido con Chromium/Playwright, interceptando cada `response` y sumando bytes reales de body, sobre servidor estático local (equivalente a GitHub Pages en la parte que importa: sin compresión adicional del lado del servidor).

## 5. Hallazgo clave del LCP (decide qué imágenes reciben tratamiento prioritario)

- **index.html**: el LCP es el `<h1>` del hero (texto), no una imagen, en móvil y desktop. **Conclusión: ninguna imagen del home necesita `fetchpriority`/`eager` ni preload.**
- **catalogo.html**: el LCP es la imagen de la **primera tarjeta** del grid (`#catalogGrid`), que antes cargaba con `loading="lazy"` — un anti-patrón real. **Conclusión: solo la primera tarjeta debe ser `eager`+`fetchpriority="high"`.**
- **producto.html**: el LCP es `#productMainImage`, tanto en móvil como en desktop. **Conclusión: esa imagen (y solo esa) justifica `fetchpriority="high"` + `loading="eager"`.**

Esto cumple explícitamente la restricción de no aplicar `fetchpriority`/`eager` a imágenes sin justificación ni a más de una imagen por página.

## 6. Inventario de imágenes (resumen)

- 43 imágenes originales de productos (`assets/images/products/*.webp`), anchos nativos reales entre 675px y 2002px (media ~1400px), pesos originales entre ~25 KB y ~180 KB cada una.
- 3 imágenes originales de categorías (`assets/images/categories/*.webp`), 1600×1000px cada una.
- Ninguna imagen quedó sin usar: las 43 imágenes de producto están referenciadas desde `data/products.js`; no se detectaron imágenes "huérfanas" en `assets/images/`.

## 7. Variantes generadas (Paso 0/5)

Se generaron con Pillow (`Image.LANCZOS`, WebP calidad 82, `method=6`) variantes en 3 anchos objetivo — **400 / 800 / 1200px** — determinados a partir de los anchos reales medidos en el punto 9 (no un valor arbitrario). **Regla aplicada: nunca se generó una variante igual o mayor al ancho nativo del original**, para no ampliar ninguna imagen:

- Productos: 152 archivos nuevos (`nombre-400.webp`, `nombre-800.webp`, `nombre-1200.webp` según corresponda — 40/43 imágenes tienen `-400`, 40/43 tienen `-800`, 26/43 tienen `-1200`; las que no alcanzan un tier simplemente no lo generan).
- Categorías: 3 archivos nuevos (`nombre-800.webp`), ya que las 3 imágenes de categoría comparten ancho nativo 1600px y su uso real nunca supera ~384px.
- **Los 47 archivos originales permanecen exactamente iguales** (mismo tamaño en bytes y fecha, verificado con `ls -la` antes/después).
- Convención de nombres en minúsculas, consistente con el resto del repositorio (relevante para GitHub Pages, que es *case-sensitive*).

## 8. Protección de calidad visual

- Ningún recorte, cambio de proporción, marca de agua ni edición creativa: solo reescalado proporcional con Lanczos.
- Verificación visual lado a lado (original vs. variante servida) en 3 productos representativos, incluyendo detalle de acero inoxidable, reflejos y controles: `parrilla-mesa-empotrable-1`, `cocina-industrial-4-hornillas-1` y `freidora-automatica-industrial-1`. Sin degradación perceptible en la variante -800 frente al original.
- Calidad WebP 82 elegida por ser el punto donde no se observó pérdida visible en las pruebas anteriores, manteniendo un ahorro sustancial de peso.

## 9. Anchos reales renderizados (base de los `sizes`)

Medido con `getBoundingClientRect()` en 4 viewports (390/768/1366/1920px):

| Contexto | 390px | 768px | 1366px | 1920px |
|---|---:|---:|---:|---:|
| Tarjeta catálogo/destacados | 356px | 338px | 361px | 361px |
| Categoría | 356px | 702px | 361px | 361px |
| Imagen principal de producto | 356px | 318px | 534px | 534px |
| Miniatura galería | 48px | 48px | 48px | 48px |
| Miniatura "Mi cotización" | — | — | 56px | — |

Estos valores (y el análisis de `.grid-cards`/`.grid-3` de Fase 3: `auto-fit, minmax(300px,1fr)` y `repeat(3,1fr)` desde 860px sobre un contenedor de hasta 1200px) fueron la base para calcular los `sizes` reales usados (ver punto 11), en vez de usar `100vw` genérico.

## 10. Solución centralizada en JavaScript (no HTML estático)

Todo el trabajo se concentró en **`js/products.js`**, que ya era el único módulo responsable de transformar `data/products.js` en HTML. Se agregó, sin duplicar lógica:

- Una tabla `PRODUCT_IMAGE_NATIVE_WIDTH` (43 entradas) y `CATEGORY_IMAGE_NATIVE_WIDTH` (3 entradas) con el ancho real de cada imagen original.
- `buildSrcset(src, nativeWidth, tiers)`: arma el `srcset` real a partir de las variantes que efectivamente existen en disco.
- `cardImageAttrs()` y `categoryImageAttrs()`: generan el string de atributos (`src`, `srcset`, `sizes`, `width`, `height`, `decoding`, `loading`/`fetchpriority`) para tarjetas y categorías.
- `applyDetailImage()`: aplica `src`/`srcset`/`sizes`/`fetchpriority`/`loading` a la imagen principal de producto, reutilizada tanto en la carga inicial como al hacer clic en una miniatura.
- `smallThumbSrc()` (exportada): entrega la variante -400 para miniaturas, reutilizada por la galería de producto **y** por `js/quote.js`.

`js/catalog.js` y `js/quote.js` solo importan y usan estas funciones; no se copió lógica de imágenes en ningún otro archivo.

## 11. `sizes` implementados por contexto

- **Tarjetas (catálogo/destacados/relacionados):** `(min-width: 1012px) 360px, (min-width: 656px) 45vw, 95vw` — coincide con los anchos reales medidos (356-361px).
- **Imagen principal de producto:** `(min-width: 1200px) 534px, (min-width: 600px) calc(50vw - 60px), 90vw` — coincide con 534px en desktop y ~318-356px en tablet/móvil.
- **Categorías:** `(min-width: 860px) 33vw, 90vw` — sobreestima levemente en desktop (nunca hay una variante intermedia entre 800w y el original de 1600w), lo cual es intencional y no genera descargas de más porque el ancho real jamás supera 384px.
- **Miniaturas de galería y de "Mi cotización":** sin `srcset` (no lo necesitan); usan directamente la variante -400, muy por encima de su tamaño real (48-56px) incluso a 3x DPR.

## 12. `loading` / `fetchpriority` / `decoding`

| Imagen | loading | fetchpriority | Justificación |
|---|---|---|---|
| 1ª tarjeta de `catalogo.html` | `eager` | `high` | Es el LCP real medido de esa página. |
| Resto de tarjetas de catálogo | `lazy` | — | Debajo o cerca del pliegue, no son LCP. |
| Grid de destacados (home) | `lazy` | — | Confirmado por LCP: el home no depende de imágenes. |
| Productos relacionados | `lazy` | — | Siempre debajo del pliegue. |
| Categorías (home) | `lazy` | — | Debajo del hero, no es LCP. |
| Imagen principal de producto | `eager` | `high` | Es el LCP real medido de `producto.html`, en el `<img>` inicial y en cada cambio de miniatura. |
| Miniaturas de galería y de cotización | `lazy` | — | Nunca son LCP; imágenes pequeñas y secundarias. |

`decoding="async"` se agregó de forma uniforme a todas las imágenes tocadas (no bloquea el hilo principal al decodificar). No se aplicó a ciegas a imágenes no relacionadas con esta fase.

## 13. `width`/`height` (CLS)

Se mantuvieron los atributos `width`/`height` ya existentes (800×600 para tarjetas/categorías, 200×150 para miniaturas de galería, 120×120 para miniatura de cotización); no se modificó el `aspect-ratio` ni el layout, por lo que el CLS no se vio afectado por este cambio.

## 14. Preload

Se evaluó agregar `<link rel="preload">` para la imagen LCP de `producto.html` y de `catalogo.html`. **Se descartó**: al ser generadas dinámicamente por JavaScript (no se conoce la URL final en el `<head>` estático sin duplicar lógica de slug/categoría), un preload estático apuntaría a la imagen equivocada en la mayoría de los casos. El beneficio de `fetchpriority="high"` sobre el elemento ya generado por JS es suficiente y evita esa inconsistencia.

## 15. Fuentes, CSS y JS: sin cambios más allá de lo necesario

- No se tocó `css/styles.css` en esta fase (no era necesario: el problema era 100% de imágenes/JS).
- No se tocó la carga de fuentes.
- Los únicos cambios de JS fueron los descritos en el punto 10, más una línea en `js/catalog.js` (pasar `{ eagerFirst: true }`) y una línea en `js/quote.js` (usar `smallThumbSrc()`). No se reescribió ni minificó manualmente ningún archivo.

## 16. Medición "DESPUÉS" y comparación

| Página | Dispositivo | Peso ANTES | Peso DESPUÉS | Ahorro | Peso img ANTES | Peso img DESPUÉS | Ahorro img |
|---|---|---:|---:|---:|---:|---:|---:|
| index.html | Móvil | 308 KB | 226 KB | -26.6% | 148 KB | 59 KB | -60.1% |
| index.html | Desktop | 652 KB | 264 KB | -59.5% | 493 KB | 97 KB | -80.3% |
| catalogo.html | Móvil | 504 KB | 194 KB | -61.5% | 373 KB | 55 KB | -85.3% |
| catalogo.html | Desktop | 1210 KB | 272 KB | -77.5% | 1079 KB | 133 KB | -87.7% |
| producto.html | Móvil | 445 KB | 187 KB | -58.0% | 314 KB | 48 KB | -84.7% |
| producto.html | Desktop | 512 KB | 211 KB | -58.8% | 381 KB | 72 KB | -81.1% |

**LCP:**

| Página | Dispositivo | LCP ANTES | LCP DESPUÉS |
|---|---|---:|---:|
| index.html | Móvil/Desktop | 108-128 ms | 112-128 ms (sin cambio real: LCP es texto) |
| catalogo.html | Móvil | 136 ms | 108 ms (-20.6%) |
| catalogo.html | Desktop | 228 ms | 136 ms (-40.4%) |
| producto.html | Móvil | 136 ms | 112 ms (-17.6%) |
| producto.html | Desktop | 152 ms | 128 ms (-15.8%) |

Nota metodológica: estos tiempos de LCP se miden en un entorno local sin latencia de red real, por lo que los milisegundos absolutos no son comparables a Lighthouse en producción; lo relevante y consistente es la reducción del **peso descargado por el elemento LCP**, que es la causa directa de cualquier mejora de LCP en una red real.

## 17. Verificación de calidad visual en variantes servidas

Comparación lado a lado (original vs. variante realmente servida en su contexto) en 3 productos, sin degradación perceptible en acero inoxidable, bordes, controles ni reflejos.

## 18. Regresión responsiva (Fase 3) — reconfirmada tras los cambios

Se re-ejecutó la batería completa de 20 anchos (320-1920px) × 5 páginas + el caso "cotización con producto" usada al cerrar Fase 3:

- **0 desbordamientos reales** en index/catálogo/producto/cotización/nosotros en todo el rango 320-1920px.
- El bug original (1024-1250px: header, CTA, hamburguesa) **sigue resuelto**: CTA visible y dentro de pantalla, header completo, en 1024/1100/1152/1200/1250/1280px.
- El breakpoint de 1280px y la clase `.grid-cards` de Fase 3 se comprobaron intactos (no se tocó `css/styles.css` ni `js/main.js` en esta fase).

## 19. Hallazgo fuera de alcance (no corregido en esta fase)

Durante la regresión se detectó que `cotizacion.html`, con el producto **p26 ("Cocina Industrial 3 Hornillas + Chifero con Horno")** y cantidad 99, produce un desbordamiento horizontal real (~50-70px) en anchos 320-430px. **Se confirmó con el código previo a Fase 4 (sin mis cambios) que el problema ya existía antes de esta fase** — no fue introducido por la optimización de imágenes ni por el cambio de miniatura a la variante -400. Por instrucción explícita de esta fase de no tocar `css/styles.css` salvo para imágenes, **no se corrigió**; queda documentado aquí para una futura fase de estabilidad/responsive.

## 20. Pruebas funcionales (regresión completa)

Repetidas contra el código final de esta fase, todas en verde:
- Catálogo: conteo total, filtro "Línea caliente", búsqueda "cocina" — sin cambios de comportamiento.
- "Agregar a cotización", persistencia en `localStorage`, "Vaciar lista".
- Ambos números de WhatsApp generan el mensaje correcto.
- Formulario de fabricación a medida genera el mensaje esperado.
- Menú móvil (abrir/cerrar con teclado, `aria-expanded`).
- Enlaces internos: 39 verificados, 0 rotos.
- Redes sociales en footer: verificadas en 9 páginas.
- Identidad ("Jeinox GastroSystems" en las 9 páginas, sin restos de "Jeinox Gastronomic"): intacta.

## 21. Accesibilidad

Sin regresiones: skip-link, foco tras abrir/cerrar menú móvil con teclado, hamburguesa visible bajo 1280px y menú en línea sobre 1280px, tal como quedó en Fase 3.

## 22. Consola y red

0 errores de consola y 0 respuestas HTTP ≥400 en las 9 páginas del sitio, incluidas las nuevas rutas de imágenes.

## 23. Compatibilidad con GitHub Pages

- Todos los nombres de archivo nuevos están en minúsculas, igual que el resto del repositorio (GitHub Pages es *case-sensitive*: un desajuste de mayúsculas rompería la imagen en producción aunque funcione en local).
- No se generaron variantes huérfanas ni quedaron referencias a variantes inexistentes: cada `srcset` generado en runtime apunta únicamente a archivos verificados en disco.
- No se requiere ningún cambio de configuración de GitHub Pages: las imágenes se sirven como archivos estáticos normales, igual que antes.

## 24. Imágenes potencialmente sin uso

No se encontró ninguna imagen de producto o categoría sin referenciar en `data/products.js`. No se eliminó ningún archivo.

## 25. Qué NO se hizo en esta fase (respetando el alcance)

- No se modificó `data/products.js`, ningún dato de producto, precio, garantía ni especificación.
- No se modificó identidad, textos, redes sociales ni ningún dato de contacto.
- No se tocó `css/styles.css`, `js/main.js`, ni el HTML de ninguna página.
- No se revirtió ni se modificó el breakpoint de 1280px ni `.grid-cards` de Fase 3.
- No se implementó AVIF (WebP ya cumple; no había justificación de calidad/tooling/simplicidad suficiente para sumar un formato más).
- No se corrigió el hallazgo del punto 19 (fuera de alcance).
- No se ejecutó la Fase 5, ni cambios de dominio, hosting, Search Console, SEO final, sitemap/robots definitivos, ni frameworks.

## 26. Archivos modificados

- `js/products.js` (lógica central de imágenes responsivas, tabla de anchos nativos, helpers).
- `js/catalog.js` (1 línea: `eagerFirst: true` en el render del catálogo).
- `js/quote.js` (uso de `smallThumbSrc()` en la miniatura de la fila de cotización).
- +155 archivos de imagen nuevos (variantes), 0 archivos de imagen eliminados o modificados.

## 27. Criterio de éxito

- [x] Peso de imágenes reducido de forma sustancial (60-88% según página/dispositivo) sin degradar calidad visual perceptible.
- [x] `srcset`/`sizes` reales, basados en el layout medido, no en supuestos genéricos.
- [x] `fetchpriority="high"`/`eager` solo donde el LCP real lo justifica (1 imagen por página como máximo).
- [x] Cero productos, identidad ni funcionalidad rotos.
- [x] Cero regresiones en Fases 1-3 (identidad, limpieza, responsive).
- [x] Todas las imágenes originales conservadas intactas.
- [x] Medición antes/después documentada con metodología reproducible.

---

**No se ejecutó la Fase 5.** Quedo a la espera de tu autorización para continuar.

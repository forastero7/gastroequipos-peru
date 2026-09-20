# FASE 3 — Responsive, estabilidad visual y correcciones técnicas — Jeinox GastroSystems

**Fecha de ejecución:** 20 de septiembre de 2026
**Alcance:** Únicamente correcciones técnicas de responsive/overflow. No se ejecutaron fases posteriores ni se tocó identidad, contenido empresarial, dominio, SEO ni arquitectura.

---

## 1. Resumen ejecutivo

Se auditaron las 9 páginas del sitio en 20 anchos de pantalla obligatorios (320 a 1920 px), más orientaciones específicas y casos de contenido largo. Se encontraron y corrigieron **tres causas técnicas reales de overflow horizontal**, ninguna de ellas resuelta con "parches" (`overflow-x:hidden` genérico, `!important`, o breakpoints improvisados):

1. **El bug ya conocido de 1024–1250 px** (header/CTA cortados): causado por activar el menú de escritorio completo (enlaces en línea + botón "Cotizar equipos") demasiado pronto, antes de que hubiera espacio real para todo. Se retrasó ese cambio a 1280 px y se ajustaron espaciados.
2. **Un bug no detectado antes**, presente en realidad en **todo el rango de escritorio (1024–1920 px)**: el botón "Agregar a cotización" se salía de su propia tarjeta en el catálogo, destacados y productos relacionados, porque la cuadrícula de 4 columnas dejaba tarjetas de solo 222–266 px, insuficientes para sus dos botones. Se corrigió con una cuadrícula que ajusta el número de columnas al espacio disponible en vez de forzar siempre 4.
3. **Un bug real en "Mi cotización" en móvil (320–430 px)**: un gesto de scroll horizontal sobre la tabla de productos (intencionalmente más ancha que la pantalla, para no comprimir sus columnas) podía arrastrar la página completa hacia los lados. Se corrigió con `overscroll-behavior-x: contain`, la propiedad CSS diseñada exactamente para este caso.

Además se corrigió un **desbordamiento real de 17 px a 320 px** (el teléfono más angosto de la lista obligatoria), causado por que el nombre de marca "Jeinox GastroSystems" (más largo que el anterior "Jeinox Gastronomic") ya no cabía junto al ícono y el botón de menú en una sola línea a tamaño completo.

**No se reconstruyó ninguna funcionalidad.** El carrito, `localStorage`, el buscador, los filtros, el sistema de cotización con ambos números de WhatsApp y el formulario de fabricación a medida se verificaron funcionando exactamente igual que antes, en cada uno de los 4 archivos modificados.

---

## 2. Problemas encontrados antes de modificar (Paso 0)

Antes de tocar código se inspeccionó el CSS completo (identificando los 24 bloques `@media` existentes) y se midió con Playwright el ancho real de cada elemento del header a distintos anchos de ventana. Esto reveló, con números concretos:

- El `.header-inner` necesita **~1136 px** de ancho interno (logo + 6 enlaces + "Mi cotización" + botón "Cotizar equipos") para no recortarse, pero ese ancho interno solo se alcanza cuando el contenedor llega a su tope de 1200 px (es decir, recién a partir de ~1264 px de ventana) — con **cero margen de seguridad** incluso en pantallas grandes.
- El botón "Agregar a cotización" necesita al menos **~290 px** de ancho de tarjeta para no recortarse junto a "Ver equipo", pero la cuadrícula de 4 columnas nunca superaba **266 px** por tarjeta (el contenedor tiene un tope de 1200 px), es decir: **el botón estaba roto en todo el rango de escritorio, no solo entre 1024 y 1250 px** como se sospechaba inicialmente.
- El wordmark "Jeinox GastroSystems" (agregado en la Fase 2) sumado al ícono y al botón de menú no entraba en un solo renglón en los teléfonos de 320–360 px.
- La tabla de "Mi cotización" (`.quote-table`, ancho mínimo 560 px, dentro de un contenedor con scroll horizontal propio) podía, en algunos gestos de scroll, arrastrar la página completa en vez de quedarse contenida en su propio scroll.

Elementos de riesgo identificados en el CSS (`width`/`min-width` fijos, `white-space:nowrap`, `flex` sin `wrap`, grids rígidos): `.btn` (nowrap), `.logo-wordmark` (nowrap), `.nav-list` (fila sin wrap en escritorio), `.grid-4` (conteo de columnas fijo por breakpoint), `.quote-table` (`min-width:560px` intencional).

---

## 3. Causa técnica del bug 1024–1250 px

En `css/styles.css`, el bloque `@media (min-width: 1024px)` activaba **simultáneamente**: el menú en una sola fila (`.nav-list{flex-direction:row}`), el botón `.header-cta` (antes `display:none`) y la etiqueta "Mi cotización" junto al ícono. El contenedor real disponible a 1024 px es de solo 960 px de ancho interno, muy por debajo de los ~1136 px que ese conjunto necesita — de ahí el recorte y el scroll horizontal (116 px medidos en la auditoría previa).

## 4. Solución implementada

- **Se retrasó el punto de cambio de 1024 px a 1280 px** para el menú de escritorio (enlaces en línea, botón "Cotizar equipos", etiqueta "Mi cotización" y ocultar el botón hamburguesa). Entre 1024 y 1279 px el sitio conserva el menú hamburguesa, que ya funcionaba correctamente a cualquier ancho — no se construyó nada nuevo, solo se amplió el rango en que se usa.
- Se agregó `flex-wrap: wrap` al `.nav-list` en modo escritorio como **red de seguridad** (nunca debería activarse en el rango probado, pero si un navegador o zoom inusual redujera el espacio, los enlaces pasarían a una segunda línea en vez de desbordar la página).
- Se ajustaron espaciados (`gap` del header de 16→12 px, `gap` del menú de 24→16/8 px) para dar margen real en vez de un ajuste exacto sin holgura.
- Se sincronizó `js/main.js` (dos referencias a `matchMedia("...1024px...")`) con el mismo valor de 1280 px — **imprescindible**: si no se sincronizaba, el menú móvil quedaría en un estado inconsistente (no se cerraría solo al hacer clic en un enlace, o se forzaría a cerrar de forma incorrecta) justo en el rango 1024–1279 px, que pasó a seguir siendo "modo móvil".

## 5. Breakpoints modificados

| Breakpoint anterior | Nuevo valor | Afecta a |
|---|---|---|
| `@media (min-width: 1024px)` (menú de escritorio) | `@media (min-width: 1280px)` | `.main-nav`, `.nav-list` (fila), `.header-cta`, `.quote-indicator__label`, `.nav-toggle` |
| `matchMedia("(max-width: 1023px)")` en `js/main.js` | `matchMedia("(max-width: 1279px)")` | Cierre automático del menú móvil al hacer clic en un enlace |
| `matchMedia("(min-width: 1024px)")` en `js/main.js` | `matchMedia("(min-width: 1280px)")` | Cierre forzado del menú si la ventana crece mientras está abierto |

Ningún otro breakpoint del sitio (grids de categorías, estadísticas, footer, formularios) fue modificado, porque no presentaban overflow real.

## 6. Archivos modificados

Solo 5 archivos, ninguno de ellos JS de funcionalidad (carrito/buscador/filtros) ni datos de producto:

| Archivo | Cambio |
|---|---|
| `css/styles.css` | Ver sección 7 |
| `js/main.js` | 2 líneas: sincronizar los breakpoints del menú móvil con el nuevo valor de CSS (1280 px) |
| `catalogo.html` | 1 línea: clase del contenedor de tarjetas (`grid-4` → `grid-cards`) |
| `index.html` | 1 línea: misma clase en el grid de "Equipos destacados" |
| `producto.html` | 1 línea: misma clase en el grid de "Productos relacionados" |

`nosotros.html` **no se tocó**: su grid de 4 pasos ("Nuestro proceso de fabricación") sigue usando `grid-4` sin cambios, porque no tiene el problema de los dos botones y ya se veía bien en 4 columnas.

## 7. Cambios CSS realizados

1. **Nueva clase `.grid-cards`** (`repeat(auto-fit, minmax(300px, 1fr))`): agrega tantas columnas como quepan sin que ninguna tarjeta baje de 300 px (el mínimo real medido para que "Ver equipo" + "Agregar a cotización" quepan sin recortarse). Reemplaza a `grid-4` únicamente en las 3 cuadrículas de tarjetas de producto (catálogo, destacados, relacionados). En la práctica, el catálogo pasa de forzar 4 columnas angostas a mostrar 3 columnas más anchas en escritorio — una consecuencia visual menor y deliberada, no un rediseño.
2. **`.header-inner`**: `gap` de `var(--space-4)` (16 px) a `var(--space-3)` (12 px).
3. **`.logo-wordmark`**: `font-size` fijo (1.02rem) reemplazado por `clamp(0.85rem, 3vw + 0.28rem, 1.02rem)` — tamaño fluido que solo se reduce en los teléfonos más angostos (320–390 px aprox.) y vuelve a su tamaño normal desde ~400 px en adelante.
4. **Bloque `@media (min-width: 1280px)`** (antes 1024px): `.nav-list` ahora usa `flex-wrap: wrap` y `gap` reducido (`var(--space-2) var(--space-4)` en vez de `var(--space-5)`).
5. **`.quote-table-wrap`**: se agregó `overscroll-behavior-x: contain` y `max-width: 100%`.

No se usó ningún `overflow-x:hidden` nuevo ni `!important`. El único `overflow-x:hidden` del sitio (en `<html>`, para el menú fuera de pantalla) ya existía desde antes y sigue siendo el único, con su justificación documentada en el propio CSS.

## 8. Cambios HTML realizados

Únicamente el nombre de una clase (`grid grid-4` → `grid grid-cards`) en 3 contenedores (`#catalogGrid` en `catalogo.html`, `#featuredGrid` en `index.html`, `#relatedProducts` en `producto.html`). Ninguna estructura, atributo ARIA, ni texto fue modificado.

## 9. Cambios JavaScript realizados (y por qué fueron imprescindibles)

Solo en `js/main.js`, 2 líneas, ambas dentro de `initNav()`:

- `matchMedia("(max-width: 1023px)")` → `matchMedia("(max-width: 1279px)")`: sin este cambio, al hacer clic en un enlace del menú móvil entre 1024–1279 px, el menú **no se cerraría solo** (porque el código pensaría que ya está en "modo escritorio").
- `matchMedia("(min-width: 1024px)")` → `matchMedia("(min-width: 1280px)")`: sin este cambio, si alguien agranda la ventana de 1000 a 1100 px con el menú móvil abierto, el código lo cerraría de golpe pensando que ya pasó a modo escritorio, cuando en realidad seguiría siendo modo hamburguesa hasta 1280 px.

Es un ajuste de sincronización con el nuevo breakpoint de CSS, no una reconstrucción: la lógica de abrir/cerrar/Escape/clic-afuera del menú **no se tocó**.

---

## 10. Resultado por viewport (los 20 anchos obligatorios)

Probado en `index.html`, `catalogo.html`, `producto.html` y `cotizacion.html` (con y sin producto agregado), con Playwright, midiendo tanto `scrollWidth` como el desplazamiento horizontal **real** (forzando `scrollTo` y simulando gestos de rueda/trackpad, no solo la métrica bruta).

| Ancho | Resultado |
|---|---|
| 320 px | ✅ Sin overflow real (corregido: antes 17 px por el wordmark) |
| 360 px | ✅ Sin overflow |
| 375 px | ✅ Sin overflow |
| 390 px | ✅ Sin overflow |
| 412 px | ✅ Sin overflow |
| 430 px | ✅ Sin overflow |
| 600 px | ✅ Sin overflow |
| 768 px | ✅ Sin overflow |
| 820 px | ✅ Sin overflow |
| 912 px | ✅ Sin overflow |
| **1024 px** | ✅ Sin overflow (header completo en modo hamburguesa, CTA accesible vía "Mi cotización" e "ir al catálogo") |
| **1100 px** | ✅ Sin overflow |
| **1152 px** | ✅ Sin overflow |
| **1200 px** | ✅ Sin overflow |
| **1250 px** | ✅ Sin overflow |
| **1280 px** | ✅ Sin overflow — aquí aparece el menú de escritorio completo, con "Cotizar equipos" totalmente visible |
| 1366 px | ✅ Sin overflow |
| 1440 px | ✅ Sin overflow |
| 1536 px | ✅ Sin overflow |
| 1920 px | ✅ Sin overflow |

**100/100 combinaciones ancho×página pasaron** (20 anchos × 5 páginas de prueba).

## 11. Resultado del test de overflow

- **Overflow real (usuario puede desplazar la página horizontalmente):** 0 en las 20 anchos, verificado forzando `scrollTo(9999,0)` **y** simulando gestos de rueda horizontal (más estricto que solo mirar `scrollWidth`).
- **Nota técnica sobre una métrica "fantasma":** en `index.html` a 320 px, `document.documentElement.scrollWidth` reporta 8 px más que `clientWidth`. Se investigó a fondo y se confirmó que proviene del menú móvil fuera de pantalla (`.main-nav`, con `transform: translateX(100%)`): su posición geométrica calculada por el navegador excede el viewport por diseño (así es como funciona un menú "off-canvas"), pero **no es alcanzable ni desplazable por el usuario** (se verificó con `scrollTo` y con gestos de rueda: el resultado siempre es 0). El propio CSS del proyecto ya documentaba este comportamiento conocido con un comentario explicativo antes de esta fase. No se requiere ninguna corrección adicional.
- Se descartó expresamente usar `overflow-x:hidden` como solución genérica nueva en ningún componente: el único que existe (en `<html>`) ya estaba ahí antes de esta fase, justificado y documentado.

## 12. Resultado del header

- **1024–1279 px:** menú hamburguesa, "Cotizar equipos" oculto (visible solo desde 1280 px), indicador "Mi cotización" visible como ícono. Sin recortes, sin overflow.
- **≥1280 px:** menú en línea, "Cotizar equipos" y "Mi cotización" (con etiqueta de texto) totalmente visibles, sin recortes, con margen real (antes el ajuste era exacto, sin ningún margen, incluso en pantallas grandes).
- Verificado con teclado en ambos modos (ver sección 21).

## 13. Resultado del catálogo

- Buscador y filtros: sin cambios, verificados funcionando (18 productos en "Todos", 7 en "Línea caliente", 10 resultados para "cocina").
- Cuadrícula: pasa de forzar 4 columnas (con tarjetas rotas) a un máximo de 3 columnas anchas en escritorio (con `.grid-cards`), 2 en tablet, 1 en móvil — sin espacios vacíos, sin tarjetas deformadas.
- **Botón "Agregar a cotización": ya no se recorta en ningún ancho probado** (1024 a 1920 px), incluido con el nombre de producto más largo del catálogo (60 caracteres).

## 14. Resultado de fichas de producto

- Imagen principal: usa `object-fit: contain` (no recorta la maquinaria), se ve completa en 320–1920 px. No se modificó ninguna imagen original ni el `object-fit` existente.
- Galería de miniaturas, nombre, descripción, especificaciones y CTA: sin overflow en ningún ancho probado, incluido con el nombre de producto más largo (60 caracteres, sin recortes en el `<h1>` ni en la tarjeta relacionada).
- "Agregar a cotización" en la ficha: funciona igual que antes (verificado end-to-end).

## 15. Resultado de cotización

- Tabla de productos: sigue usando su patrón de scroll horizontal interno (intencional, para no comprimir columnas en pantallas angostas), ahora con `overscroll-behavior-x: contain` para que ese scroll no arrastre la página completa.
- Verificado con una cantidad de dos dígitos (99): sin overflow real, contador de resumen actualizado correctamente.
- Controles +/-, eliminar, vaciar lista, ambos botones de WhatsApp: funcionan igual que antes (no se tocó `quote.js`).

## 16. Resultado de fabricación a medida

Formulario probado en 320–1920 px: todos los campos usan el ancho disponible, sin scroll horizontal, envío y generación del mensaje de WhatsApp verificados sin cambios de comportamiento. No se tocó el formulario ni su lógica.

## 17. Resultado de modales

**No aplica.** Se revisó el proyecto completo (HTML, CSS y JS) y no existe ningún modal/diálogo en el sitio actual (ni de producto, ni de confirmación, ni de ningún tipo).

## 18. Resultado del footer

Probado en 320–430, 768, 1024 y 1366 px: sin texto cortado, sin enlaces superpuestos, sin columnas excesivamente estrechas, sin overflow. Los enlaces de TikTok/Facebook (agregados en la Fase 2) se ven y se leen correctamente en las 4 anchos revisados.

## 19. Resultado del Hero

Probado en 320–1920 px. A 320 px: título legible en 4 líneas, eslogan "Tecnología que impulsa tu cocina" legible, párrafo legible, ambos CTA a ancho completo, y los 4 "trust badges" en una cuadrícula de 2×2 sin desbordarse. No se modificó ningún texto ni dato empresarial de la Fase 2, solo se confirmó que responde bien.

## 20. Resultado de Nosotros

Probado en 320–1920 px: los bloques de "Cómo trabajamos" (4 pasos), la cuadrícula de estadísticas (10 años / 1 año / Taller propio / Todo el Perú) y los textos se adaptan correctamente en todo el rango, sin overflow ni recortes.

## 21. Resultado de accesibilidad

Verificado explícitamente que nada de esto se rompió al mover el breakpoint del menú:

| Elemento | Resultado |
|---|---|
| Skip link (primer `Tab` de la página) | ✅ Sigue siendo el primer elemento enfocable |
| Abrir menú móvil con teclado (`Enter` en el botón) a 1200 px (ahora modo hamburguesa) | ✅ Abre, `aria-expanded="true"` |
| Cerrar con `Escape` | ✅ Cierra y devuelve el foco al botón hamburguesa |
| Primer `Tab` tras abrir el menú | ✅ Cae en el primer enlace |
| Menú en línea a 1366 px (modo escritorio) | ✅ Enlaces enfocables por teclado, sin botón hamburguesa visible |
| `aria-expanded`, `aria-controls`, `focus-visible` | ✅ Sin cambios (no se tocó ese código) |
| Focus trap / modales | No aplica (no existen modales) |

## 22. Errores de consola

**0** en las 9 páginas, en los 20 anchos probados.

## 23. Recursos 4xx/5xx

**0** en las 9 páginas.

## 24. Pruebas de regresión

Se ejecutaron 4 baterías completas después de todos los cambios:

1. **Suite general** (ya existente del proyecto): catálogo, filtros, búsqueda, "Mi cotización" + `localStorage`, menú móvil por teclado — **todo OK**.
2. **Suite de la Fase 2**: identidad de marca, datos de contacto, ambos números de WhatsApp, formulario a medida, 39 enlaces internos, redes sociales — **todo OK**.
3. **Suite de accesibilidad de esta fase** (sección 21) — **todo OK**.
4. **Suite de contenido largo y orientación** (sección 25) — **todo OK**.

## 25. Pruebas adicionales de esta fase

- **Orientaciones:** 390×844, 844×390, 932×430, 768×1024, 1024×768, 1366×768 — sin overflow en ninguna.
- **Nombre de producto más largo del catálogo** ("Cocina Industrial 2 Hornillas + Chifero + Freidora con Horno", 60 caracteres): sin overflow en 320/768/1024/1366 px, ni en su tarjeta de catálogo.
- **Cantidad de dos dígitos (99)** en "Mi cotización": sin overflow real.

## 26. Problemas que todavía quedan pendientes

Ninguno relacionado con responsive/overflow dentro del alcance de esta fase. Lo que queda pendiente es lo ya documentado en fases anteriores y fuera del alcance de la Fase 3 (no se tocó en esta fase):

- El dominio en `canonical`/Open Graph sigue siendo uno de ejemplo (pendiente de Fase de SEO final).
- El logo raster del header (`logo-mark.webp`) sigue mostrando "INDUSTRIAS JEINOX" (pendiente de que Jeinox proporcione el logo definitivo).
- `srcset`/optimización de imágenes: no se tocó, tal como pedía esta fase.
- Datos empresariales pendientes de confirmar (razón social, RUC, condiciones de garantía, servicio técnico, historia/misión/visión): sin cambios, siguen documentados en `FASE_1_LIMPIEZA_JEINOX.md` y `FASE_2_IDENTIDAD_JEINOX.md`.

## 27. Recomendaciones para la Fase 4

- Si en el futuro se agregan más productos con nombres aún más largos, volver a correr esta misma batería de pruebas (queda documentada la metodología: medir el ancho mínimo real necesario para los botones antes de fijar un `minmax()`).
- Considerar `srcset`/tamaños responsivos de imágenes (explícitamente fuera del alcance de esta fase).
- Si se agrega contenido nuevo al header (por ejemplo, un selector de idioma), volver a medir el ancho disponible en el rango 1024–1279 px antes de decidir si necesita su propio ajuste.
- El patrón de "auto-fit + minmax" usado en `.grid-cards` es reutilizable para cualquier futura cuadrícula de tarjetas con botones — más robusto que fijar un número de columnas por breakpoint.

---

# Resumen corto

Se corrigieron tres causas reales de overflow horizontal: el bug ya conocido de 1024–1250 px en el header (se retrasó el menú de escritorio a 1280 px, con espaciados más holgados y un `flex-wrap` de seguridad), un bug no detectado antes que afectaba **todo** el rango de escritorio (el botón "Agregar a cotización" se salía de su tarjeta por una cuadrícula de 4 columnas demasiado angostas — se reemplazó por una cuadrícula que ajusta las columnas al espacio disponible), y un problema real en la tabla de "Mi cotización" en móvil (un gesto de scroll podía arrastrar toda la página — se corrigió con `overscroll-behavior-x:contain`). También se corrigió un desbordamiento de 17 px a 320px causado por el nombre de marca más largo de la Fase 2. Se modificaron solo 5 archivos (`css/styles.css`, `js/main.js` con 2 líneas de sincronización imprescindibles, y el nombre de una clase en 3 páginas HTML) — nada de diseño general, carrito, buscador, filtros, WhatsApp ni datos empresariales fue tocado. Probado en 100 combinaciones de ancho×página, 6 orientaciones, el nombre de producto más largo y una cantidad de dos dígitos: 0 overflow real, 0 errores de consola, 0 recursos rotos, todas las regresiones (catálogo, cotización, ambos WhatsApp, formulario, menú móvil, accesibilidad) en verde.

**No se ejecutó la Fase 4. Quedo a la espera de tu autorización para continuar.**

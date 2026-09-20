# FASE 2 — Unificación de identidad y datos reales de la empresa — Jeinox GastroSystems

**Fecha de ejecución:** 20 de septiembre de 2026
**Alcance:** Únicamente la Fase 2 (identidad de marca y datos empresariales confirmados). No se ejecutaron fases posteriores (responsive profundo, rendimiento, migración, dominio, SEO final, QA de entrega).
**Regla seguida:** solo se usó información marcada como "confirmada" en el encargo. Ningún dato no confirmado fue inventado, deducido ni redactado de forma genérica para simular que era real.

---

## 1. Resumen ejecutivo

El sitio usaba tres identidades distintas para la misma empresa: **"Jeinox Gastronomic"** (dominante en títulos, metadatos, footer y esquema de datos — 64 apariciones en 9 páginas), **"Jeinox GastroSystems"** (usada solo en la sección "Visítanos", el FAQ y el mensaje de WhatsApp del formulario de fabricación — 2 archivos) e **"INDUSTRIAS JEINOX"** (grabada en los píxeles del logo cuadrado del header, `logo-mark.webp`).

Se unificó todo el texto del sitio (títulos, metadatos, `aria-label`, `alt`, pie de página, esquema JSON-LD, FAQ, mensajes de WhatsApp) bajo el nombre oficial confirmado **Jeinox GastroSystems**, se actualizaron los dos logotipos que son SVG editables (`logo.svg`, `logo-light.svg`), y se integraron al sitio los datos empresariales confirmados en este encargo: eslogan, descripción, posicionamiento, 10 años de experiencia, infraestructura (fábrica/taller/showroom/tienda), horario, cobertura, medios de pago y redes sociales. El logo raster del header (`logo-mark.webp`) **no pudo actualizarse** porque su texto está grabado en los píxeles de la imagen, no es texto editable — queda documentado como pendiente.

No se reconstruyó ninguna funcionalidad: el carrito, el buscador, los filtros, `localStorage` y el sistema de cotización por WhatsApp con ambos números se verificaron funcionando exactamente igual que antes.

---

## 2. Archivos analizados (Paso 0 — auditoría previa)

Se leyeron completos, antes de editar nada:

- Las 9 páginas HTML (`index.html`, `catalogo.html`, `producto.html`, `cotizacion.html`, `garantia.html`, `nosotros.html`, `proyectos.html`, `privacidad.html`, `libro-reclamaciones.html`).
- Los 4 módulos JavaScript (`js/main.js`, `js/products.js`, `js/catalog.js`, `js/quote.js`).
- `data/products.js` (29 productos).
- `css/styles.css` (solo para entender clases existentes antes de reutilizarlas; no se modificó).
- Los 2 logotipos SVG (`assets/images/branding/logo.svg`, `logo-light.svg`) y el logo raster (`logo-mark.webp`), abriendo este último como imagen para confirmar qué texto contiene.

## 3. Apariciones encontradas de nombres antiguos

| Variante | Dónde aparecía | Cantidad |
|---|---|---|
| **"Jeinox Gastronomic"** | `<title>`, `og:title`, `twitter:title`, meta description, `aria-label` del logo, `alt` de las 2 imágenes de logo, el "wordmark" de texto junto al logo, el pie de página (copyright) y el nombre `"Organization"` del JSON-LD — en las 9 páginas HTML, más un comentario en `data/products.js` y el `document.title` dinámico en `js/products.js`. | 64 en HTML + 2 en JS/datos |
| **"Jeinox GastroSystems"** | Ya usada correctamente en: la sección "Visítanos" (`index.html`), una respuesta del FAQ (visible + su copia en el JSON-LD), y el mensaje de WhatsApp del formulario de fabricación a medida (`js/main.js`). | 2 archivos |
| **"INDUSTRIAS JEINOX"** | Grabada en los píxeles del logo cuadrado `assets/images/branding/logo-mark.webp`, usado en el header de las 9 páginas. No aparece como texto en ningún HTML/CSS/JS. | 1 imagen (ver sección "Logo") |
| "Industrias Jeinox" (minúsculas, como texto) | No se encontró en ningún archivo de texto. | 0 |

## 4. Cambios de identidad realizados

- Reemplazo de **"Jeinox Gastronomic" → "Jeinox GastroSystems"** en las 9 páginas HTML: `<title>`, `og:title`, `twitter:title`, meta description (donde mencionaba la marca), `aria-label="... — Inicio"`, `alt` de `logo-mark.webp` y de `logo-light.svg`, el "wordmark" de texto (`Jeinox <strong>GastroSystems</strong>`) y el copyright del pie de página.
- `data/products.js`: se actualizó el comentario de cabecera ("FUENTE ÚNICA DE DATOS del catálogo de Jeinox GastroSystems"). No se tocó ningún dato de producto.
- `js/products.js`: se actualizó el `document.title` que se genera dinámicamente para cada ficha de producto (`${producto} | Jeinox GastroSystems`). No se tocó ninguna otra lógica de ese archivo.
- `assets/images/branding/logo.svg` y `logo-light.svg`: son SVG con texto real (no imágenes rasterizadas), así que se editó el texto `<text>`/`<tspan>` de "Gastronomic" a "GastroSystems" y se amplió levemente el `viewBox` (de 280 a 300 de ancho) para que el nombre más largo no se recorte. El ícono y los colores no se tocaron.
- El JSON-LD `Organization` de `index.html` ahora dice `"name":"Jeinox GastroSystems"` y se le agregó `"sameAs"` con los enlaces a TikTok y Facebook.

## 5. Cambios de contenido realizados

- **Eslogan** "Tecnología que impulsa tu cocina" agregado una sola vez, como línea destacada bajo el `<h1>` del Hero de `index.html` (no se repitió en otras páginas, para no saturar).
- **Hero de `index.html`**: el párrafo principal ahora dice *"Fabricación de equipos gastronómicos en acero inoxidable, con soluciones automáticas y digitales, para restaurantes y negocios gastronómicos"* (antes no mencionaba fabricación directa ni automatización). Los 4 "trust badges" pasaron de textos genéricos ("Equipamiento profesional", "Atención especializada", "Envíos nacionales") a los datos confirmados: **"10 años de experiencia"**, "Fabricación a medida", **"Equipos automáticos y digitales"** y **"Envíos a Lima y todo el Perú"**.
- **Meta description y `og:description` de `index.html`**: reescritas para posicionar a Jeinox como fabricante ("Fabricante peruano de equipos gastronómicos profesionales...") en vez de un texto neutro que no aclaraba si fabrica o revende.
- **"Por qué elegirnos" (`index.html`)**: la estadística "Experiencia especializada" (vaga, sin número) se reemplazó por **"10 años" / "Experiencia"**. El texto de "Cobertura nacional" se ajustó a *"Fabricamos en Lima y realizamos envíos a todo el Perú"* para usar la frase exacta confirmada.
- **FAQ "¿Qué formas de pago aceptan?"** (visible y su copia en el JSON-LD, editadas juntas para que no queden desincronizadas): ahora dice *"Aceptamos Yape, Plin, tarjetas, efectivo y transferencia bancaria..."* en vez de la frase vaga "diferentes alternativas de pago".
- **FAQ "¿Los equipos tienen garantía?"** (visible y JSON-LD): se simplificó a *"Nuestros equipos cuentan con 1 año de garantía de fabricación. Las condiciones específicas se confirman antes de realizar la compra."* — se quitó la frase *"brindamos orientación sobre el uso y mantenimiento adecuado del equipo"*, porque el servicio técnico/postventa está explícitamente marcado como **pendiente de confirmación** en este encargo y esa frase podía leerse como una promesa de servicio no confirmada.
- **`nosotros.html`**: la frase inicial ahora es *"Jeinox GastroSystems es un fabricante peruano de equipamiento gastronómico profesional, con 10 años de experiencia en el rubro. Combinamos fabricación propia y a medida en acero inoxidable con tecnología aplicada a equipos automáticos y digitales."*, seguida de *"Contamos con fábrica, taller, showroom y tienda física, y realizamos envíos a Lima y a todo el Perú."* — usando únicamente datos confirmados en este encargo. La estadística "10 años" se reincorporó (en la Fase 1 se había quitado por no existir un número confirmado; ahora sí existe y se usó tal cual: **"10 años"**, nunca "+10 años").
- **`nosotros.html`, paso "4. Entrega"**: se quitó la palabra **"instalación"** de *"Coordinación de entrega e instalación según lo acordado"*, porque el servicio de instalación no está en la lista de datos confirmados (podía leerse como una promesa de servicio técnico no confirmada). Ahora dice *"Coordinación de entrega según lo acordado con cada cliente."*
- **Sección "Visítanos" (`index.html`)**: la ubicación del mapa ahora se identifica explícitamente como *"JEINOX GastroSystems — Tienda física"*, y se agregó una línea aparte: *"También contamos con fábrica, taller y showroom."* — sin inventar ninguna dirección para esa segunda ubicación, tal como exigía el encargo.
- **Redes sociales**: se agregó un bloque "TikTok" / "Facebook" en el pie de página de las 9 páginas (dentro del bloque de marca del footer, que ya existía), con `target="_blank"`, `rel="noopener noreferrer"` y `aria-label` descriptivo en cada enlace, como pedía el encargo. No se agregó Instagram ni ninguna otra red.

## 6. Datos empresariales unificados

| Dato | Estado encontrado | Acción |
|---|---|---|
| Teléfonos | Ya consistentes: `+51 943 688 374` y `+51 926 669 669` en las 9 páginas y en `js/quote.js`/`js/main.js`. | Verificado, sin cambios necesarios. |
| Correo | Ya consistente: `jeinox2020@gmail.com` en todas las páginas donde aparece. | Verificado, sin cambios necesarios. |
| Horario | Ya consistente: "Lunes a sábado: 9:00 a. m. – 8:00 p. m. Domingos y feriados: cerrado." en `index.html` y `garantia.html`, con el mismo texto exacto. | Verificado, sin cambios necesarios. |
| Garantía | Ya decía "1 año" en los 29 productos (`data/products.js`, sin tocar) y en `garantia.html` (ajustado en la Fase 1). | Se alinearon la portada y el FAQ con ese mismo dato ya existente. |
| Cobertura | Se usaba "Todo el Perú" y "diferentes regiones del Perú" con distinta redacción según la página. | Unificado a la frase confirmada "Lima y todo el Perú" / "Envíos a Lima y todo el Perú" donde correspondía. |
| Experiencia | No existía ningún número confirmado en el proyecto (se había quitado en la Fase 1 por esa razón). | Se agregó **"10 años"** (dato confirmado en este encargo) en 3 lugares: Hero de `index.html`, estadísticas de `index.html` y de `nosotros.html`. |
| Infraestructura | Solo se mencionaba "Taller propio" de forma aislada. | Se agregó la mención conjunta de fábrica, taller, showroom y tienda física (`nosotros.html`, sección "Visítanos"), aclarando que el mapa corresponde a la tienda física, sin inventar la dirección del taller/showroom. |
| Medios de pago | El FAQ decía solo "diferentes alternativas de pago", sin especificar. | Se reemplazó por la lista confirmada: Yape, Plin, tarjetas, efectivo y transferencia bancaria. |
| Redes sociales | No existían en el sitio. | Se agregaron TikTok y Facebook en el pie de página de las 9 páginas. |

## 7. Cambios en el header

- `aria-label` del logo: "Jeinox Gastronomic — Inicio" → "Jeinox GastroSystems — Inicio" (9 páginas).
- `alt` del logo cuadrado (`logo-mark.webp`): "Jeinox Gastronomic" → "Jeinox GastroSystems" (9 páginas). El texto grabado en la propia imagen sigue diciendo "INDUSTRIAS JEINOX" (ver sección de logo).
- Texto junto al logo ("wordmark"): "Jeinox **Gastronomic**" → "Jeinox **GastroSystems**" (9 páginas).
- Menú, botón "Cotizar equipos" e indicador "Mi cotización": sin cambios (ya funcionaban correctamente y no tenían texto de marca que unificar).

## 8. Cambios en el footer

- `alt` del logo claro (`logo-light.svg`): actualizado a "Jeinox GastroSystems" (9 páginas), y el propio SVG ahora dibuja el texto "GastroSystems" en vez de "Gastronomic".
- Copyright: "© 2026 Jeinox Gastronomic." → "© 2026 Jeinox GastroSystems." (9 páginas).
- Se agregaron los enlaces "TikTok" y "Facebook" bajo la descripción de la marca (9 páginas).
- El resto del footer (columnas Empresa/Productos/Soporte, enlace "Proyectos" oculto de la Fase 1, aviso de RUC/razón social ya retirado en la Fase 1) se dejó tal cual.

## 9. Cambios en el Hero

- Se agregó el eslogan "Tecnología que impulsa tu cocina" bajo el `<h1>`.
- Se reescribió el párrafo principal para mencionar fabricación propia, acero inoxidable y soluciones automáticas/digitales.
- Se actualizaron los 4 "trust badges" con datos confirmados (10 años de experiencia, fabricación a medida, equipos automáticos y digitales, envíos a Lima y todo el Perú), reutilizando la misma estructura visual existente (no se agregó ningún elemento nuevo al Hero).

## 10. Cambios en Nosotros

Ver detalle completo en la sección 5. En resumen: nueva frase inicial con posicionamiento confirmado (fabricante peruano, 10 años, fabricación propia y a medida, tecnología, automáticos y digitales), mención de fábrica/taller/showroom/tienda y cobertura, reincorporación de la estadística "10 años" (con las otras 3 ya reales: Garantía, Fabricación, Cobertura), y corrección del paso "Entrega" para no afirmar un servicio de instalación no confirmado. La sección "Historia / Misión / Visión" **sigue oculta**, tal como exigía el encargo (no se inventó historia, misión, visión, fundador, fecha de fundación, número de empleados, número de clientes ni número de proyectos).

## 11. Cambios relacionados con garantía

- No se modificaron las condiciones de garantía: sigue siendo únicamente **"1 año de garantía de fabricación"**, sin agregar cobertura, exclusiones, piezas, mano de obra, transporte, mantenimiento, condiciones de uso, tiempos de atención, reparación ni reemplazos — ninguno de esos datos está confirmado.
- Se quitó del FAQ la frase "brindamos orientación sobre el uso y mantenimiento adecuado del equipo" (ver sección 5), por ser una afirmación de servicio no confirmada.
- `garantia.html` sigue tal como quedó en la Fase 1: con `noindex, follow` y los bloques "Qué cubre / Qué no cubre / Servicio técnico" ocultos (no reactivados, porque siguen sin confirmarse).
- El texto de garantía de `index.html` (ya corregido en la Fase 1 para decir "1 año") no requirió cambios adicionales en esta fase.

## 12. Cambios relacionados con WhatsApp

- **No se modificó `js/quote.js`.** Se verificó (no se reconstruyó) que el sistema de "Mi cotización" sigue permitiendo elegir entre los dos números oficiales y que ambos generan una URL `wa.me` válida con el mensaje del carrito.
- El mensaje de WhatsApp del formulario de "Fabricación a medida" (`js/main.js`) ya decía correctamente "Jeinox GastroSystems"; se verificó que sigue siendo así y que se sigue generando y abriendo correctamente.
- Ambos números (`51943688374` y `51926669669`) se confirmaron sin cambios en `js/quote.js`.

## 13. Redes sociales incorporadas

| Red | Enlace | Ubicación |
|---|---|---|
| TikTok | `https://www.tiktok.com/@industrias.jeinox?_r=1&_t=ZS-99twYn4wOai` | Pie de página, bloque de marca (9 páginas) |
| Facebook | `https://www.facebook.com/share/1Ei9uzwXiP/` | Pie de página, bloque de marca (9 páginas) |

Ambos enlaces usan `target="_blank"`, `rel="noopener noreferrer"` y `aria-label` descriptivo ("Jeinox GastroSystems en TikTok" / "... en Facebook"), verificado por página. También se agregaron como `"sameAs"` en el JSON-LD `Organization` de `index.html`. No se agregó Instagram ni ninguna otra red.

## 14. Pruebas realizadas

1. Validación de sintaxis de las 9 páginas HTML (parseo sin errores).
2. Validación de sintaxis de los 4 módulos JS y de `data/products.js` (`node --check`).
3. Validación de que los 2 bloques JSON-LD de `index.html` siguen siendo JSON válido (`json.loads`).
4. Validación de que los 2 logos SVG siguen siendo XML válido tras la edición de texto.
5. Servidor local + navegador automatizado (Playwright/Chromium) en las 9 páginas, verificando:
   - Errores de consola y de red (4xx/5xx).
   - Ausencia total de "Jeinox Gastronomic" y presencia de "GastroSystems" en el `<title>` y en el texto visible de cada página.
   - Datos de contacto (ambos teléfonos, correo, horario) visibles y correctos en "Visítanos".
   - La aclaración "Tienda física" y la mención de fábrica/taller/showroom.
6. Catálogo: conteo de productos, filtros y búsqueda (reutilizando la suite de regresión general del proyecto).
7. Ficha de producto → "Agregar a cotización" → contador del header.
8. "Mi cotización": generación de URL de WhatsApp para **ambos** números por separado (interceptando `window.open` para no depender de red externa), persistencia y "Vaciar lista".
9. Formulario de "Fabricación a medida": envío, mensaje generado y verificación de que contiene "Jeinox GastroSystems".
10. Menú móvil: apertura correcta.
11. Enlaces internos: los 39 enlaces únicos del sitio, verificados contra el servidor real.
12. Redes sociales: presencia, `target`, `rel` y cantidad correcta (1 TikTok + 1 Facebook) en las 9 páginas.
13. Revisión visual (capturas de pantalla) del Hero, el pie de página y la página "Nosotros" completa.

## 15. Resultado de las pruebas

**Todas las pruebas pasaron.** 0 errores de consola, 0 recursos rotos, 39/39 enlaces internos funcionando, catálogo con 18 productos visibles, cotización y WhatsApp (ambos números) funcionando, formulario de fabricación a medida funcionando, menú móvil funcionando, redes sociales presentes y correctamente configuradas en las 9 páginas.

## 16. Errores encontrados

Durante la revisión previa (Paso 0) se encontraron dos afirmaciones de servicio no confirmadas que no estaban contempladas explícitamente en la lista de tareas, pero que caían directamente bajo la regla de "no afirmar servicio técnico/instalación/mantenimiento sin confirmar":

1. FAQ de garantía: prometía "orientación sobre uso y mantenimiento".
2. `nosotros.html`, paso "Entrega": prometía coordinar "instalación".

## 17. Errores corregidos

Ambos puntos del ítem anterior fueron corregidos (ver sección 5), reemplazando el texto por una redacción que no promete un servicio no confirmado, sin necesidad de ocultar secciones completas.

## 18. Información pendiente del cliente

*(No se inventó ninguna de estas respuestas; ver también la sección obligatoria al final de este informe.)*

- El logo cuadrado del header (`logo-mark.webp`) sigue mostrando **"INDUSTRIAS JEINOX"** grabado en la imagen — no pudo actualizarse porque es una imagen rasterizada (píxeles), no texto editable. Se necesita que Jeinox proporcione un archivo de logo definitivo con el nombre "Jeinox GastroSystems" (o autorización para diseñar uno) para reemplazar ese archivo.
- La dirección física del taller/showroom (distinta de la tienda mostrada en el mapa) no está confirmada — se mencionó su existencia sin dirección, tal como exigía el encargo.
- Las 4 líneas de negocio (línea caliente, línea fría, acero inoxidable, automáticos y digitales) están representadas en el catálogo, pero **no existe un filtro o categoría navegable específico para "Equipos automáticos y digitales"** dentro de `catalogo.html` — hoy son productos individuales (p. ej. "Freidora Automática Industrial") sin una categoría propia. Se documenta como recomendación para una fase futura (ver sección 20), ya que crearla implica tocar la clasificación de productos en `data/products.js`, y el encargo pidió explícitamente no reorganizar esa clasificación sin comprobarla primero.
- Los segmentos "supermercados", "dark kitchens" y "emprendedores gastronómicos" (mencionados en el encargo como público objetivo) no tienen un tipo de negocio propio en `data/products.js` (hoy existen: restaurantes, pollerías, chifas, panaderías, cafeterías, comida rápida, hoteles, minimarkets, otros). Agregarlos requeriría tocar esa clasificación de productos — se documenta como recomendación, no se ejecutó en esta fase.

## 19. Recomendaciones para la siguiente fase

- Reemplazar `logo-mark.webp` por un archivo con "Jeinox GastroSystems" en cuanto exista el logo definitivo.
- Evaluar crear un filtro/categoría "Equipos automáticos y digitales" en el catálogo, revisando primero qué productos deberían quedar clasificados ahí.
- Evaluar agregar "supermercados", "dark kitchens" y "emprendedores gastronómicos" como tipos de negocio, si Jeinox confirma que son segmentos activos.
- Retomar los pendientes ya documentados en la Fase 1 (dominio real en `canonical`/Open Graph, SEO dinámico por producto, `robots.txt`/`sitemap.xml`, bug responsive del botón "Cotizar equipos" entre 1024–1250 px, `srcset` de imágenes).
- Cuando Jeinox confirme las condiciones específicas de garantía y el alcance real del servicio técnico/postventa, reactivar los bloques ocultos de `garantia.html`.

---

## DATOS PENDIENTES DEL CLIENTE

*(No inventados; requieren confirmación directa de Jeinox GastroSystems.)*

- **Razón social.**
- **RUC.**
- **Condiciones específicas de la garantía** (qué cubre, qué no cubre, piezas, mano de obra, transporte, exclusiones).
- **Confirmación de servicio técnico / postventa** (mantenimiento, reparación, instalación, visitas técnicas, repuestos): actualmente el sitio no afirma ofrecer ninguno de estos servicios.
- **Historia empresarial.**
- **Misión.**
- **Visión.**
- **Dirección exacta del taller/showroom** (distinta de la tienda física ya mapeada).
- **Logo definitivo** con el nombre "Jeinox GastroSystems" para reemplazar el archivo `logo-mark.webp`, que hoy muestra "INDUSTRIAS JEINOX".

---

**No se ejecutaron las fases posteriores** (responsive profundo, optimización de rendimiento, migración, dominio, SEO final, QA de entrega). Quedo a la espera de tu autorización para continuar.

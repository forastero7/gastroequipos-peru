# Auditoría técnica y comercial — Jeinox GastroSystems

**Sitio auditado:** https://forastero7.github.io/gastroequipos-peru/
**Repositorio:** `forastero7/gastroequipos-peru` (rama `claude/gifted-goldberg-54hj0c`)
**Fecha de auditoría:** 20 de septiembre de 2026
**Tipo de auditoría:** Frontend, UX/UI, SEO técnico, rendimiento, accesibilidad, responsive, conversión y arquitectura.
**Alcance:** Análisis únicamente. **No se modificó ningún archivo del proyecto.**
**Metodología:** Lectura completa del código fuente real (9 páginas HTML, 1 hoja CSS, 5 módulos JS, archivo de datos de 29 productos), inspección de las 47 imágenes reales del repositorio, medición de peso de red y errores de consola con navegador automatizado (Playwright/Chromium) en 9 páginas y 8 anchos de pantalla (320–1920 px), y verificación uno a uno de los 40 enlaces internos únicos del sitio.

> **Nota para lectores no técnicos:** cada término técnico (LCP, CLS, canonical, schema, etc.) se explica la primera vez que aparece. Las tablas indican siempre el archivo exacto donde está cada hallazgo, para que cualquier desarrollador pueda ubicarlo de inmediato.

---

## 1. Resumen ejecutivo

Jeinox GastroSystems tiene una web **bien construida técnicamente para su etapa actual** (una "Base V1" sin backend, según el propio `README.md` del proyecto): código limpio, modular, sin errores de consola en ninguna de las 9 páginas, sin enlaces internos rotos, con buen uso de accesibilidad básica y un flujo de cotización por WhatsApp que funciona de punta a punta.

Sin embargo, la auditoría encontró **problemas concretos que sí afectan ventas y percepción de marca hoy mismo**:

1. El **dominio usado en las etiquetas SEO no existe** (`jeinoxgastronomic.example`) en las 9 páginas — Google y las vistas previas de WhatsApp/Facebook no van a mostrar la información correcta.
2. El **botón principal "Cotizar equipos" del header se corta visualmente** en anchos de pantalla muy comunes (1024–1250 px: tablets en horizontal, laptops pequeñas, ventanas no maximizadas).
3. La marca aparece con **tres nombres distintos** en el propio sitio: "Jeinox Gastronomic" (dominante), "Jeinox GastroSystems" (FAQ, WhatsApp, ubicación) e "INDUSTRIAS JEINOX" (dentro del propio logo).
4. Hay **páginas con contenido de relleno ("placeholder") totalmente inventado** (`proyectos.html`, `garantia.html`, `nosotros.html`) que Google puede indexar porque están marcadas como `index, follow`, y que son accesibles desde el menú y el pie de página de casi todas las páginas.
5. El catálogo (`catalogo.html`) pesa **1.2 MB** por visita porque cada tarjeta descarga la imagen a resolución completa (hasta 2002×1200 px) aunque se muestre en una tarjeta pequeña.

Ninguno de estos problemas es catastrófico por sí solo, pero juntos **sí reducen conversión, confianza y posicionamiento en Google** — exactamente los tres objetivos comerciales que la empresa persigue con esta web.

### Puntuación técnica general

# **68 / 100**

(ver desglose completo en la sección 21)

---

## 2. Estado actual del proyecto

- **Tipo de sitio:** estático, sin framework, sin paso de build (`package.json` no existe). HTML + CSS + JavaScript nativo con módulos ES (`<script type="module">`).
- **Hosting:** GitHub Pages, desplegado directo desde la rama `claude/gifted-goldberg-54hj0c`.
- **Backend:** ninguno. No hay base de datos, login, checkout ni pasarela de pagos (confirmado en `README.md`, sección 1: "No es un e-commerce").
- **Peso total del proyecto (sin `.git`):** ≈ 2.94 MB.
- **9 páginas HTML, 1 hoja CSS, 5 módulos JS, 1 archivo de datos, 47 imágenes WebP + 10 SVG.**
- **Última actividad de commits:** 34 commits en el historial de la rama de trabajo.

---

## 3. Arquitectura del proyecto

### 3.1 Estructura de archivos

```
/
├── index.html, catalogo.html, producto.html, cotizacion.html,
│   nosotros.html, proyectos.html, garantia.html,
│   privacidad.html, libro-reclamaciones.html      (9 páginas HTML)
├── css/styles.css                                  (1 hoja, 37.4 KB)
├── js/
│   ├── main.js        Menú móvil, acordeón FAQ, formulario "a medida"
│   ├── products.js     Render de tarjetas, ficha de producto, destacados
│   ├── catalog.js        Buscador y filtros del catálogo
│   └── quote.js            Carrito "Mi cotización" (localStorage) + WhatsApp
├── data/products.js                                (29 productos, 48 KB)
└── assets/
    ├── images/products/    43 fotos reales .webp + 3 placeholders .svg
    ├── images/categories/   3 imágenes .webp
    ├── images/projects/      3 placeholders .svg (reutilizados)
    ├── images/branding/       logo .svg/.webp
    ├── icons/                  sprite.svg + favicon.svg
    └── videos/                  carpeta vacía (solo .gitkeep)
```

### 3.2 Evaluación de la organización

| Aspecto | Evaluación | Evidencia |
|---|---|---|
| Claridad | **Buena.** Cada archivo JS tiene una responsabilidad única y documentada (comentario de cabecera explica su rol). | `js/main.js`, `js/products.js`, `js/catalog.js`, `js/quote.js` |
| Mantenibilidad | **Buena para el tamaño actual.** Un solo archivo de datos (`data/products.js`) es la fuente única de verdad; agregar un producto no requiere tocar HTML. | Confirmado por el flag `visible` agregado recientemente sin tocar HTML |
| Escalabilidad | **Limitada más allá de ~100 productos** (ver sección 20). | Todo el catálogo se carga como un único array JS en cada página |
| Desorden / repetición | **Repetición real detectada:** el `<header>` y `<footer>` completos (≈50 líneas cada uno) están **copiados y pegados de forma idéntica en las 9 páginas HTML**, en vez de generarse una sola vez. | Comparación directa de `index.html`, `catalogo.html`, `garantia.html`, etc. |
| Archivos innecesarios/duplicados | `assets/videos/` existe pero está vacía (solo `.gitkeep`): no hay video en el sitio, así que la carpeta no aporta nada todavía. Las 3 imágenes SVG de `assets/images/projects/` se reutilizan 2 veces cada una en `proyectos.html` (6 tarjetas, 3 imágenes distintas). | `find` del proyecto |

**Consecuencia práctica de la repetición de header/footer:** cualquier cambio de menú, teléfono o enlace debe repetirse a mano en 9 archivos. Esto ya generó una inconsistencia real y verificada: **el enlace "Proyectos" del menú está oculto en `index.html` pero visible en las otras 8 páginas** (ver sección 4 y 23).

---

## 4. Auditoría visual / UX

### 4.1 Header

- **Logo:** correcto, enlaza a inicio, `alt` descriptivo. El archivo gráfico del logo (`logo-mark.webp`) incluye el texto "INDUSTRIAS JEINOX" dentro de la propia imagen — ver sección 21 (coherencia de marca).
- **Menú:** `index.html` muestra **6 enlaces** (Inicio, Productos, Línea caliente, Línea fría, Acero inoxidable, Nosotros). Las otras 8 páginas muestran **7 enlaces** (se agrega "Proyectos"). Esta diferencia es intencional según un comentario en el código (`index.html:47-49`: *"Enlace 'Proyectos' oculto temporalmente: proyectos.html solo contiene proyectos de ejemplo"*), pero **no se replicó en el resto del sitio**, así que el objetivo de ocultarlo se cumple solo en la portada.
- **CTA "Cotizar equipos":** visible y bien jerarquizado (botón azul sólido) en pantallas grandes. **Problema confirmado:** entre 1024 px y ~1250 px de ancho, el botón se corta visualmente o queda fuera del área visible (ver sección 8, hallazgo crítico).
- **Sticky header:** no es sticky (se desplaza con el scroll). No es un error, es una decisión de diseño; para un catálogo con muchos productos, un header fijo facilitaría volver a "Cotizar equipos" sin subir. Se sugiere como mejora, no como defecto.
- **Comportamiento móvil:** el menú hamburguesa funciona correctamente (verificado con teclado: abre, cierra con `Escape`, cierra al hacer clic fuera). Buen manejo de `aria-expanded`.

### 4.2 Hero (portada)

- Mensaje principal: *"Equipamiento profesional para negocios gastronómicos"* + subtítulo con las 3 líneas de producto. **Es claro y directo**, cumple el objetivo de explicar qué hace Jeinox en segundos.
- Dos CTA bien diferenciados: "Ver catálogo" (primario) y "Solicitar cotización" (secundario). Correcto.
- 4 "trust badges" (Equipamiento profesional, Fabricación a medida, Atención especializada, Envíos nacionales) — genéricos pero coherentes con el rubro.
- No hay imagen ni video en el hero: es texto sobre un fondo de color. Es rápido de cargar (positivo para rendimiento) pero **menos persuasivo** que mostrar equipos reales de entrada — hoy la primera imagen de producto real aparece varios scrolls más abajo.

### 4.3 Catálogo

- Buscador + 5 filtros por línea de producto (Todos, Línea caliente, Línea fría, Acero inoxidable, Fabricación especial). **Funciona correctamente** (verificado: cambia resultados y contador en tiempo real).
- Tarjetas de producto: imagen, categoría, nombre, hasta 3 características clave, disponibilidad, "Cotizar" y dos botones ("Ver equipo" / "Agregar a cotización"). Diseño limpio y consistente.
- **Problema confirmado:** el botón "Agregar a cotización" pierde parte de su texto (queda cortado, p. ej. "Agregar a co...") en el mismo rango de ancho (1024–1250 px) que el header, por la misma causa técnica (ver sección 8).
- No existe forma de comparar dos o más productos entre sí (no es un defecto — es una función que no fue construida — pero es una oportunidad de mejora dado que muchos productos son variantes entre sí, p. ej. cocinas de 2 y 3 hornillas).
- El aviso *"Filtros avanzados (precio, capacidad, dimensiones) próximamente"* es honesto pero puede leerse como una web incompleta; es una decisión de producto, no un error.

### 4.4 Secciones corporativas

| Sección | Estado | Evidencia |
|---|---|---|
| Por qué elegirnos | Textos genéricos pero coherentes con el rubro. Sin datos verificables (años de experiencia, certificaciones). | `index.html:134-169` |
| Garantía | El resumen en portada dice *"se detallarán próximamente"*, pero cada ficha de producto ya declara "Garantía: 1 año" — **mensaje contradictorio entre secciones del mismo sitio.** | `index.html:343` vs. `data/products.js` (`warranty: "1 año"` en los 29 productos) |
| Fabricación a medida | Formulario funcional y completo (tipo, cantidad, medidas, material, funcionamiento, comentarios) que arma un mensaje de WhatsApp bien estructurado. **Es de las mejores piezas de UX del sitio.** | `index.html:172-234`, `js/main.js:138-177` |
| Automatización / equipos digitales | Mencionados como diferenciales en "Por qué elegirnos" y FAQ, pero **no hay ningún producto en el catálogo marcado como automático o digital de forma filtrable** — es una promesa de marca sin respaldo visible en el catálogo. | `data/products.js` (no existe campo que distinga "automático/digital" como filtro) |
| Acero inoxidable | Tiene categoría propia en el catálogo, con productos reales. Correcto. | — |
| Cobertura | "Todo el Perú" se menciona en dos lugares distintos con formato distinto: `"Todo el Perú"` (home) y `[Todo el Perú]` entre corchetes (nosotros.html), delatando que en `nosotros.html` sigue siendo un placeholder. | `index.html:144`, `nosotros.html:125` |

### 4.5 Formularios

Hay dos formularios reales en el sitio:

1. **"¿Necesitas un equipo a medida?"** (`index.html`): 7 campos, 2 obligatorios (tipo y cantidad). Validación simple pero funcional (resalta campos vacíos, mensaje de error visible). Buena fricción — no pide de más.
2. **Selección de cantidad en "Mi cotización"** (`cotizacion.html`): controles +/- y campo numérico editable, con `aria-label` por producto. Funciona correctamente.

No hay formulario de "contacto general" tradicional (nombre/correo/mensaje) — todo el contacto pasa por WhatsApp, lo cual es coherente con el modelo de negocio declarado.

### 4.6 Footer

- Idéntico y consistente en las 9 páginas (correcto).
- Contiene un enlace a `proyectos.html` bajo "Empresa" en **todas** las páginas, incluida la portada — es decir, aunque el menú superior de `index.html` oculta "Proyectos", el pie de página de esa misma portada sí lo enlaza. La ocultación es incompleta.
- Texto **"Razón social y RUC pendientes de definir"** visible en las 9 páginas — información legal pendiente (ver sección 26).

---

## 5. Mobile / Responsive

Se probaron 8 anchos: 320, 375, 390, 430, 768, 1024, 1366 y 1920 px, en `index.html`, `catalogo.html`, `producto.html` y `cotizacion.html`, con detección automática de scroll horizontal.

| Ancho | Resultado |
|---|---|
| 320 px | Overflow horizontal muy leve (2–8 px) en las 4 páginas — probablemente por redondeo de la barra de scroll del navegador de prueba, no es perceptible para el usuario real. **Prioridad baja.** |
| 375 / 390 / 430 px | Sin overflow. Menú hamburguesa, tarjetas en una columna, formularios legibles. |
| 768 px | Sin overflow. Catálogo pasa a 2 columnas. |
| **1024 px** | **Overflow real de hasta 116 px.** El botón "Cotizar equipos" del header y el botón "Agregar a cotización" de cada tarjeta quedan cortados (ver sección 8, capturas). |
| 1366 / 1920 px | Sin overflow. Diseño correcto en escritorio grande. |

**Conclusión:** el sitio está bien resuelto en móvil puro (320–430 px) y en escritorio grande (≥1280 px), pero tiene un **hueco real en el rango de tablets en horizontal y laptops pequeñas (1024–1250 px aprox.)**, justo donde vive el menú de escritorio "completo". Ver causa técnica exacta en la sección 8.

---

## 6. Rendimiento (Performance)

### 6.1 Peso medido por página (transferencia real de red, medida con navegador automatizado)

| Página | Peticiones | Peso total | Mayor consumidor |
|---|---|---|---|
| `index.html` | 21 | **649 KB** | Imágenes WebP: 484 KB (8 productos destacados) |
| `catalogo.html` | 28 | **1206 KB (1.2 MB)** | Imágenes WebP: 1070 KB (18 productos visibles) |
| `producto.html` (ficha individual) | 17 | **509 KB** | Imágenes WebP: 372 KB (galería + relacionados) |

CSS (36.5 KB) y JS (84.5 KB, repartido en 4 archivos) se cargan en **todas** las páginas aunque no siempre se usen todas sus funciones (por ejemplo, `js/catalog.js` se carga hasta en `privacidad.html`, donde no hay catálogo). El costo real es bajo (84.5 KB sin minificar) pero es una petición HTTP extra innecesaria por página.

### 6.2 Causas de imágenes pesadas

Cada imagen de producto se sirve a su **resolución de captura original** (hasta 1600×1200 px, y en un caso 2002×1200 px), sin versiones más pequeñas (`srcset`) para móviles. Una tarjeta del catálogo se muestra en pantalla a ~300×225 px, pero el navegador descarga igualmente el archivo completo. Esto explica por qué `catalogo.html` (18 imágenes a la vez) pesa 1.2 MB.

- Las imágenes sí usan `loading="lazy"` (correcto) y declaran `width`/`height` en el HTML, lo que **evita saltos de layout (CLS)** — esto está bien hecho y no debe tocarse.
- No se usa `srcset`/`sizes` en ninguna imagen del catálogo.
- No hay imágenes en formato AVIF (serían ~20-30% más livianas que WebP), aunque WebP ya es una elección correcta y muy superior a JPG/PNG sin optimizar.

### 6.3 Impacto estimado en métricas Core Web Vitals

*(Explicación breve: estas son las métricas que Google usa para medir qué tan rápida y estable se siente una página.)*

| Métrica | Qué mide | Riesgo en este sitio |
|---|---|---|
| **LCP** (Largest Contentful Paint — tiempo hasta que se ve el elemento más grande de la pantalla) | En `catalogo.html`, el elemento más grande suele ser la primera imagen de producto visible, servida a resolución completa sin `srcset`. Riesgo **medio-alto** en conexiones móviles 3G/4G lentas. |
| **CLS** (Cumulative Layout Shift — saltos de diseño mientras carga) | **Bajo riesgo.** Las imágenes declaran `width`/`height`, y el mapa de Google usa `loading="lazy"` con un contenedor de altura fija. Buen trabajo ya hecho aquí. |
| **INP** (Interaction to Next Paint — qué tan rápido responde la página a un clic) | **Bajo riesgo.** No hay JavaScript pesado ni librerías externas; los listeners son simples y delegados. |
| **FCP** (First Contentful Paint) | **Bajo-medio riesgo.** El CSS (37 KB) no está minificado y bloquea el render hasta descargarse, pero su tamaño es pequeño. |
| **TTFB** (Time To First Byte) | Depende de GitHub Pages/CDN, fuera del control del código; en general GitHub Pages responde rápido para sitios estáticos pequeños. |

### 6.4 Los 10 archivos más pesados del proyecto

| Archivo | Tipo | Peso | Uso | Problema | Recomendación |
|---|---|---|---|---|---|
| `assets/images/products/parrilla-mesa-empotrable-1.webp` | Imagen | 118 KB | Imagen principal de producto | 1600×1200, sin versión reducida | Generar versión ~800×600 para catálogo |
| `assets/images/products/freidora-automatica-industrial-4.webp` | Imagen | 113 KB | Miniatura de galería | 900×1200 (formato vertical) a un peso alto para ser una miniatura | Comprimir más / recortar antes de subir |
| `assets/images/products/cocina-industrial-2-hornillas-chifero-1.webp` | Imagen | 104 KB | Imagen principal de producto | Resolución completa en tarjeta pequeña | Redimensionar a tamaño de tarjeta |
| `assets/images/products/cocina-industrial-2-hornillas-2.webp` | Imagen | 103 KB | Miniatura de galería | Igual que arriba | Igual que arriba |
| `assets/images/products/cocina-industrial-3-hornillas-chifero-horno-2.webp` | Imagen | 101 KB | Miniatura de galería | Igual que arriba | Igual que arriba |
| `assets/images/products/parrilla-mesa-empotrable-3.webp` | Imagen | 101 KB | Miniatura de galería | Igual que arriba | Igual que arriba |
| `assets/images/products/cocina-industrial-3-hornillas-horno-2.webp` | Imagen | 97 KB | Miniatura de galería | Igual que arriba | Igual que arriba |
| `assets/images/products/cocina-industrial-3-hornillas-horno-1.webp` | Imagen | 97 KB | Imagen principal | Igual que arriba | Igual que arriba |
| `assets/images/products/cocina-industrial-4-hornillas-2.webp` | Imagen | 81 KB | Miniatura de galería | 2002×1200: la imagen más ancha del proyecto | Recortar el encuadre antes de subir |
| `assets/images/products/caja-china-2en1-3.webp` | Imagen | 80 KB | Miniatura de galería | Resolución completa | Redimensionar |
| `data/products.js` (código, no imagen) | JS/datos | 46 KB | Fuente única de datos de 29 productos | No es "pesado" para la web (se sirve como texto comprimible), pero es el único archivo de código que crecerá con cada producto nuevo | Vigilar tamaño si el catálogo crece a 100+ productos (ver sección 20) |

**Peso total de imágenes del proyecto:** 2.6 MB en 47 archivos WebP/SVG. **Peso total del proyecto (sin `.git`):** 2.94 MB.

---

## 7. SEO técnico

### 7.1 Hallazgo crítico: dominio inexistente en todas las etiquetas SEO

Las 9 páginas declaran:

```html
<link rel="canonical" href="https://www.jeinoxgastronomic.example/index.html">
<meta property="og:url" content="https://www.jeinoxgastronomic.example/index.html">
```

El dominio `jeinoxgastronomic.example` **no existe** (`.example` es un dominio reservado que nunca se resuelve, usado normalmente solo en ejemplos de documentación). El sitio real vive en `https://forastero7.github.io/gastroequipos-peru/`. Esto significa:

- La etiqueta **canonical** (le dice a Google "esta es la versión oficial de esta URL") apunta a una dirección que no existe — en la práctica Google la ignora o la trata como señal confusa, y no consolida el posicionamiento en la URL real.
- Las etiquetas **Open Graph** (`og:url`, `og:title`, `og:image`) son las que WhatsApp, Facebook e Instagram leen para mostrar la vista previa de un enlace compartido. Con esta configuración, si alguien comparte el link del sitio por WhatsApp, la vista previa puede no cargar imagen ni datos correctos.
- **Esto es especialmente grave para el modelo de negocio de Jeinox**, que depende de compartir enlaces por WhatsApp.

### 7.2 Etiquetas por página (auditadas una por una)

| Página | `<title>` | Meta description | Canonical | Robots |
|---|---|---|---|---|
| `index.html` | Correcto y descriptivo | Correcta, con palabras clave relevantes | Dominio inexistente | `index, follow` |
| `catalogo.html` | Correcto | Correcta | Dominio inexistente | `index, follow` |
| `producto.html` | **Genérico: "Equipo \| Jeinox Gastronomic" para todos los productos** (se actualiza con JavaScript después de cargar, pero el HTML fuente es siempre el mismo) | Genérica ("Ficha técnica del equipo gastronómico") | **Un solo canonical genérico sin `?slug=` para las 29 fichas de producto** | `index, follow` |
| `nosotros.html`, `garantia.html`, `proyectos.html` | Correctos y descriptivos | Correctas | Dominio inexistente | `index, follow` (ver 7.4) |
| `cotizacion.html` | Correcto | Correcta | Dominio inexistente | `noindex, follow` ✅ correcto (es una página de utilidad, no debe indexarse) |
| `privacidad.html`, `libro-reclamaciones.html` | Correctos | Correctas | Dominio inexistente | `noindex, follow` ✅ correcto |

### 7.3 Producto: cada ficha comparte la misma "identidad" SEO

`producto.html` es una única plantilla que recibe el producto por `?slug=` y lo pinta con JavaScript (`js/products.js`, función `initProductDetail`). Esa función **sí actualiza dinámicamente** el `<title>` de la pestaña y el contenido de la meta description, pero **no actualiza el `<link rel="canonical">` ni las etiquetas Open Graph** (`og:title`, `og:url`, `og:image`).

**Consecuencia real:**
- Un buscador que no ejecute JavaScript (o un bot de vista previa como el de WhatsApp o Facebook, que generalmente **no ejecutan JavaScript**) verá **siempre** el mismo título genérico "Equipo | Jeinox Gastronomic" y ninguna imagen específica, sin importar qué producto se comparta.
- Si un vendedor de Jeinox comparte el link de una freidora industrial específica por WhatsApp a un cliente, la vista previa que verá el cliente **no mostrará el nombre ni la foto de esa freidora.**
- Esto reduce directamente la efectividad de compartir productos — un canal de venta clave para un negocio que cotiza por WhatsApp.

### 7.4 Inconsistencia entre páginas con contenido placeholder

`garantia.html` y `proyectos.html` tienen contenido explícitamente de relleno (ver sección 17) pero están marcadas `index, follow` (indexables por Google), mientras que `privacidad.html` y `libro-reclamaciones.html` — que también son "placeholders" según su propio texto — están correctamente marcadas `noindex, follow`. No hay un criterio único aplicado.

### 7.5 Ausencias

- **No existe `robots.txt`** en el proyecto.
- **No existe `sitemap.xml`.**
- No hay archivo de verificación de Google Search Console.

### 7.6 Lo que SÍ funciona bien en SEO

- `lang="es-PE"` correcto en las 9 páginas.
- Jerarquía de encabezados razonable: un solo `<h1>` por página, `<h2>` para secciones.
- Todas las imágenes de producto tienen `alt` descriptivo (verificado en `js/products.js`: genera `alt="{nombre} — imagen referencial"`).
- `viewport` correcto en las 9 páginas.
- Favicon presente y en SVG (liviano).
- Existen dos bloques de datos estructurados (JSON-LD) en `index.html`: `Organization` y `FAQPage` — ver sección 12.

---

## 8. Bug responsive confirmado: el CTA principal se corta entre 1024–1250 px

Este es, junto con el problema SEO del dominio, **el hallazgo más importante de la auditoría** porque afecta directamente la conversión.

**Evidencia (capturas tomadas en vivo con el sitio corriendo localmente):**

- A 1024 px de ancho, el botón **"Cotizar equipos"** del header queda casi completamente fuera del área visible (solo se alcanza a ver el borde azul del botón), y el botón **"Agregar a cotización"** de cada tarjeta del catálogo muestra el texto cortado ("Agregar a co...").
- El mismo problema persiste, en menor grado, hasta ~1250 px (a 1100 px el botón se lee "Cotizar equi...").
- A partir de 1280 px el problema desaparece, pero el botón queda con muy poco margen respecto al borde de la pantalla.
- Se confirmó automáticamente overflow horizontal de **116 px** en `catalogo.html`, `producto.html` y `cotizacion.html` exactamente a 1024 px de ancho.

**Causa técnica exacta** (para quien vaya a corregirlo):

En `css/styles.css`, línea 424, el bloque `@media (min-width: 1024px)` activa **al mismo tiempo**:
- el menú de navegación completo en línea (7 elementos: Inicio, Productos, Línea caliente, Línea fría, Acero inoxidable, Proyectos, Nosotros) — antes de esto estaba oculto tras el botón de menú hamburguesa;
- el botón `.header-cta` ("Cotizar equipos"), antes oculto (`display: none` en `css/styles.css:406`).

Además, la clase `.btn` (línea ~236 de `css/styles.css`) tiene `white-space: nowrap`, es decir, el texto del botón **nunca se parte en dos líneas ni se acorta**. Como resultado, en el rango 1024–1250 px la suma de: logo + 7 enlaces + indicador "Mi cotización" + botón "Cotizar equipos" **es más ancha que la pantalla**, y no existe ningún mecanismo (recorte del texto, ocultar la etiqueta "Mi cotización", reducir espacios) que compense esa falta de espacio hasta que la pantalla es lo bastante ancha (~1280 px).

**Por qué importa:** 1024 px es el ancho de un iPad en horizontal y de muchas laptops pequeñas o ventanas de navegador no maximizadas — un segmento de tráfico real, no un caso extremo.

---

## 9. Auditoría de imágenes

- **47 imágenes** en el proyecto: 43 fotos reales de producto (.webp), 3 imágenes de categoría (.webp), 3 placeholders SVG de producto (reutilizados en 11 productos aún sin foto real) y 3 placeholders SVG de "proyectos" (reutilizados 2 veces cada uno).
- **Formato:** WebP para fotos reales — es la elección correcta (mejor compresión que JPG/PNG a igual calidad visual). No se identificaron imágenes en PNG/JPG sin optimizar.
- **Dimensiones:** heterogéneas e inconsistentes: la mayoría 1600×1200, pero también hay 675×1200, 800×1200, 900×1200, 1025×1200, 1131×1200, 2002×1200 — es decir, fotos tomadas en distintas relaciones de aspecto (algunas verticales, otras muy panorámicas), en vez de un estándar único de captura.
- **object-fit y recorte:** las tarjetas usan `object-fit: cover` sobre un marco 4:3; la ficha de producto usa `object-fit: contain` (no recorta, correcto). Se revisó visualmente una miniatura generada a partir de una imagen extremadamente vertical (675×1200) y el recorte resultante seguía siendo reconocible, pero **no hay garantía de que esto se cumpla para las demás imágenes con proporciones atípicas** sin revisarlas una por una.
- **`loading="lazy"`:** presente en todas las imágenes de tarjetas y galerías (correcto).
- **`alt`:** presente y descriptivo en todas las imágenes de producto.
- **`srcset`/imágenes responsivas:** **ausente en todo el proyecto.** Es la causa principal del peso de `catalogo.html` (sección 6).
- **CLS (saltos de layout):** bajo riesgo, porque todas las imágenes declaran `width` y `height` en el HTML.
- **Imágenes duplicadas/innecesarias:** los 3 placeholders de `assets/images/projects/` se usan 2 veces cada uno en `proyectos.html` (6 tarjetas, solo 3 imágenes distintas) — no es grave, pero es visible para cualquier persona que note que dos tarjetas comparten exactamente la misma foto.
- **Recomendación de conversión (no ejecutar todavía):** generar, para cada foto de producto, una versión adicional ~800×600 (o usar `srcset`) para que el catálogo no fuerce la descarga de la resolución completa en cada tarjeta.

---

## 10. Video

No hay ningún archivo de video en el proyecto: la carpeta `assets/videos/` existe pero está vacía (solo contiene un `.gitkeep`, un archivo vacío que Git usa para no eliminar carpetas vacías). El hero de la portada es texto puro, sin imagen ni video de fondo. No hay impacto negativo en velocidad por este concepto — pero tampoco hay el impacto positivo en conversión que un video corto de la fábrica/taller podría aportar.

---

## 11. Accesibilidad

| Aspecto | Evaluación | Evidencia |
|---|---|---|
| Enlace "saltar al contenido" | ✅ Presente en las 9 páginas | `<a class="skip-link" href="#main">` |
| Navegación por teclado | ✅ Verificado: el menú móvil abre, cierra con `Escape` y devuelve el foco al botón | `js/main.js:16-63`, verificado en vivo |
| `aria-expanded` / `aria-controls` | ✅ Correcto en menú y acordeón FAQ | `js/main.js`, `index.html` (FAQ) |
| `aria-live` | ✅ Usado en grillas dinámicas (catálogo, destacados) y en el toast de notificaciones | `index.html`, `catalogo.html` |
| Foco visible | ✅ Regla global `:focus-visible` con contorno de 3 px | `css/styles.css:75-78` |
| Etiquetas de formulario (`<label>`) | ✅ Todos los campos de "Fabricación a medida" y de cantidad en "Mi cotización" tienen `<label>` o `aria-label` | `index.html`, `js/quote.js` |
| Botones solo-ícono | ✅ Tienen `aria-label` (ej. "Disminuir cantidad de {producto}") | `js/quote.js:199-204` |
| Jerarquía de encabezados | ✅ Un `<h1>` por página, sin saltos de nivel evidentes | Revisión manual de las 9 páginas |
| Contraste de color | 🟡 No se ejecutó un test de contraste automatizado (tipo axe-core), pero el azul principal (`#1d4ed8`) sobre blanco y el texto oscuro (`#10151c`) sobre fondos claros cumplen visualmente un contraste alto. Revisar puntualmente el texto gris claro (`#cbd2d9`) sobre el fondo oscuro de la sección "Garantía" en `index.html:343`. | `css/styles.css` (tokens de color) |
| Tamaño táctil de botones | 🟡 No medido con regla exacta, pero los botones usan `padding: 0.75rem 1.25rem`, que en la mayoría de los casos supera el mínimo recomendado de 44×44 px. | `css/styles.css` |
| Contenido cargado por JavaScript sin alternativa | 🟡 `producto.html` muestra literalmente el texto "Cargando equipo…" en el `<h1>` inicial del HTML fuente. Un lector de pantalla o un buscador que no ejecute JavaScript vería ese texto en vez del nombre real del producto. | `producto.html:84` |

**Clasificación de impacto:** ningún hallazgo de accesibilidad es crítico; los de impacto medio son el contraste sin verificar puntualmente y el contenido de producto dependiente de JavaScript.

---

## 12. Schema / datos estructurados (JSON-LD)

**Sí existen**, únicamente en `index.html`:

1. **`Organization`**: nombre, URL (con el dominio inexistente, ver sección 7), logo, correo, enlace de Google Maps y dos `ContactPoint` con los teléfonos. Correctamente formado.
2. **`FAQPage`**: las 9 preguntas frecuentes completas, duplicando exactamente el texto que ya está visible en el acordeón HTML de la misma página (no es un error — es el patrón recomendado por Google para FAQ — pero infla el peso del HTML de `index.html`, que con 35.7 KB es más de 3 veces el tamaño de cualquier otra página del sitio).

**No existen** (y podrían ser apropiados):

- **`LocalBusiness`**: sería el más valioso para un negocio físico con dirección y horario — permitiría que Google muestre horario, teléfono y ubicación directamente en los resultados de búsqueda. Actualmente solo hay `Organization`, que es más genérico.
- **`Product`**: `js/products.js` tiene una función `injectProductSchema()` que ya inyecta `Product` + `BreadcrumbList` en cada ficha de producto — **esto sí existe**, mediante JavaScript en `producto.html` (no aparece en el HTML fuente porque se genera dinámicamente). Es correcto, aunque hereda el mismo problema de la sección 7.3: no incluye `offers` (precio), lo cual es una decisión consciente y documentada en el propio código (los precios son "cotizar").
- **`BreadcrumbList`** en el resto de páginas interiores (`nosotros.html`, `garantia.html`, etc.) — existe visualmente el breadcrumb en HTML, pero no está marcado con datos estructurados fuera de `producto.html`.

*(Solo se documenta lo encontrado; no se implementa nada nuevo en esta auditoría.)*

---

## 13. SEO local

Búsquedas objetivo mencionadas por el negocio: *"equipos gastronómicos Perú"*, *"equipos gastronómicos Lima"*, *"equipos de cocina industrial"*, *"fabricación de cocinas industriales"*, *"equipos en acero inoxidable"*, *"maquinaria gastronómica"*, *"equipos automáticos para restaurantes"*, *"equipos digitales gastronómicos"*, *"fabricación de equipos gastronómicos"*.

**Lo que el contenido actual ya cubre bien, de forma natural (sin relleno de palabras clave):**
- "equipos gastronómicos", "línea caliente", "línea fría", "acero inoxidable" y "fabricación a medida" aparecen de forma orgánica y repetida en títulos, meta descriptions y encabezados de las páginas principales.
- Las categorías del catálogo (`linea-caliente`, `linea-fria`, `acero-inoxidable`) y sus URLs (`catalogo.html?cat=linea-caliente`) refuerzan esos mismos términos.

**Lo que falta para reforzar el posicionamiento local en Lima/Perú:**
- No hay ninguna mención textual de **"Lima"** como ciudad de operación fuera de la sección de envíos del FAQ ("Coordinamos entregas en Lima..."). No hay una frase clara tipo "Equipos gastronómicos en Lima, Perú" en el `<h1>` o la meta description de la portada.
- "Equipos automáticos" y "equipos digitales" se mencionan como diferenciales de marca, pero **ningún producto del catálogo está etiquetado ni es filtrable como "automático" o "digital"** — quien busque específicamente "freidora automática" en Google puede llegar a la home, pero no hay una categoría o filtro que lo lleve directo a esos productos (sí existe, por ejemplo, el producto "Freidora Automática Industrial" en el catálogo — el problema es que no es una categoría navegable, solo un nombre de producto).
- No existe `LocalBusiness` schema (ver sección 12), que es la señal más directa para SEO local.
- No existe `sitemap.xml` ni `robots.txt` (ver sección 7.5), lo que dificulta que Google rastree e indexe todas las páginas de forma eficiente, especialmente las 29 fichas de producto individuales, que no están enlazadas desde ningún sitemap.

---

## 14. Conversión

### 14.1 Prueba de los "5 segundos"

Un visitante nuevo que llega a `index.html` puede identificar en los primeros segundos:

- ✅ **Qué vende Jeinox:** sí, el hero es explícito ("Equipamiento profesional para negocios gastronómicos").
- ✅ **A quién le vende:** sí, aparece "restaurantes y negocios gastronómicos" y más abajo la sección "¿Qué negocio estás equipando?" con 9 rubros.
- 🟡 **Qué la diferencia:** parcialmente. La sección "Por qué elegirnos" está más abajo (requiere scroll) y usa frases genéricas ("Experiencia especializada", "Taller propio") sin cifras que las respalden (años, cantidad de proyectos).
- ✅ **Cómo cotizar:** sí, hay dos CTA visibles de inmediato ("Ver catálogo" / "Solicitar cotización").
- ✅ **Cómo contactar:** sí, aunque el WhatsApp directo no está en el hero — está más abajo, en la sección "Visítanos", y el CTA principal del header dice "Cotizar equipos" (lleva al carrito, no abre WhatsApp directo).

### 14.2 Auditoría de textos de los CTA

| Texto | Dónde aparece | Evaluación |
|---|---|---|
| "Cotizar equipos" | Header (todas las páginas) | Lleva a `cotizacion.html` (el carrito), no abre WhatsApp directamente. Puede generar una expectativa distinta a la acción real (el usuario podría esperar un chat inmediato). |
| "Ver catálogo" | Hero, CTA final | Claro y sin ambigüedad. |
| "Solicitar cotización" | Hero, footer de páginas internas | Lleva a `cotizacion.html`, mismo destino que "Cotizar equipos" — **dos textos distintos para el mismo destino**, sin ser un error, sí es una inconsistencia de microcopy que se puede unificar. |
| "Agregar a cotización" | Cada tarjeta de producto | Claro, consistente en todo el sitio. |
| "Mi cotización" | Header (indicador con contador) | Claro. |
| "Ver equipo" | Cada tarjeta de producto | Claro. |
| Botones "WhatsApp +51 9XX XXX XXX" | `cotizacion.html` | Estos sí abren WhatsApp directamente con el mensaje armado — es el único lugar del sitio donde el usuario ve el número exacto antes de hacer clic. |

**Riesgo de confusión real:** el usuario que hace clic en "Cotizar equipos" (header) espera posiblemente ir directo a WhatsApp, pero llega a una página intermedia (el carrito) que puede estar vacía si aún no agregó productos — mostrando el mensaje "Aún no agregaste equipos a tu cotización". No es un error técnico, pero es una fricción de expectativa que vale la pena revisar.

### 14.3 Recorrido visitante → WhatsApp

`Visitante → Catálogo → Producto → "Agregar a cotización" → "Mi cotización" → Elegir número de WhatsApp → WhatsApp con mensaje pre-armado.`

Este recorrido **se probó de punta a punta y funciona sin errores.** Los puntos donde un visitante real podría abandonar son:

1. **Al llegar a "Mi cotización" vacío** desde el CTA del header sin haber agregado nada antes (fricción de expectativa, sección 14.2).
2. **En el rango 1024–1250 px**, si el botón "Cotizar equipos" está cortado, el usuario podría no encontrarlo y abandonar sin cotizar (sección 8).
3. **Al compartir un link de producto específico por WhatsApp**, la vista previa no mostrará el producto correcto (sección 7.3) — esto no afecta al visitante que ya está en el sitio, pero sí a la persona que **recibe** el link compartido, reduciendo el interés de abrirlo.

---

## 15. Sistema de cotización ("Mi cotización")

**Cómo funciona (verificado en código y en vivo):** cada clic en "Agregar a cotización" guarda `{id, cantidad}` en `localStorage` (clave `gastroequipos:quote:v1`). La página `cotizacion.html` lee esa lista, la cruza con `data/products.js` para mostrar nombre/imagen, y permite subir/bajar cantidad, eliminar productos o vaciar todo. Al elegir un número de WhatsApp, arma un mensaje de texto con la lista de productos y cantidades y abre `wa.me` en una pestaña nueva.

| Aspecto | Evaluación |
|---|---|
| Persistencia | ✅ Correcta: sobrevive a recargar la página y a navegar entre páginas (usa `localStorage`, no se pierde al cerrar la pestaña). Verificado en pruebas automatizadas. |
| Productos duplicados | ✅ No ocurre: si se agrega el mismo producto dos veces, se **suma la cantidad** en la misma fila en vez de crear una fila duplicada — comportamiento correcto. |
| Cantidad de clics para cotizar | Bajo: Producto → Agregar (1 clic) → Mi cotización (1 clic, o automático si ya se está ahí) → elegir WhatsApp (1 clic) = 3 clics mínimo desde una ficha de producto. Razonable. |
| Contador del header | ✅ Se actualiza en tiempo real en cualquier página tras agregar/quitar (usa un evento personalizado `gq:quote-updated`). |
| Experiencia móvil | ✅ Los controles +/- de cantidad tienen tamaño adecuado y `aria-label` individual. |
| Mensaje enviado a WhatsApp | Es **funcional pero mínimo**: solo lista `- Nombre del producto x{cantidad}`. **No incluye:** el nombre del cliente, ningún dato de contacto adicional, ni un link de vuelta a la página del producto. El vendedor recibe una lista de equipos, pero deberá preguntar manualmente los datos del cliente y el negocio al que pertenece. |
| Errores detectados | Ninguno funcional. Es una limitación de contenido del mensaje, no un bug. |

**Comparación útil:** el formulario de "Fabricación a medida" (sección 4.4) sí arma un mensaje mucho más completo (tipo de equipo, medidas, material, funcionamiento, comentarios) — sería razonable llevar ese mismo nivel de detalle al mensaje de "Mi cotización".

---

## 16. WhatsApp

- **Formato de los números:** correcto en los dos casos encontrados en el código — `51943688374` y `51926669669` (código de país + número, sin `+`, sin espacios, tal como exige la API de `wa.me`). Verificado en `js/quote.js:22-25`.
- **Enlaces `wa.me`:** se construyen dinámicamente como `https://wa.me/{numero}?text={mensaje codificado}` — formato correcto, con el mensaje correctamente codificado con `encodeURIComponent` (evita errores por caracteres especiales, tildes o saltos de línea).
- **Apertura:** todos los enlaces de WhatsApp se abren con `window.open(url, "_blank", "noopener")` — **uso correcto de `noopener`**, que es una buena práctica de seguridad (evita que la pestaña nueva pueda manipular la pestaña original).
- **Compatibilidad:** `wa.me` funciona igual en móvil (abre la app de WhatsApp) y en escritorio (abre WhatsApp Web) — no se detectó ninguna lógica que rompa esto.
- **Contenido de los mensajes:** ver comparación en la sección 15. El del formulario "a medida" es completo; el de "Mi cotización" es mínimo.
- **Duplicidad de números:** el sitio maneja dos números de WhatsApp (`cotizacion.html` los muestra ambos como botones separados), pero el formulario de "Fabricación a medida" **solo usa el primero** (`WHATSAPP_NUMBERS[0]`) — no es un error, pero es una inconsistencia menor: un cliente que llegue por ese formulario siempre escribirá al mismo número, mientras que el resto del sitio ofrece elegir.

---

## 17. Contenido: placeholders, datos inventados y textos pendientes

Se identificaron, leyendo el HTML real de cada página, los siguientes contenidos que el propio sitio declara como no definitivos:

| Página | Contenido de relleno encontrado |
|---|---|
| `nosotros.html` | "[Historia de la empresa pendiente...]", "Misión: [Pendiente de definir.]", "Visión: [Pendiente de definir.]", "[XX]+ Años de experiencia", "[X año] Garantía", "[Taller propio] Fabricación", "Producción en taller propio (**dato a confirmar**)" |
| `proyectos.html` | 6 tarjetas de proyectos **explícitamente ficticios** ("Estas tarjetas son PLACEHOLDERS: no representan clientes reales"), con "[Ubicación pendiente]" repetido 6 veces y solo 3 imágenes SVG genéricas reutilizadas |
| `garantia.html` | "Todo el contenido siguiente es un PLACEHOLDER", con 4 bloques de texto entre corchetes sin definir (duración, cobertura, exclusiones, servicio técnico) |
| `index.html` | Nota visible sobre "Equipos destacados": *"Datos de demostración para probar la interfaz — no representan precios ni especificaciones reales"* — **aplicada sobre 8 productos que ya tienen fotografías reales y especificaciones reales** (ver 17.1) |
| Footer (las 9 páginas) | "Razón social y RUC pendientes de definir" |
| `privacidad.html` | Declarado explícitamente como marcador de posición |
| `libro-reclamaciones.html` | Declarado explícitamente como marcador de posición, pendiente de RUC/razón social |

### 17.1 Inconsistencia importante: el aviso de "datos de demostración" ya no es cierto para 8 de los productos

La sección "Equipos destacados" de la portada muestra el aviso genérico de datos ficticios, pero los 8 productos que ahí aparecen **ya tienen fotografías reales** y especificaciones mayormente reales (material, combustible, número de hornillas, garantía de 1 año). El único dato realmente pendiente en esos productos es el **precio** (que de forma correcta y consciente el sitio no muestra: usa "Cotizar" en su lugar). Mantener el aviso tal como está **resta credibilidad a información que ya es real**, y no ayuda a que el visitante confíe en el catálogo.

### 17.2 No se encontraron

- Testimonios falsos activos (la sección de testimonios está **comentada/desactivada** en el HTML de `index.html`, con una nota explícita de "activar únicamente cuando existan reseñas reales" — buena práctica, no se toca).
- Errores ortográficos evidentes en el contenido revisado.
- Imágenes referenciales presentadas engañosamente como reales — al contrario, el sitio es transparente y marca explícitamente qué es "imagen referencial" y qué es un placeholder.

---

## 18. Coherencia de marca

Se buscaron variantes del nombre en todo el código (`Jeinox`, `Jainox`, `Jenox`, `Jeinox Gastronomic`, `Jeinox GastroSystems`, `Industrias Jeinox`).

| Variante | Dónde aparece | Cantidad |
|---|---|---|
| **"Jeinox Gastronomic"** | `<title>` de las 9 páginas, logo (texto), footer, meta description, `Organization` schema, nombre de archivo del proyecto | 64 apariciones — es la variante dominante |
| **"Jeinox GastroSystems" / "JEINOX GastroSystems"** | Sección "Visítanos" (`index.html:454`, nombre del local en el mapa), título del iframe de Google Maps (`index.html:483`), una respuesta del FAQ visible **y** su copia idéntica en el JSON-LD (`index.html:27` y `429`), y el mensaje de WhatsApp que arma el formulario de "Fabricación a medida" (`js/main.js:151`, la primera línea que lee el vendedor) | 5 ubicaciones en el código |
| **"INDUSTRIAS JEINOX"** | Texto visible **dentro de la propia imagen del logo** (`assets/images/branding/logo-mark.webp`), confirmado visualmente junto al texto "Jeinox Gastronomic" del header | 1 (pero es el logo, visible en las 9 páginas) |
| "Jainox", "Jenox", "Industrias Jeinox" (como texto) | No se encontraron | 0 |

**Por qué esto importa más de lo que parece:** el nombre del negocio que aparece en la ubicación de Google Maps y en el primer mensaje que recibe el vendedor por WhatsApp ("Jeinox GastroSystems") **no coincide** con el nombre que aparece en el título de la pestaña del navegador, el logo de texto y los datos estructurados que Google lee ("Jeinox Gastronomic"). Si el negocio tiene o va a crear un perfil de Google Business, el nombre debe ser **idéntico en todos lados** (esto se llama consistencia de "NAP" — Nombre, Dirección, Teléfono — y es uno de los factores más importantes del SEO local). Actualmente no hay un nombre único y definitivo.

---

## 19. Página de garantía (`garantia.html`)

- **Claridad:** la intención de la página es clara (explicar condiciones de garantía y servicio técnico), pero el 100% del contenido sustantivo está entre corchetes como pendiente.
- **Contenido:** 5 bloques ("Duración", "Qué cubre", "Qué no cubre", "Servicio técnico", "Canales de soporte", "Horario") — la estructura es correcta y suficiente; falta solo el contenido real.
- **Navegación:** correcta, con breadcrumb funcional (Inicio > Garantía y servicio).
- **Coherencia:** contradice al resto del sitio, que ya declara "Garantía: 1 año" en las 29 fichas de producto (ver sección 4.4) — un visitante que llegue aquí buscando el detalle de esa garantía de 1 año no lo encontrará.
- **Responsive:** sin problemas detectados (no tiene tablas ni elementos anchos).
- **CTA:** dos botones al final ("Ver datos de contacto", "Solicitar cotización") — correctos y funcionales.
- **Enlaces WhatsApp/teléfono:** presentes y con formato correcto (`tel:+51943688374`).
- **Riesgo:** al estar indexada (`index, follow`), un cliente podría llegar a esta página **desde una búsqueda de Google** y encontrarse con texto entre corchetes tipo "[Detalle pendiente: defectos de fabricación, componentes, etc.]" — esto se ve poco profesional si ocurre con un visitante real, no con quien ya conoce que el sitio está en desarrollo.

---

## 20. Enlaces internos

Se recorrieron automáticamente las 9 páginas y se verificó cada uno de los **40 enlaces internos únicos** del sitio (excluyendo enlaces externos, `mailto:`, `tel:` y anclas `#`) contra el servidor real.

**Resultado: los 40 enlaces devuelven código 200 (correcto). No se encontró ningún enlace roto, ninguna URL con error 404, ni ningún `href="#"` sin destino real, en ninguna de las 9 páginas.** Esto es un punto a favor claro del proyecto — **no hay nada que corregir en este punto.**

| Ubicación | Texto del enlace | Destino | Estado | Observación |
|---|---|---|---|---|
| Menú (8 de 9 páginas) | "Proyectos" | `proyectos.html` | 200 OK (destino existe) | El destino es una página con contenido 100% ficticio declarado (ver sección 17) — el enlace no está "roto", pero **enlaza a contenido que la propia portada decidió ocultar** |
| Footer (9 páginas) | "Proyectos" | `proyectos.html` | 200 OK | Mismo caso — aparece incluso en la portada, donde el menú superior lo oculta |
| Footer (9 páginas) | "Preguntas frecuentes" | `index.html#faq` | 200 OK | Correcto |
| Footer (9 páginas) | "Contacto" | `index.html#ubicanos` | 200 OK | Correcto |
| Todas las páginas | Enlace del logo | `index.html` | 200 OK | Correcto |
| `index.html` | "Ver en Google Maps" / "Abrir en Google Maps" | Enlace externo a `maps.app.goo.gl` | No verificable como interno (es externo) | Formato correcto, `target="_blank"` con `rel="noopener"` |

---

## 21. Google Business

Para que la web complemente correctamente un perfil de Google Business Profile, la información debe coincidir exactamente. Se compara lo que hay en el código contra lo que necesitaría un perfil de Google Business:

| Dato | En la web | Consistencia |
|---|---|---|
| Nombre comercial | "Jeinox Gastronomic" (dominante) vs. "Jeinox GastroSystems" (ubicación/WhatsApp) vs. "INDUSTRIAS JEINOX" (logo) | ❌ **Inconsistente** — ver sección 18 |
| Teléfonos | `+51 943 688 374` y `+51 926 669 669`, usados de forma consistente en todo el sitio (footer, header, garantía, ubicación) | ✅ Consistente |
| Ubicación | Un enlace de Google Maps (`maps.app.goo.gl/Go7pqGee3JetVSw69`) y un mapa embebido con coordenadas `-12.044493, -77.0409056` — ambos apuntan al mismo punto | ✅ Consistente (no se verificó si la dirección física real coincide con esas coordenadas, por ser información externa al código) |
| Horario | "Lunes a sábado: 9:00 a. m. – 8:00 p. m. Domingos y feriados: cerrado" — igual en `index.html` y `garantia.html` | ✅ Consistente |
| Correo | `jeinox2020@gmail.com` en todas las páginas donde aparece | ✅ Consistente. Nota: es una cuenta de Gmail genérica, no un correo corporativo (`@jeinox.com` o similar) — no es un error, pero un correo propio del dominio se ve más profesional |
| Categoría/rubro | "Equipamiento gastronómico profesional" — coherente en todo el sitio | ✅ Consistente |
| Enlaces | El sitio no tiene ningún enlace hacia un perfil de Google Business ni redes sociales (Facebook/Instagram) | 🟡 No se encontró ningún enlace saliente a redes sociales en ninguna página |

**Conclusión:** la información de contacto operativa (teléfono, correo, horario, ubicación) es sólida y consistente. El problema real para Google Business es el **nombre de marca inconsistente** (sección 18).

---

## 22. GitHub Pages: limitaciones reales vs. no reales

| Limitación | ¿Es real para este proyecto? | Explicación |
|---|---|---|
| No hay backend/servidor propio | **Real, pero irrelevante hoy.** El sitio no necesita backend: todo el carrito funciona con `localStorage` y el contacto es por WhatsApp. Sería una limitación real solo si se quisiera un formulario que envíe correos desde el servidor o un panel de administración. |
| No se pueden procesar formularios server-side | **Real.** Si en el futuro se quiere un formulario de contacto que envíe un correo (en vez de abrir WhatsApp), GitHub Pages no lo soporta nativamente — se necesitaría un servicio externo (Formspree, un backend propio, etc.). Hoy no aplica porque todo pasa por WhatsApp. |
| Rendimiento / CDN | **No es un problema real.** GitHub Pages sirve archivos estáticos a través de una CDN (Fastly); es rápido para sitios de este tamaño. |
| Caché de archivos | **Real pero menor.** GitHub Pages aplica cabeceras de caché estándar; no hay control fino sobre invalidación de caché por archivo, así que tras cada despliegue puede haber unos minutos de retraso hasta que todos los visitantes vean la versión más nueva. No representa un riesgo práctico para este sitio. |
| Tipos MIME | **No es un problema.** Se comprobó que las imágenes `.webp`, el CSS y el JS se sirven con el tipo de contenido correcto (confirmado en las pruebas de red: `image/webp`, `text/css`, `text/javascript`). |
| Seguridad (HTTPS) | **No es un problema.** GitHub Pages sirve todo el sitio por HTTPS automáticamente. |
| Límite de tamaño de repositorio | **No aplica todavía.** El proyecto pesa 2.94 MB; GitHub Pages soporta hasta 1 GB de forma cómoda. |
| Rutas / URLs limpias | **No es un problema.** Al ser un sitio simple con archivos `.html` explícitos en los enlaces (`catalogo.html`, no `/catalogo`), no depende de reescritura de URLs que GitHub Pages no soporta. |
| Escalabilidad de tráfico | **No es un problema esperable** en el corto/mediano plazo — GitHub Pages soporta bien picos de tráfico normales de una pyme. |

**Conclusión:** GitHub Pages **no es, hoy, un factor limitante real** para Jeinox. El único escenario donde dejaría de ser suficiente es si en el futuro se necesita un backend real (base de datos de productos administrable sin tocar código, formulario que envíe correos, panel de administración, pasarela de pagos) — ver sección 20 (escalabilidad).

---

## 23. Escalabilidad

Se analiza cómo se comportaría la arquitectura actual (un array de JavaScript en `data/products.js`, cargado completo en cada página) a distintos volúmenes de catálogo:

| Cantidad de productos | HTML/JS | Imágenes | Catálogo/búsqueda | Mantenimiento |
|---|---|---|---|---|
| **50 productos** (actual: 29) | Sin problema — `data/products.js` pesaría ~85 KB, insignificante | Sin problema si se sigue el mismo ritmo de fotos (2-3 por producto) | El filtro y buscador actuales (JavaScript puro sobre un array en memoria) siguen siendo instantáneos | Editar un solo archivo sigue siendo manejable a mano |
| **100 productos** | `data/products.js` rondaría ~165 KB — aceptable, pero ya es un archivo largo para editar a mano sin errores de sintaxis | El peso de `catalogo.html` (si se muestran todos a la vez, sin paginación) podría superar los 3-4 MB por visita — **aquí sí conviene paginación o "cargar más"** | Sigue siendo rápido (JavaScript maneja bien arrays de cientos de elementos), pero ya vale la pena paginar visualmente | Empieza a ser recomendable dividir el archivo de datos por categoría o migrar a un archivo JSON validable |
| **300 productos** | El archivo de datos ya es difícil de mantener a mano sin un editor con validación; alto riesgo de errores de sintaxis al copiar/pegar productos | **Aquí el catálogo sin paginación ni `srcset` se vuelve un problema real de rendimiento** (varios MB por visita si se cargan todas las imágenes) | Sigue siendo técnicamente viable en JavaScript puro, pero ya es momento de plantear generación estática (un HTML por producto, generado con un script) o un pequeño backend/CMS | Un cambio de precio o texto en 50 productos a la vez ya no es práctico a mano |
| **500 productos** | Aquí la arquitectura actual (todo en un solo array, sin build, sin CMS) **deja de ser recomendable como método principal de gestión** | Imprescindible paginación, `srcset` y probablemente un CDN de imágenes con redimensionado automático | Se recomienda migrar a un generador de sitios estáticos (Astro, Eleventy, Next.js en modo estático) o a un CMS headless (p. ej. uno gratuito) que genere las páginas de producto automáticamente | El mantenimiento manual del catálogo ya no es razonable; se necesita algún tipo de panel o planilla conectada |

**Punto recomendado para migrar de arquitectura:** entre **100 y 300 productos**, dependiendo de cuántas fotos por producto se mantengan. No es urgente hoy (29 productos), pero es la señal a vigilar a futuro.

---

## 24. Código: calidad y mantenibilidad

| Aspecto | Hallazgo |
|---|---|
| Arquitectura JS | Buena separación de responsabilidades: `main.js` (UI general), `products.js` (render), `catalog.js` (filtros), `quote.js` (carrito). Sin librerías externas, sin dependencias que puedan quedar desactualizadas. |
| Documentación en código | Cada archivo JS tiene un comentario de cabecera explicando su propósito; `data/products.js` incluye un `@typedef` (documentación de tipos) completo para la forma de cada producto. Buena práctica, poco común en proyectos de este tamaño. |
| Repetición de HTML | El `<header>` y `<footer>` (~50 líneas cada uno) están duplicados de forma idéntica en las 9 páginas HTML — es la mayor fuente de repetición del proyecto, y la causa directa de la inconsistencia del enlace "Proyectos" (sección 3.2). |
| Estilos en línea (`style="..."`) | Se contaron 29 usos de `style=""` repartidos en 8 de las 9 páginas (el máximo es `index.html`, con 10). La mayoría son ajustes menores de espaciado (`margin-bottom: var(--space-5)`), pero **dos casos usan colores fijos en vez de las variables de diseño**: `style="color:#6ea8fe;"` y `style="color:#cbd2d9;"` en la sección de garantía de `index.html:341-343`, en vez de usar los tokens ya definidos en `css/styles.css` (`--color-accent`, etc.). Esto es un riesgo de inconsistencia de marca si la paleta de colores cambia en el futuro: esos dos colores no se actualizarían junto con el resto. |
| IDs duplicados | No se encontraron IDs duplicados dentro de una misma página. |
| Código muerto | No se encontró código muerto relevante; las secciones desactivadas (Proyectos realizados, Testimonios en `index.html`) están correctamente comentadas con una nota explicando cuándo reactivarlas, no eliminadas ni dejadas a medias. |
| Comentarios obsoletos | No se encontraron comentarios que contradigan el código actual, salvo el ya mencionado de "Proyectos oculto temporalmente" que no se replicó en las demás páginas. |
| Herramientas de calidad | No hay configuración de linter (ESLint) ni formateador (Prettier) ni tests automatizados en el repositorio. Para el tamaño actual del proyecto no es indispensable, pero facilitaría detectar automáticamente el tipo de inconsistencias que esta auditoría encontró a mano (como el color fijo en vez de variable). |

---

## 25. JavaScript: errores potenciales

Se revisó el código de los 4 módulos JS buscando referencias a elementos inexistentes, problemas de eventos, `localStorage` y listeners duplicados.

| Hallazgo | Gravedad | Detalle |
|---|---|---|
| Todas las funciones que buscan un elemento por `id` (`document.getElementById(...)`) validan que exista antes de usarlo (`if (!el) return;`) | — (positivo) | Patrón consistente en `js/main.js`, `js/products.js`, `js/catalog.js`, `js/quote.js` — esto evita que el sitio se rompa si una página no tiene cierto elemento (por ejemplo, `js/catalog.js` se carga en `privacidad.html`, que no tiene catálogo, pero no genera error porque `initCatalog()` revisa `if (!grid) return;`) |
| `producto.html` sin parámetro `?slug=` válido | Baja | Se maneja correctamente: muestra un mensaje "Equipo no encontrado" en vez de fallar (`js/products.js:278-285`) — ya fue reforzado recientemente para tratar productos ocultos (`visible:false`) de la misma forma |
| Listeners duplicados | No encontrados | Cada `initX()` se llama una sola vez desde el único `DOMContentLoaded` de cada archivo; no hay registro repetido de eventos |
| `localStorage` sin `try/catch` | No aplica | `js/quote.js` sí envuelve las lecturas/escrituras de `localStorage` en `try/catch` (líneas 31-49), protegiendo contra navegadores con almacenamiento bloqueado (modo incógnito estricto, por ejemplo) |
| Funciones globales innecesarias | No encontradas | Todo el código usa módulos ES (`import`/`export`), sin variables filtradas al objeto `window` |
| Errores de consola en producción | **Ninguno detectado** | Verificado con navegador automatizado en las 9 páginas: 0 errores de consola, 0 recursos con error HTTP |

**Conclusión:** el JavaScript del proyecto está escrito de forma defensiva y no se encontraron errores reales en ejecución.

---

## 26. Seguridad básica frontend

| Aspecto | Evaluación |
|---|---|
| `target="_blank"` sin `rel="noopener"` | **No se encontró ningún caso** — se verificó con búsqueda automatizada en las 9 páginas; todos los enlaces externos usan `rel="noopener"` correctamente. Buena práctica ya aplicada. |
| Uso de `innerHTML` | Se usa en varias partes (`js/products.js`, `js/catalog.js`, `js/quote.js`) para pintar tarjetas y filas dinámicamente. El contenido insertado proviene siempre de `data/products.js` (datos internos y controlados por el propio desarrollador, no ingresados por usuarios externos), por lo que **el riesgo de inyección de código (XSS) es bajo** en el estado actual. El propio código incluye una función `escapeHtml()` (`js/products.js:144-148`) que sanea el texto antes de insertarlo en atributos HTML como `alt`, lo cual es una buena práctica preventiva. |
| Datos sensibles expuestos | No se encontraron claves de API, tokens ni contraseñas en el código. Los únicos datos "sensibles" son el correo y los teléfonos de contacto, que son públicos por diseño (es la información de contacto comercial). |
| Formularios | No envían datos a ningún servidor (confirmado en `privacidad.html`: "Esta fase del proyecto no envía datos de formularios a ningún servidor"); solo arman una URL de WhatsApp. No hay superficie de ataque de backend porque no existe backend. |
| `localStorage` | Solo almacena `{id, cantidad}` de productos del catálogo — no se guarda ningún dato personal del visitante. |
| Dependencias externas | El único recurso externo cargado es el `<iframe>` de Google Maps (`index.html`) — es un dominio de confianza (`google.com`) y usa `referrerpolicy="no-referrer-when-downgrade"` y `loading="lazy"`. No se cargan scripts de terceros (no hay Google Analytics, Facebook Pixel, ni ninguna librería externa). |

**Conclusión:** no se identificó ningún riesgo de seguridad relevante. El sitio, al no tener backend ni recolectar datos de usuarios, tiene una superficie de ataque mínima.

---

## 27. Priorización de todos los problemas encontrados

| # | Problema | Severidad | Archivo(s) |
|---|---|---|---|
| 1 | Canonical y Open Graph apuntan a un dominio inexistente (`.example`) en las 9 páginas | **ALTO** | Las 9 páginas HTML |
| 2 | El botón "Cotizar equipos" y "Agregar a cotización" se cortan entre 1024–1250 px | **ALTO** | `css/styles.css` (líneas 236, 406, 424-449) |
| 3 | Ficha de producto: canonical/Open Graph genéricos, no específicos por producto | **ALTO** | `producto.html`, `js/products.js` |
| 4 | Nombre de marca inconsistente (3 variantes) | **ALTO** | `index.html`, `js/main.js`, logo |
| 5 | `proyectos.html` y `garantia.html` indexables por Google con contenido de relleno declarado | **ALTO** | `proyectos.html`, `garantia.html` |
| 6 | Menú "Proyectos" inconsistente entre `index.html` y las demás páginas | **MEDIO** | `index.html` vs. resto |
| 7 | Mensaje contradictorio sobre garantía (portada dice "próximamente", fichas dicen "1 año") | **MEDIO** | `index.html`, `data/products.js` |
| 8 | Aviso de "datos de demostración" aplicado también a productos ya reales | **MEDIO** | `index.html` |
| 9 | Imágenes servidas a resolución completa sin `srcset`, catálogo pesa 1.2 MB | **MEDIO** | `js/products.js`, `assets/images/products/*` |
| 10 | Falta `robots.txt` y `sitemap.xml` | **MEDIO** | Raíz del proyecto |
| 11 | Mensaje de WhatsApp de "Mi cotización" muy básico (sin datos de contacto) | **MEDIO** | `js/quote.js` |
| 12 | Header y footer duplicados literalmente en 9 archivos (causa de la inconsistencia #6) | **MEDIO** | Las 9 páginas HTML |
| 13 | Dos colores fijos en HTML en vez de variables de diseño | **BAJO** | `index.html` (líneas 341-343) |
| 14 | Robots meta inconsistente entre páginas con contenido similar (`garantia`/`proyectos` indexables vs. `privacidad`/`libro-reclamaciones` no indexables) | **BAJO** | Comparación entre páginas |
| 15 | Overflow horizontal mínimo (2–8 px) a 320 px de ancho | **BAJO** | Todas las páginas |
| 16 | Dos textos distintos ("Cotizar equipos" / "Solicitar cotización") para el mismo destino | **BAJO** | `index.html` y otras |
| 17 | Formulario "a medida" usa solo el primer número de WhatsApp | **BAJO** | `js/main.js` |
| 18 | No hay categoría/filtro navegable para "equipos automáticos/digitales" | **BAJO** | `data/products.js`, `js/catalog.js` |
| 19 | Correo de contacto es una cuenta de Gmail genérica | **BAJO** | Todas las páginas |
| 20 | Placeholders de "proyectos" duplicados visualmente (3 imágenes reutilizadas 2 veces) | **BAJO** | `proyectos.html` |

---

## 28. Puntuaciones técnicas (0–100)

| Categoría | Puntaje | Motivo breve |
|---|---|---|
| Diseño visual | 78 | Paleta consistente, tipografía clara, diseño moderno; penaliza el uso puntual de colores fijos fuera del sistema de diseño |
| UX | 72 | Recorridos claros y funcionales, pero con fricciones de mensaje (garantía contradictoria, aviso de "demo" sobre datos reales) y navegación inconsistente ("Proyectos") |
| Mobile | 75 | Excelente en 320–768 px; penaliza fuerte el bug confirmado de 1024–1250 px |
| Rendimiento | 68 | Sin JS pesado ni terceros, buen uso de `lazy loading`, pero imágenes sin `srcset` encarecen el catálogo (1.2 MB) |
| SEO | 45 | Buena base semántica y schema, pero el dominio inexistente en canonical/OG y la falta de `robots.txt`/`sitemap.xml` son fallas de fondo |
| Accesibilidad | 80 | Buen manejo de teclado, ARIA y foco; falta verificación puntual de contraste y depende de JS para el contenido de producto |
| Conversión | 65 | Flujo de WhatsApp probado y funcional, pero el bug del CTA cortado y las vistas previas genéricas de producto restan efectividad |
| Código | 74 | Modular, documentado, sin dependencias externas; penaliza la duplicación de header/footer y ausencia de linter/tests |
| Catálogo | 80 | Buscador y filtros funcionan correctamente, sin huecos visuales, recién reforzado con el sistema `visible` |
| Cotización | 78 | Carrito robusto y persistente, sin duplicados; mensaje final de WhatsApp podría ser más completo |
| Confianza | 42 | Contenido de relleno visible y accesible por Google en varias páginas clave, más la inconsistencia de nombre de marca |
| Escalabilidad | 60 | Cómodo hasta ~100 productos; requiere plan de migración más allá de eso |

# **PUNTUACIÓN TÉCNICA GENERAL: 68 / 100**

*(Promedio de las 12 categorías. Esta nota evalúa el estado técnico del sitio, no el valor del negocio ni la calidad de sus productos o servicios.)*

---

## 29. Top 10 problemas más importantes

| # | Problema | Impacto | Gravedad | Archivo | Cómo corregirlo (a alto nivel) |
|---|---|---|---|---|---|
| 1 | Canonical/Open Graph con dominio inexistente | Confunde a Google y rompe las vistas previas de WhatsApp/Facebook en todo el sitio | ALTO | Las 9 páginas HTML | Reemplazar `https://www.jeinoxgastronomic.example/` por la URL real del sitio en producción en cada `<link rel="canonical">` y `<meta property="og:*">` |
| 2 | CTA "Cotizar equipos" cortado entre 1024–1250 px | Un visitante en tablet horizontal o laptop pequeña puede no encontrar el botón principal de conversión | ALTO | `css/styles.css` | Ajustar el punto de quiebre de 1024px, permitir que el texto del botón se acorte o reducir elementos del menú antes de esa medida |
| 3 | Ficha de producto sin SEO/Open Graph propio por producto | Compartir un producto por WhatsApp no muestra su nombre ni su foto | ALTO | `producto.html`, `js/products.js` | Actualizar también `canonical`, `og:title`, `og:url` y `og:image` con JavaScript al cargar cada producto (mismo mecanismo que ya actualiza el `<title>`) |
| 4 | Nombre de marca inconsistente (Gastronomic / GastroSystems / Industrias Jeinox) | Confunde a clientes y perjudica el SEO local (Google Business necesita un nombre único) | ALTO | `index.html`, `js/main.js`, logo | Definir un único nombre oficial y reemplazarlo en todo el sitio, incluyendo el logo |
| 5 | Páginas con contenido inventado indexables por Google | Un cliente puede llegar por Google a una página que dice literalmente "PLACEHOLDER" | ALTO | `proyectos.html`, `garantia.html` | Cambiar su meta robots a `noindex, follow` hasta tener contenido real, igual que ya se hizo con `privacidad.html` |
| 6 | Menú "Proyectos" visible en 8 páginas pero oculto en la portada | Inconsistencia de navegación; el objetivo de ocultar la sección no se cumple | MEDIO | `index.html` vs. resto | Aplicar el mismo criterio en las 9 páginas (ocultar o mostrar en todas por igual) |
| 7 | Mensaje contradictorio sobre la garantía | Un cliente puede desconfiar al ver "1 año" en un producto y "próximamente" en la portada | MEDIO | `index.html`, `data/products.js` | Unificar el mensaje: si ya hay una garantía de 1 año definida, reflejarlo también en el resumen de portada |
| 8 | Catálogo pesa 1.2 MB por visita | Carga más lenta en conexiones móviles, afecta LCP | MEDIO | `js/products.js`, imágenes | Generar versiones más livianas de cada imagen para el tamaño de tarjeta y usar `srcset` |
| 9 | Falta `robots.txt` y `sitemap.xml` | Dificulta que Google rastree todas las fichas de producto de forma ordenada | MEDIO | Raíz del proyecto | Crear ambos archivos apuntando a la URL real |
| 10 | Header y footer duplicados en 9 archivos | Cualquier cambio (teléfono, enlace, menú) debe hacerse 9 veces, con riesgo de inconsistencias como la del punto 6 | MEDIO | Las 9 páginas HTML | Evaluar una solución de "incluir" HTML (aunque GitHub Pages es estático, existen soluciones simples como Web Components o un pequeño script de build) |

---

## 30. Top 10 mejoras con mayor impacto

| # | Mejora | Beneficio principal |
|---|---|---|
| 1 | Corregir canonical/Open Graph con la URL real | SEO + vistas previas de WhatsApp correctas de inmediato |
| 2 | Arreglar el CTA cortado en 1024–1250 px | Conversión — el botón principal vuelve a ser 100% visible y usable |
| 3 | SEO dinámico por producto (canonical/OG por `slug`) | Cada producto compartido por WhatsApp se ve profesional con su nombre y foto |
| 4 | Unificar el nombre de marca | Confianza + mejor SEO local / Google Business |
| 5 | `noindex` en páginas con contenido de relleno | Evita que un cliente real llegue por Google a una página de "placeholder" |
| 6 | Generar imágenes en tamaño de tarjeta (~800×600) para el catálogo | Reduce el peso de `catalogo.html` de 1.2 MB a una fracción, mejora velocidad móvil |
| 7 | Agregar `robots.txt` y `sitemap.xml` | Mejora la indexación completa del catálogo en Google |
| 8 | Enriquecer el mensaje de WhatsApp de "Mi cotización" (nombre, referencia) | El vendedor recibe cotizaciones más completas, responde más rápido |
| 9 | Unificar el mensaje sobre garantía entre portada y fichas de producto | Refuerza confianza con un dato ya real (garantía de 1 año) |
| 10 | Completar contenido real de "Nosotros" y "Garantía" (años de experiencia, condiciones reales) | Aumenta directamente la confianza — es el bloque de menor puntaje de toda la auditoría (42/100) |

---

## 31. Plan de acción por fases

### FASE 1 — Urgente (afecta ventas o credibilidad hoy)
1. Corregir el dominio en `canonical` y Open Graph en las 9 páginas.
2. Corregir el bug de overflow del header en 1024–1250 px.
3. Poner `noindex, follow` en `proyectos.html` y `garantia.html` mientras su contenido sea de relleno.
4. Unificar el enlace "Proyectos" del menú (mostrarlo u ocultarlo igual en las 9 páginas).
5. Definir y unificar el nombre oficial de marca en todo el sitio (incluye decidir si se actualiza el logo).

### FASE 2 — Optimización (rendimiento, UX y SEO)
6. Generar imágenes de catálogo en un tamaño acorde a su uso real (`srcset` o versiones redimensionadas).
7. Implementar SEO dinámico por producto (canonical + Open Graph específico por `slug`).
8. Crear `robots.txt` y `sitemap.xml`.
9. Unificar el mensaje sobre garantía entre la portada y las fichas de producto.
10. Revisar y ajustar el aviso de "datos de demostración" para que no aplique a los productos que ya son reales.

### FASE 3 — Crecimiento (contenido, SEO local y conversión)
11. Redactar contenido real para `nosotros.html` (historia, misión, visión, años de experiencia).
12. Redactar condiciones reales de garantía para `garantia.html`.
13. Reemplazar `proyectos.html` con proyectos reales y fotos reales (o mantenerlo oculto hasta entonces).
14. Enriquecer el mensaje de WhatsApp de "Mi cotización" con más contexto para el vendedor.
15. Agregar mención explícita de "Lima, Perú" y considerar datos estructurados `LocalBusiness`.
16. Crear una categoría o filtro navegable para "equipos automáticos/digitales" si se quiere reforzar ese diferencial de marca.

### FASE 4 — Escala (arquitectura futura)
17. Si el catálogo supera ~100 productos: evaluar paginación del catálogo y división del archivo de datos.
18. Si supera ~300 productos: evaluar migrar a un generador de sitios estáticos o un CMS headless.
19. Evaluar reemplazar la duplicación de header/footer por una solución de "incluir" HTML, para reducir el riesgo de inconsistencias como la del enlace "Proyectos".
20. Definir un correo corporativo propio (en vez de Gmail) y una razón social/RUC definitivos, para poder completar `libro-reclamaciones.html` conforme a la normativa de INDECOPI.

---

## 32. Matriz impacto / esfuerzo

| Mejora | Impacto | Esfuerzo | Prioridad |
|---|---|---|---|
| Corregir dominio en canonical/Open Graph | Alto | Bajo | **Inmediata** |
| Arreglar overflow del header (1024–1250 px) | Alto | Bajo | **Inmediata** |
| `noindex` en páginas de relleno | Alto | Bajo | **Inmediata** |
| Unificar nombre de marca | Alto | Medio | **Inmediata** |
| Unificar enlace "Proyectos" en el menú | Medio | Bajo | Alta |
| SEO dinámico por producto (canonical/OG por slug) | Alto | Medio | Alta |
| Unificar mensaje de garantía | Medio | Bajo | Alta |
| Crear `robots.txt` / `sitemap.xml` | Medio | Bajo | Alta |
| Redimensionar imágenes del catálogo / `srcset` | Medio | Medio | Alta |
| Enriquecer mensaje de WhatsApp de cotización | Medio | Bajo | Media |
| Contenido real de "Nosotros" y "Garantía" | Alto | Alto (depende de información que solo Jeinox tiene) | Media |
| Filtro de "equipos automáticos/digitales" | Bajo | Medio | Media |
| Reemplazar duplicación de header/footer | Medio | Alto | Media |
| Proyectos reales con fotos reales | Alto | Alto (depende de material fotográfico real) | Media |
| Migrar arquitectura (100+ productos) | Alto (a futuro) | Alto | Baja (por ahora) |
| Correo corporativo propio / razón social-RUC | Medio | Depende de terceros (trámite legal) | Media |

---

## 33. Datos pendientes de confirmar con Jeinox GastroSystems

*(Detectados automáticamente en el código; no se inventó ninguna respuesta.)*

- Nombre de marca definitivo (¿"Jeinox Gastronomic" o "Jeinox GastroSystems"?).
- Razón social y RUC (bloquea completar `libro-reclamaciones.html` conforme a INDECOPI).
- Años de experiencia de la empresa (`nosotros.html` los deja como "[XX]+").
- Historia real de la empresa (origen, hitos).
- Misión y visión oficiales.
- Si la fabricación realmente se hace en "taller propio" (`nosotros.html` lo marca como "dato a confirmar").
- Condiciones exactas de garantía por línea de producto (duración real, qué cubre, qué no cubre) — hoy coexisten "1 año" (en productos) y "próximamente" (en la portada y en `garantia.html`).
- Detalle real del servicio técnico post-venta.
- Formas de pago aceptadas (el FAQ dice "diferentes alternativas" sin especificar cuáles).
- Proyectos reales terminados, con fotos y ubicaciones reales (para reemplazar `proyectos.html`).
- Reseñas o testimonios reales de clientes (la sección ya existe en el código, solo está desactivada a la espera de contenido real).
- Certificaciones (si las hay: normas técnicas, certificaciones sanitarias, etc. — no se menciona ninguna actualmente).
- Correo corporativo propio (actualmente se usa una cuenta de Gmail).
- Enlaces a redes sociales, si existen (no se encontró ninguno en el sitio).
- Confirmación de que las coordenadas del mapa (`-12.044493, -77.0409056`) corresponden a la dirección real y actual del negocio.
- Nombre oficial a usar frente a Google Business (debe coincidir exactamente con el que se use en la web).

---

## 34. Conclusión técnica

Jeinox GastroSystems tiene, para tratarse de un sitio sin backend construido como "Base V1", una **base de código sólida**: sin errores de consola, sin enlaces rotos, con buena accesibilidad básica, un carrito de cotización que funciona de punta a punta y un catálogo que ya filtra correctamente los productos sin fotos reales (mejora aplicada en la sesión anterior a esta auditoría).

Los problemas reales no están en "el código está mal escrito", sino en **tres frentes muy concretos y corregibles**:

1. **Metadatos técnicos mal configurados** (dominio de ejemplo en canonical/OG, falta de `robots.txt`/`sitemap.xml`, SEO no dinámico por producto) — esto es una corrección de bajo esfuerzo y alto impacto.
2. **Un bug real de layout** en un rango de pantalla específico (1024–1250 px) que oculta el botón de conversión más importante del sitio.
3. **Contenido y marca todavía en construcción** (nombre inconsistente, páginas con placeholders indexables, mensajes contradictorios sobre la garantía) — esto requiere decisiones de negocio de Jeinox, no solo código.

Ninguno de estos problemas exige rehacer el sitio: son ajustes puntuales, bien localizados por archivo y línea en este informe, sobre una base técnica que ya funciona.

---

# Respuestas directas a las 5 preguntas finales

**1. Puntuación técnica general:** **68 / 100**

**2. Los 5 problemas más urgentes:**
1. El `canonical` y las etiquetas Open Graph de las 9 páginas apuntan a un dominio que no existe (`jeinoxgastronomic.example`), rompiendo las vistas previas de WhatsApp/Facebook y confundiendo a Google.
2. El botón "Cotizar equipos" (y "Agregar a cotización" en las tarjetas) se corta visualmente en pantallas de 1024 a ~1250 px de ancho (tablets en horizontal, laptops pequeñas).
3. Cada ficha de producto comparte el mismo título/imagen genéricos al compartirse por WhatsApp o redes — no se actualiza el `canonical` ni el Open Graph por producto.
4. El nombre de la marca aparece de 3 formas distintas en el propio sitio ("Jeinox Gastronomic", "Jeinox GastroSystems", "INDUSTRIAS JEINOX" en el logo).
5. `proyectos.html` y `garantia.html` tienen contenido explícitamente ficticio ("PLACEHOLDER") pero están configuradas para que Google las indexe.

**3. Qué NO tocaría porque funciona correctamente hoy:**
- El sistema de "Mi cotización" (carrito con `localStorage`): persiste, suma cantidades correctamente, sin duplicados, sin errores.
- El formulario de "Fabricación a medida": arma un mensaje de WhatsApp completo y bien estructurado.
- El buscador y los filtros del catálogo (recién reforzados con el sistema `visible` para ocultar productos sin fotos reales).
- El manejo de accesibilidad por teclado del menú móvil y del acordeón de FAQ.
- Todos los enlaces `target="_blank"` ya usan `rel="noopener"` correctamente — no hay nada que corregir en seguridad de enlaces externos.
- Los 40 enlaces internos del sitio funcionan sin ningún 404.
- El uso de `loading="lazy"` y `width`/`height` en las imágenes, que ya evita saltos de layout (CLS).

**4. Dónde se guardó el archivo de auditoría:**
- `auditoria/AUDITORIA_WEB_JEINOX_GASTROSYSTEMS.md` (dentro del proyecto, dado que la carpeta `auditoria/` no formaba parte del sitio publicado, no se subió a `git` — sigue como archivo local sin confirmar/pushear hasta que Jeinox lo autorice).
- También se generó una versión navegable en `auditoria/AUDITORIA_WEB_JEINOX_GASTROSYSTEMS.html`.

**5. Autorización:**
No se modificó ningún archivo del proyecto durante esta auditoría. Quedo a la espera de tu autorización para aplicar cualquiera de las correcciones descritas (se recomienda empezar por la Fase 1).

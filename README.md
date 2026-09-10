# GastroEquipos — Base V1

Sitio web tipo catálogo para comercializar equipamiento gastronómico
profesional: línea caliente, línea fría, acero inoxidable y
fabricaciones a medida, dirigido a restaurantes, pollerías, chifas,
panaderías, cafeterías, comida rápida y negocios afines.

## 1. Objetivo de esta fase

Esta es la **Base V1**: una arquitectura profesional, modular,
escalable y mobile-first para mostrar el catálogo y generar
solicitudes de cotización. **No es un e-commerce.** No incluye
pasarela de pagos, checkout, usuarios/login, base de datos, panel
administrativo ni backend. Todos los datos de productos, precios,
especificaciones, testimonios y proyectos son **demostrativos o
placeholders** y deben reemplazarse por información real antes de
publicar el sitio (ver sección 9).

## 2. Estructura del proyecto

```
/
├── index.html                 Inicio
├── catalogo.html               Catálogo con buscador y filtros
├── producto.html                Plantilla única de ficha de producto (usa ?slug=)
├── nosotros.html                 Sobre la empresa
├── proyectos.html                 Proyectos realizados (placeholders)
├── garantia.html                   Garantía y servicio técnico
├── cotizacion.html                  "Mi cotización" (localStorage)
├── libro-reclamaciones.html          Placeholder legal (Perú / INDECOPI)
├── privacidad.html                    Placeholder de política de privacidad
├── assets/
│   ├── images/
│   │   ├── products/            Placeholders SVG reutilizables de producto
│   │   ├── categories/           Imágenes de las 3 categorías principales
│   │   ├── projects/              Placeholders SVG de proyectos
│   │   └── branding/               Logo temporal (claro y sobre fondo oscuro)
│   ├── icons/
│   │   ├── sprite.svg              Sprite de iconos UI (<use href="...#icon-x">)
│   │   └── favicon.svg
│   └── videos/                       Carpeta preparada para video de fondo futuro
├── css/
│   └── styles.css                     Sistema de diseño completo (mobile-first)
├── js/
│   ├── main.js                         Navegación, header, acordeón FAQ, formularios, toast
│   ├── catalog.js                       Buscador y filtros del catálogo
│   ├── products.js                       Render de productos, ficha técnica, ficha de producto
│   └── quote.js                           "Mi cotización" (localStorage)
├── data/
│   └── products.js                         Fuente única de datos (categorías, negocios, productos)
└── README.md
```

## 3. Tecnología y decisiones técnicas

- **HTML5 semántico + CSS moderno + JavaScript vanilla con ES Modules
  nativos.** Sin frameworks (React/Vue/Next) ni bundlers.
- **Por qué no Tailwind en esta fase:** usar Tailwind "correctamente
  para producción" requiere un paso de build (CLI/PostCSS con
  purga de clases). Para mantener el despliegue como archivos
  estáticos simples (compatible con GitHub Pages y Netlify sin
  pipeline de CI), se optó por CSS propio con *design tokens*
  (custom properties), Grid/Flexbox y `clamp()` para tipografía
  fluida. Esto es más fácil de mantener sin herramientas adicionales.
- **ES Modules nativos** (`<script type="module">`): permiten dividir
  la lógica en `main.js` / `catalog.js` / `products.js` / `quote.js`
  sin necesidad de bundler. Cada módulo se auto-inicializa detectando
  si el elemento raíz que le corresponde existe en la página actual
  (por ejemplo, `catalog.js` no hace nada si no encuentra
  `#catalogGrid`), por lo que es seguro incluir los cuatro scripts en
  todas las páginas.
- **Sin imágenes externas de terceros:** todos los placeholders
  visuales (productos, categorías, proyectos, logo, iconos) son SVG
  propios, livianos y fáciles de reemplazar.
- **Sin dominio real:** las URLs canónicas y Open Graph usan
  `https://www.gastroequipos-peru.example/` (dominio reservado para
  documentación, RFC 2606) como placeholder. Reemplázalo por el
  dominio real cuando esté disponible (ver sección 8).

## 4. Cómo ejecutar localmente

No requiere instalación de dependencias. Basta con servir la carpeta
como archivos estáticos (abrir `index.html` directamente con doble
clic también funciona, aunque un servidor local evita restricciones
de algunos navegadores con módulos ES vía `file://`):

```bash
# Con Python 3
python3 -m http.server 8080

# o con Node (si tienes npx disponible)
npx serve .
```

Luego visita `http://localhost:8080`.

## 5. Cómo agregar un producto nuevo

Todo el catálogo se genera desde **`data/products.js`**. Nunca se
escribe un producto directamente en HTML.

1. Abre `data/products.js`.
2. Copia un objeto del arreglo `products` y pégalo al final.
3. Cambia `id` (único) y `slug` (único, minúsculas, con guiones).
4. Ajusta `category`, `subcategory` y `businessTypes` según el
   equipo (un mismo producto puede pertenecer a varios tipos de
   negocio sin duplicarse).
5. Completa `specifications` **solo** con los campos que apliquen a
   ese equipo (no se muestran filas para campos ausentes).
6. Define `price` y `priceType` (`"fixed"`, `"from"` o `"quote"`) —
   el precio nunca es obligatorio.
7. Marca `featured: true` si debe aparecer en "Equipos destacados"
   del inicio (recomendado: 6 a 8 productos).

El producto aparecerá automáticamente en el catálogo, en destacados
(si corresponde) y tendrá su ficha en `producto.html?slug=tu-slug`
sin tocar ningún archivo HTML.

## 6. Cómo cambiar imágenes

- **Productos:** reemplaza los archivos en `assets/images/products/`
  manteniendo el nombre, o cambia las rutas dentro del arreglo
  `images` de cada producto en `data/products.js`.
- **Categorías:** reemplaza `assets/images/categories/linea-caliente.svg`,
  `linea-fria.svg` o `acero-inoxidable.svg` (o edita `data/products.js`
  si cambias el nombre del archivo).
- **Logo:** reemplaza `assets/images/branding/logo.svg` (uso general)
  y `logo-light.svg` (footer, fondo oscuro). Ambos se referencian una
  sola vez por página mediante `<img>`, así que basta con sustituir
  el archivo.
- Al incorporar fotografías reales, usa **WebP/AVIF**, define
  `width`/`height` (o `aspect-ratio`) para evitar *layout shift*, y
  mantén `loading="lazy"` salvo en imágenes críticas visibles sin
  scroll.

## 7. Cómo editar categorías y tipos de negocio

Ambos viven en `data/products.js`:

- `categories`: las 3 categorías principales (línea caliente, línea
  fría, acero inoxidable) con sus subcategorías. Se renderizan
  automáticamente en el inicio (`initCategoryGrid` en
  `js/products.js`).
- `businessTypes`: los tipos de negocio (restaurantes, pollerías,
  chifas, etc.). Se renderizan en "¿Qué negocio estás equipando?" y
  se usan para filtrar el catálogo vía `catalogo.html?business=id`.

## 8. Cómo configurar WhatsApp en el futuro

El sistema de cotización ya genera el mensaje de texto, pero **no
tiene un número de WhatsApp real conectado** en esta fase.

Para activarlo:

1. Abre `js/quote.js`.
2. Ubica la constante `WHATSAPP_NUMBER` (cerca del inicio del
   archivo) y coloca el número comercial en formato internacional,
   sin `+` ni espacios (ejemplo: `"51987654321"`).
3. El botón "Solicitar cotización" en `cotizacion.html` detectará
   automáticamente que el número está configurado y abrirá WhatsApp
   con el mensaje ya armado (ver `buildWhatsAppUrl()` /
   `buildWhatsAppMessage()`).

Mientras el número no esté configurado, el botón muestra el mensaje
generado en pantalla para que el equipo comercial lo revise
manualmente.

## 9. Placeholders pendientes de información real

Antes de publicar el sitio, reemplazar:

- Precios, disponibilidad y especificaciones técnicas de todos los
  productos (`data/products.js`) — son datos demostrativos.
- Dirección, teléfono/WhatsApp, correo y horario de atención
  (sección "Visítanos" en `index.html`).
- Años de experiencia, garantía, "taller propio" y cobertura
  (sección "Por qué elegirnos").
- Contenido de "Nosotros" (historia, misión, visión).
- Testimonios reales (actualmente marcados como "Testimonio de
  ejemplo").
- Proyectos reales con foto, tipo de negocio, ubicación y equipos
  utilizados (actualmente placeholders, sin nombres de clientes).
- Condiciones de garantía y servicio técnico (`garantia.html`).
- Respuestas definitivas del FAQ (`index.html#faq`).
- Información legal: razón social, RUC, libro de reclamaciones
  (`libro-reclamaciones.html`) y política de privacidad
  (`privacidad.html`).
- Logo definitivo (`assets/images/branding/logo.svg` y
  `logo-light.svg`), actualmente un logo temporal.
- Número de WhatsApp (ver sección 8).

## 10. Preparado para el futuro (no implementado aún)

La arquitectura deja espacio para, sin rehacer el sitio:

- Carrito de cotización múltiple más avanzado (ya existe una base
  funcional en `js/quote.js` con localStorage).
- WhatsApp dinámico (ver sección 8).
- Fichas de producto en PDF.
- Filtros avanzados de catálogo: precio, capacidad, dimensiones,
  número de puertas/hornillas, potencia, material (ver comentario en
  `js/catalog.js`, función `matchesFilters`).
- Catálogo descargable.
- Comparación de productos.
- Google Analytics / Meta Pixel / Google Tag Manager.
- SEO local y dominio propio.
- Envío real del formulario de fabricación a medida a un backend/CRM.
- Integración futura con un CMS para gestionar productos sin tocar
  código.

## 11. Cómo desplegar (cuando esté aprobado)

El proyecto es 100% archivos estáticos, compatible con:

- **Netlify:** arrastrar la carpeta o conectar el repositorio (sin
  comando de build; carpeta de publicación = raíz del proyecto).
- **GitHub Pages:** publicar la rama deseada como fuente de Pages
  (sin build step).

**Esta fase no incluye ningún despliegue.** El sitio debe revisarse
localmente antes de publicarlo.

## 12. Funciones ya implementadas vs. pendientes

**Implementado:**
- Header responsive con menú hamburguesa accesible (teclado, foco,
  `aria-expanded`) y estado sticky.
- Hero con CTAs e indicadores de confianza.
- Categorías, tipos de negocio y productos destacados generados
  desde `data/products.js`.
- Catálogo con búsqueda, filtros por línea y filtro por tipo de
  negocio (`?business=`).
- Ficha de producto única y reutilizable (`producto.html?slug=`) con
  galería, ficha técnica dinámica (oculta campos vacíos) y
  productos relacionados.
- "Mi cotización" completo con localStorage: agregar, cambiar
  cantidad, eliminar, vaciar y generar el mensaje de solicitud.
- Formulario de fabricación a medida con validación Front-End (sin
  envío a servidor).
- FAQ en acordeón accesible, sección de garantía, ubicación y CTA
  final.
- Datos estructurados (Schema.org) para `Organization` en todas las
  páginas y `Product` + `BreadcrumbList` inyectados dinámicamente en
  la ficha de producto.

**Preparado pero no activo:**
- Envío de WhatsApp real (falta número).
- Envío del formulario de fabricación a un backend.
- Filtros avanzados de catálogo.
- Analítica (GA/GTM/Meta Pixel).

---

No continuar con nuevas funcionalidades sobre esta base sin
autorización explícita del equipo del proyecto.

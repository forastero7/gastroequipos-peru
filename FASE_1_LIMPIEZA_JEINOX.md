# FASE 1 — Limpieza y preparación comercial — Jeinox GastroSystems

**Fecha de ejecución:** 20 de septiembre de 2026
**Alcance:** Únicamente la Fase 1 (limpieza y ocultamiento de contenido incompleto/placeholder). No se ejecutó ninguna otra fase.
**Regla seguida:** ocultar/conservar en vez de destruir, y no inventar ningún dato empresarial no confirmado.

---

## 1. Resumen de la fase

Se revisaron las 9 páginas HTML del sitio, `data/products.js` y los 4 módulos de `js/` en busca de contenido que evidenciara que la web está en desarrollo (textos "PLACEHOLDER", corchetes `[...]`, "pendiente", "dato a confirmar", avisos de "datos de demostración", etc.).

Se aplicaron **8 tareas** solicitadas: ocultar "Proyectos" del menú y footer en todo el sitio, limpiar textos placeholder visibles, revisar `nosotros.html`, revisar mensajes de garantía, quitar el aviso de "datos de demostración" sobre productos ya reales, verificar que testimonios sigan desactivados, retirar de la interfaz pública el aviso de "Razón social y RUC pendientes", y hacer una revisión global final.

**No se inventó ningún dato de la empresa.** Donde no existía información real, el contenido se ocultó (con comentarios HTML explicando por qué y cómo reactivarlo), nunca se rellenó con datos ficticios.

---

## 2. Archivos modificados

Únicamente estos 9 archivos HTML. **No se tocó ningún archivo CSS, JavaScript ni `data/products.js`** (tal como exigía la Fase 1):

| Archivo | Líneas cambiadas |
|---|---|
| `index.html` | 8 |
| `catalogo.html` | 9 |
| `cotizacion.html` | 9 |
| `producto.html` | 11 |
| `garantia.html` | 32 |
| `nosotros.html` | 42 |
| `proyectos.html` | 13 |
| `privacidad.html` | 9 |
| `libro-reclamaciones.html` | 9 |

---

## 3. Cambios realizados en cada archivo

### `index.html`
- Se ocultó (ya estaba oculto en el menú) también el enlace **"Proyectos" del footer** ("Empresa").
- Se eliminó el aviso *"Datos de demostración para probar la interfaz — no representan precios ni especificaciones reales"* sobre la sección "Equipos destacados", porque los 8 productos que ahí se muestran ya tienen fotografías y especificaciones reales.
- Se reescribió el texto de la sección "Garantía y servicio técnico" para que sea coherente con el dato ya real cargado en el catálogo (garantía de 1 año), en vez de decir que "se detallará próximamente" — no se inventó ninguna condición nueva, solo se alineó con el dato que ya existe en `data/products.js`.
- Se retiró el aviso visible "Razón social y RUC pendientes de definir." del footer (queda solo como comentario interno, invisible).

### `catalogo.html`, `cotizacion.html`, `producto.html`, `privacidad.html`, `libro-reclamaciones.html`
- Se ocultó el enlace **"Proyectos" del menú principal** (con un comentario explicando cuándo reactivarlo).
- Se ocultó el enlace **"Proyectos" del footer**.
- Se retiró el aviso visible "Razón social y RUC pendientes de definir." del footer (comentario interno, invisible).

### `garantia.html`
- `<meta name="robots">` cambiado de `index, follow` a **`noindex, follow`** (con comentario explicando por qué y cuándo revertirlo).
- Se eliminó la frase *"Todo el contenido siguiente es un PLACEHOLDER"* del texto introductorio, reemplazada por un mensaje honesto que no admite ni inventa nada: *"Aquí encontrarás la duración de garantía de nuestros equipos y nuestros canales de soporte. Estamos completando el detalle de cobertura por línea de producto."*
- El bloque **"Duración de la garantía"** (antes `[Duración de garantía pendiente de definir...]`) ahora dice *"Nuestros equipos cuentan con 1 año de garantía de fabricación. Las condiciones específicas se confirman antes de cada compra."* — este dato (1 año) **ya estaba cargado y confirmado** en los 29 productos de `data/products.js`; no se inventó nada nuevo, solo se reflejó lo que ya existe en el catálogo.
- Se **ocultaron** (no se inventaron) los bloques **"Qué cubre"**, **"Qué no cubre"** y **"Servicio técnico"**, que solo contenían texto entre corchetes sin ningún dato real. Quedó un comentario HTML indicando que deben reactivarse cuando Jeinox proporcione esa información.
- Se conservaron intactos los bloques **"Canales de soporte"** y **"Horario de atención"**, que ya contenían información real.
- Se ocultó el enlace "Proyectos" del menú y del footer; se retiró el aviso de RUC/razón social del footer.

### `nosotros.html`
- Se eliminó de la frase principal (hero) la oración *"El contenido de esta sección es provisional y se actualizará con información real de la empresa."*
- Se **ocultó completamente** la sección **"Nuestra historia" / "Misión y visión"**, que solo tenía corchetes (`[Historia... pendiente]`, `[Pendiente de definir.]` ×2). Queda como comentario HTML explicando que debe reactivarse cuando existan esos datos — no se inventó ninguna historia, misión ni visión.
- En "Nuestro proceso de fabricación", se quitó la anotación *"(dato a confirmar)"* del paso 3, dejando *"Producción en taller propio con acero inoxidable"* — se alineó con el mismo dato ("Taller propio") que la portada (`index.html`) ya presenta como información real, sin inventar nada nuevo.
- En "Por qué elegirnos": se **eliminó** el bloque **"[XX]+ Años de experiencia"** (no existe ningún número confirmado en ningún lugar del proyecto, así que no se inventó ninguna cifra). Los otros 3 datos (Garantía, Fabricación, Cobertura) se dejaron **sin corchetes**, porque ya se presentan como información real en la portada del sitio (`index.html`); solo se quitó la marca de "pendiente" para que ambas páginas sean consistentes entre sí.
- Se ajustó el grid de estadísticas (ahora 3 en vez de 4 elementos) para que no quede un espacio vacío en la fila.
- Se ocultó el enlace "Proyectos" del menú y del footer; se retiró el aviso de RUC/razón social del footer.

### `proyectos.html`
- `<meta name="robots">` cambiado de `index, follow` a **`noindex, follow`** (con comentario explicando el motivo).
- Se ocultó su propio enlace "Proyectos" en el menú (para que la navegación sea consistente en las 9 páginas) y el del footer.
- Se retiró el aviso de RUC/razón social del footer.
- **No se tocó el contenido interno de la página** (las 6 tarjetas de ejemplo, textos "PLACEHOLDER", "[Ubicación pendiente]"): la instrucción de la Fase 1 fue explícita en no inventar proyectos, y como la página ya queda huérfana (sin ningún enlace público que lleve a ella) y fuera de Google (`noindex`), un visitante normal no puede llegar a verla navegando el sitio ni buscando en Google. El archivo se conserva intacto para reactivarlo cuando existan proyectos reales.

---

## 4. Elementos ocultados temporalmente (con comentario HTML para reactivar)

1. Enlace "Proyectos" del menú principal en 8 páginas (ya estaba oculto en `index.html`).
2. Enlace "Proyectos" del pie de página en las 9 páginas.
3. Sección completa "Nuestra historia" / "Misión y visión" en `nosotros.html`.
4. Bloques "Qué cubre", "Qué no cubre" y "Servicio técnico" en `garantia.html`.
5. Estadística "Años de experiencia" en `nosotros.html`.
6. `proyectos.html` completo (queda huérfano y con `noindex`, no navegable desde ninguna página, pero no se borró ni se le quitó contenido).

## 5. Elementos eliminados (texto, no código)

1. Aviso "Datos de demostración para probar la interfaz..." sobre los productos destacados de `index.html`.
2. Frase "El contenido de esta sección es provisional..." en `nosotros.html`.
3. Frase "Todo el contenido siguiente es un PLACEHOLDER." en `garantia.html`.
4. Anotación "(dato a confirmar)" sobre "taller propio" en `nosotros.html`.
5. Aviso visible "Razón social y RUC pendientes de definir." del footer de las 9 páginas (queda solo como comentario interno para desarrolladores).
6. Corchetes sobre datos ya reales ("Garantía", "Fabricación", "Cobertura") en `nosotros.html` — no se eliminó el dato, solo la marca de "pendiente".

Nada de código (HTML, CSS ni JS) fue borrado del proyecto; solo se retiró o reescribió texto visible, y se agregaron comentarios internos.

## 6. Elementos conservados para uso futuro (no se tocaron)

- `proyectos.html` completo, con sus 6 tarjetas de ejemplo — listo para reemplazar por proyectos reales y reactivar el enlace.
- La sección "Nuestra historia / Misión y visión" de `nosotros.html`, comentada pero no borrada.
- Los bloques "Qué cubre / Qué no cubre / Servicio técnico" de `garantia.html`, comentados pero no borrados.
- La sección "Testimonios" de `index.html`: ya estaba comentada de antes; se verificó que sigue así, no se modificó.
- `data/products.js`: **no se tocó ningún dato**, incluidos los valores `"-- (por confirmar)"` de especificaciones técnicas (dimensiones, potencia, peso, etc.) y el campo `warranty: "1 año"` de los 29 productos — la instrucción de la Fase 1 fue explícita en no cambiar el sistema de productos ni la garantía ya cargada como dato.
- `privacidad.html` y `libro-reclamaciones.html`: se les quitó el aviso de RUC/razón social del footer, pero **su contenido propio** (que ya declara honestamente que son marcadores de posición legales) se dejó intacto, porque la Fase 1 pidió explícitamente no inventar datos legales para estas dos páginas y mantenerlas identificadas como pendientes (ya estaban correctamente en `noindex, follow`).

## 7. Información que todavía necesita confirmar Jeinox

*(No se inventó ninguna de estas respuestas.)*

- Razón social y RUC (para completar el footer y `libro-reclamaciones.html`).
- Historia real de la empresa (origen, hitos, trayectoria) — para reactivar la sección en `nosotros.html`.
- Misión y visión oficiales — para reactivar la sección en `nosotros.html`.
- Años de experiencia de la empresa (no hay ninguna cifra confirmada en el proyecto).
- Cobertura exacta de la garantía: qué cubre y qué no cubre — para reactivar esos bloques en `garantia.html`.
- Detalle del servicio técnico post-venta — para reactivar ese bloque en `garantia.html`.
- Proyectos reales terminados, con fotos y ubicaciones reales — para reemplazar `proyectos.html` y reactivar su enlace.
- Reseñas o testimonios reales de clientes (la sección ya existe en el código, solo espera contenido real).

## 8. Pruebas realizadas

1. Validación de sintaxis HTML de las 9 páginas (sin errores de parseo).
2. Validación de sintaxis de los 4 módulos JS y de `data/products.js` (`node --check`) — confirmando que, en efecto, no se tocaron.
3. Servidor local + navegador automatizado (Playwright/Chromium) recorriendo las 9 páginas, verificando:
   - Código de respuesta HTTP de cada página.
   - Errores de consola/JavaScript.
   - Recursos con error (4xx/5xx).
   - Que el menú (desktop) y el footer de cada página **no** contengan la palabra "Proyectos".
   - El valor de la etiqueta `<meta name="robots">` de cada página.
   - Ausencia de textos "PLACEHOLDER", "Pendiente de definir", "Datos de demostración", "dato a confirmar" y "Razón social y RUC pendientes" visibles (excepto dentro de `proyectos.html`, dejado así a propósito).
4. Catálogo: conteo total de productos mostrados y filtro por categoría.
5. Ficha de producto → "Agregar a cotización" → contador del header.
6. "Mi cotización": persistencia tras navegar, generación de la URL de WhatsApp (interceptada en el navegador para no depender de red externa), botón "Vaciar lista".
7. Formulario "Fabricación a medida": envío y generación de URL de WhatsApp.
8. Menú móvil: apertura con el botón hamburguesa y verificación de que no contiene "Proyectos".
9. Verificación de los 39 enlaces internos únicos del sitio contra el servidor real (ninguno roto).
10. Se reutilizó además la suite de regresión general ya existente del proyecto (consola, catálogo/filtros/búsqueda, cotización + localStorage, menú móvil por teclado).

## 9. Errores encontrados durante las pruebas

**Ninguno.** Todas las pruebas pasaron en el primer intento, sin necesidad de correcciones posteriores.

## 10. Estado final de cada prueba

| Prueba | Resultado |
|---|---|
| Sintaxis HTML (9 páginas) | ✅ OK |
| Sintaxis JS y `data/products.js` | ✅ OK (sin cambios, como debía ser) |
| Consola/errores HTTP en las 9 páginas | ✅ 0 errores |
| "Proyectos" ausente del menú en las 9 páginas | ✅ OK |
| "Proyectos" ausente del footer en las 9 páginas | ✅ OK |
| `robots` de `proyectos.html` y `garantia.html` | ✅ `noindex, follow` |
| `robots` de páginas activas (index, catálogo, producto, nosotros) | ✅ sin cambios, `index, follow` |
| Texto placeholder visible (fuera de `proyectos.html`) | ✅ ninguno encontrado |
| Catálogo — conteo de productos ("Todos") | ✅ 18 |
| Filtro por categoría | ✅ funciona |
| Agregar a cotización + contador | ✅ funciona |
| Persistencia de "Mi cotización" | ✅ funciona |
| URL de WhatsApp generada (cotización) | ✅ formato correcto |
| Formulario "Fabricación a medida" → WhatsApp | ✅ funciona |
| Menú móvil (abrir + sin "Proyectos") | ✅ funciona |
| Enlaces internos (39 únicos) | ✅ 0 rotos |
| Diseño / responsive | ✅ sin cambios visuales de layout general (solo se redujo contenido en 2 páginas, sin romper la grilla) |

## 11. Confirmación de que catálogo, cotización y WhatsApp siguen funcionando

**Confirmado con pruebas automatizadas reales, no solo revisión visual:**
- El catálogo sigue mostrando los 18 productos visibles, con filtros y búsqueda operativos.
- "Mi cotización" sigue agregando productos, actualizando el contador del header, persistiendo entre páginas (localStorage) y generando el mensaje de WhatsApp correctamente.
- Los botones de WhatsApp (tanto en "Mi cotización" como en el formulario de "Fabricación a medida") siguen generando URLs `https://wa.me/...` válidas con el mensaje correspondiente.
- Ningún número de WhatsApp, ninguna lógica de carrito y ningún filtro fueron modificados.

## 12. Asuntos pendientes para la Fase 2 (no ejecutados en esta fase)

Recordatorio de lo que la auditoría original y esta Fase 1 dejan abierto para una futura Fase 2 (optimización SEO/performance), que **no debe iniciarse sin autorización**:

- Corregir el dominio en `canonical` y Open Graph (actualmente apunta a un dominio de ejemplo inexistente).
- Corregir el bug responsive del botón "Cotizar equipos" cortado entre 1024–1250 px.
- Implementar SEO dinámico por producto (canonical/Open Graph específico por `slug`).
- Crear `robots.txt` y `sitemap.xml`.
- Unificar el nombre de marca ("Jeinox Gastronomic" vs. "Jeinox GastroSystems" vs. "Industrias Jeinox" en el logo).
- Redimensionar imágenes del catálogo / implementar `srcset`.
- Cuando Jeinox confirme razón social y RUC: completar el footer y `libro-reclamaciones.html`.
- Cuando Jeinox confirme historia/misión/visión: reactivar esa sección en `nosotros.html`.
- Cuando Jeinox confirme cobertura y exclusiones de garantía: reactivar esos bloques en `garantia.html`.
- Cuando existan proyectos reales con fotos: reemplazar el contenido de `proyectos.html`, quitar el `noindex` y reactivar su enlace en el menú y el footer.

---

# Resumen corto

Se ocultó "Proyectos" del menú y del footer en las 9 páginas (antes solo estaba oculto en la portada), se marcó `proyectos.html` y `garantia.html` como `noindex` mientras tengan contenido de ejemplo, se limpiaron o se ocultaron (nunca se inventaron) los textos "PLACEHOLDER", corchetes y avisos de "pendiente"/"datos de demostración" visibles en `index.html`, `nosotros.html` y `garantia.html`, y se retiró de la interfaz pública el aviso de "Razón social y RUC pendientes". No se tocó ningún archivo CSS ni JavaScript, ni `data/products.js`, ni el diseño, ni el carrito, ni el buscador, ni WhatsApp. Se probó todo (catálogo, cotización, WhatsApp, menú móvil, 39 enlaces internos) y no se encontró ningún error.

**No se ejecutó la Fase 2. Quedo a la espera de tu autorización para continuar.**

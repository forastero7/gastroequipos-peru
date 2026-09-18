/**
 * data/products.js
 * ------------------------------------------------------------------
 * FUENTE ÚNICA DE DATOS del catálogo de Jeinox Gastronomic.
 *
 * Ningún producto debe escribirse "a mano" en el HTML. Todas las
 * páginas (inicio, catálogo, ficha de producto, relacionados) leen
 * de aquí a través de js/products.js.
 *
 * CÓMO AGREGAR UN PRODUCTO NUEVO
 * 1. Copia un objeto de PRODUCTS y pégalo al final del arreglo.
 * 2. Cambia "id" y "slug" (el slug debe ser único, en minúsculas y
 *    con guiones, ej: "horno-rotativo-industrial").
 * 3. Ajusta category / subcategory / businessTypes.
 * 4. Completa specifications SOLO con los campos que apliquen a ese
 *    producto (no agregues campos que no correspondan al equipo).
 * 5. Si aún no tienes una foto real, deja el arreglo "images" con los
 *    placeholders genéricos de assets/images/products/.
 * 6. Marca featured:true si quieres que aparezca en "Equipos
 *    destacados" en la página de inicio (recomendado: 6 a 8 productos).
 *
 * CÓMO CAMBIAR IMÁGENES
 * Reemplaza el archivo físico en assets/images/products/ manteniendo
 * el mismo nombre, o cambia la ruta dentro de "images". Usa WebP/AVIF
 * cuando tengas fotografías reales (ver README, sección Imágenes).
 *
 * NOTA IMPORTANTE SOBRE LOS DATOS
 * Todo lo incluido aquí (precios, especificaciones, disponibilidad)
 * es DEMOSTRATIVO, para probar la interfaz. Debe reemplazarse por
 * información comercial real antes de publicar el sitio.
 * ------------------------------------------------------------------
 */

/**
 * Categorías principales del catálogo.
 * @typedef {Object} Category
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {string} image
 * @property {{id:string, name:string}[]} subcategories
 */

/** @type {Category[]} */
export const categories = [
  {
    id: "linea-caliente",
    name: "Línea caliente",
    description:
      "Cocinas, hornos, freidoras, parrillas y planchas para producción en volumen.",
    image: "assets/images/categories/linea-caliente.svg",
    subcategories: [
      { id: "cocinas", name: "Cocinas industriales" },
      { id: "hornos", name: "Hornos" },
      { id: "freidoras", name: "Freidoras" },
      { id: "parrillas", name: "Parrillas" },
      { id: "planchas", name: "Planchas" },
    ],
  },
  {
    id: "linea-fria",
    name: "Línea fría",
    description:
      "Refrigeración y conservación profesional para tu negocio gastronómico.",
    image: "assets/images/categories/linea-fria.svg",
    subcategories: [
      { id: "refrigeradores", name: "Refrigeradores" },
      { id: "congeladores", name: "Congeladores" },
      { id: "exhibidoras", name: "Exhibidoras" },
      { id: "mesas-refrigeradas", name: "Mesas refrigeradas" },
      { id: "vitrinas-refrigeradas", name: "Vitrinas refrigeradas" },
    ],
  },
  {
    id: "acero-inoxidable",
    name: "Acero inoxidable",
    description:
      "Mobiliario, campanas y fabricaciones especiales en acero inoxidable a medida.",
    image: "assets/images/categories/acero-inoxidable.svg",
    subcategories: [
      { id: "mesas", name: "Mesas" },
      { id: "lavaderos", name: "Lavaderos" },
      { id: "campanas", name: "Campanas" },
      { id: "estanterias", name: "Estanterías" },
      { id: "muebles-inox", name: "Muebles inox" },
      { id: "fabricaciones-especiales", name: "Fabricaciones especiales" },
    ],
  },
];

/**
 * Tipos de negocio. Un mismo producto puede pertenecer a varios
 * (relación muchos-a-muchos vía el campo businessTypes de cada
 * producto), sin duplicar información.
 * @typedef {Object} BusinessType
 * @property {string} id
 * @property {string} name
 * @property {string} icon nombre de símbolo en assets/icons/sprite.svg
 */

/** @type {BusinessType[]} */
export const businessTypes = [
  { id: "restaurantes", name: "Restaurantes", icon: "icon-building" },
  { id: "pollerias", name: "Pollerías", icon: "icon-flame" },
  { id: "chifas", name: "Chifas", icon: "icon-flame" },
  { id: "panaderias", name: "Panaderías", icon: "icon-building" },
  { id: "cafeterias", name: "Cafeterías", icon: "icon-building" },
  { id: "comida-rapida", name: "Comida rápida", icon: "icon-flame" },
  { id: "hoteles", name: "Hoteles", icon: "icon-building" },
  { id: "minimarkets", name: "Minimarkets", icon: "icon-snowflake" },
  { id: "otros", name: "Otros negocios", icon: "icon-building" },
];

/**
 * Ficha técnica: solo se incluyen las claves que aplican a cada
 * producto. js/products.js renderiza únicamente las claves presentes
 * (no muestra filas vacías). Un valor "--" indica un dato que aún
 * no ha sido confirmado por el área comercial/técnica.
 * @typedef {Object} ProductSpecifications
 * @property {string} [dimensiones]
 * @property {string} [material]
 * @property {string} [capacidad]
 * @property {string} [potencia]
 * @property {string} [voltaje]
 * @property {string} [combustible]
 * @property {string} [numeroPuertas]
 * @property {string} [numeroHornillas]
 * @property {string} [temperatura]
 * @property {string} [peso]
 * @property {string} [garantia]
 */

/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} slug
 * @property {string} name
 * @property {string} category            id de categories
 * @property {string} subcategory         id de subcategories dentro de la categoría
 * @property {string[]} businessTypes     ids de businessTypes
 * @property {string[]} images            rutas relativas a assets/images/products/
 * @property {string} shortDescription    para tarjetas de producto
 * @property {string} description         para la ficha de producto
 * @property {ProductSpecifications} specifications
 * @property {number|null} price          null si no aplica precio fijo
 * @property {"fixed"|"from"|"quote"} priceType
 * @property {"disponible"|"fabricacion"|"consultar"} availability
 * @property {boolean} featured
 * @property {string} warranty            texto corto, placeholder si no está definido
 */

/** @type {Product[]} */
export const products = [
  {
    id: "p01",
    slug: "cocina-industrial-4-hornillas",
    name: "Cocina Industrial 4 Hornillas",
    category: "linea-caliente",
    subcategory: "cocinas",
    businessTypes: ["restaurantes", "pollerias", "chifas", "comida-rapida"],
    images: [
      "assets/images/products/placeholder-1.svg",
      "assets/images/products/placeholder-2.svg",
      "assets/images/products/placeholder-3.svg",
    ],
    shortDescription:
      "Cocina de 4 hornillas en acero inoxidable para cocinas de alta producción.",
    description:
      "Cocina industrial de 4 hornillas construida en acero inoxidable, pensada para negocios con producción constante. Estructura reforzada y diseño pensado para uso intensivo. Especificaciones exactas sujetas a confirmación según modelo.",
    specifications: {
      dimensiones: "-- (por confirmar)",
      material: "Acero inoxidable",
      combustible: "Gas (GLP / natural)",
      numeroHornillas: "4",
      potencia: "--",
      peso: "--",
      garantia: "-- (por confirmar)",
    },
    price: 3200,
    priceType: "from",
    availability: "disponible",
    featured: true,
    warranty: "Por confirmar",
  },
  {
    id: "p02",
    slug: "cocina-industrial-3-hornillas",
    name: "Cocina Industrial 3 Hornillas",
    category: "linea-caliente",
    subcategory: "cocinas",
    businessTypes: ["restaurantes", "panaderias", "cafeterias"],
    images: [
      "assets/images/products/placeholder-1.svg",
      "assets/images/products/placeholder-2.svg",
      "assets/images/products/placeholder-3.svg",
    ],
    shortDescription:
      "Cocina compacta de 3 hornillas, ideal para negocios de espacio reducido.",
    description:
      "Versión compacta de 3 hornillas en acero inoxidable, adecuada para cocinas con espacio limitado sin sacrificar capacidad de producción.",
    specifications: {
      dimensiones: "-- (por confirmar)",
      material: "Acero inoxidable",
      combustible: "Gas (GLP / natural)",
      numeroHornillas: "3",
      potencia: "--",
      garantia: "-- (por confirmar)",
    },
    price: 2600,
    priceType: "from",
    availability: "disponible",
    featured: true,
    warranty: "Por confirmar",
  },
  {
    id: "p03",
    slug: "horno-pizzero",
    name: "Horno Pizzero",
    category: "linea-caliente",
    subcategory: "hornos",
    businessTypes: ["restaurantes", "panaderias", "comida-rapida"],
    images: [
      "assets/images/products/placeholder-2.svg",
      "assets/images/products/placeholder-1.svg",
      "assets/images/products/placeholder-3.svg",
    ],
    shortDescription:
      "Horno para pizzas y panificados, fabricado en acero inoxidable.",
    description:
      "Horno pizzero de fabricación industrial, diseñado para cocción uniforme. Disponible en distintas configuraciones según requerimiento del negocio.",
    specifications: {
      dimensiones: "-- (por confirmar)",
      material: "Acero inoxidable",
      combustible: "Gas / eléctrico (según modelo)",
      temperatura: "--",
      garantia: "-- (por confirmar)",
    },
    price: null,
    priceType: "quote",
    availability: "fabricacion",
    featured: true,
    warranty: "Por confirmar",
  },
  {
    id: "p04",
    slug: "freidora-industrial",
    name: "Freidora Industrial",
    category: "linea-caliente",
    subcategory: "freidoras",
    businessTypes: ["pollerias", "chifas", "comida-rapida", "restaurantes"],
    images: [
      "assets/images/products/placeholder-3.svg",
      "assets/images/products/placeholder-1.svg",
      "assets/images/products/placeholder-2.svg",
    ],
    shortDescription:
      "Freidora industrial en acero inoxidable de alta capacidad de trabajo.",
    description:
      "Freidora de uso intensivo fabricada en acero inoxidable, orientada a negocios con alta rotación de frituras.",
    specifications: {
      dimensiones: "-- (por confirmar)",
      material: "Acero inoxidable",
      combustible: "Gas (GLP / natural)",
      capacidad: "--",
      garantia: "-- (por confirmar)",
    },
    price: null,
    priceType: "quote",
    availability: "disponible",
    featured: true,
    warranty: "Por confirmar",
  },
  {
    id: "p05",
    slug: "refrigerador-vertical",
    name: "Refrigerador Vertical",
    category: "linea-fria",
    subcategory: "refrigeradores",
    businessTypes: [
      "restaurantes",
      "minimarkets",
      "cafeterias",
      "panaderias",
      "hoteles",
    ],
    images: [
      "assets/images/products/placeholder-1.svg",
      "assets/images/products/placeholder-3.svg",
      "assets/images/products/placeholder-2.svg",
    ],
    shortDescription:
      "Refrigerador vertical en acero inoxidable para conservación diaria.",
    description:
      "Equipo de refrigeración vertical, diseñado para conservación de insumos y productos en negocios gastronómicos con distintos niveles de rotación.",
    specifications: {
      dimensiones: "-- (por confirmar)",
      material: "Acero inoxidable",
      capacidad: "--",
      voltaje: "220V (referencial)",
      numeroPuertas: "1",
      temperatura: "--",
      garantia: "-- (por confirmar)",
    },
    price: 4200,
    priceType: "from",
    availability: "disponible",
    featured: true,
    warranty: "Por confirmar",
  },
  {
    id: "p06",
    slug: "congeladora-comercial",
    name: "Congeladora Comercial",
    category: "linea-fria",
    subcategory: "congeladores",
    businessTypes: ["restaurantes", "minimarkets", "chifas", "pollerias"],
    images: [
      "assets/images/products/placeholder-2.svg",
      "assets/images/products/placeholder-3.svg",
      "assets/images/products/placeholder-1.svg",
    ],
    shortDescription:
      "Congeladora comercial de alta capacidad para negocios gastronómicos.",
    description:
      "Congeladora orientada a conservación a bajas temperaturas por periodos prolongados, con estructura reforzada para uso comercial.",
    specifications: {
      dimensiones: "-- (por confirmar)",
      material: "Acero inoxidable / pintado (según modelo)",
      capacidad: "--",
      voltaje: "220V (referencial)",
      temperatura: "--",
      garantia: "-- (por confirmar)",
    },
    price: null,
    priceType: "quote",
    availability: "disponible",
    featured: true,
    warranty: "Por confirmar",
  },
  {
    id: "p07",
    slug: "mesa-acero-inoxidable",
    name: "Mesa de Acero Inoxidable",
    category: "acero-inoxidable",
    subcategory: "mesas",
    businessTypes: [
      "restaurantes",
      "pollerias",
      "chifas",
      "panaderias",
      "cafeterias",
      "comida-rapida",
      "hoteles",
      "minimarkets",
    ],
    images: [
      "assets/images/products/placeholder-3.svg",
      "assets/images/products/placeholder-2.svg",
      "assets/images/products/placeholder-1.svg",
    ],
    shortDescription:
      "Mesa de trabajo en acero inoxidable, fabricada a medida según requerimiento.",
    description:
      "Mesa de trabajo en acero inoxidable disponible en distintas medidas. Puede fabricarse a medida según el espacio y necesidad operativa del negocio.",
    specifications: {
      dimensiones: "A medida (indicar en la cotización)",
      material: "Acero inoxidable",
      peso: "--",
      garantia: "-- (por confirmar)",
    },
    price: 850,
    priceType: "from",
    availability: "disponible",
    featured: true,
    warranty: "Por confirmar",
  },
  {
    id: "p08",
    slug: "campana-extractora",
    name: "Campana Extractora",
    category: "acero-inoxidable",
    subcategory: "campanas",
    businessTypes: ["restaurantes", "pollerias", "chifas", "comida-rapida"],
    images: [
      "assets/images/products/placeholder-1.svg",
      "assets/images/products/placeholder-2.svg",
      "assets/images/products/placeholder-3.svg",
    ],
    shortDescription:
      "Campana extractora en acero inoxidable, fabricada según dimensiones del local.",
    description:
      "Campana de extracción fabricada en acero inoxidable, dimensionada según la cocina y el tipo de equipo de cocción a cubrir.",
    specifications: {
      dimensiones: "A medida (indicar en la cotización)",
      material: "Acero inoxidable",
      garantia: "-- (por confirmar)",
    },
    price: null,
    priceType: "quote",
    availability: "fabricacion",
    featured: true,
    warranty: "Por confirmar",
  },
  {
    id: "p09",
    slug: "plancha-industrial",
    name: "Plancha Industrial",
    category: "linea-caliente",
    subcategory: "planchas",
    businessTypes: ["restaurantes", "comida-rapida"],
    images: [
      "assets/images/products/placeholder-2.svg",
      "assets/images/products/placeholder-1.svg",
      "assets/images/products/placeholder-3.svg",
    ],
    shortDescription:
      "Plancha industrial en acero, ideal para cocción rápida de alto volumen.",
    description:
      "Plancha de cocción en acero, orientada a negocios de preparación rápida con alta rotación de pedidos.",
    specifications: {
      dimensiones: "-- (por confirmar)",
      material: "Acero",
      combustible: "Gas (GLP / natural)",
      garantia: "-- (por confirmar)",
    },
    price: null,
    priceType: "quote",
    availability: "disponible",
    featured: false,
    warranty: "Por confirmar",
  },
  {
    id: "p10",
    slug: "vitrina-refrigerada",
    name: "Vitrina Refrigerada",
    category: "linea-fria",
    subcategory: "vitrinas-refrigeradas",
    businessTypes: ["panaderias", "cafeterias", "minimarkets"],
    images: [
      "assets/images/products/placeholder-3.svg",
      "assets/images/products/placeholder-1.svg",
      "assets/images/products/placeholder-2.svg",
    ],
    shortDescription:
      "Vitrina refrigerada para exhibición de productos a la vista del cliente.",
    description:
      "Vitrina de exhibición refrigerada, pensada para mostrar productos manteniendo la cadena de frío en el punto de venta.",
    specifications: {
      dimensiones: "-- (por confirmar)",
      material: "Acero inoxidable / vidrio templado",
      capacidad: "--",
      voltaje: "220V (referencial)",
      garantia: "-- (por confirmar)",
    },
    price: 3100,
    priceType: "from",
    availability: "disponible",
    featured: false,
    warranty: "Por confirmar",
  },
  {
    id: "p11",
    slug: "lavadero-industrial-2-pozas",
    name: "Lavadero Industrial 2 Pozas",
    category: "acero-inoxidable",
    subcategory: "lavaderos",
    businessTypes: [
      "restaurantes",
      "pollerias",
      "chifas",
      "panaderias",
      "cafeterias",
      "comida-rapida",
      "hoteles",
    ],
    images: [
      "assets/images/products/placeholder-1.svg",
      "assets/images/products/placeholder-3.svg",
      "assets/images/products/placeholder-2.svg",
    ],
    shortDescription:
      "Lavadero industrial de 2 pozas en acero inoxidable, fabricado a medida.",
    description:
      "Lavadero de 2 pozas en acero inoxidable, fabricado según las dimensiones y necesidades del área de lavado del negocio.",
    specifications: {
      dimensiones: "A medida (indicar en la cotización)",
      material: "Acero inoxidable",
      numeroPuertas: "--",
      garantia: "-- (por confirmar)",
    },
    price: 780,
    priceType: "from",
    availability: "disponible",
    featured: false,
    warranty: "Por confirmar",
  },
  {
    id: "p12",
    slug: "estanteria-acero-inoxidable",
    name: "Estantería de Acero Inoxidable",
    category: "acero-inoxidable",
    subcategory: "estanterias",
    businessTypes: ["restaurantes", "minimarkets", "panaderias"],
    images: [
      "assets/images/products/placeholder-2.svg",
      "assets/images/products/placeholder-3.svg",
      "assets/images/products/placeholder-1.svg",
    ],
    shortDescription:
      "Estantería en acero inoxidable para almacenamiento e insumos.",
    description:
      "Estantería en acero inoxidable de varios niveles, orientada al almacenamiento ordenado de insumos y utensilios.",
    specifications: {
      dimensiones: "A medida (indicar en la cotización)",
      material: "Acero inoxidable",
      capacidad: "--",
      peso: "--",
      garantia: "-- (por confirmar)",
    },
    price: 450,
    priceType: "from",
    availability: "disponible",
    featured: false,
    warranty: "Por confirmar",
  },
  {
    id: "p13",
    slug: "freidora-automatica-industrial",
    name: "Freidora Automática Industrial",
    category: "linea-caliente",
    subcategory: "freidoras",
    businessTypes: ["restaurantes", "pollerias", "chifas", "comida-rapida"],
    images: [
      "assets/images/products/freidora-automatica-industrial-1.webp",
      "assets/images/products/freidora-automatica-industrial-2.webp",
      "assets/images/products/freidora-automatica-industrial-3.webp",
      "assets/images/products/freidora-automatica-industrial-4.webp",
    ],
    shortDescription:
      "Freidora automática industrial de doble cesta en acero inoxidable, con gabinete inferior y ruedas para fácil desplazamiento.",
    description:
      "Freidora automática industrial de doble cesta, construida en acero inoxidable para resistir el uso intensivo en cocinas de alta demanda. Incluye cestas colgantes con mango ergonómico y gabinete inferior con puerta, montado sobre ruedas giratorias que facilitan su desplazamiento y limpieza. Pensada para negocios con producción constante de frituras. Especificaciones técnicas exactas sujetas a confirmación según modelo.",
    specifications: {
      dimensiones: "-- (por confirmar)",
      material: "Acero inoxidable",
      capacidad: "-- (por confirmar)",
      potencia: "-- (por confirmar)",
      voltaje: "-- (por confirmar)",
      combustible: "-- (por confirmar)",
      numeroCestas: "2",
      peso: "-- (por confirmar)",
      garantia: "-- (por confirmar)",
    },
    price: null,
    priceType: "quote",
    availability: "disponible",
    featured: false,
    warranty: "Por confirmar",
  },
  {
    id: "p14",
    slug: "horno-shawarma-4-quemadores",
    name: "Horno para Shawarma 4 Quemadores",
    category: "linea-caliente",
    subcategory: "hornos",
    businessTypes: ["restaurantes", "comida-rapida", "otros"],
    images: [
      "assets/images/products/horno-shawarma-4-quemadores-1.webp",
      "assets/images/products/horno-shawarma-4-quemadores-2.webp",
      "assets/images/products/horno-shawarma-4-quemadores-3.webp",
    ],
    shortDescription:
      "Horno vertical para shawarma de 4 quemadores en acero inoxidable, con bandeja recolectora y gabinete inferior sobre ruedas.",
    description:
      "Horno vertical para shawarma de 4 quemadores, construido en acero inoxidable, con bandeja recolectora de grasa y asador giratorio central. Panel de control lateral con perillas independientes por quemador. Estructura montada sobre ruedas giratorias, con gabinete inferior con puerta para almacenamiento. Pensado para negocios con alta demanda de producción de shawarma y döner kebab. Especificaciones técnicas exactas sujetas a confirmación según modelo.",
    specifications: {
      dimensiones: "-- (por confirmar)",
      material: "Acero inoxidable",
      combustible: "Gas (GLP / natural)",
      numeroQuemadores: "4",
      potencia: "-- (por confirmar)",
      capacidad: "-- (por confirmar)",
      peso: "-- (por confirmar)",
      garantia: "-- (por confirmar)",
    },
    price: null,
    priceType: "quote",
    availability: "disponible",
    featured: false,
    warranty: "Por confirmar",
  },
  {
    id: "p15",
    slug: "parrilla-mesa-empotrable",
    name: "Parrilla de Mesa Empotrable",
    category: "acero-inoxidable",
    subcategory: "fabricaciones-especiales",
    businessTypes: ["restaurantes", "hoteles", "otros"],
    images: [
      "assets/images/products/parrilla-mesa-empotrable-1.webp",
      "assets/images/products/parrilla-mesa-empotrable-2.webp",
      "assets/images/products/parrilla-mesa-empotrable-3.webp",
      "assets/images/products/parrilla-mesa-empotrable-4.webp",
    ],
    shortDescription:
      "Parrilla de mesa empotrable a carbón, con parrilla ajustable por manivela y bandeja extraíble en acero inoxidable.",
    description:
      "Parrilla de mesa empotrable a carbón, construida en acero inoxidable. Cuenta con parrilla superior ajustable en altura mediante manivela, para regular la intensidad del calor sobre las brasas, y bandeja/cajón extraíble para el manejo de cenizas. Incluye asas laterales para facilitar su traslado. Diseño pensado para integrarse en una línea de cocción empotrada en restaurantes y parrilladas de alto volumen. Especificaciones técnicas exactas sujetas a confirmación según modelo.",
    specifications: {
      dimensiones: "-- (por confirmar)",
      material: "Acero inoxidable",
      combustible: "Carbón",
      capacidad: "-- (por confirmar)",
      peso: "-- (por confirmar)",
      garantia: "-- (por confirmar)",
    },
    price: null,
    priceType: "quote",
    availability: "disponible",
    featured: false,
    warranty: "Por confirmar",
  },
  {
    id: "p16",
    slug: "caja-china-4en1",
    name: "Caja China 4 en 1 con Tapa",
    category: "acero-inoxidable",
    subcategory: "fabricaciones-especiales",
    businessTypes: ["restaurantes", "pollerias", "otros"],
    images: [
      "assets/images/products/caja-china-4en1-1.webp",
      "assets/images/products/caja-china-4en1-2.webp",
      "assets/images/products/caja-china-4en1-3.webp",
    ],
    shortDescription:
      "Caja china 4 en 1 con tapa, en acero inoxidable: caja china, parrilla, chancho al palo y pollo a las brasas, con ventana con visor y motor independiente. Capacidad 20 kg.",
    description:
      "Caja china 4 en 1 con tapa, construida en acero inoxidable, pensada para cubrir cuatro modos de cocción en un solo equipo: caja china, parrilla, chancho al palo y pollo a las brasas. Incorpora ventana con visor que permite supervisar la cocción en el interior de la caja china sin necesidad de abrir la tapa, y motor independiente para el sistema de rotación, lo que facilita un dorado uniforme con menor intervención manual. Cuenta con capacidad para 20 kg, adecuada para preparaciones de alto volumen. Su fabricación en acero inoxidable favorece la resistencia al uso intensivo y facilita la limpieza. Diseño orientado a restaurantes, pollerías y negocios de comida a las brasas que requieren un equipo versátil para distintos tipos de cocción. Especificaciones técnicas exactas sujetas a confirmación según modelo.",
    specifications: {
      dimensiones: "-- (por confirmar)",
      material: "Acero inoxidable",
      combustible: "Carbón",
      capacidad: "20 kg",
      peso: "-- (por confirmar)",
      garantia: "-- (por confirmar)",
    },
    price: null,
    priceType: "quote",
    availability: "disponible",
    featured: false,
    warranty: "Por confirmar",
  },
  {
    id: "p17",
    slug: "cocina-industrial-2-hornillas",
    name: "Cocina Industrial 2 Hornillas",
    category: "acero-inoxidable",
    subcategory: "fabricaciones-especiales",
    businessTypes: ["restaurantes", "panaderias", "cafeterias", "otros"],
    images: [
      "assets/images/products/cocina-industrial-2-hornillas-1.webp",
      "assets/images/products/cocina-industrial-2-hornillas-2.webp",
    ],
    shortDescription:
      "Cocina industrial de 2 hornillas en acero inoxidable, con parrillas de fundición y repisa inferior. Versión compacta para espacios reducidos.",
    description:
      "Cocina industrial de 2 hornillas, construida en acero inoxidable, con quemadores de fundición de alta resistencia y perillas de control independientes para cada hornilla. Incorpora repisa inferior en acero inoxidable para almacenamiento u ollas de reserva, y patas regulables para nivelación en piso. Su tamaño compacto la hace adecuada para cocinas con espacio limitado que igualmente requieren capacidad de cocción industrial, como negocios de producción moderada o como complemento de una línea de cocción más amplia. Especificaciones técnicas exactas sujetas a confirmación según modelo.",
    specifications: {
      dimensiones: "-- (por confirmar)",
      material: "Acero inoxidable",
      combustible: "Gas (GLP / natural)",
      numeroHornillas: "2",
      potencia: "-- (por confirmar)",
      peso: "-- (por confirmar)",
      garantia: "-- (por confirmar)",
    },
    price: null,
    priceType: "quote",
    availability: "disponible",
    featured: false,
    warranty: "Por confirmar",
  },
  {
    id: "p18",
    slug: "cocina-industrial-2-hornillas-chifero",
    name: "Cocina Industrial 2 Hornillas + Chifero",
    category: "acero-inoxidable",
    subcategory: "fabricaciones-especiales",
    businessTypes: ["restaurantes", "chifas", "otros"],
    images: [
      "assets/images/products/cocina-industrial-2-hornillas-chifero-1.webp",
    ],
    shortDescription:
      "Cocina industrial de 2 hornillas más chifero (quemador tipo wok), en acero inoxidable, con repisa inferior. Ideal para cocina criolla y de wok en un solo mueble.",
    description:
      "Cocina industrial de 2 hornillas con chifero incorporado, construida en acero inoxidable. Las dos hornillas cuentan con quemadores de fundición y perillas de control independientes, mientras que el chifero incluye un quemador circular tipo wok de mayor potencia, pensado para salteados y preparaciones que requieren fuego intenso y concentrado. Incorpora repisa inferior en acero inoxidable para almacenamiento y patas regulables para nivelación en piso. Diseño pensado para negocios que combinan cocción tradicional con preparaciones al wok en un mismo mueble, optimizando espacio en cocina. Especificaciones técnicas exactas sujetas a confirmación según modelo.",
    specifications: {
      dimensiones: "-- (por confirmar)",
      material: "Acero inoxidable",
      combustible: "Gas (GLP / natural)",
      numeroHornillas: "2 + 1 chifero",
      potencia: "-- (por confirmar)",
      peso: "-- (por confirmar)",
      garantia: "-- (por confirmar)",
    },
    price: null,
    priceType: "quote",
    availability: "disponible",
    featured: false,
    warranty: "Por confirmar",
  },
  {
    id: "p19",
    slug: "cocina-industrial-3-hornillas-horno",
    name: "Cocina Industrial 3 Hornillas + Horno",
    category: "acero-inoxidable",
    subcategory: "fabricaciones-especiales",
    businessTypes: ["restaurantes", "panaderias", "otros"],
    images: [
      "assets/images/products/cocina-industrial-3-hornillas-horno-1.webp",
      "assets/images/products/cocina-industrial-3-hornillas-horno-2.webp",
    ],
    shortDescription:
      "Cocina industrial de 3 hornillas con horno y gratinador incorporados, en acero inoxidable, con repisa inferior. Cocción, horneado y gratinado en un solo mueble.",
    description:
      "Cocina industrial de 3 hornillas con horno incorporado, construida en acero inoxidable. Las tres hornillas cuentan con quemadores de fundición y perillas de control independientes, mientras que el módulo inferior integra horno con puerta de visor y función de gratinador, además de repisa lateral para almacenamiento. Panel de control frontal con mando de presión y perillas identificadas por función (cocina, gratinador, horno), lo que facilita su operación. Diseño pensado para negocios que requieren cocción, horneado y gratinado en un mismo mueble, optimizando espacio en cocina. Especificaciones técnicas exactas sujetas a confirmación según modelo.",
    specifications: {
      dimensiones: "-- (por confirmar)",
      material: "Acero inoxidable",
      combustible: "Gas (GLP / natural)",
      numeroHornillas: "3 + horno",
      potencia: "-- (por confirmar)",
      peso: "-- (por confirmar)",
      garantia: "-- (por confirmar)",
    },
    price: null,
    priceType: "quote",
    availability: "disponible",
    featured: false,
    warranty: "Por confirmar",
  },
  {
    id: "p20",
    slug: "freidora-industrial-2-pozas",
    name: "Freidora Industrial 2 Pozas",
    category: "linea-caliente",
    subcategory: "freidoras",
    businessTypes: ["restaurantes", "pollerias", "chifas", "comida-rapida"],
    images: [
      "assets/images/products/freidora-industrial-2-pozas-1.webp",
      "assets/images/products/freidora-industrial-2-pozas-2.webp",
      "assets/images/products/freidora-industrial-2-pozas-3.webp",
    ],
    shortDescription:
      "Freidora industrial de 2 pozas independientes en acero inoxidable, con cestas colgantes, gabinete inferior con puerta y ruedas.",
    description:
      "Freidora industrial de 2 pozas independientes, construida en acero inoxidable, pensada para freír dos productos distintos al mismo tiempo sin mezclar sabores ni aceites. Cada poza cuenta con su propia cesta colgante de mango ergonómico para un escurrido cómodo y seguro. El panel frontal incluye perillas de control independientes por poza, y el gabinete inferior cuenta con puerta con pasador de seguridad para almacenamiento, montado sobre ruedas giratorias que facilitan su desplazamiento y limpieza. Diseño pensado para negocios con producción constante de frituras que requieren freír distintos productos de forma simultánea. Especificaciones técnicas exactas sujetas a confirmación según modelo.",
    specifications: {
      dimensiones: "-- (por confirmar)",
      material: "Acero inoxidable",
      capacidad: "-- (por confirmar)",
      potencia: "-- (por confirmar)",
      combustible: "Gas (GLP / natural)",
      numeroCestas: "2",
      peso: "-- (por confirmar)",
      garantia: "-- (por confirmar)",
    },
    price: null,
    priceType: "quote",
    availability: "disponible",
    featured: false,
    warranty: "Por confirmar",
  },
  {
    id: "p21",
    slug: "mesa-trabajo-5-niveles",
    name: "Mesa de Trabajo 5 Niveles",
    category: "acero-inoxidable",
    subcategory: "mesas",
    businessTypes: ["restaurantes", "panaderias", "cafeterias", "hoteles", "otros"],
    images: [
      "assets/images/products/mesa-trabajo-5-niveles-1.webp",
      "assets/images/products/mesa-trabajo-5-niveles-2.webp",
    ],
    shortDescription:
      "Mesa de trabajo en acero inoxidable de 5 niveles: superficie principal, 2 repisas superiores y 2 repisas inferiores, para máximo aprovechamiento del espacio.",
    description:
      "Mesa de trabajo en acero inoxidable de 5 niveles, pensada para maximizar el aprovechamiento del espacio en cocina. Además de la superficie principal de trabajo, incorpora un entrepaño superior de 2 repisas para tener a la mano utensilios, insumos o vajilla, y 2 repisas inferiores adicionales para almacenamiento. Estructura tubular en acero inoxidable con patas regulables para nivelación en piso. Diseño pensado para negocios que requieren ordenar y tener accesible una mayor cantidad de utensilios e insumos en un solo mueble. Especificaciones técnicas exactas sujetas a confirmación según modelo.",
    specifications: {
      dimensiones: "-- (por confirmar)",
      material: "Acero inoxidable",
      capacidad: "-- (por confirmar)",
      peso: "-- (por confirmar)",
      garantia: "-- (por confirmar)",
    },
    price: null,
    priceType: "quote",
    availability: "disponible",
    featured: false,
    warranty: "Por confirmar",
  },
];

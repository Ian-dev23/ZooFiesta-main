const TOTAL_OBJETOS = 12;

const FONDOS = {
  conejo: require("../assets/backgrounds/HabitatConejo.png"),
  mono: require("../assets/backgrounds/HabitatMono.png"),
  elefante: require("../assets/backgrounds/HabitatElefante.png"),
  jirafa: require("../assets/backgrounds/HabitatJirafa.png"),
  oso: require("../assets/backgrounds/HabitatOso.png"),
};

const IMAGENES_ANIMALES = {
  conejo: require("../assets/animals/Conejo.png"),
  mono: require("../assets/animals/mono.png"),
  elefante: require("../assets/animals/elefante.png"),
  jirafa: require("../assets/animals/jirafa.png"),
  oso: require("../assets/animals/oso.png"),
};

const OBJETOS = {
  zanahoria: {
    singular: "zanahoria",
    plural: "zanahorias",
    articuloIndefinido: "una",
    articuloPlural: "las",
    pronombreSingular: "la",
    pronombrePlural: "las",
    imagen: require("../assets/objects/zanahoria.png"),
  },

  lechuga: {
    singular: "lechuga",
    plural: "lechugas",
    articuloIndefinido: "una",
    articuloPlural: "las",
    pronombreSingular: "la",
    pronombrePlural: "las",
    imagen: require("../assets/objects/lechuga.png"),
  },

  platano: {
    singular: "plátano",
    plural: "plátanos",
    articuloIndefinido: "un",
    articuloPlural: "los",
    pronombreSingular: "lo",
    pronombrePlural: "los",
    imagen: require("../assets/objects/platano.png"),
  },

  sandia: {
    singular: "sandía",
    plural: "sandías",
    articuloIndefinido: "una",
    articuloPlural: "las",
    pronombreSingular: "la",
    pronombrePlural: "las",
    imagen: require("../assets/objects/sandia.png"),
  },

  maiz: {
    singular: "mazorca de maíz",
    plural: "mazorcas de maíz",
    articuloIndefinido: "una",
    articuloPlural: "las",
    pronombreSingular: "la",
    pronombrePlural: "las",
    imagen: require("../assets/objects/maiz.png"),
  },

  manzana: {
    singular: "manzana",
    plural: "manzanas",
    articuloIndefinido: "una",
    articuloPlural: "las",
    pronombreSingular: "la",
    pronombrePlural: "las",
    imagen: require("../assets/objects/manzana.png"),
  },

  pera: {
    singular: "pera",
    plural: "peras",
    articuloIndefinido: "una",
    articuloPlural: "las",
    pronombreSingular: "la",
    pronombrePlural: "las",
    imagen: require("../assets/objects/pera.png"),
  },

  uva: {
    singular: "uva",
    plural: "uvas",
    articuloIndefinido: "una",
    articuloPlural: "las",
    pronombreSingular: "la",
    pronombrePlural: "las",
    imagen: require("../assets/objects/uva.png"),
  },

  naranja: {
    singular: "naranja",
    plural: "naranjas",
    articuloIndefinido: "una",
    articuloPlural: "las",
    pronombreSingular: "la",
    pronombrePlural: "las",
    imagen: require("../assets/objects/naranja.png"),
  },
};

const configuraciones = [
  {
    id: 1,
    nombre: "Conejo",
    presentacion: "el conejito",

    imagenAnimal: IMAGENES_ANIMALES.conejo,
    imagenFondo: FONDOS.conejo,

    objetoBuscado: "zanahoria",
    cantidadMinima: 2,
    cantidadMaxima: 5,

    distractores: [
      "lechuga",
      "platano",
      "sandia",
      "maiz",
    ],

    audioError: null,
    audioCompletado: null,

    audiosIntroduccion: {
      2: null,
      3: null,
      4: null,
      5: null,
    },

    audiosRecordatorio: {
      1: null,
      2: null,
      3: null,
      4: null,
      5: null,
    },
  },

  {
    id: 2,
    nombre: "Mono",
    presentacion: "el monito",

    imagenAnimal: IMAGENES_ANIMALES.mono,
    imagenFondo: FONDOS.mono,

    objetoBuscado: "platano",
    cantidadMinima: 3,
    cantidadMaxima: 6,

    distractores: [
      "manzana",
      "pera",
      "sandia",
      "uva",
      "naranja",
    ],

    audioError: null,
    audioCompletado: null,

    audiosIntroduccion: {
      3: null,
      4: null,
      5: null,
      6: null,
    },

    audiosRecordatorio: {
      1: null,
      2: null,
      3: null,
      4: null,
      5: null,
      6: null,
    },
  },

  {
    id: 3,
    nombre: "Elefante",
    presentacion: "el elefante",

    imagenAnimal: IMAGENES_ANIMALES.elefante,
    imagenFondo: FONDOS.elefante,

    objetoBuscado: "manzana",
    cantidadMinima: 2,
    cantidadMaxima: 5,

    distractores: [
      "pera",
      "uva",
      "sandia",
      "platano",
      "naranja",
    ],

    audioError: null,
    audioCompletado: null,

    audiosIntroduccion: {
      2: null,
      3: null,
      4: null,
      5: null,
    },

    audiosRecordatorio: {
      1: null,
      2: null,
      3: null,
      4: null,
      5: null,
    },
  },

  {
    id: 4,
    nombre: "Jirafa",
    presentacion: "la jirafa",

    imagenAnimal: IMAGENES_ANIMALES.jirafa,
    imagenFondo: FONDOS.jirafa,

    objetoBuscado: "pera",
    cantidadMinima: 4,
    cantidadMaxima: 7,

    distractores: [
      "manzana",
      "platano",
      "sandia",
      "uva",
      "naranja",
    ],

    audioError: null,
    audioCompletado: null,

    audiosIntroduccion: {
      4: null,
      5: null,
      6: null,
      7: null,
    },

    audiosRecordatorio: {
      1: null,
      2: null,
      3: null,
      4: null,
      5: null,
      6: null,
      7: null,
    },
  },

  {
    id: 5,
    nombre: "Oso",
    presentacion: "el osito",

    imagenAnimal: IMAGENES_ANIMALES.oso,
    imagenFondo: FONDOS.oso,

    objetoBuscado: "sandia",
    cantidadMinima: 2,
    cantidadMaxima: 4,

    distractores: [
      "manzana",
      "platano",
      "pera",
      "uva",
      "naranja",
    ],

    audioError: null,
    audioCompletado: null,

    audiosIntroduccion: {
      2: null,
      3: null,
      4: null,
    },

    audiosRecordatorio: {
      1: null,
      2: null,
      3: null,
      4: null,
    },
  },
];

const obtenerNumeroAleatorio = (minimo, maximo) => {
  return (
    Math.floor(Math.random() * (maximo - minimo + 1)) +
    minimo
  );
};

const mezclarElementos = (elementos) => {
  const resultado = [...elementos];

  for (
    let posicion = resultado.length - 1;
    posicion > 0;
    posicion -= 1
  ) {
    const posicionAleatoria = Math.floor(
      Math.random() * (posicion + 1)
    );

    [
      resultado[posicion],
      resultado[posicionAleatoria],
    ] = [
      resultado[posicionAleatoria],
      resultado[posicion],
    ];
  }

  return resultado;
};

const crearId = (nivelId, tipo, indice) => {
  const parteAleatoria = Math.random()
    .toString(36)
    .slice(2, 9);

  return `${nivelId}-${tipo}-${indice}-${parteAleatoria}`;
};

const crearObjetosCorrectos = (
  configuracion,
  cantidad,
  objeto
) => {
  return Array.from(
    { length: cantidad },
    (_, indice) => ({
      id: crearId(
        configuracion.id,
        configuracion.objetoBuscado,
        indice
      ),
      tipo: configuracion.objetoBuscado,
      correcto: true,
      imagen: objeto.imagen,
    })
  );
};

const crearObjetosDistractores = (
  configuracion,
  cantidad
) => {
  const tiposDisponibles = [];

  while (tiposDisponibles.length < cantidad) {
    tiposDisponibles.push(
      ...mezclarElementos(configuracion.distractores)
    );
  }

  return tiposDisponibles
    .slice(0, cantidad)
    .map((tipo, indice) => ({
      id: crearId(
        configuracion.id,
        tipo,
        indice
      ),
      tipo,
      correcto: false,
      imagen: OBJETOS[tipo].imagen,
    }));
};

export const crearNivelJugable = (configuracion) => {
  const cantidad = obtenerNumeroAleatorio(
    configuracion.cantidadMinima,
    configuracion.cantidadMaxima
  );

  const objeto =
    OBJETOS[configuracion.objetoBuscado];

  const objetosCorrectos =
    crearObjetosCorrectos(
      configuracion,
      cantidad,
      objeto
    );

  const objetosDistractores =
    crearObjetosDistractores(
      configuracion,
      TOTAL_OBJETOS - cantidad
    );

  const nombreObjeto =
    cantidad === 1
      ? objeto.singular
      : objeto.plural;

  const pronombre =
    cantidad === 1
      ? objeto.pronombreSingular
      : objeto.pronombrePlural;

  return {
    ...configuracion,

    cantidad,

    // Mantiene el fondo asignado a cada animal.
    imagenFondo: configuracion.imagenFondo,

    imagenObjetoBuscado: objeto.imagen,
    imagenBotonAudio: null,

    objetoBuscadoPlural: objeto.plural,

    mensajeIntroduccion:
      `Hola, soy ${configuracion.presentacion}. ` +
      `Tengo que llevar ${cantidad} ${nombreObjeto} ` +
      `a la fiesta. ¿Me ayudas a encontrar${pronombre}?`,

    mensajeError:
      `Ups, eso no parece ${objeto.articuloIndefinido} ` +
      `${objeto.singular}. Busca ${objeto.articuloPlural} ` +
      `${objeto.plural}.`,

    mensajeCompletado:
      `Muy bien. Encontraste ${cantidad} ${nombreObjeto}.`,

    audioIntroduccion:
      configuracion.audiosIntroduccion[cantidad] ??
      null,

    audioRecordatorio:
      configuracion.audiosRecordatorio,

    objetos: mezclarElementos([
      ...objetosCorrectos,
      ...objetosDistractores,
    ]),
  };
};

export const crearPartida = () => {
  return configuraciones.map(crearNivelJugable);
};

export default configuraciones;
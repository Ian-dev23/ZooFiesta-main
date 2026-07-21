// Número máximo de objetos en la cuadrícula.
const TOTAL_OBJETOS = 12;

// Audios de error e inactividad para cada animal.
const AUDIOS = Object.freeze({
  conejo: {
    error: require(
      "../assets/sounds/conejo/error.mp3"
    ),

    inactividad: require(
      "../assets/sounds/conejo/inactividad.mp3"
    ),
  },

  mono: {
    error: require(
      "../assets/sounds/mono/error.mp3"
    ),

    inactividad: require(
      "../assets/sounds/mono/inactividad.mp3"
    ),
  },

  elefante: {
    error: require(
      "../assets/sounds/elefante/error.mp3"
    ),

    inactividad: require(
      "../assets/sounds/elefante/inactividad.mp3"
    ),
  },

  jirafa: {
    error: require(
      "../assets/sounds/jirafa/error.mp3"
    ),

    inactividad: require(
      "../assets/sounds/jirafa/inactividad.mp3"
    ),
  },

  oso: {
    error: require(
      "../assets/sounds/oso/error.mp3"
    ),

    inactividad: require(
      "../assets/sounds/oso/inactividad.mp3"
    ),
  },
});

// Fondos para cada nivel.
const FONDOS = Object.freeze({
  conejo: require(
    "../assets/backgrounds/HabitatConejo.png"
  ),

  mono: require(
    "../assets/backgrounds/HabitatMono.png"
  ),

  elefante: require(
    "../assets/backgrounds/HabitatElefante.png"
  ),

  jirafa: require(
    "../assets/backgrounds/HabitatJirafa.png"
  ),

  oso: require(
    "../assets/backgrounds/HabitatOso.png"
  ),
});

// Imágenes principales de los animales.
const IMAGENES_ANIMALES = Object.freeze({
  conejo: require(
    "../assets/animals/Conejo.png"
  ),

  mono: require(
    "../assets/animals/mono.png"
  ),

  elefante: require(
    "../assets/animals/elefante.png"
  ),

  jirafa: require(
    "../assets/animals/jirafa.png"
  ),

  oso: require(
    "../assets/animals/oso.png"
  ),
});

// Objetos disponibles en el juego.
const OBJETOS = Object.freeze({
  zanahoria: {
    singular: "zanahoria",
    plural: "zanahorias",

    articuloIndefinido: "una",
    articuloPlural: "las",

    pronombreSingular: "la",
    pronombrePlural: "las",

    imagen: require(
      "../assets/objects/zanahoria.png"
    ),
  },

  lechuga: {
    singular: "lechuga",
    plural: "lechugas",

    articuloIndefinido: "una",
    articuloPlural: "las",

    pronombreSingular: "la",
    pronombrePlural: "las",

    imagen: require(
      "../assets/objects/lechuga.png"
    ),
  },

  platano: {
    singular: "plátano",
    plural: "plátanos",

    articuloIndefinido: "un",
    articuloPlural: "los",

    pronombreSingular: "lo",
    pronombrePlural: "los",

    imagen: require(
      "../assets/objects/platano.png"
    ),
  },

  sandia: {
    singular: "sandía",
    plural: "sandías",

    articuloIndefinido: "una",
    articuloPlural: "las",

    pronombreSingular: "la",
    pronombrePlural: "las",

    imagen: require(
      "../assets/objects/sandia.png"
    ),
  },

  maiz: {
    singular: "mazorca de maíz",
    plural: "mazorcas de maíz",

    articuloIndefinido: "una",
    articuloPlural: "las",

    pronombreSingular: "la",
    pronombrePlural: "las",

    imagen: require(
      "../assets/objects/maiz.png"
    ),
  },

  manzana: {
    singular: "manzana",
    plural: "manzanas",

    articuloIndefinido: "una",
    articuloPlural: "las",

    pronombreSingular: "la",
    pronombrePlural: "las",

    imagen: require(
      "../assets/objects/manzana.png"
    ),
  },

  pera: {
    singular: "pera",
    plural: "peras",

    articuloIndefinido: "una",
    articuloPlural: "las",

    pronombreSingular: "la",
    pronombrePlural: "las",

    imagen: require(
      "../assets/objects/pera.png"
    ),
  },

  uva: {
    singular: "uva",
    plural: "uvas",

    articuloIndefinido: "una",
    articuloPlural: "las",

    pronombreSingular: "la",
    pronombrePlural: "las",

    imagen: require(
      "../assets/objects/uva.png"
    ),
  },

  naranja: {
    singular: "naranja",
    plural: "naranjas",

    articuloIndefinido: "una",
    articuloPlural: "las",

    pronombreSingular: "la",
    pronombrePlural: "las",

    imagen: require(
      "../assets/objects/naranja.png"
    ),
  },
});

// Configuración de los cinco niveles.
const configuraciones = Object.freeze([
  {
    id: 1,

    nombre: "Conejo",
    presentacion: "el conejito",

    imagenAnimal:
      IMAGENES_ANIMALES.conejo,

    imagenFondo:
      FONDOS.conejo,

    objetoBuscado: "zanahoria",

    cantidadMinima: 2,
    cantidadMaxima: 5,

    distractores: [
      "lechuga",
      "platano",
      "sandia",
      "maiz",
    ],

    audioError:
      AUDIOS.conejo.error,

    audioInactividad:
      AUDIOS.conejo.inactividad,

    audioCompletado: null,

    audiosIntroduccion: {
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

    imagenAnimal:
      IMAGENES_ANIMALES.mono,

    imagenFondo:
      FONDOS.mono,

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

    audioError:
      AUDIOS.mono.error,

    audioInactividad:
      AUDIOS.mono.inactividad,

    audioCompletado: null,

    audiosIntroduccion: {
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

    imagenAnimal:
      IMAGENES_ANIMALES.elefante,

    imagenFondo:
      FONDOS.elefante,

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

    audioError:
      AUDIOS.elefante.error,

    audioInactividad:
      AUDIOS.elefante.inactividad,

    audioCompletado: null,

    audiosIntroduccion: {
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

    imagenAnimal:
      IMAGENES_ANIMALES.jirafa,

    imagenFondo:
      FONDOS.jirafa,

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

    audioError:
      AUDIOS.jirafa.error,

    audioInactividad:
      AUDIOS.jirafa.inactividad,

    audioCompletado: null,

    audiosIntroduccion: {
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

    imagenAnimal:
      IMAGENES_ANIMALES.oso,

    imagenFondo:
      FONDOS.oso,

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

    audioError:
      AUDIOS.oso.error,

    audioInactividad:
      AUDIOS.oso.inactividad,

    audioCompletado: null,

    audiosIntroduccion: {
      2: null,
      3: null,
      4: null,
    },
  },
]);

// Obtiene un número aleatorio entero dentro del rango indicado.
const obtenerNumeroAleatorio = (
  minimo,
  maximo
) => {
  return (
    Math.floor(
      Math.random() *
        (maximo - minimo + 1)
    ) + minimo
  );
};

// Mezcla un arreglo sin modificar el arreglo original.
const mezclarElementos = (
  elementos
) => {
  const resultado = [
    ...elementos,
  ];

  for (
    let posicion =
      resultado.length - 1;

    posicion > 0;

    posicion -= 1
  ) {
    const posicionAleatoria =
      Math.floor(
        Math.random() *
          (posicion + 1)
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

// Genera un identificador único para cada objeto de la cuadrícula.
const crearId = (
  nivelId,
  tipo,
  indice
) => {
  const parteAleatoria =
    Math.random()
      .toString(36)
      .slice(2, 9);

  return (
    `${nivelId}-` +
    `${tipo}-` +
    `${indice}-` +
    `${parteAleatoria}`
  );
};

// Obtiene un objeto del catálogo por tipo.
const obtenerObjeto = (tipo) => {
  const objeto = OBJETOS[tipo];

  if (!objeto) {
    throw new Error(
      `El objeto "${tipo}" no existe en OBJETOS.`
    );
  }

  return objeto;
};

// Crea los objetos correctos del nivel.
const crearObjetosCorrectos = (
  configuracion,
  cantidad,
  objeto
) => {
  return Array.from(
    {
      length: cantidad,
    },

    (_, indice) => ({
      id: crearId(
        configuracion.id,
        configuracion.objetoBuscado,
        indice
      ),

      tipo:
        configuracion.objetoBuscado,

      nombreAccesible:
        objeto.singular,

      correcto: true,

      imagen:
        objeto.imagen,
    })
  );
};

// Crea los objetos distractores del nivel.
const crearObjetosDistractores = (
  configuracion,
  cantidad
) => {
  if (cantidad <= 0) {
    return [];
  }

  if (
    !Array.isArray(
      configuracion.distractores
    ) ||
    configuracion.distractores
      .length === 0
  ) {
    throw new Error(
      `El nivel "${configuracion.nombre}" no tiene distractores.`
    );
  }

  const tiposDisponibles = [];

  while (
    tiposDisponibles.length <
    cantidad
  ) {
    tiposDisponibles.push(
      ...mezclarElementos(
        configuracion.distractores
      )
    );
  }

  return tiposDisponibles
    .slice(0, cantidad)
    .map((tipo, indice) => {
      const objeto =
        obtenerObjeto(tipo);

      return {
        id: crearId(
          configuracion.id,
          tipo,
          indice
        ),

        tipo,

        nombreAccesible:
          objeto.singular,

        correcto: false,

        imagen:
          objeto.imagen,
      };
    });
};

// Genera un nivel jugable completo a partir de la configuración.
export const crearNivelJugable = (
  configuracion
) => {
  if (!configuracion) {
    throw new Error(
      "No se recibió una configuración para crear el nivel."
    );
  }

  const objeto = obtenerObjeto(
    configuracion.objetoBuscado
  );

  const cantidad =
    obtenerNumeroAleatorio(
      configuracion.cantidadMinima,
      configuracion.cantidadMaxima
    );

  const cantidadDistractores =
    TOTAL_OBJETOS - cantidad;

  if (cantidadDistractores < 0) {
    throw new Error(
      `La cantidad del nivel "${configuracion.nombre}" supera el total de objetos.`
    );
  }

  const objetosCorrectos =
    crearObjetosCorrectos(
      configuracion,
      cantidad,
      objeto
    );

  const objetosDistractores =
    crearObjetosDistractores(
      configuracion,
      cantidadDistractores
    );

  const nombreObjeto =
    cantidad === 1
      ? objeto.singular
      : objeto.plural;

  const pronombre =
    cantidad === 1
      ? objeto.pronombreSingular
      : objeto.pronombrePlural;

  const audioIntroduccion =
    configuracion
      .audiosIntroduccion?.[
        cantidad
      ] ?? null;

  return {
    ...configuracion,

    cantidad,

    imagenAnimal:
      configuracion.imagenAnimal,

    imagenFondo:
      configuracion.imagenFondo,

    imagenObjetoBuscado:
      objeto.imagen,

    objetoBuscadoSingular:
      objeto.singular,

    objetoBuscadoPlural:
      objeto.plural,

    mensajeIntroduccion:
      `Hola, soy ${configuracion.presentacion}. ` +
      `Tengo que llevar ${cantidad} ${nombreObjeto} ` +
      `a la fiesta. ¿Me ayudas a encontrar${pronombre}?`,

    mensajeError:
      "Ups, esa no es la fruta que estamos buscando. " +
      "Inténtalo nuevamente.",

    mensajeInactividad:
      "¿Seguimos jugando? " +
      "Toca una fruta para continuar.",

    mensajeCompletado:
      `Muy bien. Encontraste ` +
      `${cantidad} ${nombreObjeto}.`,

    audioIntroduccion,

    audioError:
      configuracion.audioError ??
      null,

    audioInactividad:
      configuracion
        .audioInactividad ?? null,

    audioCompletado:
      configuracion
        .audioCompletado ?? null,

    objetos: mezclarElementos([
      ...objetosCorrectos,
      ...objetosDistractores,
    ]),
  };
};

// Crea los cinco niveles de una partida.
export const crearPartida = () => {
  return configuraciones.map(
    (configuracion) =>
      crearNivelJugable(
        configuracion
      )
  );
};

export {
  AUDIOS,
  FONDOS,
  IMAGENES_ANIMALES,
  OBJETOS,
  TOTAL_OBJETOS,
};

export default configuraciones;
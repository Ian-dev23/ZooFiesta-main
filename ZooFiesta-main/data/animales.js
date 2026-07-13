const animales = [
  {
    id: 1,
    nombre: "Conejo",
    cantidad: 4,

    imagenFondo: require("../assets/background.png"),

    objetoBuscado: "zanahoria",
    objetoBuscadoPlural: "zanahorias",

    mensajeIntroduccion:
      "Hola, soy el conejito. Tengo que llevar 4 zanahorias a la fiesta. ¿Me ayudas a encontrarlas?",

    mensajeError:
      "Ups, eso no parece una zanahoria. Busca las zanahorias.",

    mensajeCompletado:
      "Muy bien. Encontraste las 4 zanahorias.",

    imagenAnimal: null,
    imagenObjetoBuscado: null,

    audioIntroduccion: null,
    audioError: null,
    audioCompletado: null,

    audioRecordatorio: {
      1: null,
      2: null,
      3: null,
      4: null,
    },

    objetos: [
      { id: "1-1", tipo: "zanahoria", correcto: true, imagen: null },
      { id: "1-2", tipo: "lechuga", correcto: false, imagen: null },
      { id: "1-3", tipo: "platano", correcto: false, imagen: null },
      { id: "1-4", tipo: "sandia", correcto: false, imagen: null },

      { id: "1-5", tipo: "maiz", correcto: false, imagen: null },
      { id: "1-6", tipo: "zanahoria", correcto: true, imagen: null },
      { id: "1-7", tipo: "sandia", correcto: false, imagen: null },
      { id: "1-8", tipo: "zanahoria", correcto: true, imagen: null },

      { id: "1-9", tipo: "lechuga", correcto: false, imagen: null },
      { id: "1-10", tipo: "zanahoria", correcto: true, imagen: null },
      { id: "1-11", tipo: "platano", correcto: false, imagen: null },
      { id: "1-12", tipo: "sandia", correcto: false, imagen: null },
    ],
  },

  {
    id: 2,
    nombre: "Mono",
    cantidad: 5,

    imagenFondo: require("../assets/background.png"),

    objetoBuscado: "platano",
    objetoBuscadoPlural: "plátanos",

    mensajeIntroduccion:
      "Hola, soy el monito. Tengo que llevar 5 plátanos a la fiesta. ¿Me ayudas a encontrarlos?",

    mensajeError:
      "Ups, eso no parece un plátano. Busca los plátanos.",

    mensajeCompletado:
      "Muy bien. Encontraste los 5 plátanos.",

    imagenAnimal: null,
    imagenObjetoBuscado: null,

    audioIntroduccion: null,
    audioError: null,
    audioCompletado: null,

    audioRecordatorio: {
      1: null,
      2: null,
      3: null,
      4: null,
      5: null,
    },

    objetos: [
      { id: "2-1", tipo: "platano", correcto: true, imagen: null },
      { id: "2-2", tipo: "manzana", correcto: false, imagen: null },
      { id: "2-3", tipo: "platano", correcto: true, imagen: null },
      { id: "2-4", tipo: "pera", correcto: false, imagen: null },

      { id: "2-5", tipo: "sandia", correcto: false, imagen: null },
      { id: "2-6", tipo: "platano", correcto: true, imagen: null },
      { id: "2-7", tipo: "manzana", correcto: false, imagen: null },
      { id: "2-8", tipo: "platano", correcto: true, imagen: null },

      { id: "2-9", tipo: "uva", correcto: false, imagen: null },
      { id: "2-10", tipo: "pera", correcto: false, imagen: null },
      { id: "2-11", tipo: "platano", correcto: true, imagen: null },
      { id: "2-12", tipo: "sandia", correcto: false, imagen: null },
    ],
  },

  {
    id: 3,
    nombre: "Elefante",
    cantidad: 3,

    imagenFondo: require("../assets/background.png"),

    objetoBuscado: "manzana",
    objetoBuscadoPlural: "manzanas",

    mensajeIntroduccion:
      "Hola, soy el elefante. Tengo que llevar 3 manzanas a la fiesta. ¿Me ayudas a encontrarlas?",

    mensajeError:
      "Ups, eso no parece una manzana. Busca las manzanas.",

    mensajeCompletado:
      "Muy bien. Encontraste las 3 manzanas.",

    imagenAnimal: null,
    imagenObjetoBuscado: null,

    audioIntroduccion: null,
    audioError: null,
    audioCompletado: null,

    audioRecordatorio: {
      1: null,
      2: null,
      3: null,
    },

    objetos: [
      { id: "3-1", tipo: "pera", correcto: false, imagen: null },
      { id: "3-2", tipo: "manzana", correcto: true, imagen: null },
      { id: "3-3", tipo: "uva", correcto: false, imagen: null },
      { id: "3-4", tipo: "sandia", correcto: false, imagen: null },

      { id: "3-5", tipo: "manzana", correcto: true, imagen: null },
      { id: "3-6", tipo: "platano", correcto: false, imagen: null },
      { id: "3-7", tipo: "pera", correcto: false, imagen: null },
      { id: "3-8", tipo: "naranja", correcto: false, imagen: null },

      { id: "3-9", tipo: "sandia", correcto: false, imagen: null },
      { id: "3-10", tipo: "uva", correcto: false, imagen: null },
      { id: "3-11", tipo: "manzana", correcto: true, imagen: null },
      { id: "3-12", tipo: "platano", correcto: false, imagen: null },
    ],
  },

  {
    id: 4,
    nombre: "Jirafa",
    cantidad: 6,

    imagenFondo: require("../assets/background.png"),

    objetoBuscado: "pera",
    objetoBuscadoPlural: "peras",

    mensajeIntroduccion:
      "Hola, soy la jirafa. Tengo que llevar 6 peras a la fiesta. ¿Me ayudas a encontrarlas?",

    mensajeError:
      "Ups, eso no parece una pera. Busca las peras.",

    mensajeCompletado:
      "Muy bien. Encontraste las 6 peras.",

    imagenAnimal: null,
    imagenObjetoBuscado: null,

    audioIntroduccion: null,
    audioError: null,
    audioCompletado: null,

    audioRecordatorio: {
      1: null,
      2: null,
      3: null,
      4: null,
      5: null,
      6: null,
    },

    objetos: [
      { id: "4-1", tipo: "pera", correcto: true, imagen: null },
      { id: "4-2", tipo: "manzana", correcto: false, imagen: null },
      { id: "4-3", tipo: "pera", correcto: true, imagen: null },
      { id: "4-4", tipo: "platano", correcto: false, imagen: null },

      { id: "4-5", tipo: "pera", correcto: true, imagen: null },
      { id: "4-6", tipo: "sandia", correcto: false, imagen: null },
      { id: "4-7", tipo: "pera", correcto: true, imagen: null },
      { id: "4-8", tipo: "manzana", correcto: false, imagen: null },

      { id: "4-9", tipo: "pera", correcto: true, imagen: null },
      { id: "4-10", tipo: "uva", correcto: false, imagen: null },
      { id: "4-11", tipo: "pera", correcto: true, imagen: null },
      { id: "4-12", tipo: "naranja", correcto: false, imagen: null },
    ],
  },

  {
    id: 5,
    nombre: "Oso",
    cantidad: 2,

    imagenFondo: require("../assets/background.png"),

    objetoBuscado: "sandia",
    objetoBuscadoPlural: "sandías",

    mensajeIntroduccion:
      "Hola, soy el osito. Tengo que llevar 2 sandías a la fiesta. ¿Me ayudas a encontrarlas?",

    mensajeError:
      "Ups, eso no parece una sandía. Busca las sandías.",

    mensajeCompletado:
      "Muy bien. Encontraste las 2 sandías.",

    imagenAnimal: null,
    imagenObjetoBuscado: null,

    audioIntroduccion: null,
    audioError: null,
    audioCompletado: null,

    audioRecordatorio: {
      1: null,
      2: null,
    },

    objetos: [
      { id: "5-1", tipo: "manzana", correcto: false, imagen: null },
      { id: "5-2", tipo: "platano", correcto: false, imagen: null },
      { id: "5-3", tipo: "sandia", correcto: true, imagen: null },
      { id: "5-4", tipo: "pera", correcto: false, imagen: null },

      { id: "5-5", tipo: "uva", correcto: false, imagen: null },
      { id: "5-6", tipo: "naranja", correcto: false, imagen: null },
      { id: "5-7", tipo: "manzana", correcto: false, imagen: null },
      { id: "5-8", tipo: "platano", correcto: false, imagen: null },

      { id: "5-9", tipo: "pera", correcto: false, imagen: null },
      { id: "5-10", tipo: "sandia", correcto: true, imagen: null },
      { id: "5-11", tipo: "uva", correcto: false, imagen: null },
      { id: "5-12", tipo: "naranja", correcto: false, imagen: null },
    ],
  },
];

export default animales;
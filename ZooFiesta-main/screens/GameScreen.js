import React, {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";

import {
  Animated,
  FlatList,
  Image,
  ImageBackground,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { Audio } from "expo-av";
import { useFocusEffect } from "@react-navigation/native";
import * as NavigationBar from "expo-navigation-bar";

import { crearPartida } from "../data/animales";

const MUSICA_FONDO = require(
  "../assets/sounds/audio_inicio.mp3"
);

const VOLUMEN_MUSICA = 0.15;
const VOLUMEN_MUSICA_MIENTRAS_HABLA = 0.03;
const TIEMPO_RECORDATORIO = 40000;

const esperar = (milisegundos) => {
  return new Promise((resolve) => {
    setTimeout(resolve, milisegundos);
  });
};

const estadoInicial = {
  nivelActual: 0,
  seleccionados: [],
  bloqueado: true,
  mostrarAyuda: false,
  nivelCompletado: false,
};

function juegoReducer(estado, accion) {
  switch (accion.type) {
    case "NUEVA_PARTIDA":
      return {
        ...estadoInicial,
      };

    case "INICIAR_NIVEL":
      return {
        ...estado,
        seleccionados: [],
        bloqueado: true,
        mostrarAyuda: false,
        nivelCompletado: false,
      };

    case "BLOQUEAR":
      return {
        ...estado,
        bloqueado: true,
      };

    case "DESBLOQUEAR":
      return {
        ...estado,
        bloqueado: false,
      };

    case "SELECCIONAR":
      if (estado.seleccionados.includes(accion.id)) {
        return estado;
      }

      return {
        ...estado,
        seleccionados: [
          ...estado.seleccionados,
          accion.id,
        ],
      };

    case "MOSTRAR_AYUDA":
      return {
        ...estado,
        mostrarAyuda: true,
      };

    case "OCULTAR_AYUDA":
      return {
        ...estado,
        mostrarAyuda: false,
      };

    case "COMPLETAR_NIVEL":
      return {
        ...estado,
        bloqueado: true,
        nivelCompletado: true,
      };

    case "SIGUIENTE_NIVEL":
      return {
        ...estadoInicial,
        nivelActual: estado.nivelActual + 1,
      };

    default:
      return estado;
  }
}

function useAudioJuego() {
  const musicaRef = useRef(null);
  const vozRef = useRef(null);
  const resolverVozRef = useRef(null);

  const cambiarVolumenMusica = useCallback(
    async (volumen) => {
      if (!musicaRef.current) {
        return;
      }

      try {
        await musicaRef.current.setVolumeAsync(volumen);
      } catch (error) {
        console.warn(
          "No se pudo cambiar el volumen:",
          error
        );
      }
    },
    []
  );

  const detenerMusica = useCallback(async () => {
    const musica = musicaRef.current;
    musicaRef.current = null;

    if (!musica) {
      return;
    }

    try {
      await musica.stopAsync();
      await musica.unloadAsync();
    } catch (error) {
      console.warn(
        "No se pudo detener la música:",
        error
      );
    }
  }, []);

  const detenerVoz = useCallback(
    async (restaurarMusica = true) => {
      const voz = vozRef.current;
      vozRef.current = null;

      if (resolverVozRef.current) {
        resolverVozRef.current();
        resolverVozRef.current = null;
      }

      if (voz) {
        try {
          voz.setOnPlaybackStatusUpdate(null);
          await voz.stopAsync();
          await voz.unloadAsync();
        } catch (error) {
          console.warn(
            "No se pudo detener la voz:",
            error
          );
        }
      }

      if (restaurarMusica) {
        await cambiarVolumenMusica(
          VOLUMEN_MUSICA
        );
      }
    },
    [cambiarVolumenMusica]
  );

  const iniciarMusica = useCallback(async () => {
    await detenerMusica();

    try {
      const { sound } =
        await Audio.Sound.createAsync(
          MUSICA_FONDO,
          {
            shouldPlay: true,
            isLooping: true,
            volume: VOLUMEN_MUSICA,
          }
        );

      musicaRef.current = sound;
    } catch (error) {
      console.warn(
        "No se pudo iniciar la música:",
        error
      );
    }
  }, [detenerMusica]);

  const reproducirVoz = useCallback(
    async (archivoAudio) => {
      if (!archivoAudio) {
        return;
      }

      await detenerVoz(false);

      await cambiarVolumenMusica(
        VOLUMEN_MUSICA_MIENTRAS_HABLA
      );

      await new Promise(async (resolve) => {
        let finalizado = false;

        const finalizar = () => {
          if (finalizado) {
            return;
          }

          finalizado = true;
          resolve();
        };

        resolverVozRef.current = finalizar;

        try {
          const { sound } =
            await Audio.Sound.createAsync(
              archivoAudio,
              {
                shouldPlay: true,
                volume: 1,
              }
            );

          vozRef.current = sound;

          sound.setOnPlaybackStatusUpdate(
            async (estadoAudio) => {
              if (
                !estadoAudio.isLoaded ||
                !estadoAudio.didJustFinish
              ) {
                return;
              }

              sound.setOnPlaybackStatusUpdate(null);

              if (vozRef.current === sound) {
                vozRef.current = null;
              }

              if (
                resolverVozRef.current ===
                finalizar
              ) {
                resolverVozRef.current = null;
              }

              try {
                await sound.unloadAsync();
              } catch (error) {
                console.warn(
                  "No se pudo descargar la voz:",
                  error
                );
              }

              await cambiarVolumenMusica(
                VOLUMEN_MUSICA
              );

              finalizar();
            }
          );
        } catch (error) {
          console.warn(
            "No se pudo reproducir la voz:",
            error
          );

          await cambiarVolumenMusica(
            VOLUMEN_MUSICA
          );

          finalizar();
        }
      });
    },
    [cambiarVolumenMusica, detenerVoz]
  );

  return {
    iniciarMusica,
    detenerMusica,
    reproducirVoz,
    detenerVoz,
  };
}

function useRecordatorioInactividad({
  nivel,
  pantallaActivaRef,
  bloqueadoRef,
  cambiarBloqueo,
  reproducirVoz,
}) {
  const timeoutRef = useRef(null);
  const tokenRef = useRef(0);
  const programarRef = useRef(null);

  const limpiar = useCallback(() => {
    tokenRef.current += 1;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const programar = useCallback(
    (cantidadPendiente) => {
      limpiar();

      const audio =
        nivel.audioRecordatorio?.[
          cantidadPendiente
        ];

      if (cantidadPendiente <= 0 || !audio) {
        return;
      }

      const tokenActual = tokenRef.current;

      const ejecutar = async () => {
        if (
          tokenActual !== tokenRef.current ||
          !pantallaActivaRef.current
        ) {
          return;
        }

        if (bloqueadoRef.current) {
          timeoutRef.current = setTimeout(
            ejecutar,
            1000
          );

          return;
        }

        cambiarBloqueo(true);

        await reproducirVoz(audio);

        if (
          tokenActual !== tokenRef.current ||
          !pantallaActivaRef.current
        ) {
          return;
        }

        cambiarBloqueo(false);

        programarRef.current?.(
          cantidadPendiente
        );
      };

      timeoutRef.current = setTimeout(
        ejecutar,
        TIEMPO_RECORDATORIO
      );
    },
    [
      cambiarBloqueo,
      limpiar,
      nivel.audioRecordatorio,
      reproducirVoz,
    ]
  );

  useEffect(() => {
    programarRef.current = programar;
  }, [programar]);

  return {
    programar,
    limpiar,
  };
}

export default function GameScreen({
  navigation,
}) {
  const { width: screenWidth } =
    useWindowDimensions();

  const [niveles] = useState(() =>
    crearPartida()
  );

  const [estado, dispatch] = useReducer(
    juegoReducer,
    estadoInicial
  );

  const pantallaActivaRef = useRef(false);
  const bloqueadoRef = useRef(true);
  const seleccionadosRef = useRef([]);

  const ayudaAnimada = useRef(
    new Animated.Value(1)
  ).current;

  const nivel = niveles[estado.nivelActual];

  const anchoObjeto = Math.min(
    (screenWidth - 48) / 4,
    90
  );

  const {
    iniciarMusica,
    detenerMusica,
    reproducirVoz,
    detenerVoz,
  } = useAudioJuego();

  const cambiarBloqueo = useCallback(
    (valor) => {
      bloqueadoRef.current = valor;

      dispatch({
        type: valor
          ? "BLOQUEAR"
          : "DESBLOQUEAR",
      });
    },
    []
  );

  const {
    programar: programarRecordatorio,
    limpiar: limpiarRecordatorio,
  } = useRecordatorioInactividad({
    nivel,
    pantallaActivaRef,
    bloqueadoRef,
    cambiarBloqueo,
    reproducirVoz,
  });

  useFocusEffect(
    useCallback(() => {
      pantallaActivaRef.current = true;

      const prepararAudio = async () => {
        try {
          await Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            staysActiveInBackground: false,
            shouldDuckAndroid: true,
          });

          if (pantallaActivaRef.current) {
            await iniciarMusica();
          }
        } catch (error) {
          console.warn(
            "No se pudo configurar el audio:",
            error
          );
        }
      };

      if (Platform.OS === "android") {
        NavigationBar.setBehaviorAsync(
          "overlay-swipe"
        ).catch(() => {});

        NavigationBar.setVisibilityAsync(
          "hidden"
        ).catch(() => {});
      }

      prepararAudio();

      return () => {
        pantallaActivaRef.current = false;

        limpiarRecordatorio();
        detenerVoz(false);
        detenerMusica();

        if (Platform.OS === "android") {
          NavigationBar.setVisibilityAsync(
            "visible"
          ).catch(() => {});
        }
      };
    }, [
      detenerMusica,
      detenerVoz,
      iniciarMusica,
      limpiarRecordatorio,
    ])
  );

  useEffect(() => {
    let efectoActivo = true;

    limpiarRecordatorio();

    seleccionadosRef.current = [];
    bloqueadoRef.current = true;

    dispatch({
      type: "INICIAR_NIVEL",
    });

    ayudaAnimada.setValue(1);

    const iniciarNivel = async () => {
      await esperar(350);

      if (
        !efectoActivo ||
        !pantallaActivaRef.current
      ) {
        return;
      }

      await reproducirVoz(
        nivel.audioIntroduccion
      );

      if (
        efectoActivo &&
        pantallaActivaRef.current
      ) {
        cambiarBloqueo(false);

        programarRecordatorio(
          nivel.cantidad
        );
      }
    };

    iniciarNivel();

    return () => {
      efectoActivo = false;
      limpiarRecordatorio();
    };
  }, [
    ayudaAnimada,
    cambiarBloqueo,
    limpiarRecordatorio,
    nivel.audioIntroduccion,
    nivel.cantidad,
    nivel.id,
    programarRecordatorio,
    reproducirVoz,
  ]);

  const iluminarObjetosCorrectos =
    useCallback(async () => {
      dispatch({
        type: "MOSTRAR_AYUDA",
      });

      ayudaAnimada.setValue(1);

      await new Promise((resolve) => {
        Animated.sequence([
          Animated.timing(ayudaAnimada, {
            toValue: 1.14,
            duration: 220,
            useNativeDriver: true,
          }),

          Animated.timing(ayudaAnimada, {
            toValue: 1,
            duration: 220,
            useNativeDriver: true,
          }),

          Animated.timing(ayudaAnimada, {
            toValue: 1.14,
            duration: 220,
            useNativeDriver: true,
          }),

          Animated.timing(ayudaAnimada, {
            toValue: 1,
            duration: 220,
            useNativeDriver: true,
          }),
        ]).start(resolve);
      });

      dispatch({
        type: "OCULTAR_AYUDA",
      });
    }, [ayudaAnimada]);

  const completarNivel =
    useCallback(async () => {
      limpiarRecordatorio();

      cambiarBloqueo(true);

      dispatch({
        type: "COMPLETAR_NIVEL",
      });

      await reproducirVoz(
        nivel.audioCompletado
      );

      await esperar(1400);

      const esUltimoNivel =
        estado.nivelActual ===
        niveles.length - 1;

      if (esUltimoNivel) {
        navigation.replace("Success");
        return;
      }

      seleccionadosRef.current = [];

      dispatch({
        type: "SIGUIENTE_NIVEL",
      });
    }, [
      cambiarBloqueo,
      estado.nivelActual,
      limpiarRecordatorio,
      navigation,
      nivel.audioCompletado,
      niveles.length,
      reproducirVoz,
    ]);

  const seleccionarObjeto = useCallback(
    async (objeto) => {
      if (
        bloqueadoRef.current ||
        estado.nivelCompletado ||
        seleccionadosRef.current.includes(
          objeto.id
        )
      ) {
        return;
      }

      if (!objeto.correcto) {
        cambiarBloqueo(true);

        await Promise.all([
          reproducirVoz(nivel.audioError),
          iluminarObjetosCorrectos(),
        ]);

        if (pantallaActivaRef.current) {
          cambiarBloqueo(false);
        }

        return;
      }

      const nuevosSeleccionados = [
        ...seleccionadosRef.current,
        objeto.id,
      ];

      seleccionadosRef.current =
        nuevosSeleccionados;

      dispatch({
        type: "SELECCIONAR",
        id: objeto.id,
      });

      const cantidadPendiente =
        nivel.cantidad -
        nuevosSeleccionados.length;

      if (cantidadPendiente > 0) {
        programarRecordatorio(
          cantidadPendiente
        );
      } else {
        await completarNivel();
      }
    },
    [
      cambiarBloqueo,
      completarNivel,
      estado.nivelCompletado,
      iluminarObjetosCorrectos,
      nivel.audioError,
      nivel.cantidad,
      programarRecordatorio,
      reproducirVoz,
    ]
  );

  const repetirIntroduccion =
    useCallback(async () => {
      if (
        bloqueadoRef.current ||
        !nivel.audioIntroduccion
      ) {
        return;
      }

      cambiarBloqueo(true);

      await reproducirVoz(
        nivel.audioIntroduccion
      );

      if (pantallaActivaRef.current) {
        cambiarBloqueo(false);
      }
    }, [
      cambiarBloqueo,
      nivel.audioIntroduccion,
      reproducirVoz,
    ]);

  const renderizarObjeto = useCallback(
    ({ item }) => {
      const seleccionado =
        estado.seleccionados.includes(
          item.id
        );

      const debeIluminarse =
        estado.mostrarAyuda &&
        item.correcto &&
        !seleccionado;

      return (
        <Animated.View
          style={[
            styles.contenedorObjeto,
            {
              width: anchoObjeto,
              height: anchoObjeto,
            },
            debeIluminarse && {
              transform: [
                {
                  scale: ayudaAnimada,
                },
              ],
            },
          ]}
        >
          <Pressable
            onPress={() =>
              seleccionarObjeto(item)
            }
            disabled={
              estado.bloqueado ||
              seleccionado
            }
            accessibilityRole="button"
            accessibilityLabel={item.tipo}
            style={({ pressed }) => [
              styles.botonObjeto,

              seleccionado &&
                styles.objetoSeleccionado,

              debeIluminarse &&
                styles.objetoIluminado,

              pressed &&
                !seleccionado &&
                styles.objetoPresionado,
            ]}
          >
            <Image
              source={item.imagen}
              style={styles.imagenObjeto}
              resizeMode="contain"
            />

            {seleccionado && (
              <View
                style={
                  styles.marcaSeleccionado
                }
              >
                <Text
                  style={
                    styles.numeroSeleccionado
                  }
                >
                  {estado.seleccionados.indexOf(
                    item.id
                  ) + 1}
                </Text>
              </View>
            )}
          </Pressable>
        </Animated.View>
      );
    },
    [
      anchoObjeto,
      ayudaAnimada,
      estado.bloqueado,
      estado.mostrarAyuda,
      estado.seleccionados,
      seleccionarObjeto,
    ]
  );

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={nivel.imagenFondo}
        resizeMode="cover"
        style={styles.background}
      >
        <View style={styles.overlay}>
          <View style={styles.parteSuperior}>
            <View style={styles.filaSuperior}>
              <Image
                source={nivel.imagenAnimal}
                style={styles.imagenAnimal}
                resizeMode="contain"
              />

              <View
                style={
                  styles.mensajeContainer
                }
              >
                <Text style={styles.mensaje}>
                  {nivel.mensajeIntroduccion}
                </Text>

                <Pressable
                  onPress={
                    repetirIntroduccion
                  }
                  disabled={
                    estado.bloqueado ||
                    !nivel.audioIntroduccion
                  }
                  style={({ pressed }) => [
                    styles.botonAudio,

                    pressed &&
                      styles.botonAudioPresionado,

                    !nivel.audioIntroduccion &&
                      styles.botonAudioDeshabilitado,
                  ]}
                >
                  {nivel.imagenBotonAudio ? (
                    <Image
                      source={
                        nivel.imagenBotonAudio
                      }
                      style={
                        styles.imagenBotonAudio
                      }
                      resizeMode="contain"
                    />
                  ) : (
                    <Text
                      style={
                        styles.textoBotonAudio
                      }
                    >
                      Repetir audio
                    </Text>
                  )}
                </Pressable>
              </View>
            </View>

            <View
              style={
                styles.objetivoContainer
              }
            >
              <Text
                style={
                  styles.textoCantidad
                }
              >
                Encuentra
              </Text>

              <Text
                style={
                  styles.numeroObjetivo
                }
              >
                {nivel.cantidad}
              </Text>

              <Text
                style={
                  styles.nombreObjetivo
                }
              >
                {nivel.objetoBuscadoPlural}
              </Text>
            </View>
          </View>

          <View style={styles.parteJuego}>
            <View
              style={
                styles.progresoContainer
              }
            >
              <View
                style={
                  styles.progresoEncontradosContainer
                }
              >
                <Text
                  style={styles.progreso}
                >
                  Encontrados:{" "}
                  {
                    estado.seleccionados
                      .length
                  }{" "}
                  de {nivel.cantidad}
                </Text>
              </View>

              <View
                style={
                  styles.indicadorNivelContainer
                }
              >
                <Text
                  style={
                    styles.indicadorNivel
                  }
                >
                  Nivel{" "}
                  {estado.nivelActual + 1}{" "}
                  de {niveles.length}
                </Text>
              </View>
            </View>

            <FlatList
              data={nivel.objetos}
              keyExtractor={(item) =>
                item.id
              }
              renderItem={
                renderizarObjeto
              }
              numColumns={4}
              scrollEnabled={false}
              removeClippedSubviews={
                false
              }
              extraData={estado}
              contentContainerStyle={
                styles.cuadricula
              }
              columnWrapperStyle={
                styles.filaCuadricula
              }
            />

            {estado.nivelCompletado && (
              <View
                style={
                  styles.mensajeCompletado
                }
              >
                <Text
                  style={
                    styles.textoCompletado
                  }
                >
                  {
                    nivel.mensajeCompletado
                  }
                </Text>
              </View>
            )}
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF9E8",
  },

  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  overlay: {
    flex: 1,
    backgroundColor:
      "rgba(255, 249, 232, 0.20)",
  },

  parteSuperior: {
    flex: 1.25,
    paddingHorizontal: 12,
    paddingTop: 8,
    justifyContent: "space-between",
  },

  filaSuperior: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingBottom: 35,
  },

  imagenAnimal: {
    width: 180,
    height: 180,
    transform: [
      {
        translateY: 30,
      },
    ],
  },

  mensajeContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 12,
    elevation: 3,
    transform: [
      {
        translateY: 30,
      },
    ],
  },

  mensaje: {
    fontSize: 16,
    lineHeight: 21,
    color: "#333333",
    fontWeight: "600",
  },

  botonAudio: {
    alignSelf: "flex-start",
    minWidth: 110,
    minHeight: 38,
    marginTop: 9,
    borderRadius: 10,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4CAF50",
  },

  botonAudioPresionado: {
    opacity: 0.75,
  },

  botonAudioDeshabilitado: {
    opacity: 0.45,
  },

  textoBotonAudio: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },

  imagenBotonAudio: {
    width: 36,
    height: 36,
  },

  objetivoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 105,
    marginTop: 15,
  },

  textoCantidad: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333333",
  },

  numeroObjetivo: {
    marginHorizontal: 14,
    fontSize: 82,
    lineHeight: 88,
    fontWeight: "900",
    color: "#F57C00",
  },

  nombreObjetivo: {
    maxWidth: 135,
    fontSize: 23,
    fontWeight: "800",
    color: "#333333",
  },

  parteJuego: {
    flex: 1.75,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },

  progresoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 5,
    gap: 8,
  },

  progresoEncontradosContainer: {
    flexShrink: 1,
    backgroundColor:
      "rgba(255, 255, 255, 0.95)",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#4CAF50",

    elevation: 5,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.22,
    shadowRadius: 3,
  },

  progreso: {
    fontSize: 16,
    fontWeight: "900",
    color: "#1B5E20",
    textAlign: "center",
  },

  indicadorNivelContainer: {
    backgroundColor:
      "rgba(255, 255, 255, 0.95)",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#F57C00",

    elevation: 5,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.22,
    shadowRadius: 3,
  },

  indicadorNivel: {
    fontSize: 17,
    fontWeight: "900",
    color: "#C94F00",
    textAlign: "center",
  },

  cuadricula: {
    flexGrow: 1,
    justifyContent: "space-around",
  },

  filaCuadricula: {
    justifyContent: "space-around",
  },

  contenedorObjeto: {
    margin: 3,
  },

  botonObjeto: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    padding: 2,
    elevation: 2,
  },

  objetoPresionado: {
    transform: [
      {
        scale: 0.93,
      },
    ],
  },

  objetoSeleccionado: {
    borderColor: "#4CAF50",
    backgroundColor: "#E8F5E9",
    opacity: 0.75,
  },

  objetoIluminado: {
    borderColor: "#FFB300",
    borderWidth: 5,
    backgroundColor: "#FFF3C4",
    elevation: 8,
  },

  imagenObjeto: {
    width: "100%",
    height: "100%",
  },

  marcaSeleccionado: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 27,
    height: 27,
    borderRadius: 14,
    backgroundColor: "#2E7D32",
    justifyContent: "center",
    alignItems: "center",
  },

  numeroSeleccionado: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "900",
  },

  mensajeCompletado: {
    position: "absolute",
    left: 25,
    right: 25,
    bottom: 25,
    minHeight: 80,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 4,
    borderColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    elevation: 10,
  },

  textoCompletado: {
    fontSize: 21,
    fontWeight: "900",
    color: "#2E7D32",
    textAlign: "center",
  },
});
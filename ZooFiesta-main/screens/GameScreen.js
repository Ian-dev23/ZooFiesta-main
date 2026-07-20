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

import SoundButton from "../components/botones/SoundButton";
import { crearPartida } from "../data/animales";

const MUSICA_FONDO = require(
  "../assets/sounds/audio_inicio.mp3"
);

const VOLUMEN_MUSICA = 0.10;
const VOLUMEN_MUSICA_MIENTRAS_HABLA = 0.03;
const TIEMPO_INACTIVIDAD = 20000;

const esperar = (milisegundos) =>
  new Promise((resolve) =>
    setTimeout(resolve, milisegundos)
  );

const estadoInicial = {
  nivelActual: 0,
  seleccionados: [],
  bloqueado: true,
  mostrarAyuda: false,
  nivelCompletado: false,
};

function juegoReducer(estado, accion) {
  switch (accion.type) {
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
      if (
        estado.seleccionados.includes(
          accion.id
        )
      ) {
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
        nivelActual:
          estado.nivelActual + 1,
      };

    default:
      return estado;
  }
}

function useAudioJuego(
  musicaActivaRef
) {
  const musicaRef = useRef(null);
  const vozRef = useRef(null);

  const vozReproduciendoseRef =
    useRef(false);

  const resolverVozRef =
    useRef(null);

  const cambiarVolumenMusica =
    useCallback(
      async (volumen) => {
        if (!musicaRef.current) {
          return;
        }

        try {
          await musicaRef.current
            .setVolumeAsync(
              musicaActivaRef.current
                ? volumen
                : 0
            );
        } catch (error) {
          console.warn(
            "No se pudo cambiar el volumen:",
            error
          );
        }
      },
      [musicaActivaRef]
    );

  const detenerMusica =
    useCallback(async () => {
      const musica =
        musicaRef.current;

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

  const detenerVoz =
    useCallback(
      async (
        restaurarMusica = true
      ) => {
        const voz = vozRef.current;

        vozRef.current = null;

        vozReproduciendoseRef.current =
          false;

        if (
          resolverVozRef.current
        ) {
          resolverVozRef.current();

          resolverVozRef.current =
            null;
        }

        if (voz) {
          try {
            voz.setOnPlaybackStatusUpdate(
              null
            );

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

  const iniciarMusica =
    useCallback(async () => {
      await detenerMusica();

      try {
        const { sound } =
          await Audio.Sound
            .createAsync(
              MUSICA_FONDO,
              {
                shouldPlay: true,
                isLooping: true,

                volume:
                  musicaActivaRef
                    .current
                    ? VOLUMEN_MUSICA
                    : 0,
              }
            );

        musicaRef.current = sound;
      } catch (error) {
        console.warn(
          "No se pudo iniciar la música:",
          error
        );
      }
    }, [
      detenerMusica,
      musicaActivaRef,
    ]);

  const reproducirVoz =
    useCallback(
      async (archivoAudio) => {
        if (!archivoAudio) {
          return;
        }

        await detenerVoz(false);

        vozReproduciendoseRef.current =
          true;

        await cambiarVolumenMusica(
          VOLUMEN_MUSICA_MIENTRAS_HABLA
        );

        await new Promise(
          (resolve) => {
            let finalizado = false;

            const finalizar = () => {
              if (finalizado) {
                return;
              }

              finalizado = true;
              resolve();
            };

            resolverVozRef.current =
              finalizar;

            Audio.Sound.createAsync(
              archivoAudio,
              {
                shouldPlay: true,
                volume: 1,
              }
            )
              .then(
                ({ sound }) => {
                  vozRef.current =
                    sound;

                  sound
                    .setOnPlaybackStatusUpdate(
                      async (
                        estadoAudio
                      ) => {
                        if (
                          !estadoAudio
                            .isLoaded ||
                          !estadoAudio
                            .didJustFinish
                        ) {
                          return;
                        }

                        sound
                          .setOnPlaybackStatusUpdate(
                            null
                          );

                        if (
                          vozRef.current ===
                          sound
                        ) {
                          vozRef.current =
                            null;
                        }

                        if (
                          resolverVozRef
                            .current ===
                          finalizar
                        ) {
                          resolverVozRef.current =
                            null;
                        }

                        try {
                          await sound
                            .unloadAsync();
                        } catch (
                          error
                        ) {
                          console.warn(
                            "No se pudo descargar la voz:",
                            error
                          );
                        }

                        vozReproduciendoseRef.current =
                          false;

                        await cambiarVolumenMusica(
                          VOLUMEN_MUSICA
                        );

                        finalizar();
                      }
                    );
                }
              )
              .catch(
                async (error) => {
                  console.warn(
                    "No se pudo reproducir la voz:",
                    error
                  );

                  vozReproduciendoseRef.current =
                    false;

                  await cambiarVolumenMusica(
                    VOLUMEN_MUSICA
                  );

                  finalizar();
                }
              );
          }
        );
      },
      [
        cambiarVolumenMusica,
        detenerVoz,
      ]
    );

  const establecerMusicaActiva =
    useCallback(
      async (activa) => {
        musicaActivaRef.current =
          activa;

        if (!musicaRef.current) {
          return;
        }

        const volumen = activa
          ? vozReproduciendoseRef.current
            ? VOLUMEN_MUSICA_MIENTRAS_HABLA
            : VOLUMEN_MUSICA
          : 0;

        try {
          await musicaRef.current
            .setVolumeAsync(
              volumen
            );
        } catch (error) {
          console.warn(
            "No se pudo cambiar el estado de la música:",
            error
          );
        }
      },
      [musicaActivaRef]
    );

  return {
    iniciarMusica,
    detenerMusica,
    reproducirVoz,
    detenerVoz,
    establecerMusicaActiva,
  };
}

export default function GameScreen({
  navigation,
}) {
  const {
    width: screenWidth,
  } = useWindowDimensions();

  const [niveles] = useState(
    () => crearPartida()
  );

  const [estado, dispatch] =
    useReducer(
      juegoReducer,
      estadoInicial
    );

  const [
    musicaActiva,
    setMusicaActiva,
  ] = useState(true);

  const musicaActivaRef =
    useRef(true);

  const pantallaActivaRef =
    useRef(false);

  const bloqueadoRef =
    useRef(true);

  const seleccionadosRef =
    useRef([]);

  const partidaTerminadaRef =
    useRef(false);

  const recordatorioRef =
    useRef(null);

  const tokenRecordatorioRef =
    useRef(0);

  const ayudaAnimada = useRef(
    new Animated.Value(1)
  ).current;

  const nivel =
    niveles[estado.nivelActual];

  const anchoObjeto = Math.min(
    (screenWidth - 48) / 4,
    90
  );

  const {
    iniciarMusica,
    detenerMusica,
    reproducirVoz,
    detenerVoz,
    establecerMusicaActiva,
  } = useAudioJuego(
    musicaActivaRef
  );

  const cambiarBloqueo =
    useCallback((valor) => {
      bloqueadoRef.current =
        valor;

      dispatch({
        type: valor
          ? "BLOQUEAR"
          : "DESBLOQUEAR",
      });
    }, []);

  const limpiarRecordatorio =
    useCallback(() => {
      tokenRecordatorioRef.current +=
        1;

      if (
        recordatorioRef.current
      ) {
        clearTimeout(
          recordatorioRef.current
        );

        recordatorioRef.current =
          null;
      }
    }, []);

  const programarRecordatorio =
    useCallback(() => {
      limpiarRecordatorio();

      if (
        !nivel.audioInactividad
      ) {
        return;
      }

      const tokenActual =
        tokenRecordatorioRef.current;

      const ejecutar = async () => {
        if (
          tokenActual !==
            tokenRecordatorioRef
              .current ||
          !pantallaActivaRef.current
        ) {
          return;
        }

        if (
          bloqueadoRef.current
        ) {
          recordatorioRef.current =
            setTimeout(
              ejecutar,
              1000
            );

          return;
        }

        cambiarBloqueo(true);

        await reproducirVoz(
          nivel.audioInactividad
        );

        if (
          tokenActual !==
            tokenRecordatorioRef
              .current ||
          !pantallaActivaRef.current
        ) {
          return;
        }

        cambiarBloqueo(false);

        programarRecordatorio();
      };

      recordatorioRef.current =
        setTimeout(
          ejecutar,
          TIEMPO_INACTIVIDAD
        );
    }, [
      cambiarBloqueo,
      limpiarRecordatorio,
      nivel.audioInactividad,
      reproducirVoz,
    ]);

  const alternarMusica =
    useCallback(async () => {
      const nuevoEstado =
        !musicaActivaRef.current;

      setMusicaActiva(
        nuevoEstado
      );

      await establecerMusicaActiva(
        nuevoEstado
      );
    }, [
      establecerMusicaActiva,
    ]);

  useFocusEffect(
    useCallback(() => {
      pantallaActivaRef.current =
        true;

      const prepararAudio =
        async () => {
          try {
            await Audio
              .setAudioModeAsync({
                playsInSilentModeIOS:
                  true,

                staysActiveInBackground:
                  false,

                shouldDuckAndroid:
                  true,
              });

            if (
              pantallaActivaRef.current
            ) {
              await iniciarMusica();
            }
          } catch (error) {
            console.warn(
              "No se pudo configurar el audio:",
              error
            );
          }
        };

      if (
        Platform.OS === "android"
      ) {
        NavigationBar
          .setBehaviorAsync(
            "overlay-swipe"
          )
          .catch(() => {});

        NavigationBar
          .setVisibilityAsync(
            "hidden"
          )
          .catch(() => {});
      }

      prepararAudio();

      return () => {
        pantallaActivaRef.current =
          false;

        limpiarRecordatorio();
        detenerVoz(false);
        detenerMusica();

        if (
          Platform.OS === "android"
        ) {
          NavigationBar
            .setVisibilityAsync(
              "visible"
            )
            .catch(() => {});
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

    seleccionadosRef.current =
      [];

    bloqueadoRef.current =
      true;

    dispatch({
      type: "INICIAR_NIVEL",
    });

    ayudaAnimada.setValue(1);

    const iniciarNivel =
      async () => {
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

          programarRecordatorio();
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

      await new Promise(
        (resolve) => {
          Animated.sequence([
            Animated.timing(
              ayudaAnimada,
              {
                toValue: 1.14,
                duration: 220,
                useNativeDriver:
                  true,
              }
            ),

            Animated.timing(
              ayudaAnimada,
              {
                toValue: 1,
                duration: 220,
                useNativeDriver:
                  true,
              }
            ),

            Animated.timing(
              ayudaAnimada,
              {
                toValue: 1.14,
                duration: 220,
                useNativeDriver:
                  true,
              }
            ),

            Animated.timing(
              ayudaAnimada,
              {
                toValue: 1,
                duration: 220,
                useNativeDriver:
                  true,
              }
            ),
          ]).start(resolve);
        }
      );

      dispatch({
        type: "OCULTAR_AYUDA",
      });
    }, [ayudaAnimada]);

  const completarNivel =
    useCallback(async () => {
      if (
        partidaTerminadaRef.current
      ) {
        return;
      }

      limpiarRecordatorio();
      cambiarBloqueo(true);

      dispatch({
        type: "COMPLETAR_NIVEL",
      });

      const esUltimoNivel =
        estado.nivelActual >=
        niveles.length - 1;

      if (esUltimoNivel) {
        partidaTerminadaRef.current =
          true;
      }

      await reproducirVoz(
        nivel.audioCompletado
      );

      await esperar(1400);

      if (esUltimoNivel) {
        navigation.reset({
          index: 0,

          routes: [
            {
              name: "Success",
            },
          ],
        });

        return;
      }

      seleccionadosRef.current =
        [];

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

  const seleccionarObjeto =
    useCallback(
      async (objeto) => {
        if (
          bloqueadoRef.current ||
          estado.nivelCompletado ||
          seleccionadosRef.current
            .includes(objeto.id)
        ) {
          return;
        }

        /*
         * Cada selección reinicia
         * el contador de 40 segundos.
         */
        limpiarRecordatorio();

        if (!objeto.correcto) {
          cambiarBloqueo(true);

          await Promise.all([
            reproducirVoz(
              nivel.audioError
            ),

            iluminarObjetosCorrectos(),
          ]);

          if (
            pantallaActivaRef.current
          ) {
            cambiarBloqueo(false);

            programarRecordatorio();
          }

          return;
        }

        const nuevosSeleccionados =
          [
            ...seleccionadosRef.current,
            objeto.id,
          ];

        seleccionadosRef.current =
          nuevosSeleccionados;

        dispatch({
          type: "SELECCIONAR",
          id: objeto.id,
        });

        if (
          nuevosSeleccionados.length <
          nivel.cantidad
        ) {
          programarRecordatorio();
        } else {
          await completarNivel();
        }
      },
      [
        cambiarBloqueo,
        completarNivel,
        estado.nivelCompletado,
        iluminarObjetosCorrectos,
        limpiarRecordatorio,
        nivel.audioError,
        nivel.cantidad,
        programarRecordatorio,
        reproducirVoz,
      ]
    );

  const renderizarObjeto =
    useCallback(
      ({ item }) => {
        const indice =
          estado.seleccionados
            .indexOf(item.id);

        const seleccionado =
          indice !== -1;

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
                    scale:
                      ayudaAnimada,
                  },
                ],
              },
            ]}
          >
            <Pressable
              onPress={() =>
                seleccionarObjeto(
                  item
                )
              }
              disabled={
                estado.bloqueado ||
                seleccionado
              }
              accessibilityRole="button"
              accessibilityLabel={
                item.nombreAccesible ||
                item.tipo
              }
              style={({
                pressed,
              }) => [
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
                style={
                  styles.imagenObjeto
                }
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
                    {indice + 1}
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
    <SafeAreaView
      style={styles.container}
    >
      <ImageBackground
        source={nivel.imagenFondo}
        resizeMode="cover"
        style={styles.background}
      >
        <View
          style={
            styles.botonSonidoNivel
          }
        >
          <SoundButton
            onPress={alternarMusica}
            active={musicaActiva}
          />
        </View>

        <View style={styles.overlay}>
          <View
            style={
              styles.parteSuperior
            }
          >
            <View
              style={
                styles.filaSuperior
              }
            >
              <Image
                source={
                  nivel.imagenAnimal
                }
                style={
                  styles.imagenAnimal
                }
                resizeMode="contain"
              />

              <View
                style={
                  styles.mensajeContainer
                }
              >
                <Text
                  style={styles.mensaje}
                >
                  {
                    nivel.mensajeIntroduccion
                  }
                </Text>
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
                {
                  nivel.objetoBuscadoPlural
                }
              </Text>
            </View>
          </View>

          <View
            style={
              styles.parteJuego
            }
          >
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
                  style={
                    styles.progreso
                  }
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
                  {
                    estado.nivelActual +
                    1
                  }{" "}
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

  botonSonidoNivel: {
    position: "absolute",

    top:
      Platform.OS === "android"
        ? 16
        : 10,

    left: 16,
    zIndex: 50,
    elevation: 20,
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

    justifyContent:
      "space-between",
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

    padding: 12,

    borderRadius: 18,

    backgroundColor: "#FFFFFF",

    elevation: 3,

    transform: [
      {
        translateY: 30,
      },
    ],
  },

  mensaje: {
    color: "#333333",

    fontSize: 16,
    lineHeight: 21,
    fontWeight: "600",
  },

  objetivoContainer: {
    flexDirection: "row",

    alignItems: "center",
    justifyContent: "center",

    minHeight: 105,
    marginTop: 15,
  },

  textoCantidad: {
    color: "#333333",

    fontSize: 24,
    fontWeight: "700",
  },

  numeroObjetivo: {
    marginHorizontal: 14,

    color: "#F57C00",

    fontSize: 82,
    lineHeight: 88,
    fontWeight: "900",
  },

  nombreObjetivo: {
    maxWidth: 135,

    color: "#333333",

    fontSize: 23,
    fontWeight: "800",
  },

  parteJuego: {
    flex: 1.75,

    paddingHorizontal: 12,
    paddingBottom: 12,
  },

  progresoContainer: {
    flexDirection: "row",

    justifyContent:
      "space-between",

    alignItems: "center",

    marginBottom: 12,
    paddingHorizontal: 5,

    gap: 8,
  },

  progresoEncontradosContainer: {
    flexShrink: 1,

    paddingHorizontal: 12,
    paddingVertical: 7,

    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#4CAF50",

    backgroundColor:
      "rgba(255, 255, 255, 0.95)",

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
    color: "#1B5E20",

    fontSize: 16,
    fontWeight: "900",

    textAlign: "center",
  },

  indicadorNivelContainer: {
    paddingHorizontal: 14,
    paddingVertical: 7,

    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#F57C00",

    backgroundColor:
      "rgba(255, 255, 255, 0.95)",

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
    color: "#C94F00",

    fontSize: 17,
    fontWeight: "900",

    textAlign: "center",
  },

  cuadricula: {
    flexGrow: 1,

    justifyContent:
      "space-around",
  },

  filaCuadricula: {
    justifyContent:
      "space-around",
  },

  contenedorObjeto: {
    margin: 3,
  },

  botonObjeto: {
    flex: 1,

    padding: 2,

    borderRadius: 18,
    borderWidth: 3,
    borderColor: "#E0E0E0",

    backgroundColor: "#FFFFFF",

    justifyContent: "center",
    alignItems: "center",

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
    padding: 12,

    borderRadius: 18,
    borderWidth: 4,
    borderColor: "#4CAF50",

    backgroundColor: "#FFFFFF",

    justifyContent: "center",
    alignItems: "center",

    elevation: 10,
  },

  textoCompletado: {
    color: "#2E7D32",

    fontSize: 21,
    fontWeight: "900",

    textAlign: "center",
  },
});
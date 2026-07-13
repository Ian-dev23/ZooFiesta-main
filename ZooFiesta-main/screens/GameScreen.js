import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Animated,
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

import animales from "../data/animales";

const MUSICA_FONDO = require("../assets/sounds/audio_inicio.mp3");
const FONDO_PREDETERMINADO = require("../assets/background.png");

const VOLUMEN_MUSICA = 0.15;
const VOLUMEN_MUSICA_MIENTRAS_HABLA = 0.03;
const TIEMPO_RECORDATORIO = 40000;

const esperar = (milisegundos) =>
  new Promise((resolve) => setTimeout(resolve, milisegundos));

export default function GameScreen({ navigation }) {
  const { width: screenWidth } = useWindowDimensions();

  const [nivelActual, setNivelActual] = useState(0);
  const [objetosSeleccionados, setObjetosSeleccionados] = useState([]);
  const [bloqueado, setBloqueado] = useState(false);
  const [mostrarAyuda, setMostrarAyuda] = useState(false);
  const [nivelCompletado, setNivelCompletado] = useState(false);

  const musicaRef = useRef(null);
  const vozRef = useRef(null);
  const resolverVozRef = useRef(null);

  const bloqueadoRef = useRef(false);
  const pantallaActivaRef = useRef(false);

  const recordatorioTimeoutRef = useRef(null);
  const recordatorioTokenRef = useRef(0);
  const programarRecordatorioRef = useRef(null);

  const ayudaAnimada = useRef(new Animated.Value(1)).current;

  const nivel = animales[nivelActual];
  const cantidadEncontrada = objetosSeleccionados.length;

  const anchoObjeto = Math.min(
    (screenWidth - 48) / 4,
    90
  );

  const actualizarBloqueado = useCallback((valor) => {
    bloqueadoRef.current = valor;
    setBloqueado(valor);
  }, []);

  const cambiarVolumenMusica = useCallback(
    async (volumen) => {
      if (!musicaRef.current) {
        return;
      }

      try {
        await musicaRef.current.setVolumeAsync(volumen);
      } catch (error) {
        console.warn(
          "No se pudo cambiar el volumen de la música:",
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
        let promesaResuelta = false;

        const resolverPromesa = () => {
          if (promesaResuelta) {
            return;
          }

          promesaResuelta = true;
          resolve();
        };

        resolverVozRef.current = resolverPromesa;

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
            async (status) => {
              if (
                !status.isLoaded ||
                !status.didJustFinish
              ) {
                return;
              }

              sound.setOnPlaybackStatusUpdate(null);

              if (vozRef.current === sound) {
                vozRef.current = null;
              }

              if (
                resolverVozRef.current ===
                resolverPromesa
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

              resolverPromesa();
            }
          );
        } catch (error) {
          console.warn(
            "No se pudo reproducir la voz:",
            error
          );

          if (
            resolverVozRef.current ===
            resolverPromesa
          ) {
            resolverVozRef.current = null;
          }

          await cambiarVolumenMusica(
            VOLUMEN_MUSICA
          );

          resolverPromesa();
        }
      });
    },
    [
      cambiarVolumenMusica,
      detenerVoz,
    ]
  );

  const limpiarRecordatorio = useCallback(() => {
    recordatorioTokenRef.current += 1;

    if (recordatorioTimeoutRef.current) {
      clearTimeout(recordatorioTimeoutRef.current);
      recordatorioTimeoutRef.current = null;
    }
  }, []);

  const programarRecordatorio = useCallback(
    (cantidadPendiente) => {
      limpiarRecordatorio();

      if (
        cantidadPendiente <= 0 ||
        !nivel.audioRecordatorio
      ) {
        return;
      }

      const audioRecordatorio =
        nivel.audioRecordatorio[cantidadPendiente];

      if (!audioRecordatorio) {
        return;
      }

      const tokenActual =
        recordatorioTokenRef.current;

      const intentarReproducirRecordatorio =
        async () => {
          if (
            tokenActual !==
              recordatorioTokenRef.current ||
            !pantallaActivaRef.current
          ) {
            return;
          }

          /*
           * Si el animal ya está hablando por un error,
           * presentación u otro mensaje, se espera un
           * segundo para no interrumpir ese audio.
           */
          if (bloqueadoRef.current) {
            recordatorioTimeoutRef.current =
              setTimeout(
                intentarReproducirRecordatorio,
                1000
              );

            return;
          }

          actualizarBloqueado(true);

          await reproducirVoz(audioRecordatorio);

          if (
            tokenActual !==
              recordatorioTokenRef.current ||
            !pantallaActivaRef.current
          ) {
            return;
          }

          actualizarBloqueado(false);

          /*
           * Si continúa sin encontrar otra fruta,
           * vuelve a recordarle después de 40 segundos.
           */
          programarRecordatorioRef.current?.(
            cantidadPendiente
          );
        };

      recordatorioTimeoutRef.current =
        setTimeout(
          intentarReproducirRecordatorio,
          TIEMPO_RECORDATORIO
        );
    },
    [
      actualizarBloqueado,
      limpiarRecordatorio,
      nivel.audioRecordatorio,
      reproducirVoz,
    ]
  );

  useEffect(() => {
    programarRecordatorioRef.current =
      programarRecordatorio;
  }, [programarRecordatorio]);

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

    setObjetosSeleccionados([]);
    setMostrarAyuda(false);
    setNivelCompletado(false);

    actualizarBloqueado(true);
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
        actualizarBloqueado(false);

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
    actualizarBloqueado,
    ayudaAnimada,
    limpiarRecordatorio,
    nivel.audioIntroduccion,
    nivel.cantidad,
    nivel.id,
    programarRecordatorio,
    reproducirVoz,
  ]);

  const iluminarObjetosCorrectos =
    useCallback(async () => {
      setMostrarAyuda(true);
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

      setMostrarAyuda(false);
    }, [ayudaAnimada]);

  const avanzarNivel = useCallback(
    async () => {
      limpiarRecordatorio();

      setNivelCompletado(true);
      actualizarBloqueado(true);

      await reproducirVoz(
        nivel.audioCompletado
      );

      await esperar(1400);

      const esUltimoNivel =
        nivelActual ===
        animales.length - 1;

      if (esUltimoNivel) {
        navigation.replace("Success");
        return;
      }

      setNivelActual(
        (anterior) => anterior + 1
      );
    },
    [
      actualizarBloqueado,
      limpiarRecordatorio,
      navigation,
      nivel.audioCompletado,
      nivelActual,
      reproducirVoz,
    ]
  );

  const seleccionarObjeto = async (
    objeto
  ) => {
    if (
      bloqueadoRef.current ||
      nivelCompletado ||
      objetosSeleccionados.includes(
        objeto.id
      )
    ) {
      return;
    }

    if (!objeto.correcto) {
      actualizarBloqueado(true);

      await Promise.all([
        reproducirVoz(
          nivel.audioError
        ),
        iluminarObjetosCorrectos(),
      ]);

      if (pantallaActivaRef.current) {
        actualizarBloqueado(false);
      }

      /*
       * Un error no reinicia los 40 segundos.
       */
      return;
    }

    const nuevaSeleccion = [
      ...objetosSeleccionados,
      objeto.id,
    ];

    setObjetosSeleccionados(
      nuevaSeleccion
    );

    const cantidadPendiente =
      nivel.cantidad -
      nuevaSeleccion.length;

    if (cantidadPendiente > 0) {
      /*
       * Cada respuesta correcta reinicia
       * completamente los 40 segundos.
       */
      programarRecordatorio(
        cantidadPendiente
      );
    } else {
      limpiarRecordatorio();
    }

    if (
      nuevaSeleccion.length ===
      nivel.cantidad
    ) {
      await avanzarNivel();
    }
  };

  const repetirIntroduccion =
    async () => {
      if (
        bloqueadoRef.current ||
        !nivel.audioIntroduccion
      ) {
        return;
      }

      actualizarBloqueado(true);

      await reproducirVoz(
        nivel.audioIntroduccion
      );

      if (pantallaActivaRef.current) {
        actualizarBloqueado(false);
      }

      /*
       * Repetir la presentación no reinicia
       * el temporizador, porque solo lo hace
       * una fruta seleccionada correctamente.
       */
    };

  const renderizarImagenAnimal = () => {
    if (nivel.imagenAnimal) {
      return (
        <Image
          source={nivel.imagenAnimal}
          style={styles.imagenAnimal}
          resizeMode="contain"
        />
      );
    }

    return (
      <View
        style={styles.placeholderAnimal}
      >
        <Text
          style={
            styles.textoPlaceholderAnimal
          }
        >
          Imagen de {nivel.nombre}
        </Text>
      </View>
    );
  };

  const renderizarObjeto = (objeto) => {
    const seleccionado =
      objetosSeleccionados.includes(
        objeto.id
      );

    const debeIluminarse =
      mostrarAyuda &&
      objeto.correcto &&
      !seleccionado;

    const contenido = objeto.imagen ? (
      <Image
        source={objeto.imagen}
        style={styles.imagenObjeto}
        resizeMode="contain"
      />
    ) : (
      <Text
        style={styles.nombreObjeto}
        numberOfLines={2}
      >
        {objeto.tipo}
      </Text>
    );

    return (
      <Animated.View
        key={objeto.id}
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
            seleccionarObjeto(objeto)
          }
          disabled={
            bloqueado || seleccionado
          }
          accessibilityRole="button"
          accessibilityLabel={
            objeto.tipo
          }
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
          {contenido}

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
                {objetosSeleccionados.indexOf(
                  objeto.id
                ) + 1}
              </Text>
            </View>
          )}
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView
      style={styles.container}
    >
      <ImageBackground
        source={
          nivel.imagenFondo ||
          FONDO_PREDETERMINADO
        }
        resizeMode="cover"
        style={styles.background}
      >
        <View style={styles.overlay}>
          <View
            style={styles.parteSuperior}
          >
            <View
              style={styles.filaSuperior}
            >
              {renderizarImagenAnimal()}

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

                <Pressable
                  onPress={
                    repetirIntroduccion
                  }
                  disabled={
                    bloqueado ||
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
                {
                  nivel.objetoBuscadoPlural
                }
              </Text>
            </View>
          </View>

          <View
            style={styles.parteJuego}
          >
            <View
              style={
                styles.progresoContainer
              }
            >
              <Text
                style={styles.progreso}
              >
                Encontrados:{" "}
                {cantidadEncontrada} de{" "}
                {nivel.cantidad}
              </Text>

              <Text
                style={
                  styles.indicadorNivel
                }
              >
                Nivel {nivelActual + 1} de{" "}
                {animales.length}
              </Text>
            </View>

            <View
              style={styles.cuadricula}
            >
              {nivel.objetos.map(
                renderizarObjeto
              )}
            </View>

            {nivelCompletado && (
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
      "rgba(255, 249, 232, 0.68)",
  },

  parteSuperior: {
    flex: 1.05,
    paddingHorizontal: 16,
    paddingTop: 10,
    justifyContent: "space-between",
  },

  filaSuperior: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  imagenAnimal: {
    width: 125,
    height: 125,
  },

  placeholderAnimal: {
    width: 125,
    height: 125,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#757575",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#FFFFFF",
  },

  textoPlaceholderAnimal: {
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
    color: "#555555",
  },

  mensajeContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 12,
    elevation: 3,
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
    flex: 1.95,
    paddingHorizontal: 12,
    paddingBottom: 12,
  },

  progresoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    paddingHorizontal: 5,
  },

  progreso: {
    fontSize: 17,
    fontWeight: "800",
    color: "#2E7D32",
  },

  indicadorNivel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#555555",
  },

  cuadricula: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignContent: "space-around",
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
    padding: 7,
    elevation: 2,
  },

  objetoPresionado: {
    transform: [{ scale: 0.93 }],
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
    width: "88%",
    height: "88%",
  },

  nombreObjeto: {
    fontSize: 14,
    fontWeight: "800",
    color: "#424242",
    textAlign: "center",
    textTransform: "capitalize",
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
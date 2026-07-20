import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Alert,
  Animated,
  Dimensions,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import AsyncStorage from
  "@react-native-async-storage/async-storage";

import { Audio } from "expo-av";
import { useFocusEffect } from "@react-navigation/native";
import * as NavigationBar from "expo-navigation-bar";
import ConfettiCannon from "react-native-confetti-cannon";

import PlayButton from "../components/botones/PlayButton";
import SoundButton from "../components/botones/SoundButton";
import SettingsButton from "../components/botones/SettingsButton";

const { width: SCREEN_WIDTH } =
  Dimensions.get("window");

const CLAVE_NOMBRE = "nombreJugador";

export default function HomeScreen({
  navigation,
}) {
  const floatAnim = useRef(
    new Animated.Value(0)
  ).current;

  const soundRef = useRef(null);
  const soundEnabledRef = useRef(true);

  const confettiLeftRef = useRef(null);
  const confettiRightRef = useRef(null);

  const [soundEnabled, setSoundEnabled] =
    useState(true);

  const [nombreGuardado, setNombreGuardado] =
    useState("");

  const [nombreTemporal, setNombreTemporal] =
    useState("");

  const [modalVisible, setModalVisible] =
    useState(false);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -15,
          duration: 1500,
          useNativeDriver: true,
        }),

        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, [floatAnim]);

  useFocusEffect(
    useCallback(() => {
      let pantallaActiva = true;

      const cargarNombre = async () => {
        try {
          const nombre =
            await AsyncStorage.getItem(
              CLAVE_NOMBRE
            );

          if (!pantallaActiva) {
            return;
          }

          if (nombre) {
            setNombreGuardado(nombre);
            setNombreTemporal(nombre);
          } else {
            setNombreGuardado("");
            setNombreTemporal("");
          }
        } catch (error) {
          console.warn(
            "No se pudo cargar el nombre:",
            error
          );
        }
      };

      cargarNombre();

      return () => {
        pantallaActiva = false;
      };
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      let pantallaActiva = true;
      let sonidoCreado = null;

      if (Platform.OS === "android") {
        NavigationBar.setBehaviorAsync(
          "overlay-swipe"
        ).catch(() => {});

        NavigationBar.setVisibilityAsync(
          "hidden"
        ).catch(() => {});
      }

      const cargarMusica = async () => {
        try {
          await Audio.setAudioModeAsync({
            playsInSilentModeIOS: true,
            staysActiveInBackground: false,
            shouldDuckAndroid: true,
          });

          const { sound } =
            await Audio.Sound.createAsync(
              require(
                "../assets/sounds/audio_inicio.mp3"
              ),
              {
                shouldPlay: true,
                isLooping: true,
                volume:
                  soundEnabledRef.current
                    ? 1
                    : 0,
              }
            );

          if (!pantallaActiva) {
            await sound.unloadAsync();
            return;
          }

          sonidoCreado = sound;
          soundRef.current = sound;
        } catch (error) {
          console.warn(
            "Error cargando audio:",
            error
          );
        }
      };

      cargarMusica();

      return () => {
        pantallaActiva = false;

        const sonido =
          sonidoCreado || soundRef.current;

        soundRef.current = null;

        if (sonido) {
          const detenerAudio = async () => {
            try {
              await sonido.stopAsync();
              await sonido.unloadAsync();
            } catch (error) {
              console.warn(
                "No se pudo detener el audio:",
                error
              );
            }
          };

          detenerAudio();
        }

        if (Platform.OS === "android") {
          NavigationBar.setVisibilityAsync(
            "visible"
          ).catch(() => {});
        }
      };
    }, [])
  );

  const abrirFormularioNombre = () => {
    setNombreTemporal(nombreGuardado);
    setModalVisible(true);
  };

  const cerrarFormularioNombre = () => {
    setNombreTemporal(nombreGuardado);
    setModalVisible(false);
  };

  const guardarNombre = async () => {
    const nombreLimpio =
      nombreTemporal.trim();

    if (!nombreLimpio) {
      Alert.alert(
        "Nombre requerido",
        "Escribe tu nombre antes de guardar."
      );

      return;
    }

    try {
      await AsyncStorage.setItem(
        CLAVE_NOMBRE,
        nombreLimpio
      );

      setNombreGuardado(nombreLimpio);
      setNombreTemporal(nombreLimpio);
      setModalVisible(false);
    } catch (error) {
      console.warn(
        "No se pudo guardar el nombre:",
        error
      );

      Alert.alert(
        "Error",
        "No se pudo guardar el nombre."
      );
    }
  };

  const handlePlay = () => {
    if (
      confettiLeftRef.current &&
      confettiRightRef.current
    ) {
      confettiLeftRef.current.start();
      confettiRightRef.current.start();
    }

    setTimeout(() => {
    navigation.replace("Game", {
      partidaId: Date.now(),
    });
    }, 800);
  };

  const handleSound = async () => {
    if (!soundRef.current) {
      return;
    }

    const nuevoEstado = !soundEnabled;

    try {
      await soundRef.current.setVolumeAsync(
        nuevoEstado ? 1 : 0
      );

      soundEnabledRef.current =
        nuevoEstado;

      setSoundEnabled(nuevoEstado);
    } catch (error) {
      console.warn(
        "No se pudo cambiar el sonido:",
        error
      );
    }
  };

  const handleSettings = () => {
    Alert.alert(
      "Cómo jugar",
      "Ayuda a los animales a encontrar la cantidad correcta de frutas.\n\n" +
        "1. Observa el animal.\n" +
        "2. Revisa cuántas frutas necesita.\n" +
        "3. Presiona únicamente las frutas correctas.\n" +
        "4. Continúa hasta completar la cantidad solicitada.\n\n" +
        "Cuando termines los cinco niveles, llegarás a la fiesta.",
      [
        {
          text: "Entendido",
          style: "default",
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require(
          "../assets/background.png"
        )}
        resizeMode="cover"
        style={styles.background}
      >
       <View style={styles.nameButtonWrapper}>
  <Pressable
    onPress={abrirFormularioNombre}
    style={({ pressed }) => [
      styles.botonNombre,
      pressed &&
        styles.botonNombrePresionado,
    ]}
  >
      <Text style={styles.textoBotonNombre}>
        {nombreGuardado
          ? "Cambiar nombre"
          : "Escribe tu nombre"}
      </Text>
    </Pressable>

    {nombreGuardado ? (
      <Text
        style={styles.nombreActual}
        numberOfLines={1}
      >
        {nombreGuardado}
      </Text>
    ) : null}
  </View>

        <View style={styles.logoContainer}>
          <Animated.Image
            source={require(
              "../assets/logo/titulo_logo.png"
            )}
            style={[
              styles.logo,
              {
                transform: [
                  {
                    translateY: floatAnim,
                  },
                ],
              },
            ]}
            resizeMode="contain"
          />
        </View>

        <View style={styles.centerContainer}>
          <View
            style={styles.playButtonWrapper}
          >
            <PlayButton
              onPress={handlePlay}
            />
          </View>

          <View
            style={styles.animalsContainer}
          >
            <Image
              source={require(
                "../assets/animals_background.png"
              )}
              style={styles.animalsImage}
              resizeMode="contain"
            />
          </View>
        </View>

        <View style={styles.footerContainer}>
          <SoundButton
            onPress={handleSound}
            active={soundEnabled}
          />

          <SettingsButton
            onPress={handleSettings}
          />
        </View>

        <ConfettiCannon
          count={55}
          origin={{
            x: -20,
            y: 300,
          }}
          autoStart={false}
          ref={confettiLeftRef}
          fadeOut
          fallSpeed={2500}
          explosionSpeed={300}
          colors={[
            "#FF0033",
            "#0066FF",
            "#FFD700",
            "#00CC44",
            "#FF6600",
          ]}
        />

        <ConfettiCannon
          count={55}
          origin={{
            x: SCREEN_WIDTH + 20,
            y: 300,
          }}
          autoStart={false}
          ref={confettiRightRef}
          fadeOut
          fallSpeed={2500}
          explosionSpeed={300}
          colors={[
            "#FF0033",
            "#0066FF",
            "#FFD700",
            "#00CC44",
            "#FF6600",
          ]}
        />

        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          statusBarTranslucent
          onRequestClose={
            cerrarFormularioNombre
          }
        >
          <KeyboardAvoidingView
            style={styles.fondoModal}
            behavior={
              Platform.OS === "ios"
                ? "padding"
                : undefined
            }
          >
            <Pressable
              style={styles.capaModal}
              onPress={
                cerrarFormularioNombre
              }
            />

            <View
              style={styles.contenidoModal}
            >
              <Text
                style={styles.tituloModal}
              >
                {nombreGuardado
                  ? "Cambiar nombre"
                  : "Escribe tu nombre"}
              </Text>

              <Text
                style={
                  styles.descripcionModal
                }
              >
                Este nombre aparecerá al
                finalizar el juego.
              </Text>

              <TextInput
                style={styles.entradaNombre}
                value={nombreTemporal}
                onChangeText={
                  setNombreTemporal
                }
                placeholder="Tu nombre"
                placeholderTextColor="#8A8A8A"
                maxLength={20}
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={
                  guardarNombre
                }
              />

              <Text
                style={
                  styles.contadorCaracteres
                }
              >
                {nombreTemporal.length}/20
              </Text>

              <View
                style={styles.botonesModal}
              >
                <Pressable
                  onPress={
                    cerrarFormularioNombre
                  }
                  style={({ pressed }) => [
                    styles.botonModal,
                    styles.botonCancelar,
                    pressed &&
                      styles.botonModalPresionado,
                  ]}
                >
                  <Text
                    style={
                      styles.textoCancelar
                    }
                  >
                    Cancelar
                  </Text>
                </Pressable>

                <Pressable
                  onPress={guardarNombre}
                  style={({ pressed }) => [
                    styles.botonModal,
                    styles.botonGuardar,
                    pressed &&
                      styles.botonModalPresionado,
                  ]}
                >
                  <Text
                    style={
                      styles.textoGuardar
                    }
                  >
                    Guardar
                  </Text>
                </Pressable>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "space-between",
  },

  logoContainer: {
    marginTop: 130,
    width: "80%",
    alignItems: "center",
    zIndex: 2,
  },

  logo: {
    width: "100%",
    height: 140,
  },

  centerContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },

  playButtonWrapper: {
    position: "absolute",
    top: -20,
    zIndex: 4,
  },

  nameButtonWrapper: {
  position: "absolute",
  top: Platform.OS === "android" ? 38 : 18,
  left: 18,
  zIndex: 20,
  alignItems: "flex-start",
},

tarjetaNombre: {
  minWidth: 165,
  maxWidth: 210,
  paddingHorizontal: 16,
  paddingVertical: 10,
  marginBottom: 7,
  borderRadius: 18,
  borderWidth: 3,
  borderColor: "#FF9800",
  backgroundColor: "rgba(255, 255, 255, 0.97)",
  alignItems: "flex-start",
  elevation: 6,

  shadowColor: "#000000",
  shadowOffset: {
    width: 0,
    height: 3,
  },
  shadowOpacity: 0.22,
  shadowRadius: 5,
},

saludoNombre: {
  color: "#F57C00",
  fontSize: 11,
  fontWeight: "900",
  letterSpacing: 2,
},

nombreActual: {
  maxWidth: 180,
  marginTop: 1,
  color: "#2E7D32",
  fontSize: 19,
  lineHeight: 23,
  fontWeight: "900",
  textAlign: "left",
},

botonNombre: {
  minWidth: 145,
  minHeight: 40,
  paddingHorizontal: 15,
  paddingVertical: 7,
  borderRadius: 14,
  borderWidth: 3,
  borderColor: "#2E7D32",
  backgroundColor: "#4CAF50",
  justifyContent: "center",
  alignItems: "center",
  elevation: 5,

  shadowColor: "#000000",
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.2,
  shadowRadius: 4,
},

botonNombrePresionado: {
  transform: [
    {
      scale: 0.96,
    },
  ],
  opacity: 0.85,
},

textoBotonNombre: {
  color: "#FFFFFF",
  fontSize: 14,
  fontWeight: "900",
  textAlign: "center",
},
  animalsContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 190,
    zIndex: 2,
  },

  animalsImage: {
    width: "110%",
    height: 250,
  },

  footerContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 25,
    marginBottom: 30,
    zIndex: 3,
  },

  fondoModal: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
    backgroundColor:
      "rgba(0, 0, 0, 0.55)",
  },

  capaModal: {
    ...StyleSheet.absoluteFillObject,
  },

  contenidoModal: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
    padding: 24,
    borderRadius: 25,
    borderWidth: 4,
    borderColor: "#4CAF50",
    backgroundColor: "#FFFFFF",
    elevation: 10,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },

  tituloModal: {
    color: "#2E7D32",
    fontSize: 25,
    fontWeight: "900",
    textAlign: "center",
  },

  descripcionModal: {
    marginTop: 8,
    marginBottom: 18,
    color: "#555555",
    fontSize: 15,
    lineHeight: 21,
    fontWeight: "600",
    textAlign: "center",
  },

  entradaNombre: {
    width: "100%",
    minHeight: 56,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: "#BDBDBD",
    borderRadius: 15,
    backgroundColor: "#FFFDF7",
    color: "#333333",
    fontSize: 18,
    fontWeight: "700",
  },

  contadorCaracteres: {
    marginTop: 5,
    color: "#777777",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "right",
  },

  botonesModal: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },

  botonModal: {
    flex: 1,
    minHeight: 50,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  botonCancelar: {
    borderWidth: 2,
    borderColor: "#BDBDBD",
    backgroundColor: "#F1F1F1",
  },

  botonGuardar: {
    borderWidth: 2,
    borderColor: "#2E7D32",
    backgroundColor: "#4CAF50",
  },

  botonModalPresionado: {
    transform: [
      {
        scale: 0.97,
      },
    ],
    opacity: 0.85,
  },

  textoCancelar: {
    color: "#424242",
    fontSize: 16,
    fontWeight: "800",
  },

  textoGuardar: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "900",
  },
});
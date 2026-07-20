import React, {
  useCallback,
  useState,
} from "react";

import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import AsyncStorage from
  "@react-native-async-storage/async-storage";

import { useFocusEffect } from
  "@react-navigation/native";

import * as NavigationBar from
  "expo-navigation-bar";

const CLAVE_NOMBRE = "nombreJugador";

export default function SuccessScreen({
  navigation,
}) {
  const [nombre, setNombre] =
    useState("");

  const [cargando, setCargando] =
    useState(true);

  useFocusEffect(
    useCallback(() => {
      let pantallaActiva = true;

      const prepararPantalla =
        async () => {
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

          try {
            const nombreGuardado =
              await AsyncStorage.getItem(
                CLAVE_NOMBRE
              );

            if (!pantallaActiva) {
              return;
            }

            setNombre(
              nombreGuardado?.trim() ||
                "AMIGO"
            );

            setCargando(false);
          } catch (error) {
            console.warn(
              "No se pudo cargar el nombre:",
              error
            );

            if (pantallaActiva) {
              setNombre("AMIGO");
              setCargando(false);
            }
          }
        };

      prepararPantalla();

      return () => {
        pantallaActiva = false;

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
    }, [])
  );

  const volverAlInicio = () => {
    navigation.reset({
      index: 0,

      routes: [
        {
          name: "Home",
        },
      ],
    });
  };

  const volverAJugar = () => {
    navigation.replace(
      "Game",
      {
        partidaId: Date.now(),
      }
    );
  };

  if (cargando) {
    return (
      <SafeAreaView
        style={styles.pantallaCarga}
      >
        <ActivityIndicator
          size="large"
          color="#2E7D32"
        />
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require(
          "../assets/backgrounds/SuccessScreen.png"
        )}
        style={styles.imagenFondo}
        resizeMode="cover"
      >
        <SafeAreaView
          style={styles.contenido}
        >
          <View
            pointerEvents="none"
            style={
              styles.contenedorNombre
            }
          >
            <Text
              style={styles.nombre}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {nombre.toUpperCase()}
            </Text>
          </View>

          <View
            style={
              styles.contenedorBotones
            }
          >
            <Pressable
              onPress={volverAlInicio}
              accessibilityRole="button"
              accessibilityLabel="Volver al inicio"
              style={({ pressed }) => [
                styles.botonInicio,

                pressed &&
                  styles.botonPresionado,
              ]}
            >
              <Image
                source={require(
                  "../assets/botton/BtnVolverInicio.png"
                )}
                style={
                  styles.imagenBoton
                }
                resizeMode="contain"
              />
            </Pressable>

            <Pressable
              onPress={volverAJugar}
              accessibilityRole="button"
              accessibilityLabel="Volver a jugar"
              style={({ pressed }) => [
                styles.botonJugar,

                pressed &&
                  styles.botonPresionado,
              ]}
            >
              <Image
                source={require(
                  "../assets/botton/BtnVolverJugar.png"
                )}
                style={
                  styles.imagenBoton
                }
                resizeMode="contain"
              />
            </Pressable>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#58C9ED",
  },

  pantallaCarga: {
    flex: 1,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "#58C9ED",
  },

  imagenFondo: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  contenido: {
    flex: 1,
    position: "relative",
  },

  /*
   * El nombre aparece dentro del cartel,
   * debajo del mensaje que ya está
   * incluido en la imagen.
   */
  contenedorNombre: {
    position: "absolute",

    top: "56.5%",
    left: "17%",
    right: "17%",

    minHeight: 42,

    justifyContent: "center",
    alignItems: "center",
  },

  nombre: {
    color: "#7A3F22",

    fontSize: 25,
    lineHeight: 31,
    fontWeight: "900",

    textAlign: "center",

    textShadowColor:
      "rgba(255, 255, 255, 0.75)",

    textShadowOffset: {
      width: 0,
      height: 2,
    },

    textShadowRadius: 2,
  },

contenedorBotones: {
  position: "absolute",

  left: 4,
  right: 4,

  bottom:
    Platform.OS === "android"
      ? 28
      : 70,

  alignItems: "center",
  gap:0,
},

botonInicio: {
  width: "75%",
  maxWidth: 440,

  aspectRatio: 800 / 213,

  justifyContent: "center",
  alignItems: "center",
    marginBottom:20,
},

botonJugar: {
  width: "75%",
  maxWidth: 440,

  aspectRatio: 800 / 227,

  justifyContent: "center",
  alignItems: "center",
  marginBottom:45,
},

imagenBoton: {
  width: "100%",
  height: "100%",
},

  imagenBoton: {
    width: "100%",
    height: "100%",
  },

  botonPresionado: {
    opacity: 0.82,

    transform: [
      {
        scale: 0.96,
      },
    ],
  },
});
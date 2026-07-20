import React, {
  useCallback,
  useState,
} from "react";

import {
  ActivityIndicator,
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
  const [nombre, setNombre] = useState("");
  const [cargando, setCargando] =
    useState(true);

  useFocusEffect(
    useCallback(() => {
      let pantallaActiva = true;

      const prepararPantalla = async () => {
        if (Platform.OS === "android") {
          NavigationBar.setBehaviorAsync(
            "overlay-swipe"
          ).catch(() => {});

          NavigationBar.setVisibilityAsync(
            "hidden"
          ).catch(() => {});
        }

        try {
          const nombreGuardado =
            await AsyncStorage.getItem(
              CLAVE_NOMBRE
            );

          if (pantallaActiva) {
            setNombre(
              nombreGuardado?.trim() ||
                "AMIGO"
            );

            setCargando(false);
          }
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

        if (Platform.OS === "android") {
          NavigationBar.setVisibilityAsync(
            "visible"
          ).catch(() => {});
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
    navigation.replace("Game", {
      partidaId: Date.now(),
    });
  };

  if (cargando) {
    return (
      <SafeAreaView
        style={styles.container}
      >
        <ActivityIndicator
          size="large"
          color="#2E7D32"
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.container}
    >
      <View style={styles.tarjeta}>
        <View style={styles.decoracion}>
          <Text style={styles.textoDecoracion}>
            ¡FIESTA COMPLETADA!
          </Text>
        </View>

        <Text style={styles.titulo}>
          ¡GRACIAS{" "}
          {nombre.toUpperCase()}!
        </Text>

        <Text style={styles.mensaje}>
          GRACIAS A TI, LA FIESTA FUE UN
          ÉXITO.
        </Text>

        <View style={styles.separador} />

        <View style={styles.botones}>
          <Pressable
            onPress={volverAlInicio}
            accessibilityRole="button"
            accessibilityLabel="Volver al inicio"
            style={({ pressed }) => [
              styles.boton,
              styles.botonInicio,

              pressed &&
                styles.botonPresionado,
            ]}
          >
            <View
              style={styles.contenidoBoton}
            >
              <Text
                style={styles.simboloInicio}
              >
                ⌂
              </Text>

              <Text
                style={
                  styles.textoBotonInicio
                }
              >
                Volver al inicio
              </Text>
            </View>
          </Pressable>

          <Pressable
            onPress={volverAJugar}
            accessibilityRole="button"
            accessibilityLabel="Volver a jugar"
            style={({ pressed }) => [
              styles.boton,
              styles.botonJugar,

              pressed &&
                styles.botonPresionado,
            ]}
          >
            <View
              style={styles.contenidoBoton}
            >
              <Text
                style={styles.simboloJugar}
              >
                ↻
              </Text>

              <Text
                style={
                  styles.textoBotonJugar
                }
              >
                Volver a jugar
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF9E8",
    justifyContent: "center",
    alignItems: "center",
    padding: 22,
  },

  tarjeta: {
    width: "100%",
    maxWidth: 420,
    paddingHorizontal: 24,
    paddingVertical: 34,
    borderRadius: 30,
    borderWidth: 4,
    borderColor: "#4CAF50",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    elevation: 8,

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },

  decoracion: {
    marginBottom: 18,
    paddingHorizontal: 18,
    paddingVertical: 7,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#FFB300",
    backgroundColor: "#FFF3C4",
  },

  textoDecoracion: {
    color: "#C94F00",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 1,
    textAlign: "center",
  },

  titulo: {
    color: "#2E7D32",
    fontSize: 30,
    lineHeight: 38,
    fontWeight: "900",
    textAlign: "center",
  },

  mensaje: {
    marginTop: 18,
    color: "#424242",
    fontSize: 22,
    lineHeight: 30,
    fontWeight: "800",
    textAlign: "center",
  },

  separador: {
    width: "75%",
    height: 3,
    marginTop: 26,
    borderRadius: 2,
    backgroundColor: "#FFE0B2",
  },

  botones: {
    width: "100%",
    marginTop: 28,
    gap: 14,
  },

  boton: {
    width: "100%",
    minHeight: 58,
    paddingHorizontal: 18,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
  },

  botonInicio: {
    borderWidth: 3,
    borderColor: "#F57C00",
    backgroundColor: "#FFFFFF",
  },

  botonJugar: {
    borderWidth: 3,
    borderColor: "#2E7D32",
    backgroundColor: "#4CAF50",
  },

  botonPresionado: {
    transform: [
      {
        scale: 0.97,
      },
    ],
    opacity: 0.85,
  },

  contenidoBoton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  simboloInicio: {
    color: "#C94F00",
    fontSize: 28,
    lineHeight: 30,
    fontWeight: "900",
  },

  simboloJugar: {
    color: "#FFFFFF",
    fontSize: 28,
    lineHeight: 30,
    fontWeight: "900",
  },

  textoBotonInicio: {
    color: "#C94F00",
    fontSize: 18,
    fontWeight: "900",
  },

  textoBotonJugar: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
  },
});
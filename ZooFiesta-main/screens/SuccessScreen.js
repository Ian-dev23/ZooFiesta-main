import React, {
  useCallback,
  useState,
} from "react";

import {
  Platform,
  Pressable,
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
              nombreGuardado || "AMIGO"
            );
          }
        } catch (error) {
          if (pantallaActiva) {
            setNombre("AMIGO");
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

  return (
    <View style={styles.container}>
      <View style={styles.tarjeta}>
        <Text style={styles.titulo}>
          ¡GRACIAS {nombre.toUpperCase()}!
        </Text>

        <Text style={styles.mensaje}>
          GRACIAS A TI, LA FIESTA FUE UN
          ÉXITO.
        </Text>

        <View style={styles.botones}>
          <Pressable
            style={({ pressed }) => [
              styles.boton,
              styles.botonInicio,
              pressed && styles.botonPresionado,
            ]}
            onPress={volverAlInicio}
          >
           <View style={styles.contenidoBoton}>
            <Text style={styles.simboloInicio}>
              ⌂
            </Text>

              <Text style={styles.textoBotonInicio}>
                Volver al inicio
              </Text>
            </View>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.boton,
              styles.botonJugar,
              pressed && styles.botonPresionado,
            ]}
            onPress={volverAJugar}
          >
         <View style={styles.contenidoBoton}>
            <Text style={styles.simboloJugar}>
              ↻
            </Text>

            <Text style={styles.textoBotonJugar}>
              Volver a jugar
            </Text>
          </View>
          </Pressable>
        </View>
      </View>
    </View>
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
    backgroundColor: "#FFFFFF",
    borderRadius: 28,
    borderWidth: 4,
    borderColor: "#4CAF50",
    paddingHorizontal: 24,
    paddingVertical: 36,
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

  titulo: {
    fontSize: 30,
    lineHeight: 38,
    color: "#2E7D32",
    fontWeight: "900",
    textAlign: "center",
  },

  mensaje: {
    marginTop: 18,
    fontSize: 22,
    lineHeight: 30,
    color: "#424242",
    fontWeight: "800",
    textAlign: "center",
  },

  botones: {
    width: "100%",
    marginTop: 32,
    gap: 14,
  },

  boton: {
    width: "100%",
    minHeight: 56,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
  },

  botonInicio: {
    backgroundColor: "#FFFFFF",
    borderWidth: 3,
    borderColor: "#F57C00",
  },

  botonJugar: {
    backgroundColor: "#4CAF50",
    borderWidth: 3,
    borderColor: "#2E7D32",
  },

  botonPresionado: {
    transform: [
      {
        scale: 0.97,
      },
    ],
    opacity: 0.85,
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
  contenidoBoton: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "center",
  gap: 10,
},

simboloInicio: {
  color: "#C94F00",
  fontSize: 27,
  lineHeight: 29,
  fontWeight: "900",
},

simboloJugar: {
  color: "#FFFFFF",
  fontSize: 27,
  lineHeight: 29,
  fontWeight: "900",
}
});
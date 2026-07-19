import React from "react";
import { useFocusEffect } from "@react-navigation/native";
import * as NavigationBar from "expo-navigation-bar";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";

export default function SuccessScreen({
  navigation,
}) {
  // Ocultar botones del sistema
  useFocusEffect(
    React.useCallback(() => {
      if (Platform.OS === "android") {
        NavigationBar.setBehaviorAsync("overlay-swipe");
        NavigationBar.setVisibilityAsync("hidden");
      }

      return () => {
        if (Platform.OS === "android") {
          NavigationBar.setVisibilityAsync("visible");
        }
      };
    }, [])
  );

  return (
    <View style={styles.container}>

      <Text style={styles.emoji}>
        🎉
      </Text>

      <Text style={styles.titulo}>
        ¡Excelente!
      </Text>

      <Text style={styles.subtitulo}>
        Ayudaste a todos los animales.
      </Text>

      <TouchableOpacity
        style={styles.boton}
        onPress={() =>
          navigation.replace("Game")
        }
      >
        <Text style={styles.textoBoton}>
          Volver a jugar
        </Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF9E8",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  emoji: {
    fontSize: 90,
  },

  titulo: {
    fontSize: 34,
    color: "#4CAF50",
    fontWeight: "bold",
    marginTop: 20,
  },

  subtitulo: {
    fontSize: 20,
    marginVertical: 20,
    textAlign: "center",
  },

  boton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 35,
    paddingVertical: 16,
    borderRadius: 15,
  },

  textoBoton: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 18,
  },
});
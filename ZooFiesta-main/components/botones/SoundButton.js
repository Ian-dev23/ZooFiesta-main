import React from "react";
import { TouchableOpacity, StyleSheet, Image } from "react-native";

export default function SoundButton({ onPress, active = true }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.button, !active && styles.inactive]}
    >
      <Image
        source={require("../../assets/botton/sonido_btn.png")}
        style={styles.image} // <-- Corregido de styles.icon a styles.image
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 56,            // Exactamente igual al de Settings
    height: 56,           // Exactamente igual al de Settings
    borderRadius: 28,     // Lo hace perfectamente circular
    backgroundColor: "#171717", // Mismo fondo crema de tu otro botón
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,       // Mismo grosor de borde
    borderColor: "#fdfdfd", // Mismo color verde de borde
  },
  inactive: {
    opacity: 0.5,
  },
  image: {
    width: "290%",      
    height: "290%",
  },
});
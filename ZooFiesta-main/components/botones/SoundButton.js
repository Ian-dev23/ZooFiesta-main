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
        style={styles.image}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#171717",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fdfdfd",
  },
  inactive: {
    opacity: 0.5,
  },
  image: {
    width: "290%",
    height: "290%",
  },
});
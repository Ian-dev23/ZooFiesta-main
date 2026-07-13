import React from "react";
import { TouchableOpacity, StyleSheet, Image } from "react-native";

export default function SettingsButton({ onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={styles.button}
    >
      <Image
        source={require("../../assets/botton/configura_btn.png")}
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
    justifyContent: "center",
    alignItems: "center",
    // ❌ Eliminamos backgroundColor, borderWidth y borderColor
  },

  image: {
    width: "590%",
    height: "590%",
  },
});
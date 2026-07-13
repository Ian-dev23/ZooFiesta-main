import React, { useEffect, useRef } from "react";
import { Animated, TouchableOpacity, StyleSheet, Image } from "react-native";

export default function PlayButton({ onPress }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.08,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();
    return () => animation.stop();
  }, [scaleAnim]);

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity 
        activeOpacity={0.8} 
        onPress={onPress} 
        style={styles.button}
      >
        <Image
          source={require("../../assets/botton/play_btn.png")}
          style={styles.image}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 300,  // ¡Aumentado para que sea grande y llamativo!
    height: 350, // Proporción perfecta para el botón principal
  },
});
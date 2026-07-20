import React, {
  memo,
  useEffect,
  useRef,
} from "react";

import {
  Animated,
  Pressable,
  StyleSheet,
} from "react-native";

import { Image as ExpoImage } from "expo-image";

function PlayButton({ onPress }) {
  const escalaAnimada = useRef(
    new Animated.Value(1)
  ).current;

  useEffect(() => {
    const animacion = Animated.loop(
      Animated.sequence([
        Animated.timing(escalaAnimada, {
          toValue: 1.08,
          duration: 700,
          useNativeDriver: true,
        }),

        Animated.timing(escalaAnimada, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );

    animacion.start();

    return () => {
      animacion.stop();
      escalaAnimada.stopAnimation();
      escalaAnimada.setValue(1);
    };
  }, [escalaAnimada]);

  const manejarPresion = () => {
    if (typeof onPress === "function") {
      onPress();
    }
  };

  return (
    <Animated.View
      style={[
        styles.contenedor,
        {
          transform: [
            {
              scale: escalaAnimada,
            },
          ],
        },
      ]}
    >
      <Pressable
        onPress={manejarPresion}
        accessibilityRole="button"
        accessibilityLabel="Comenzar el juego"
        style={({ pressed }) => [
          styles.boton,

          pressed &&
            styles.botonPresionado,
        ]}
      >
        <ExpoImage
          source={require(
            "../../assets/botton/play_btn.png"
          )}
          style={styles.imagen}
          contentFit="contain"
          cachePolicy="memory-disk"
          priority="high"
        />
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    width: 355,
    height: 355,
  },

  boton: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  botonPresionado: {
    opacity: 0.8,
  },

  imagen: {
    width: "100%",
    height: "100%",
  },
});

export default memo(PlayButton);
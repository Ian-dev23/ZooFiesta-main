import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  SafeAreaView,
  ImageBackground,
  StyleSheet,
  Animated,
  View,
  Image,
  Alert,
  Dimensions,
  Platform,
} from "react-native";
import { Audio } from "expo-av";
import { useFocusEffect } from "@react-navigation/native";
import * as NavigationBar from "expo-navigation-bar";
import ConfettiCannon from "react-native-confetti-cannon";

import PlayButton from "../components/botones/PlayButton";
import SoundButton from "../components/botones/SoundButton";
import SettingsButton from "../components/botones/SettingsButton";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function HomeScreen({ navigation }) {
  const floatAnim = useRef(new Animated.Value(0)).current;
  const soundRef = useRef(null);
  const confettiLeftRef = useRef(null);  // <-- Referencia para el cañón izquierdo
  const confettiRightRef = useRef(null); // <-- Referencia para el cañón derecho
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Animación de flotación del logo
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
    return () => animation.stop();
  }, [floatAnim]);

  // Ocultar botones del sistema y cargar/descargar música al enfocar/desenfocar
  useFocusEffect(
    useCallback(() => {
      let sound = null;

      // Ocultar botones del sistema en Android
      if (Platform.OS === "android") {
        NavigationBar.setBehaviorAsync("overlay-swipe");
        NavigationBar.setVisibilityAsync("hidden");
      }

      const loadSound = async () => {
        try {
          const { sound: bgSound } = await Audio.Sound.createAsync(
            require("../assets/sounds/audio_inicio.mp3"),
            {
              shouldPlay: soundEnabled,
              isLooping: true,
              volume: 1.0,
            }
          );
          sound = bgSound;
          soundRef.current = bgSound;
        } catch (error) {
          console.warn("Error cargando audio:", error);
        }
      };

      loadSound();

      return () => {
        if (sound) {
          sound.stopAsync();
          sound.unloadAsync();
          soundRef.current = null;
        }
        // Mostrar botones al abandonar la pantalla
        if (Platform.OS === "android") {
          NavigationBar.setVisibilityAsync("visible");
        }
      };
    }, [])
  );

  // Acción al presionar Jugar
  const handlePlay = () => {
    // 1. Activamos la ráfaga de ambos cañones laterales
    if (confettiLeftRef.current && confettiRightRef.current) {
      confettiLeftRef.current.start();
      confettiRightRef.current.start();
    }

    // 2. Retrasamos la navegación 800ms para que se disfrute la animación de fiesta
    setTimeout(() => {
      navigation.navigate("Game");
    }, 800);
  };

  const handleSound = async () => {

  if (!soundRef.current) return;

  try {

    if (soundEnabled) {

      await soundRef.current.setVolumeAsync(0);

    } else {

      await soundRef.current.setVolumeAsync(1);

    }

    setSoundEnabled(!soundEnabled);

  } catch (error) {

    console.warn(error);

  }

};

  const handleSettings = () => {
    Alert.alert(
      "🦁 ¡Bienvenido a ZooFiesta! 🎉",
      "🎯 OBJETIVO\n" +
      "Ayuda a los animales a encontrar su fruta favorita.\n\n" +
      "📖 ¿Cómo jugar?\n" +
      "1️⃣ Observa el animal que aparece en pantalla.\n" +
      "2️⃣ Lee cuántas frutas necesita llevar a la fiesta.\n" +
      "3️⃣ Presiona la fruta correcta para comenzar a contar.\n" +
      "4️⃣ Sigue tocando la fruta hasta completar la cantidad solicitada.\n" +
      "5️⃣ ¡Hazlo antes de que el tiempo termine para ganar! ⏳\n\n" +
      "🌟 ¡Diviértete aprendiendo a contar con ZooFiesta!",
      [{ text: "¡Entendido! 🎮", style: "default" }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../assets/background.png")}
        resizeMode="cover"
        style={styles.background}
      >
        {/* LOGO */}
        <View style={styles.logoContainer}>
          <Animated.Image
            source={require("../assets/logo/titulo_logo.png")}
            style={[
              styles.logo,
              {
                transform: [{ translateY: floatAnim }],
              },
            ]}
            resizeMode="contain"
          />
        </View>

        {/* CONTENEDOR CENTRAL */}
        <View style={styles.centerContainer}>
          <View style={styles.playButtonWrapper}>
            <PlayButton onPress={handlePlay} />
          </View>

          <View style={styles.animalsContainer}>
            <Image
              source={require("../assets/animals_background.png")}
              style={styles.animalsImage}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* PIE DE PÁGINA */}
        <View style={styles.footerContainer}>
          <SoundButton onPress={handleSound} active={soundEnabled} />
          <SettingsButton onPress={handleSettings} />
        </View>

        {/* CAÑÓN IZQUIERDO: Dispara desde la izquierda hacia el centro (ángulo diagonal hacia la derecha) */}
        <ConfettiCannon
          count={55}
          origin={{ x: -20, y: 300 }}
          autoStart={false}
          ref={confettiLeftRef}
          fadeOut={true}
          fallSpeed={2500}
          explosionSpeed={300}
          colors={["#FF0033", "#0066FF", "#FFD700", "#00CC44", "#FF6600"]} // Colores pastel llamativos
        />

        {/* CAÑÓN DERECHO: Dispara desde la derecha hacia el centro (ángulo diagonal hacia la izquierda) */}
        <ConfettiCannon
          count={55}
          origin={{ x: SCREEN_WIDTH + 20, y: 300 }}
          autoStart={false}
          ref={confettiRightRef}
          fadeOut={true}
          fallSpeed={2500}
          explosionSpeed={300}
          colors={["#FF0033", "#0066FF", "#FFD700", "#00CC44", "#FF6600"]}
        />

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
    zIndex: 3,
  },
  animalsContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 110,
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
});
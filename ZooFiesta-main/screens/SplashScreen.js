// Pantalla de presentación inicial. Configura la barra de navegación y redirige a Home.
import React, { useEffect } from "react";
import { Platform, SafeAreaView, StyleSheet, View } from "react-native";
import { Image as ExpoImage } from "expo-image";
import * as NavigationBar from "expo-navigation-bar";

export default function SplashScreen({
  navigation,
}) {
  useEffect(() => {
    let pantallaActiva = true;

    const prepararPantalla = async () => {
      if (Platform.OS === "android") {
        try {
          await NavigationBar.setBehaviorAsync(
            "overlay-swipe"
          );

          await NavigationBar.setVisibilityAsync(
            "hidden"
          );
        } catch (error) {
          console.warn(
            "No se pudo ocultar la barra de navegación:",
            error
          );
        }
      }
    };

    prepararPantalla();

    const timer = setTimeout(() => {
      if (pantallaActiva) {
        navigation.reset({
        index: 0,
        routes: [
          {
            name: "Home",
          },
        ],
      });
      }
    }, 2000);

    return () => {
      pantallaActiva = false;
      clearTimeout(timer);
    };
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <ExpoImage
          source={require(
            "../assets/logo/titulo_logo.png"
          )}
          style={styles.logo}
          contentFit="contain"
          cachePolicy="memory-disk"
          transition={150}
          priority="high"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },

  content: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    width: 200,
    height: 200,
  },
});
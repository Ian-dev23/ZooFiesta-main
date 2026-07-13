import React, { useEffect, useRef } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  Dimensions,
  Platform,
} from "react-native";
import * as NavigationBar from "expo-navigation-bar";
import ConfettiCannon from "react-native-confetti-cannon";

const { width, height } = Dimensions.get("window");

export default function SplashScreen({ navigation }) {
  const confettiLeftRef = useRef(null);
  const confettiRightRef = useRef(null);

  useEffect(() => {
    // Ocultar botones del sistema
    if (Platform.OS === "android") {
      NavigationBar.setBehaviorAsync("overlay-swipe");
      NavigationBar.setVisibilityAsync("hidden");
    }

    // Espera 2 segundos y luego navega a HomeScreen
    const timer = setTimeout(() => {
      navigation.replace("Home");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo/Imagen del splash */}
        <Image
          source={require("../assets/logo/titulo_logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  logo: {
    width: 200,
    height: 200,
  },
});

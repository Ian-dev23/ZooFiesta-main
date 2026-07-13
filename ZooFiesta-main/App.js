import React, { useEffect, useState } from "react";
import * as SplashScreen from "expo-splash-screen";
import AppNavigator from "./navigation/AppNavigator";

// Mantén el splash screen visible mientras la app se carga
SplashScreen.preventAutoHideAsync().catch(() => {
  // Ignorar errores si ya se llamó
});

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Simula tiempo de carga de recursos (opcional)
        // Aquí puedes cargar fuentes, imágenes, etc.
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (e) {
        console.warn(e);
      } finally {
        // Oculta el splash screen nativo de Expo
        await SplashScreen.hideAsync();
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  if (!appIsReady) {
    return null;
  }

  return <AppNavigator />;
}

import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "../screens/SplashScreen";
import HomeScreen from "../screens/HomeScreen";
import GameScreen from "../screens/GameScreen";
import SuccessScreen from "../screens/SuccessScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          animation: "fade",
        }}
      >
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{
            animation: "none",
            gestureEnabled: false,
          }}
        />

        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            animation: "fade",
            gestureEnabled: false,
          }}
        />

        <Stack.Screen
          name="Game"
          component={GameScreen}
          options={{
            animation: "fade",
            gestureEnabled: false,
          }}
        />

        <Stack.Screen
          name="Success"
          component={SuccessScreen}
          options={{
            animation: "fade",
            gestureEnabled: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
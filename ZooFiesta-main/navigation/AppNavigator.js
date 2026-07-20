import React from "react";

import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

import SplashScreen from
  "../screens/SplashScreen";

import HomeScreen from
  "../screens/HomeScreen";

import GameScreen from
  "../screens/GameScreen";

import SuccessScreen from
  "../screens/SuccessScreen";

const Stack =
  createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        animation: "fade",
      }}
    >
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{
          animation: "none",
        }}
      />

      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          animation: "fade",
        }}
      />

      <Stack.Screen
        name="Game"
        component={GameScreen}
        options={{
          animation: "fade",
        }}
      />

      <Stack.Screen
        name="Success"
        component={SuccessScreen}
        options={{
          animation: "fade",
        }}
      />
    </Stack.Navigator>
  );
}
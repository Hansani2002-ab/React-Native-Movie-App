import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import './globals.css';

export default function RootLayout() {
  return (
    <>
      <Stack>
        <StatusBar hidden={true} />

        {/* Main Tabs */}
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />

        {/* Movie Details */}
        <Stack.Screen
          name="movies/[id]"
          options={{ headerShown: false }}
        />


        {/* Signup */}
        <Stack.Screen
          name="Signup"
          options={{ headerShown: false }}
        />

      </Stack>
    </>
  );
}

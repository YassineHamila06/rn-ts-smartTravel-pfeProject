import { useEffect, useState } from "react";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { Asset } from "expo-asset";
import "react-native-reanimated";
import { ActivityIndicator, View } from "react-native";

import { useColorScheme } from "@/hooks/useColorScheme";
import { Provider } from "react-redux";
import { store } from "@/Store/store";
import { SavedTripsProvider } from "../context/SavedTripsContext";



SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isReady, setIsReady] = useState(false);

  // Load fonts
  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    Exo2: require("../assets/fonts/Exo2.ttf"),
  });

  async function loadAssetsAsync() {
    const images = [
      require("../assets/images/logo.png"),
      require("../assets/images/signup.jpg"),
      require("../assets/images/otp.jpg"),
      require("../assets/images/login.jpg"),
    ];

    const cacheImages = images.map((image) => Asset.loadAsync(image));
    await Promise.all(cacheImages);
  }

  useEffect(() => {
    async function prepare() {
      try {
        await loadAssetsAsync(); // Load images

        if (fontsLoaded) {
          setIsReady(true);
          await SplashScreen.hideAsync();
        }
      } catch (error) {
        console.warn("Error loading assets:", error);
      }
    }

    prepare();
  }, [fontsLoaded]);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="red" />
      </View>
    );
  }

  return (
    <Provider store={store}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <SavedTripsProvider>
        <Stack>
          <Stack.Screen name="form" options={{ headerShown: false }} />
          <Stack.Screen name="event" options={{ headerShown: false }} />
          <Stack.Screen name="trip" options={{ headerShown: false }} />
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen
            name="loyalty-program"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="nearby-places" options={{ headerShown: false }} />
        </Stack>
        </SavedTripsProvider>
        <StatusBar style="auto" />
      </ThemeProvider>
    </Provider>
  );
}

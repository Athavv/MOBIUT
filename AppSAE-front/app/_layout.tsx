import "../global.css";
import { useEffect } from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { Platform } from "react-native";
import { IntroAnimation } from "../components/IntroAnimation";

void SplashScreen.preventAutoHideAsync().catch(() => undefined);

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === "web") return;
    const t = setTimeout(() => {
      SplashScreen.hideAsync().catch(() => undefined);
    }, 50);
    return () => clearTimeout(t);
  }, []);

  const handleSplashFinish = async () => {
    try {
      await SplashScreen.hideAsync();
    } catch {
      undefined;
    }
  };

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="admin/login" options={{ headerShown: false }} />
        <Stack.Screen name="admin/dashboard" options={{ headerShown: false }} />
        <Stack.Screen name="sae/[id]" options={{ headerShown: false }} />
      </Stack>
      <IntroAnimation onFinish={handleSplashFinish} />
    </>
  );
}

import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: "none" },
      }}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="projects" />
      <Tabs.Screen name="mmi2" />
      <Tabs.Screen name="mmi3" />
      <Tabs.Screen name="domains" />
      <Tabs.Screen name="grades" />
    </Tabs>
  );
}

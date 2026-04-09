import { Ionicons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { Pressable, View } from "react-native";

const TABS = [
  { icon: "home" as const, route: "/(tabs)/home", segment: "home" },
  { icon: "layers" as const, route: "/(tabs)/projects", segment: "projects" },
  { icon: "school" as const, route: "/(tabs)/mmi2", segment: "mmi2" },
  { icon: "medal" as const, route: "/(tabs)/mmi3", segment: "mmi3" },
  { icon: "grid" as const, route: "/(tabs)/domains", segment: "domains" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <View
      pointerEvents="box-none"
      style={{
        position: "absolute",
        left: 24,
        right: 24,
        bottom: 28,
        height: 62,
        backgroundColor: "#FFFFFF",
        borderRadius: 32,
        borderWidth: 1,
        borderColor: "rgba(15,23,42,0.06)",
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 10 },
        elevation: 10,
        flexDirection: "row",
        alignItems: "center",
        zIndex: 100,
      }}
    >
      {TABS.map(({ icon, route, segment }) => {
        const isActive = pathname === `/${segment}` || pathname.endsWith(`/${segment}`);
        return (
          <Pressable
            key={route}
            onPress={() => router.navigate(route as any)}
            style={({ pressed }) => ({
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <Ionicons name={icon} size={22} color={isActive ? "#071341" : "#94A3B8"} />
            {isActive && (
              <View style={{ width: 4, height: 4, borderRadius: 2, backgroundColor: "#071341", marginTop: 3 }} />
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

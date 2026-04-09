import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import { colors } from "../../theme";
import type { Sae } from "./types";

const DOMAIN_COLORS: Record<string, string> = {
  Web: colors.domainWeb,
  DI: colors.domainDI,
  "3D": colors.domain3D,
  Création: colors.domainCreation,
  Développement: colors.domainDev,
};

const DOMAIN_DARK: Record<string, string> = {
  Web: "#0F2460", DI: "#2E1060", "3D": "#5A1A00", Création: "#5A0A30", Développement: "#013820",
};

type Props = { sae: Sae };

export function SaeCard({ sae }: Props) {
  const domainColor = DOMAIN_COLORS[sae.domain] ?? colors.accent;
  const domainDark = DOMAIN_DARK[sae.domain] ?? "#030714";

  return (
    <Link href={{ pathname: "/sae/[id]" as any, params: { id: String(sae.id) } }} asChild>
      <Pressable
        accessibilityRole="button"
        style={({ pressed }) => ({ width: 240, opacity: pressed ? 0.85 : 1 })}
      >
        <View
          style={{
            borderRadius: 20,
            overflow: "hidden",
            backgroundColor: domainDark,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.4,
            shadowRadius: 20,
            elevation: 6,
          }}
        >
          {sae.imageUrl ? (
            <View style={{ height: 120 }}>
              <Image source={{ uri: sae.imageUrl }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
              <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.3)" }} />
            </View>
          ) : (
            <View style={{ height: 120, backgroundColor: domainColor + "60", alignItems: "center", justifyContent: "center" }}>
              <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" }}>
                <Ionicons name="layers" size={18} color="rgba(255,255,255,0.8)" />
              </View>
            </View>
          )}

          <View style={{ padding: 16, gap: 10, backgroundColor: colors.bgCard }}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View
                style={{
                  backgroundColor: domainColor + "18",
                  borderRadius: 8,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderWidth: 1,
                  borderColor: domainColor + "40",
                }}
              >
                <Text style={{ fontSize: 11, fontWeight: "700", color: domainColor, letterSpacing: 0.5, textTransform: "uppercase" }}>
                  {sae.domain}
                </Text>
              </View>
              <Text style={{ fontSize: 11, color: colors.textMuted, fontWeight: "500" }}>{sae.semester}</Text>
            </View>

            <Text style={{ fontSize: 15, fontWeight: "700", color: colors.textPrimary, letterSpacing: -0.3, lineHeight: 20 }} numberOfLines={2}>
              {sae.title}
            </Text>

            <Text style={{ fontSize: 12, color: colors.textSecondary, lineHeight: 17 }} numberOfLines={2}>
              {sae.description}
            </Text>

            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 2 }}>
              {sae.ue ? (
                <View style={{ backgroundColor: colors.accent + "15", borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 }}>
                  <Text style={{ fontSize: 11, color: colors.accent, fontWeight: "600" }}>{sae.ue.code}</Text>
                </View>
              ) : <View />}
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: domainColor }} />
                <Text style={{ fontSize: 11, color: colors.textMuted, fontWeight: "500" }}>Voir les groupes</Text>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

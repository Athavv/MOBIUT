import { useEffect, useState } from "react";
import { FlatList, Pressable, ScrollView, Text, View } from "react-native";
import { fetchSaes } from "../../components/projects";
import { SaeCard } from "../../components/projects/SaeCard";
import type { Sae } from "../../components/projects";
import { colors } from "../../theme";
import { BottomNav } from "../../components/ui/BottomNav";

const DOMAINS = ["Tous", "Web", "DI", "3D", "Création", "Développement"];
const DOMAIN_COLORS: Record<string, string> = {
  Web: colors.domainWeb, DI: colors.domainDI, "3D": colors.domain3D,
  Création: colors.domainCreation, Développement: colors.domainDev,
};

export default function ProjectsScreen() {
  const [saes, setSaes] = useState<Sae[]>([]);
  const [selectedDomain, setSelectedDomain] = useState("Tous");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try { setSaes(await fetchSaes()); } catch { setSaes([]); } finally { setIsLoading(false); }
    };
    load();
  }, []);

  const filtered = selectedDomain === "Tous" ? saes : saes.filter((saeItem) => saeItem.domain === selectedDomain);
  const mmi3 = filtered.filter((saeItem) => saeItem.semester?.startsWith("S") && parseInt(saeItem.semester.slice(1)) >= 5);
  const mmi2 = filtered.filter((saeItem) => saeItem.semester?.startsWith("S") && parseInt(saeItem.semester.slice(1)) < 5);
  const mmi3Final = mmi3.length > 0 ? mmi3 : (mmi2.length === 0 ? filtered : mmi3);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 56, paddingBottom: 120, gap: 32 }}>


        <View style={{ paddingHorizontal: 20, gap: 6 }}>
          <Text style={{ fontSize: 11, fontWeight: "700", color: colors.textMuted, letterSpacing: 1.5, textTransform: "uppercase" }}>
            Archive
          </Text>
          <Text style={{ fontSize: 34, fontWeight: "800", color: colors.textPrimary, letterSpacing: -0.8 }}>
            SAé
          </Text>
          <Text style={{ fontSize: 14, color: colors.textSecondary }}>
            {saes.length} réalisation{saes.length > 1 ? "s" : ""} · Appuie pour voir les groupes
          </Text>
        </View>

        <FlatList
          horizontal showsHorizontalScrollIndicator={false}
          data={DOMAINS}
          keyExtractor={(item) => item}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
          renderItem={({ item }) => {
            const active = item === selectedDomain;
            const domainColor = DOMAIN_COLORS[item];
            return (
              <Pressable
                onPress={() => setSelectedDomain(item)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 999,
                  backgroundColor: active
                    ? (domainColor ?? colors.accent)
                    : colors.bgCard,
                  borderWidth: 1,
                  borderColor: active
                    ? (domainColor ?? colors.accent)
                    : colors.bgBorder,
                }}
              >
                <Text style={{ fontSize: 13, fontWeight: "600", color: active ? colors.white : colors.textSecondary }}>
                  {item}
                </Text>
              </Pressable>
            );
          }}
        />

        {isLoading ? (
          <Text style={{ paddingHorizontal: 20, fontSize: 14, color: colors.textMuted }}>Chargement...</Text>
        ) : (
          <>
            <View style={{ gap: 16 }}>
              <View style={{ paddingHorizontal: 20, flexDirection: "row", alignItems: "center", gap: 12 }}>
                <View style={{ flex: 1, height: 1, backgroundColor: colors.bgBorder }} />
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent }} />
                  <Text style={{ fontSize: 13, fontWeight: "700", color: colors.textSecondary, letterSpacing: 1, textTransform: "uppercase" }}>
                    MMI3
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.textMuted }}>({mmi3Final.length})</Text>
                </View>
                <View style={{ flex: 1, height: 1, backgroundColor: colors.bgBorder }} />
              </View>
              {mmi3Final.length === 0 ? (
                <Text style={{ paddingHorizontal: 20, fontSize: 14, color: colors.textMuted }}>Aucune SAé MMI3.</Text>
              ) : (
                <FlatList
                  horizontal showsHorizontalScrollIndicator={false}
                  data={mmi3Final} keyExtractor={(item) => String(item.id)}
                  contentContainerStyle={{ paddingHorizontal: 20, gap: 14 }}
                  renderItem={({ item }) => <SaeCard sae={item} />}
                />
              )}
            </View>

            <View style={{ gap: 16 }}>
              <View style={{ paddingHorizontal: 20, flexDirection: "row", alignItems: "center", gap: 12 }}>
                <View style={{ flex: 1, height: 1, backgroundColor: colors.bgBorder }} />
                <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.domainDev }} />
                  <Text style={{ fontSize: 13, fontWeight: "700", color: colors.textSecondary, letterSpacing: 1, textTransform: "uppercase" }}>
                    MMI2
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.textMuted }}>({mmi2.length})</Text>
                </View>
                <View style={{ flex: 1, height: 1, backgroundColor: colors.bgBorder }} />
              </View>
              {mmi2.length === 0 ? (
                <Text style={{ paddingHorizontal: 20, fontSize: 14, color: colors.textMuted }}>Aucune SAé MMI2.</Text>
              ) : (
                <FlatList
                  horizontal showsHorizontalScrollIndicator={false}
                  data={mmi2} keyExtractor={(item) => String(item.id)}
                  contentContainerStyle={{ paddingHorizontal: 20, gap: 14 }}
                  renderItem={({ item }) => <SaeCard sae={item} />}
                />
              )}
            </View>
          </>
        )}
      </ScrollView>
      <BottomNav />
    </View>
  );
}

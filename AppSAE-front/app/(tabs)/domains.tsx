import { useEffect, useState } from "react";
import { FlatList, ScrollView, Text, View } from "react-native";
import { fetchSaes } from "../../components/projects";
import { SaeCard } from "../../components/projects/SaeCard";
import type { Sae } from "../../components/projects";
import { colors } from "../../theme";
import { BottomNav } from "../../components/ui/BottomNav";

const DOMAIN_COLORS: Record<string, string> = {
  Web: colors.domainWeb, DI: colors.domainDI, "3D": colors.domain3D,
  Création: colors.domainCreation, Développement: colors.domainDev,
};

const DOMAIN_ICONS: Record<string, string> = {
  Web: "🌐", DI: "🎨", "3D": "📦", Création: "✨", Développement: "⚙️",
};

export default function DomainsScreen() {
  const [saes, setSaes] = useState<Sae[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try { setSaes(await fetchSaes()); } finally { setIsLoading(false); }
    };
    load();
  }, []);

  const domains = [...new Set(saes.map((saeItem) => saeItem.domain))].filter(Boolean);
  const grouped: Record<string, Sae[]> = {};
  for (const sae of saes) {
    if (!grouped[sae.domain]) grouped[sae.domain] = [];
    grouped[sae.domain].push(sae);
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 56, paddingBottom: 120, gap: 36 }}>

        <View style={{ paddingHorizontal: 20, gap: 6 }}>
          <Text style={{ fontSize: 11, fontWeight: "700", color: colors.textMuted, letterSpacing: 1.5, textTransform: "uppercase" }}>
            Filtrer
          </Text>
          <Text style={{ fontSize: 34, fontWeight: "800", color: colors.textPrimary, letterSpacing: -0.8 }}>
            Domaines
          </Text>
          <Text style={{ fontSize: 14, color: colors.textSecondary }}>
            {domains.length} domaine{domains.length > 1 ? "s" : ""} · {saes.length} SAé au total
          </Text>
        </View>

        {isLoading ? (
          <Text style={{ paddingHorizontal: 20, fontSize: 14, color: colors.textMuted }}>Chargement...</Text>
        ) : domains.length === 0 ? (
          <Text style={{ paddingHorizontal: 20, fontSize: 14, color: colors.textMuted }}>Aucune SAé disponible.</Text>
        ) : (
          domains.map((domain) => {
            const color = DOMAIN_COLORS[domain] ?? colors.accent;
            const icon = DOMAIN_ICONS[domain] ?? "📁";
            const count = grouped[domain]?.length ?? 0;
            return (
              <View key={domain} style={{ gap: 16 }}>
                <View style={{ paddingHorizontal: 20, flexDirection: "row", alignItems: "center", gap: 12 }}>
                  <View
                    style={{
                      width: 36, height: 36, borderRadius: 10,
                      backgroundColor: color + "18",
                      alignItems: "center", justifyContent: "center",
                      borderWidth: 1, borderColor: color + "30",
                    }}
                  >
                    <Text style={{ fontSize: 18 }}>{icon}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 18, fontWeight: "700", color: colors.textPrimary }}>{domain}</Text>
                    <Text style={{ fontSize: 12, color: color, fontWeight: "600" }}>{count} SAé</Text>
                  </View>
                  <View style={{ width: 1, alignSelf: "stretch", backgroundColor: color + "30" }} />
                </View>

                <FlatList
                  horizontal showsHorizontalScrollIndicator={false}
                  data={grouped[domain]}
                  keyExtractor={(item) => String(item.id)}
                  contentContainerStyle={{ paddingHorizontal: 20, gap: 14 }}
                  renderItem={({ item }) => <SaeCard sae={item} />}
                />
              </View>
            );
          })
        )}
      </ScrollView>
      <BottomNav />
    </View>
  );
}

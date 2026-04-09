import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { fetchProjectsByYear, fetchSaes } from "../../components/projects";
import { GroupeCard } from "../../components/projects/GroupeCard";
import type { Sae, SaeProjectResponse } from "../../components/projects";
import { colors } from "../../theme";
import { BottomNav } from "../../components/ui/BottomNav";

const MMI2_SEMESTERS = ["S3", "S4"];

const DOMAIN_COLORS: Record<string, string> = {
  Web: "#2563EB", DI: "#7C3AED", "3D": "#EA580C", Création: "#DB2777", Développement: "#059669",
};

export default function Mmi2Screen() {
  const [allSaes, setAllSaes] = useState<Sae[]>([]);
  const [projects, setProjects] = useState<SaeProjectResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSae, setSelectedSae] = useState<Sae | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [saes, projs] = await Promise.all([fetchSaes(), fetchProjectsByYear("MMI2")]);
        setAllSaes(saes.filter((s) => MMI2_SEMESTERS.includes(s.semester)));
        setProjects(projs);
      } finally { setIsLoading(false); }
    };
    load();
  }, []);

  if (selectedSae) {
    const saeProjects = projects.filter((p) => p.sae.id === selectedSae.id);
    const rows: SaeProjectResponse[][] = [];
    for (let i = 0; i < saeProjects.length; i += 2) rows.push(saeProjects.slice(i, i + 2));
    const avgAll = saeProjects.length > 0
      ? (saeProjects.reduce((sum, p) => sum + p.average, 0) / saeProjects.length).toFixed(1)
      : "—";

    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <FlatList
          data={rows}
          keyExtractor={(_, i) => String(i)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 56, paddingBottom: 120, gap: 12 }}
          ListHeaderComponent={
            <View style={{ gap: 16, marginBottom: 8 }}>
              <Pressable
                onPress={() => setSelectedSae(null)}
                style={({ pressed }) => ({
                  flexDirection: "row", alignItems: "center", gap: 6,
                  alignSelf: "flex-start", opacity: pressed ? 0.6 : 1,
                  backgroundColor: colors.bgCard, borderRadius: 10,
                  paddingHorizontal: 12, paddingVertical: 8,
                  borderWidth: 1, borderColor: colors.bgBorder,
                })}
              >
                <Ionicons name="arrow-back" size={16} color={colors.textSecondary} />
                <Text style={{ fontSize: 13, fontWeight: "600", color: colors.textSecondary }}>Retour aux SAé</Text>
              </Pressable>
              <View style={{ gap: 4 }}>
                <Text style={{ fontSize: 11, fontWeight: "700", color: colors.textMuted, letterSpacing: 1.5, textTransform: "uppercase" }}>MMI2</Text>
                <Text style={{ fontSize: 24, fontWeight: "800", color: colors.textPrimary, letterSpacing: -0.5, lineHeight: 30 }} numberOfLines={2}>
                  {selectedSae.title}
                </Text>
                <Text style={{ fontSize: 14, color: colors.textSecondary }}>
                  {saeProjects.length} groupe{saeProjects.length > 1 ? "s" : ""}{saeProjects.length > 0 ? ` · moy. ${avgAll}/20` : ""}
                </Text>
              </View>
            </View>
          }
          ListEmptyComponent={
            <View style={{ backgroundColor: colors.bgCard, borderRadius: 16, padding: 24, alignItems: "center", borderWidth: 1, borderColor: colors.bgBorder }}>
              <Text style={{ fontSize: 14, color: colors.textMuted, textAlign: "center" }}>
                {isLoading ? "Chargement..." : "Aucun groupe n'a encore soumis cette SAé."}
              </Text>
            </View>
          }
          renderItem={({ item: row }) => (
            <View style={{ flexDirection: "row", gap: 12, alignItems: "stretch" }}>
              {row.map((project) => <GroupeCard key={project.id} project={project} />)}
              {row.length === 1 && <View style={{ flex: 1 }} />}
            </View>
          )}
        />
        <BottomNav />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <FlatList
        data={allSaes}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 56, paddingBottom: 120, gap: 12 }}
        ListHeaderComponent={
          <View style={{ gap: 4, marginBottom: 8 }}>
            <Text style={{ fontSize: 11, fontWeight: "700", color: colors.textMuted, letterSpacing: 1.5, textTransform: "uppercase" }}>Promotion</Text>
            <Text style={{ fontSize: 34, fontWeight: "800", color: colors.textPrimary, letterSpacing: -0.8 }}>MMI2</Text>
            <Text style={{ fontSize: 14, color: colors.textSecondary }}>
              {allSaes.length} SAé · {projects.length} projet{projects.length > 1 ? "s" : ""}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <Text style={{ fontSize: 14, color: colors.textMuted }}>
            {isLoading ? "Chargement..." : "Aucune SAé S3/S4 disponible."}
          </Text>
        }
        renderItem={({ item: sae }) => {
          const domainColor = DOMAIN_COLORS[sae.domain] ?? colors.accent;
          const saeProjects = projects.filter((p) => p.sae.id === sae.id);
          const avg = saeProjects.length > 0
            ? (saeProjects.reduce((sum, p) => sum + p.average, 0) / saeProjects.length).toFixed(1)
            : null;
          return (
            <Pressable
              onPress={() => setSelectedSae(sae)}
              style={({ pressed }) => ({
                backgroundColor: colors.bgCard, borderRadius: 16, padding: 16,
                borderWidth: 1, borderColor: colors.bgBorder, opacity: pressed ? 0.85 : 1, gap: 10,
              })}
            >
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <View style={{ backgroundColor: domainColor + "18", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: domainColor + "30" }}>
                  <Text style={{ fontSize: 11, fontWeight: "700", color: domainColor, textTransform: "uppercase", letterSpacing: 0.8 }}>{sae.domain}</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                  <Text style={{ fontSize: 12, color: colors.textMuted }}>{saeProjects.length} groupe{saeProjects.length > 1 ? "s" : ""}</Text>
                  <Ionicons name="chevron-forward" size={14} color={colors.textMuted} />
                </View>
              </View>
              <Text style={{ fontSize: 17, fontWeight: "700", color: colors.textPrimary, lineHeight: 22 }} numberOfLines={2}>{sae.title}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Text style={{ fontSize: 12, color: colors.textMuted }}>{sae.semester}</Text>
                {avg && (
                  <>
                    <View style={{ width: 3, height: 3, borderRadius: 2, backgroundColor: colors.textMuted }} />
                    <Text style={{ fontSize: 12, fontWeight: "600", color: colors.accent }}>moy. {avg}/20</Text>
                  </>
                )}
              </View>
            </Pressable>
          );
        }}
      />
      <BottomNav />
    </View>
  );
}

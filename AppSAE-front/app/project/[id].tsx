import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Image, Linking, Pressable, ScrollView, Text, View } from "react-native";
import { fetchProjectById } from "../../components/projects";
import type { SaeProjectResponse } from "../../components/projects";
import { colors } from "../../theme";

const DOMAIN_COLORS: Record<string, string> = {
  Web: colors.domainWeb, DI: colors.domainDI, "3D": colors.domain3D,
  Création: colors.domainCreation, Développement: colors.domainDev,
};

function GradeChip({ grade }: { grade: number }) {
  const color = grade >= 14 ? colors.success : grade >= 10 ? colors.accent : colors.danger;
  return (
    <View style={{ backgroundColor: color + "15", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: color + "30" }}>
      <Text style={{ fontSize: 14, fontWeight: "700", color, letterSpacing: -0.2 }}>{grade.toFixed(1)}</Text>
    </View>
  );
}

function ScoreBar({ value }: { value: number }) {
  const pct = Math.min((value / 20) * 100, 100);
  const color = value >= 14 ? colors.success : value >= 10 ? colors.accent : colors.danger;
  return (
    <View style={{ height: 4, backgroundColor: colors.bgSurface, borderRadius: 4, overflow: "hidden" }}>
      <View style={{ width: `${pct}%` as any, height: "100%", backgroundColor: color, borderRadius: 4 }} />
    </View>
  );
}

export default function ProjectDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<SaeProjectResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try { setProject(await fetchProjectById(Number(id))); } finally { setIsLoading(false); }
    };
    load();
  }, [id]);

  const openUrl = (url?: string | null) => { if (url) Linking.openURL(url); };
  const domainColor = project ? (DOMAIN_COLORS[project.sae.domain] ?? colors.accent) : colors.accent;
  const avgColor = project
    ? (project.average >= 14 ? colors.success : project.average >= 10 ? colors.accent : colors.danger)
    : colors.accent;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Stack.Screen options={{ headerShown: false }} />
      <Pressable
        onPress={() => router.back()}
        style={({ pressed }) => ({
          position: "absolute", top: 52, left: 20, zIndex: 10,
          flexDirection: "row", alignItems: "center", gap: 6,
          opacity: pressed ? 0.6 : 1,
          backgroundColor: colors.bgCard, borderRadius: 10,
          paddingHorizontal: 12, paddingVertical: 8,
          borderWidth: 1, borderColor: colors.bgBorder,
        })}
      >
        <Ionicons name="arrow-back" size={16} color={colors.textSecondary} />
        <Text style={{ fontSize: 13, fontWeight: "600", color: colors.textSecondary }}>Retour</Text>
      </Pressable>

      {isLoading ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: 14, color: colors.textMuted }}>Chargement...</Text>
        </View>
      ) : !project ? (
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: "700", color: colors.textPrimary }}>Projet introuvable</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

          <View style={{ paddingHorizontal: 20, paddingTop: 100, paddingBottom: 24, gap: 14 }}>
            <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
              <View style={{ backgroundColor: domainColor + "18", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: domainColor + "40" }}>
                <Text style={{ fontSize: 11, fontWeight: "700", color: domainColor, letterSpacing: 0.8, textTransform: "uppercase" }}>{project.sae.domain}</Text>
              </View>
              <View style={{ backgroundColor: colors.bgCard, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: colors.bgBorder }}>
                <Text style={{ fontSize: 11, color: colors.textSecondary, fontWeight: "500" }}>{project.groupe.name} · {project.groupe.year}</Text>
              </View>
            </View>

            <Text style={{ fontSize: 26, fontWeight: "800", color: colors.textPrimary, letterSpacing: -0.5, lineHeight: 32 }}>
              {project.sae.title}
            </Text>

            <View style={{ height: 1, backgroundColor: colors.bgBorder }} />
          </View>

          {!!project.imageUrls?.length && (
            <View style={{ marginBottom: 24 }}>
              <FlatList
                horizontal showsHorizontalScrollIndicator={false}
                data={project.imageUrls} keyExtractor={(url) => url}
                contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
                renderItem={({ item }) => (
                  <Image source={{ uri: item }} style={{ width: 280, height: 170, borderRadius: 14, backgroundColor: colors.bgCard }} resizeMode="cover" />
                )}
              />
            </View>
          )}

          <View style={{ paddingHorizontal: 20, gap: 24 }}>

            <View style={{ gap: 14 }}>
              <Text style={{ fontSize: 11, fontWeight: "700", color: colors.textMuted, letterSpacing: 1.5, textTransform: "uppercase" }}>Notes</Text>

              <View style={{ backgroundColor: avgColor + "10", borderRadius: 20, padding: 24, alignItems: "center", borderWidth: 1, borderColor: avgColor + "20", gap: 10 }}>
                <Text style={{ fontSize: 60, fontWeight: "900", color: avgColor, letterSpacing: -2, lineHeight: 64 }}>
                  {project.average.toFixed(2)}
                </Text>
                <Text style={{ fontSize: 12, color: avgColor + "99", fontWeight: "700", textTransform: "uppercase", letterSpacing: 1 }}>
                  Moyenne / 20
                </Text>
                <View style={{ width: "100%" }}>
                  <ScoreBar value={project.average} />
                </View>
              </View>

              {(() => {
                const names = project.humanResources
                  ? project.humanResources.split(", ").map((part) => {
                      const colon = part.indexOf(": ");
                      return colon !== -1 ? part.slice(colon + 2) : null;
                    }).filter(Boolean) as string[]
                  : [];
                const grades = project.studentGrades;
                const minName = names[grades.indexOf(project.min)] ?? null;
                const maxName = names[grades.indexOf(project.max)] ?? null;
                return (
                  <View style={{ flexDirection: "row", gap: 12 }}>
                    <View style={{ flex: 1, backgroundColor: colors.danger + "0D", borderRadius: 14, padding: 16, alignItems: "center", borderWidth: 1, borderColor: colors.danger + "20", gap: 6 }}>
                      <Ionicons name="trending-down" size={16} color={colors.danger} />
                      <Text style={{ fontSize: 22, fontWeight: "800", color: colors.danger }}>{project.min.toFixed(1)}</Text>
                      <Text style={{ fontSize: 10, color: colors.textMuted, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 }}>Min</Text>
                      {minName && <Text style={{ fontSize: 11, fontWeight: "600", color: colors.danger + "CC", textAlign: "center" }} numberOfLines={1}>{minName}</Text>}
                    </View>
                    <View style={{ flex: 1, backgroundColor: colors.success + "0D", borderRadius: 14, padding: 16, alignItems: "center", borderWidth: 1, borderColor: colors.success + "20", gap: 6 }}>
                      <Ionicons name="trending-up" size={16} color={colors.success} />
                      <Text style={{ fontSize: 22, fontWeight: "800", color: colors.success }}>{project.max.toFixed(1)}</Text>
                      <Text style={{ fontSize: 10, color: colors.textMuted, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 }}>Max</Text>
                      {maxName && <Text style={{ fontSize: 11, fontWeight: "600", color: colors.success + "CC", textAlign: "center" }} numberOfLines={1}>{maxName}</Text>}
                    </View>
                  </View>
                );
              })()}

              {project.studentGrades.length > 0 && (
                <View style={{ gap: 10 }}>
                  <Text style={{ fontSize: 12, fontWeight: "600", color: colors.textSecondary }}>
                    Notes individuelles — {project.studentGrades.length} élève{project.studentGrades.length > 1 ? "s" : ""}
                  </Text>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                    {[...project.studentGrades].sort((gradeA, gradeB) => gradeB - gradeA).map((grade, gradeIndex) => (
                      <GradeChip key={gradeIndex} grade={grade} />
                    ))}
                  </View>
                </View>
              )}
            </View>

            <View style={{ gap: 10 }}>
              <Text style={{ fontSize: 11, fontWeight: "700", color: colors.textMuted, letterSpacing: 1.5, textTransform: "uppercase" }}>Informations</Text>
              <View style={{ backgroundColor: colors.bgCard, borderRadius: 16, borderWidth: 1, borderColor: colors.bgBorder, overflow: "hidden" }}>
                {project.sae.ue && (
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 14, borderBottomWidth: 1, borderBottomColor: colors.bgBorder }}>
                    <Text style={{ fontSize: 13, color: colors.textMuted }}>UE</Text>
                    <Text style={{ fontSize: 13, fontWeight: "600", color: colors.textPrimary }}>{project.sae.ue.code} — {project.sae.ue.name}</Text>
                  </View>
                )}
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 14, borderBottomWidth: project.humanResources ? 1 : 0, borderBottomColor: colors.bgBorder }}>
                  <Text style={{ fontSize: 13, color: colors.textMuted }}>Période</Text>
                  <Text style={{ fontSize: 13, fontWeight: "600", color: colors.textPrimary }}>{project.sae.startDate} → {project.sae.endDate}</Text>
                </View>
                {!!project.humanResources && (
                  <View style={{ padding: 14 }}>
                    <Text style={{ fontSize: 12, color: colors.textMuted, marginBottom: 4 }}>Équipe</Text>
                    <Text style={{ fontSize: 13, color: colors.textPrimary, lineHeight: 18 }}>{project.humanResources}</Text>
                  </View>
                )}
              </View>
            </View>

            <View style={{ gap: 10 }}>
              <Text style={{ fontSize: 11, fontWeight: "700", color: colors.textMuted, letterSpacing: 1.5, textTransform: "uppercase" }}>Liens</Text>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <Pressable
                  onPress={() => openUrl(project.websiteUrl)}
                  disabled={!project.websiteUrl}
                  style={({ pressed }) => ({
                    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
                    backgroundColor: project.websiteUrl ? colors.accent : colors.bgCard,
                    borderRadius: 12, paddingVertical: 14,
                    borderWidth: 1, borderColor: project.websiteUrl ? colors.accent : colors.bgBorder,
                    opacity: pressed ? 0.8 : project.websiteUrl ? 1 : 0.35,
                  })}
                >
                  <Ionicons name="globe-outline" size={16} color={project.websiteUrl ? colors.white : colors.textMuted} />
                  <Text style={{ fontSize: 14, fontWeight: "600", color: project.websiteUrl ? colors.white : colors.textMuted }}>Site web</Text>
                </Pressable>
                <Pressable
                  onPress={() => openUrl(project.sourceCodeUrl)}
                  disabled={!project.sourceCodeUrl}
                  style={({ pressed }) => ({
                    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
                    backgroundColor: colors.bgCard,
                    borderRadius: 12, paddingVertical: 14,
                    borderWidth: 1, borderColor: project.sourceCodeUrl ? colors.bgBorderStrong : colors.bgBorder,
                    opacity: pressed ? 0.8 : project.sourceCodeUrl ? 1 : 0.35,
                  })}
                >
                  <Ionicons name="logo-github" size={16} color={project.sourceCodeUrl ? colors.textPrimary : colors.textMuted} />
                  <Text style={{ fontSize: 14, fontWeight: "600", color: project.sourceCodeUrl ? colors.textPrimary : colors.textMuted }}>Code source</Text>
                </Pressable>
              </View>
            </View>

          </View>
        </ScrollView>
      )}
    </View>
  );
}

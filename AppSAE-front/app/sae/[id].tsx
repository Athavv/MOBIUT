import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { fetchSaeById, fetchProjectsBySaeId } from "../../components/projects";
import { GroupeCard } from "../../components/projects/GroupeCard";
import type { Sae, SaeProjectResponse } from "../../components/projects";
import { colors } from "../../theme";

const DOMAIN_COLORS: Record<string, string> = {
  Web: colors.domainWeb, DI: colors.domainDI, "3D": colors.domain3D,
  Création: colors.domainCreation, Développement: colors.domainDev,
};

export default function SaeGroupesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [sae, setSae] = useState<Sae | null>(null);
  const [projects, setProjects] = useState<SaeProjectResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [saeData, projectsData] = await Promise.all([
          fetchSaeById(Number(id)),
          fetchProjectsBySaeId(Number(id)),
        ]);
        setSae(saeData);
        setProjects(projectsData);
      } finally { setIsLoading(false); }
    };
    load();
  }, [id]);

  const domainColor = sae ? (DOMAIN_COLORS[sae.domain] ?? colors.accent) : colors.accent;

  const rows: SaeProjectResponse[][] = [];
  for (let i = 0; i < projects.length; i += 2) rows.push(projects.slice(i, i + 2));

  const avgAll = projects.length > 0
    ? (projects.reduce((sum, currentProject) => sum + currentProject.average, 0) / projects.length).toFixed(1)
    : null;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120, gap: 28 }}>

        {sae?.imageUrl ? (
          <View style={{ position: "relative" }}>
            <Image
              source={{ uri: sae.imageUrl }}
              style={{ width: "100%", height: 220, backgroundColor: colors.bgCard }}
              resizeMode="cover"
            />
            <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.25)" }} />
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => ({
                position: "absolute", top: 52, left: 20,
                flexDirection: "row", alignItems: "center", gap: 6,
                opacity: pressed ? 0.7 : 1,
                backgroundColor: "rgba(0,0,0,0.4)", borderRadius: 10,
                paddingHorizontal: 12, paddingVertical: 8,
              })}
            >
              <Ionicons name="arrow-back" size={16} color="#fff" />
              <Text style={{ fontSize: 13, fontWeight: "600", color: "#fff" }}>Retour</Text>
            </Pressable>
          </View>
        ) : (
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => ({
              flexDirection: "row", alignItems: "center", gap: 6,
              alignSelf: "flex-start", opacity: pressed ? 0.6 : 1,
              backgroundColor: colors.bgCard, borderRadius: 10,
              paddingHorizontal: 12, paddingVertical: 8,
              borderWidth: 1, borderColor: colors.bgBorder,
              marginTop: 52, marginLeft: 20,
            })}
          >
            <Ionicons name="arrow-back" size={16} color={colors.textSecondary} />
            <Text style={{ fontSize: 13, fontWeight: "600", color: colors.textSecondary }}>Retour</Text>
          </Pressable>
        )}

        <View style={{ paddingHorizontal: 20, paddingTop: 4, gap: 28 }}>
        {sae && (
          <View style={{ gap: 14 }}>
            <View style={{ alignSelf: "flex-start", backgroundColor: domainColor + "18", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: domainColor + "40" }}>
              <Text style={{ fontSize: 11, fontWeight: "700", color: domainColor, letterSpacing: 0.8, textTransform: "uppercase" }}>{sae.domain}</Text>
            </View>

            <Text style={{ fontSize: 28, fontWeight: "800", color: colors.textPrimary, letterSpacing: -0.5, lineHeight: 34 }}>
              {sae.title}
            </Text>

            <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}>
              <View style={{ backgroundColor: colors.bgCard, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: colors.bgBorder }}>
                <Text style={{ fontSize: 12, color: colors.textSecondary, fontWeight: "500" }}>{sae.semester}</Text>
              </View>
              {sae.ue && (
                <View style={{ backgroundColor: colors.accent + "15", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: colors.accent + "30" }}>
                  <Text style={{ fontSize: 12, color: colors.accent, fontWeight: "600" }}>{sae.ue.code} — {sae.ue.name}</Text>
                </View>
              )}
            </View>

            <Text style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 20 }}>{sae.description}</Text>

            <View style={{ height: 1, backgroundColor: colors.bgBorder }} />
          </View>
        )}

        <View style={{ gap: 8 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <Text style={{ fontSize: 13, fontWeight: "700", color: colors.textSecondary, letterSpacing: 1, textTransform: "uppercase" }}>
              Groupes ({projects.length})
            </Text>
            {avgAll && (
              <View style={{ backgroundColor: colors.accent + "15", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 }}>
                <Text style={{ fontSize: 12, fontWeight: "700", color: colors.accent }}>moy. {avgAll}/20</Text>
              </View>
            )}
          </View>
        </View>

        {isLoading ? (
          <Text style={{ fontSize: 14, color: colors.textMuted }}>Chargement...</Text>
        ) : projects.length === 0 ? (
          <View style={{ backgroundColor: colors.bgCard, borderRadius: 16, padding: 24, alignItems: "center", borderWidth: 1, borderColor: colors.bgBorder }}>
            <Text style={{ fontSize: 14, color: colors.textMuted, textAlign: "center" }}>
              Aucun groupe n'a encore soumis cette SAé.
            </Text>
          </View>
        ) : (
          <View style={{ gap: 12 }}>
            {rows.map((row, rowIndex) => (
              <View key={rowIndex} style={{ flexDirection: "row", gap: 12 }}>
                {row.map((project) => <GroupeCard key={project.id} project={project} />)}
                {row.length === 1 && <View style={{ flex: 1 }} />}
              </View>
            ))}
          </View>
        )}
        </View>
      </ScrollView>
    </View>
  );
}

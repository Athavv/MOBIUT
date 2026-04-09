import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Text, TextInput, View } from "react-native";
import { Card, Screen } from "../ui";
import { colors } from "../../theme";
import type { SaeProject } from "./types";
import { ProjectCard } from "./ProjectCard";

type Props = {
  title: string;
  subtitle?: string;
  load: () => Promise<SaeProject[]>;
  embedded?: boolean;
};

export function ProjectListScreen({ title, subtitle, load, embedded }: Props) {
  const [projects, setProjects] = useState<SaeProject[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");

  const runLoad = async () => {
    setIsLoading(true);
    try {
      const data = await load();
      setProjects(data);
    } catch {
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runLoad();
  }, []);

  const filtered = useMemo(() => {
    const searchLowercase = query.trim().toLowerCase();
    if (!searchLowercase) return projects;
    return projects.filter((project) => {
      return (
        project.sae.title.toLowerCase().includes(searchLowercase) ||
        project.sae.description.toLowerCase().includes(searchLowercase) ||
        project.sae.domain.toLowerCase().includes(searchLowercase) ||
        project.groupe.year.toLowerCase().includes(searchLowercase)
      );
    });
  }, [projects, query]);

  const content = (
    <View style={{ gap: 12 }}>
      <View style={{ gap: 4 }}>
        <Text style={{ fontSize: 28, fontWeight: "700", letterSpacing: -0.5, color: colors.slate900 }}>
          {title}
        </Text>
        {!!subtitle && (
          <Text style={{ fontSize: 15, fontWeight: "400", lineHeight: 22, color: colors.slate600 }}>{subtitle}</Text>
        )}
      </View>

      <Card style={{ padding: 12 }}>
        <Text style={{ fontSize: 13, fontWeight: "600", color: colors.slate900 }}>Rechercher</Text>
        <View style={{ height: 8 }} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Titre, domaine, année…"
          placeholderTextColor={colors.slate400}
          autoCorrect={false}
          style={{
            borderWidth: 1,
            borderColor: colors.slate300,
            backgroundColor: colors.white,
            borderRadius: 14,
            paddingHorizontal: 12,
            paddingVertical: 10,
            color: colors.slate900,
          }}
        />
        <View style={{ height: 10 }} />
        <Text style={{ fontSize: 12, fontWeight: "400", color: colors.slate600 }}>
          {isLoading ? "Chargement…" : `${filtered.length} résultat(s)`}
        </Text>
      </Card>

      {isLoading ? (
        <View style={{ paddingVertical: 24, alignItems: "center" }}>
          <ActivityIndicator />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <ProjectCard project={item} />}
          contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
          ListEmptyComponent={
            <Card>
              <Text style={{ fontSize: 17, fontWeight: "600", color: colors.slate900 }}>Aucun projet</Text>
              <Text style={{ fontSize: 15, fontWeight: "400", lineHeight: 22, color: colors.slate600, marginTop: 6 }}>
                Essaie de modifier ta recherche.
              </Text>
            </Card>
          }
        />
      )}
    </View>
  );

  if (embedded) return content;
  return <Screen>{content}</Screen>;
}

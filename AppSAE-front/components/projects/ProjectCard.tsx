import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { Card } from "../ui";
import { colors } from "../../theme";
import type { SaeProject } from "./types";

type Props = { project: SaeProject };

export function ProjectCard({ project }: Props) {
  return (
    <Link
      href={{ pathname: "/project/[id]" as any, params: { id: String(project.id) } }}
      asChild
    >
      <Pressable accessibilityRole="button">
        <Card style={{ gap: 6 }}>
          <Text style={{ fontSize: 17, fontWeight: "600", color: colors.slate900 }}>{project.sae.title}</Text>
          <Text style={{ fontSize: 12, fontWeight: "400", color: colors.slate600 }}>
            {project.groupe.year} · {project.sae.domain}
            {project.average ? ` · moy. ${project.average.toFixed(1)}/20` : ""}
          </Text>
          <Text style={{ fontSize: 15, fontWeight: "400", lineHeight: 22, color: colors.slate700 }} numberOfLines={3}>
            {project.sae.description}
          </Text>
          <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
            <View style={{ height: 8, width: 8, borderRadius: 999, backgroundColor: colors.liutBlue }} />
            <Text style={{ fontSize: 12, fontWeight: "600", color: colors.liutBlue }}>Voir le détail</Text>
          </View>
        </Card>
      </Pressable>
    </Link>
  );
}

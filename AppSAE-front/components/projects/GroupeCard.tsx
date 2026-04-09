import { Link } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import { colors } from "../../theme";
import type { SaeProjectResponse } from "./types";

function GradeBar({ value, max = 20 }: { value: number; max?: number }) {
  const pct = Math.min((value / max) * 100, 100);
  const color = value >= 14 ? colors.success : value >= 10 ? colors.accent : colors.danger;
  return (
    <View style={{ height: 3, backgroundColor: colors.bgBorder, borderRadius: 2, overflow: "hidden" }}>
      <View style={{ width: `${pct}%`, height: "100%", backgroundColor: color, borderRadius: 2 }} />
    </View>
  );
}

type Props = { project: SaeProjectResponse };

export function GroupeCard({ project }: Props) {
  const avg = project.average;
  const gradeColor = avg >= 14 ? colors.success : avg >= 10 ? colors.accent : colors.danger;
  const firstImage = project.imageUrls?.[0] ?? null;

  return (
    <Link href={{ pathname: "/project/[id]" as any, params: { id: String(project.id) } }} asChild>
      <Pressable
        accessibilityRole="button"
        style={({ pressed }) => ({ flex: 1, opacity: pressed ? 0.8 : 1 })}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: colors.bgCard,
            borderRadius: 16,
            overflow: "hidden",
            borderWidth: 1,
            borderColor: colors.bgBorder,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
            elevation: 4,
          }}
        >
          {firstImage ? (
            <View style={{ height: 90 }}>
              <Image source={{ uri: firstImage }} style={{ width: "100%", height: "100%" }} resizeMode="cover" />
              <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.2)" }} />
            </View>
          ) : (
            <View style={{ height: 6, backgroundColor: gradeColor + "60" }} />
          )}

          <View style={{ padding: 14, gap: 10 }}>
            <View style={{ gap: 2 }}>
              <Text style={{ fontSize: 14, fontWeight: "700", color: colors.textPrimary }} numberOfLines={1}>
                {project.groupe.name}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: colors.accent }} />
                <Text style={{ fontSize: 11, color: colors.textSecondary, fontWeight: "500" }}>
                  {project.groupe.year}
                </Text>
              </View>
            </View>

            <View
              style={{
                backgroundColor: gradeColor + "12",
                borderRadius: 10,
                padding: 10,
                alignItems: "center",
                borderWidth: 1,
                borderColor: gradeColor + "25",
              }}
            >
              <Text style={{ fontSize: 26, fontWeight: "800", color: gradeColor, letterSpacing: -0.5 }}>
                {avg.toFixed(1)}
              </Text>
              <Text style={{ fontSize: 10, color: gradeColor + "99", fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 }}>
                moy. /20
              </Text>
            </View>

            <GradeBar value={avg} />

            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <View style={{ alignItems: "center", gap: 2 }}>
                <Text style={{ fontSize: 13, fontWeight: "700", color: colors.danger }}>{project.min.toFixed(1)}</Text>
                <Text style={{ fontSize: 10, color: colors.textMuted, fontWeight: "500" }}>min</Text>
              </View>
              <View style={{ width: 1, backgroundColor: colors.bgBorder }} />
              <View style={{ alignItems: "center", gap: 2 }}>
                <Text style={{ fontSize: 13, fontWeight: "700", color: colors.success }}>{project.max.toFixed(1)}</Text>
                <Text style={{ fontSize: 10, color: colors.textMuted, fontWeight: "500" }}>max</Text>
              </View>
              <View style={{ width: 1, backgroundColor: colors.bgBorder }} />
              <View style={{ alignItems: "center", gap: 2 }}>
                <Text style={{ fontSize: 13, fontWeight: "700", color: colors.textSecondary }}>{project.studentGrades.length}</Text>
                <Text style={{ fontSize: 10, color: colors.textMuted, fontWeight: "500" }}>élèves</Text>
              </View>
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

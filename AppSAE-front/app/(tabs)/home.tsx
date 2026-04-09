import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Dimensions, Image, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchGroupes, fetchSaes, fetchUes } from "../../components/projects";
import { colors } from "../../theme";
import type { Sae } from "../../components/projects";
import { BottomNav } from "../../components/ui/BottomNav";

const CARD_H = 300;
const SMALL_CARD_W = 180;
const SMALL_CARD_H = 220;

const DOMAIN_META: Record<string, { color: string; dark: string; mid: string }> = {
  Web:           { color: "#2563EB", dark: "#0F2460", mid: "#1D4ED8" },
  DI:            { color: "#7C3AED", dark: "#2E1060", mid: "#5B21B6" },
  "3D":          { color: "#EA580C", dark: "#5A1A00", mid: "#C2410C" },
  Création:      { color: "#DB2777", dark: "#5A0A30", mid: "#BE185D" },
  Développement: { color: "#059669", dark: "#013820", mid: "#047857" },
};

const FILTER_TABS = ["Tous", "Web", "DI", "3D", "Création", "Développement"];

function GradientOverlay({ height = 160 }: { height?: number }) {
  const steps = [0, 0.04, 0.1, 0.22, 0.42, 0.65, 0.82];
  const stepH = height / steps.length;
  return (
    <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, height }}>
      {steps.map((op, i) => (
        <View key={i} style={{ position: "absolute", bottom: i * stepH, left: 0, right: 0, height: stepH, backgroundColor: `rgba(5,5,20,${op})` }} />
      ))}
    </View>
  );
}

function SaeCard({ sae, width, height }: { sae: Sae; width: number; height: number }) {
  const meta = DOMAIN_META[sae.domain] ?? { color: colors.accent, dark: "#030714", mid: "#0c1f55" };

  return (
    <Link href={{ pathname: "/sae/[id]" as any, params: { id: String(sae.id) } }} asChild>
      <Pressable
        style={({ pressed }) => ({
          width, height, marginRight: 16,
          overflow: "hidden", borderRadius: 32,
          opacity: pressed ? 0.94 : 1,
          backgroundColor: meta.dark,
        })}
      >
        {sae.imageUrl ? (
          <Image source={{ uri: sae.imageUrl }} style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }} resizeMode="cover" />
        ) : (
          <>
            <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: meta.color, opacity: 0.85 }} />
            <View style={{ position: "absolute", top: 0, left: 0, right: 0, height: height * 0.5, backgroundColor: meta.mid, opacity: 0.6 }} />
            <View style={{ position: "absolute", top: -30, right: -30, width: 180, height: 180, borderRadius: 90, backgroundColor: "rgba(255,255,255,0.08)" }} />
            <View style={{ position: "absolute", top: 40, right: 60, width: 80, height: 80, borderRadius: 40, backgroundColor: "rgba(255,255,255,0.05)" }} />
          </>
        )}

        <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.3)" }} />
        <GradientOverlay height={height * 0.65} />

        <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: 20 }}>
          <View style={{ alignSelf: "flex-start", backgroundColor: "rgba(255,255,255,0.18)", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, marginBottom: 8, borderWidth: 1, borderColor: "rgba(255,255,255,0.25)" }}>
            <Text style={{ fontSize: 10, fontWeight: "700", color: "#fff", letterSpacing: 1.2, textTransform: "uppercase" }}>
              {sae.domain}
            </Text>
          </View>
          <Text style={{ fontSize: width > 200 ? 20 : 15, fontWeight: "800", color: "#FFFFFF", letterSpacing: -0.4, lineHeight: width > 200 ? 26 : 20, marginBottom: 10 }} numberOfLines={2}>
            {sae.title}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <Ionicons name="calendar-outline" size={12} color="rgba(255,255,255,0.7)" />
                <Text style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", fontWeight: "500" }}>{sae.semester}</Text>
              </View>
              {sae.ue && (
                <>
                  <View style={{ width: 3, height: 3, borderRadius: 2, backgroundColor: "rgba(255,255,255,0.4)" }} />
                  <Text style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", fontWeight: "500" }} numberOfLines={1}>{sae.ue.code}</Text>
                </>
              )}
            </View>
            <View style={{ backgroundColor: "#fff", borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6, flexDirection: "row", alignItems: "center", gap: 4 }}>
              <Text style={{ fontSize: 12, fontWeight: "700", color: meta.color }}>Voir plus</Text>
              <Ionicons name="arrow-forward" size={12} color={meta.color} />
            </View>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const CARD_W = Dimensions.get("window").width - 72;
  const [saes, setSaes] = useState<Sae[]>([]);
  const [stats, setStats] = useState({ saes: 0, groupes: 0, ues: 0 });
  const [activeTab, setActiveTab] = useState("Tous");
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [s, g, u] = await Promise.all([fetchSaes(), fetchGroupes(), fetchUes()]);
        setSaes(s);
        setStats({ saes: s.length, groupes: g.length, ues: u.length });
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const featured = useMemo(() => {
    if (activeTab === "Tous") return saes;
    return saes.filter((s) => s.domain === activeTab);
  }, [saes, activeTab]);

  const queried = useMemo(() => {
    if (!query.trim()) return featured;
    const q = query.trim().toLowerCase();
    return featured.filter((s) => s.title.toLowerCase().includes(q) || s.domain.toLowerCase().includes(q));
  }, [featured, query]);

  const mainCards = queried.slice(0, 8);
  const secondaryCards = queried.slice(0, 12);

  return (
    <View style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>

          {/* Header */}
          <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", paddingHorizontal: 24, paddingTop: 8, paddingBottom: 4 }}>
            <View>
              <Text style={{ fontSize: 13, fontWeight: "500", color: "#94A3B8" }}>Bienvenue</Text>
              <Text style={{ fontSize: 26, fontWeight: "800", color: "#0F172A", letterSpacing: -0.5, lineHeight: 32 }}>Explorez les SAé</Text>
            </View>
            <Pressable
              onLongPress={() => router.push("/admin/login")}
              delayLongPress={600}
              style={({ pressed }) => ({
                width: 44, height: 44,
                borderRadius: 22,
                backgroundColor: colors.accent,
                alignItems: "center", justifyContent: "center",
                opacity: pressed ? 0.85 : 1,
                shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 8, shadowOffset: { width: 0, height: 4 },
                elevation: 4,
              })}
            >
              <Text style={{ fontSize: 11, fontWeight: "800", color: "#fff", letterSpacing: 0.5 }}>MMI</Text>
            </Pressable>
          </View>

          {/* Search */}
          <View style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 20 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: "#fff", borderRadius: 16, borderWidth: 1, borderColor: "#E2E8F0", paddingHorizontal: 16, paddingVertical: 14, shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 }}>
              <Ionicons name="search-outline" size={18} color="#94A3B8" />
              <TextInput
                value={query}
                onChangeText={setQuery}
                placeholder="Rechercher une SAé..."
                placeholderTextColor="#CBD5E1"
                style={{ flex: 1, fontSize: 15, color: "#0F172A" }}
                autoCorrect={false}
              />
              {query ? (
                <Pressable onPress={() => setQuery("")} hitSlop={8}>
                  <Ionicons name="close-circle" size={18} color="#CBD5E1" />
                </Pressable>
              ) : (
                <View style={{ width: 1, height: 18, backgroundColor: "#E2E8F0" }} />
              )}
              <Pressable onPress={() => router.push("/(tabs)/projects")} hitSlop={8}>
                <Ionicons name="options-outline" size={18} color="#171717" />
              </Pressable>
            </View>
          </View>

          {/* Section : SAé à la une */}
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 24, marginBottom: 14 }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#0F172A", letterSpacing: -0.3 }}>SAé à la une</Text>
            <Pressable onPress={() => router.push("/(tabs)/projects")} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
              <Text style={{ fontSize: 13, fontWeight: "600", color: "#94A3B8" }}>Voir tout</Text>
            </Pressable>
          </View>

          {/* Filtre pills */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, gap: 8, marginBottom: 18 }}>
            {FILTER_TABS.map((tab) => {
              const active = activeTab === tab;
              return (
                <Pressable
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  style={({ pressed }) => ({
                    paddingHorizontal: 16, paddingVertical: 10,
                    borderRadius: 999,
                    backgroundColor: active ? colors.accent : "#F1F5F9",
                    opacity: pressed ? 0.85 : 1,
                  })}
                >
                  <Text style={{ fontSize: 14, fontWeight: "600", color: active ? "#fff" : "#64748B" }}>{tab}</Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Contenu SAé */}
          {isLoading ? (
            <View style={{ height: 300, alignItems: "center", justifyContent: "center" }}>
              <Text style={{ fontSize: 14, color: "#94A3B8" }}>Chargement...</Text>
            </View>
          ) : mainCards.length === 0 ? (
            <View style={{ minHeight: 180, alignItems: "center", justifyContent: "center", paddingHorizontal: 24 }}>
              <Text style={{ fontSize: 15, fontWeight: "600", color: "#0F172A" }}>Aucune SAé trouvée</Text>
              <Text style={{ marginTop: 4, fontSize: 13, color: "#94A3B8" }}>Essaie un autre filtre</Text>
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ height: CARD_H }} contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 4, gap: 16, alignItems: "flex-start" }}>
              {mainCards.map((item) => (
                <SaeCard key={item.id} sae={item} width={CARD_W} height={CARD_H} />
              ))}
            </ScrollView>
          )}

          {/* Stats */}
          <View style={{ paddingHorizontal: 24, marginTop: 24, marginBottom: 24 }}>
            <View style={{ flexDirection: "row", gap: 10 }}>
              {[
                { value: stats.saes, label: "SAé", dark: true },
                { value: stats.groupes, label: "Groupes", dark: false },
                { value: stats.ues, label: "UEs", dark: false },
              ].map(({ value, label, dark }) => (
                <View
                  key={label}
                  style={{
                    flex: 1, alignItems: "center", borderRadius: 16, paddingVertical: 16,
                    shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 8, elevation: 2,
                    backgroundColor: dark ? colors.accent : "#fff",
                    borderWidth: dark ? 0 : 1, borderColor: "#F1F5F9",
                  }}
                >
                  <Text style={{ fontSize: 24, fontWeight: "800", letterSpacing: -0.5, color: dark ? "#fff" : "#0F172A" }}>{value}</Text>
                  <Text style={{ marginTop: 2, fontSize: 11, fontWeight: "500", color: dark ? "rgba(255,255,255,0.6)" : "#94A3B8" }}>{label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Toutes les SAé */}
          {!isLoading && secondaryCards.length > 0 && (
            <>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 24, marginBottom: 14 }}>
                <Text style={{ fontSize: 16, fontWeight: "700", color: "#0F172A", letterSpacing: -0.3 }}>Toutes les SAé</Text>
                <Pressable onPress={() => router.push("/(tabs)/projects")} style={({ pressed }) => ({ opacity: pressed ? 0.5 : 1 })}>
                  <Text style={{ fontSize: 13, fontWeight: "600", color: "#94A3B8" }}>Voir tout</Text>
                </Pressable>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ height: SMALL_CARD_H }} contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 4, gap: 16, alignItems: "flex-start" }}>
                {secondaryCards.map((item) => (
                  <SaeCard key={item.id} sae={item} width={SMALL_CARD_W} height={SMALL_CARD_H} />
                ))}
              </ScrollView>
            </>
          )}

          <View style={{ alignItems: "center", paddingVertical: 24 }}>
            <Text style={{ fontSize: 11, color: "#CBD5E1", letterSpacing: 0.3 }}>Maintenez MMI pour l'espace admin</Text>
          </View>

        </ScrollView>
      </SafeAreaView>

      <BottomNav />
    </View>
  );
}

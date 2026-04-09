import { Ionicons } from "@expo/vector-icons";
import { Redirect, router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import {
  createGroupe, createSae, createSaeProject, createUe,
  fetchProjectsByYear, fetchSaes, fetchUes, uploadImage,
} from "../../components/projects";
import type { Sae, SaeProjectResponse, Ue } from "../../components/projects";
import * as ImagePicker from "expo-image-picker";
import { colors } from "../../theme";
import { BottomNav } from "../../components/ui/BottomNav";

declare global { var authToken: string | undefined; }

type Tab = "sae" | "project" | "ue";
type Member = { name: string; grade: string };

const DOMAINS = ["Web", "DI", "3D", "Création", "Développement"];
const YEARS = ["MMI3", "MMI2"];
const SEMESTERS: Record<string, string[]> = { MMI2: ["S3", "S4"], MMI3: ["S5", "S6"] };

function Field({ label, ...props }: { label: string } & React.ComponentProps<typeof TextInput>) {
  return (
    <View style={{ gap: 5 }}>
      <Text style={{ fontSize: 11, fontWeight: "600", color: colors.textSecondary, letterSpacing: 0.4, textTransform: "uppercase" }}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.textMuted}
        style={{ backgroundColor: colors.bgSurface, borderRadius: 10, borderWidth: 1, borderColor: colors.bgBorder, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: colors.textPrimary }}
        {...props}
      />
    </View>
  );
}

function SubmitBtn({ label, loading, onPress }: { label: string; loading: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading}
      style={({ pressed }) => ({ backgroundColor: colors.accent, borderRadius: 10, paddingVertical: 14, alignItems: "center", opacity: pressed || loading ? 0.7 : 1 })}
    >
      <Text style={{ fontSize: 15, fontWeight: "700", color: colors.white }}>{loading ? "Enregistrement..." : label}</Text>
    </Pressable>
  );
}

function SectionHeader({ title, showForm, onToggle }: { title: string; showForm: boolean; onToggle: () => void }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
      <Text style={{ fontSize: 15, fontWeight: "700", color: colors.textPrimary }}>{title}</Text>
      <Pressable
        onPress={onToggle}
        style={({ pressed }) => ({
          flexDirection: "row", alignItems: "center", gap: 5, opacity: pressed ? 0.7 : 1,
          backgroundColor: showForm ? colors.bgCard : colors.accent,
          borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7,
          borderWidth: 1, borderColor: showForm ? colors.bgBorder : colors.accent,
        })}
      >
        <Ionicons name={showForm ? "close" : "add"} size={16} color={showForm ? colors.textSecondary : colors.white} />
        <Text style={{ fontSize: 13, fontWeight: "700", color: showForm ? colors.textSecondary : colors.white }}>
          {showForm ? "Annuler" : "Ajouter"}
        </Text>
      </Pressable>
    </View>
  );
}

export default function AdminDashboardScreen() {
  const [activeTab, setActiveTab] = useState<Tab>("sae");
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saes, setSaes] = useState<Sae[]>([]);
  const [ues, setUes] = useState<Ue[]>([]);
  const [allProjects, setAllProjects] = useState<SaeProjectResponse[]>([]);

  const [showSaeForm, setShowSaeForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showUeForm, setShowUeForm] = useState(false);

  // SAé form
  const [saeYear, setSaeYear] = useState<"MMI2" | "MMI3" | "">("");
  const [saeForm, setSaeForm] = useState({ title: "", description: "", domain: "", semester: "", startDate: "", endDate: "", ueId: null as number | null });
  const [saeImageUri, setSaeImageUri] = useState<string | null>(null);
  const [saeImageFile, setSaeImageFile] = useState<unknown>(null);

  // UE form
  const [ueForm, setUeForm] = useState({ code: "", name: "" });

  // Project form
  const [selectedSae, setSelectedSae] = useState<Sae | null>(null);
  const [showSaePicker, setShowSaePicker] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupYear, setGroupYear] = useState("MMI3");
  const [members, setMembers] = useState<Member[]>([{ name: "", grade: "" }]);
  const [projectExtras, setProjectExtras] = useState({ localImageUris: [] as string[], websiteUrl: "", sourceCodeUrl: "" });
  const [projectImageFiles, setProjectImageFiles] = useState<unknown[]>([]);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const [fetchedSaes, fetchedUes, mmi2, mmi3] = await Promise.all([
      fetchSaes(), fetchUes(), fetchProjectsByYear("MMI2"), fetchProjectsByYear("MMI3"),
    ]);
    setSaes(fetchedSaes);
    setUes(fetchedUes);
    setAllProjects([...mmi2, ...mmi3]);
  };

  const token = () => global.authToken ?? "";

  const showMessage = (text: string, isSuccess: boolean) => {
    setMessage({ text, ok: isSuccess });
    setTimeout(() => setMessage(null), 3000);
  };

  const parsedGrades = members.map((m) => parseFloat(m.grade)).filter((g) => !isNaN(g) && g >= 0 && g <= 20);
  const gradeAvg = parsedGrades.length ? parsedGrades.reduce((t, g) => t + g, 0) / parsedGrades.length : null;
  const gradeMin = parsedGrades.length ? Math.min(...parsedGrades) : null;
  const gradeMax = parsedGrades.length ? Math.max(...parsedGrades) : null;

  const handleSaeSubmit = async () => {
    if (!saeForm.domain) { showMessage("Choisissez un domaine.", false); return; }
    if (!saeForm.semester) { showMessage("Choisissez un semestre.", false); return; }
    setIsSubmitting(true);
    try {
      let uploadedImageUrl: string | null = null;
      if (saeImageUri) {
        uploadedImageUrl = await uploadImage(saeImageUri, saeImageFile ?? undefined);
        if (!uploadedImageUrl) { showMessage("Erreur lors de l'upload de l'image.", false); return; }
      }
      const responseData = await createSae(token(), { ...saeForm, imageUrl: uploadedImageUrl });
      if (responseData.ok) {
        setSaeYear("");
        setSaeForm({ title: "", description: "", domain: "", semester: "", startDate: "", endDate: "", ueId: null });
        setSaeImageUri(null);
        setSaeImageFile(null);
        setShowSaeForm(false);
        loadData();
      }
      showMessage(responseData.ok ? "SAé créée !" : "Erreur lors de la création.", responseData.ok);
    } finally { setIsSubmitting(false); }
  };

  const handleUeSubmit = async () => {
    setIsSubmitting(true);
    const responseData = await createUe(token(), ueForm);
    setIsSubmitting(false);
    if (responseData.ok) { setUeForm({ code: "", name: "" }); setShowUeForm(false); loadData(); }
    showMessage(responseData.ok ? "UE créée !" : "Erreur lors de la création.", responseData.ok);
  };

  const handleProjectSubmit = async () => {
    if (!selectedSae) { showMessage("Choisissez une SAé.", false); return; }
    if (!groupName.trim()) { showMessage("Entrez un nom de groupe.", false); return; }
    if (parsedGrades.length === 0) { showMessage("Entrez au moins une note valide.", false); return; }
    setIsSubmitting(true);
    try {
      const groupeResult = await createGroupe(token(), { name: groupName.trim(), year: groupYear });
      if (!groupeResult.ok || !groupeResult.id) { showMessage("Erreur lors de la création du groupe.", false); return; }

      const humanResources = members
        .map((m, i) => m.name.trim() ? `${i === 0 ? "Chef" : "Membre"}: ${m.name.trim()}` : null)
        .filter(Boolean).join(", ");

      const uploadedImagesList: string[] = [];
      for (let i = 0; i < projectExtras.localImageUris.length; i++) {
        const url = await uploadImage(projectExtras.localImageUris[i], projectImageFiles[i] ?? undefined);
        if (url) { uploadedImagesList.push(url); } else { showMessage("Erreur upload image.", false); return; }
      }

      const result = await createSaeProject(token(), {
        saeId: selectedSae.id, groupeId: groupeResult.id,
        imageUrls: uploadedImagesList, humanResources,
        websiteUrl: projectExtras.websiteUrl, sourceCodeUrl: projectExtras.sourceCodeUrl,
        studentGrades: parsedGrades,
      });

      if (result.ok) {
        setSelectedSae(null); setGroupName(""); setGroupYear("MMI3");
        setMembers([{ name: "", grade: "" }]);
        setProjectExtras({ localImageUris: [], websiteUrl: "", sourceCodeUrl: "" });
        setProjectImageFiles([]);
        setShowProjectForm(false);
        loadData();
      }
      showMessage(result.ok ? "Projet enregistré !" : "Erreur lors de l'enregistrement.", result.ok);
    } finally { setIsSubmitting(false); }
  };

  const addMember = () => { if (members.length < 6) setMembers((p) => [...p, { name: "", grade: "" }]); };
  const removeMember = (i: number) => { if (members.length > 1) setMembers((p) => p.filter((_, idx) => idx !== i)); };
  const updateMember = (i: number, k: keyof Member, v: string) =>
    setMembers((p) => p.map((m, idx) => idx === i ? { ...m, [k]: v } : m));

  const pickSaeImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: true, quality: 1 });
    if (!result.canceled && result.assets[0].uri) {
      setSaeImageUri(result.assets[0].uri);
      setSaeImageFile((result.assets[0] as any).file ?? null);
    }
  };

  const pickProjectImage = async () => {
    if (projectExtras.localImageUris.length >= 6) return;
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], allowsEditing: true, quality: 1 });
    if (!result.canceled && result.assets[0].uri) {
      setProjectExtras((p) => ({ ...p, localImageUris: [...p.localImageUris, result.assets[0].uri] }));
      setProjectImageFiles((p) => [...p, (result.assets[0] as any).file ?? null]);
    }
  };

  const removeProjectImage = (index: number) => {
    setProjectExtras((p) => ({ ...p, localImageUris: p.localImageUris.filter((_, i) => i !== index) }));
    setProjectImageFiles((p) => p.filter((_, i) => i !== index));
  };

  const TABS: { key: Tab; label: string }[] = [
    { key: "sae", label: "SAé" },
    { key: "project", label: "Projet" },
    { key: "ue", label: "UE" },
  ];

  if (!global.authToken) return <Redirect href="/admin/login" />;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 56, paddingBottom: 120, gap: 20 }}>

        <View style={{ flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" }}>
          <View style={{ gap: 4 }}>
            <Text style={{ fontSize: 11, fontWeight: "700", color: colors.textMuted, letterSpacing: 1.5, textTransform: "uppercase" }}>Admin</Text>
            <Text style={{ fontSize: 28, fontWeight: "800", color: colors.textPrimary, letterSpacing: -0.5 }}>Dashboard</Text>
          </View>
          <Pressable
            onPress={() => { global.authToken = undefined; router.replace("/admin/login"); }}
            style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1, backgroundColor: colors.bgCard, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: colors.bgBorder })}
          >
            <Text style={{ fontSize: 13, fontWeight: "600", color: colors.textSecondary }}>Déconnexion</Text>
          </Pressable>
        </View>

        <View style={{ flexDirection: "row", gap: 10 }}>
          {[
            { label: "SAé", value: saes.length, color: colors.accent },
            { label: "Projets", value: allProjects.length, color: colors.domainDev },
            { label: "UEs", value: ues.length, color: colors.domain3D },
          ].map(({ label, value, color }) => (
            <View key={label} style={{ flex: 1, backgroundColor: colors.bgCard, borderRadius: 14, padding: 12, borderWidth: 1, borderColor: colors.bgBorder, alignItems: "center", gap: 4 }}>
              <Text style={{ fontSize: 22, fontWeight: "800", color, letterSpacing: -0.5 }}>{value}</Text>
              <Text style={{ fontSize: 11, color: colors.textMuted, fontWeight: "500" }}>{label}</Text>
            </View>
          ))}
        </View>

        <View style={{ flexDirection: "row", gap: 8 }}>
          {TABS.map(({ key, label }) => {
            const isActive = activeTab === key;
            return (
              <Pressable
                key={key}
                onPress={() => setActiveTab(key)}
                style={{ flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: "center", backgroundColor: isActive ? colors.accent : colors.bgCard, borderWidth: 1, borderColor: isActive ? colors.accent : colors.bgBorder }}
              >
                <Text style={{ fontSize: 13, fontWeight: "700", color: isActive ? colors.white : colors.textSecondary }}>{label}</Text>
              </Pressable>
            );
          })}
        </View>

        {message && (
          <View style={{ backgroundColor: message.ok ? colors.success + "12" : colors.danger + "12", borderRadius: 10, padding: 12, borderWidth: 1, borderColor: message.ok ? colors.success + "30" : colors.danger + "30" }}>
            <Text style={{ fontSize: 13, fontWeight: "600", color: message.ok ? colors.success : colors.danger }}>{message.text}</Text>
          </View>
        )}

        {/* ── SAé tab ── */}
        {activeTab === "sae" && (
          <View style={{ gap: 14 }}>
            <SectionHeader title={`SAé existantes (${saes.length})`} showForm={showSaeForm} onToggle={() => setShowSaeForm((v) => !v)} />

            {saes.length > 0 && !showSaeForm && (
              <View style={{ gap: 8 }}>
                {saes.map((sae) => (
                  <View key={sae.id} style={{ backgroundColor: colors.bgCard, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: colors.bgBorder, gap: 4 }}>
                    <Text style={{ fontSize: 14, fontWeight: "700", color: colors.textPrimary }} numberOfLines={1}>{sae.title}</Text>
                    <Text style={{ fontSize: 12, color: colors.textMuted }}>{sae.domain} · {sae.semester}</Text>
                  </View>
                ))}
              </View>
            )}

            {saes.length === 0 && !showSaeForm && (
              <Text style={{ fontSize: 13, color: colors.textMuted, fontStyle: "italic" }}>Aucune SAé créée.</Text>
            )}

            {showSaeForm && (
              <View style={{ backgroundColor: colors.bgCard, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: colors.bgBorder, gap: 14 }}>
                <Text style={{ fontSize: 17, fontWeight: "700", color: colors.textPrimary }}>Nouvelle SAé</Text>

                <Field label="Titre" value={saeForm.title} onChangeText={(v) => setSaeForm((p) => ({ ...p, title: v }))} placeholder="Titre de la SAé" />
                <Field label="Description" value={saeForm.description} onChangeText={(v) => setSaeForm((p) => ({ ...p, description: v }))} placeholder="Description" multiline />

                <View style={{ gap: 6 }}>
                  <Text style={{ fontSize: 11, fontWeight: "600", color: colors.textSecondary, letterSpacing: 0.4, textTransform: "uppercase" }}>Domaine</Text>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                    {DOMAINS.map((d) => (
                      <Pressable key={d} onPress={() => setSaeForm((p) => ({ ...p, domain: d }))}
                        style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, backgroundColor: saeForm.domain === d ? colors.accent : colors.bgSurface, borderWidth: 1, borderColor: saeForm.domain === d ? colors.accent : colors.bgBorder }}>
                        <Text style={{ fontSize: 13, fontWeight: "600", color: saeForm.domain === d ? colors.white : colors.textSecondary }}>{d}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                <View style={{ gap: 6 }}>
                  <Text style={{ fontSize: 11, fontWeight: "600", color: colors.textSecondary, letterSpacing: 0.4, textTransform: "uppercase" }}>Promotion</Text>
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    {YEARS.map((y) => (
                      <Pressable key={y} onPress={() => { setSaeYear(y as "MMI2" | "MMI3"); setSaeForm((p) => ({ ...p, semester: "" })); }}
                        style={{ flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: "center", backgroundColor: saeYear === y ? colors.accent : colors.bgSurface, borderWidth: 1, borderColor: saeYear === y ? colors.accent : colors.bgBorder }}>
                        <Text style={{ fontSize: 13, fontWeight: "700", color: saeYear === y ? colors.white : colors.textSecondary }}>{y}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                {saeYear !== "" && (
                  <View style={{ gap: 6 }}>
                    <Text style={{ fontSize: 11, fontWeight: "600", color: colors.textSecondary, letterSpacing: 0.4, textTransform: "uppercase" }}>Semestre</Text>
                    <View style={{ flexDirection: "row", gap: 8 }}>
                      {SEMESTERS[saeYear].map((s) => (
                        <Pressable key={s} onPress={() => setSaeForm((p) => ({ ...p, semester: s }))}
                          style={{ flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: "center", backgroundColor: saeForm.semester === s ? colors.accent : colors.bgSurface, borderWidth: 1, borderColor: saeForm.semester === s ? colors.accent : colors.bgBorder }}>
                          <Text style={{ fontSize: 14, fontWeight: "700", color: saeForm.semester === s ? colors.white : colors.textSecondary }}>{s}</Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                )}

                <View style={{ flexDirection: "row", gap: 10 }}>
                  <View style={{ flex: 1 }}><Field label="Début" value={saeForm.startDate} onChangeText={(v) => setSaeForm((p) => ({ ...p, startDate: v }))} placeholder="2025-09-01" /></View>
                  <View style={{ flex: 1 }}><Field label="Fin" value={saeForm.endDate} onChangeText={(v) => setSaeForm((p) => ({ ...p, endDate: v }))} placeholder="2026-01-31" /></View>
                </View>

                <View style={{ gap: 6 }}>
                  <Text style={{ fontSize: 11, fontWeight: "600", color: colors.textSecondary, letterSpacing: 0.4, textTransform: "uppercase" }}>UE (optionnel)</Text>
                  {ues.length === 0 ? (
                    <Text style={{ fontSize: 13, color: colors.textMuted, fontStyle: "italic" }}>Aucune UE disponible</Text>
                  ) : (
                    <View style={{ gap: 6 }}>
                      {ues.map((ue) => (
                        <Pressable key={ue.id}
                          onPress={() => setSaeForm((p) => ({ ...p, ueId: p.ueId === ue.id ? null : ue.id }))}
                          style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 12, borderRadius: 10, backgroundColor: saeForm.ueId === ue.id ? colors.accent + "18" : colors.bgSurface, borderWidth: 1, borderColor: saeForm.ueId === ue.id ? colors.accent + "60" : colors.bgBorder }}>
                          <Text style={{ fontSize: 13, fontWeight: "600", color: saeForm.ueId === ue.id ? colors.accent : colors.textPrimary }}>{ue.code} — {ue.name}</Text>
                          {saeForm.ueId === ue.id && <Ionicons name="checkmark-circle" size={16} color={colors.accent} />}
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>

                <View style={{ gap: 6 }}>
                  <Text style={{ fontSize: 11, fontWeight: "600", color: colors.textSecondary, letterSpacing: 0.4, textTransform: "uppercase" }}>Image de couverture (optionnel)</Text>
                  {saeImageUri && (
                    <View style={{ position: "relative", alignSelf: "flex-start", marginBottom: 4 }}>
                      <Image source={{ uri: saeImageUri }} style={{ width: "100%", height: 140, borderRadius: 10, backgroundColor: colors.bgSurface }} resizeMode="cover" />
                      <Pressable
                        onPress={() => { setSaeImageUri(null); setSaeImageFile(null); }}
                        style={{ position: "absolute", top: -6, right: -6, backgroundColor: colors.bg, borderRadius: 10 }}
                      >
                        <Ionicons name="close-circle" size={20} color={colors.danger} />
                      </Pressable>
                    </View>
                  )}
                  <Pressable onPress={pickSaeImage} style={{ padding: 14, backgroundColor: colors.bgSurface, borderRadius: 10, borderWidth: 1, borderColor: colors.bgBorder, alignItems: "center" }}>
                    <Text style={{ color: saeImageUri ? colors.accent : colors.textMuted, fontWeight: "500" }}>
                      {saeImageUri ? "Modifier l'image..." : "Sélectionner une image de couverture..."}
                    </Text>
                  </Pressable>
                </View>

                <SubmitBtn label="Créer la SAé" loading={isSubmitting} onPress={handleSaeSubmit} />
              </View>
            )}
          </View>
        )}

        {/* ── Project tab ── */}
        {activeTab === "project" && (
          <View style={{ gap: 14 }}>
            <SectionHeader title={`Projets (${allProjects.length})`} showForm={showProjectForm} onToggle={() => setShowProjectForm((v) => !v)} />

            {allProjects.length > 0 && !showProjectForm && (
              <View style={{ gap: 8 }}>
                {allProjects.map((p) => (
                  <View key={p.id} style={{ backgroundColor: colors.bgCard, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: colors.bgBorder, gap: 4 }}>
                    <Text style={{ fontSize: 14, fontWeight: "700", color: colors.textPrimary }} numberOfLines={1}>{p.sae.title}</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                      <Text style={{ fontSize: 12, color: colors.textMuted }}>{p.groupe.name} · {p.groupe.year}</Text>
                      <View style={{ width: 3, height: 3, borderRadius: 2, backgroundColor: colors.textMuted }} />
                      <Text style={{ fontSize: 12, fontWeight: "600", color: colors.accent }}>moy. {p.average.toFixed(1)}/20</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {allProjects.length === 0 && !showProjectForm && (
              <Text style={{ fontSize: 13, color: colors.textMuted, fontStyle: "italic" }}>Aucun projet créé.</Text>
            )}

            {showProjectForm && (
              <View style={{ backgroundColor: colors.bgCard, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: colors.bgBorder, gap: 16 }}>
                <Text style={{ fontSize: 17, fontWeight: "700", color: colors.textPrimary }}>Nouveau projet</Text>

                <View style={{ gap: 6 }}>
                  <Text style={{ fontSize: 11, fontWeight: "600", color: colors.textSecondary, letterSpacing: 0.4, textTransform: "uppercase" }}>SAé</Text>
                  <Pressable
                    onPress={() => setShowSaePicker((p) => !p)}
                    style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: colors.bgSurface, borderRadius: 10, borderWidth: 1, borderColor: selectedSae ? colors.accent + "60" : colors.bgBorder, paddingHorizontal: 14, paddingVertical: 12 }}
                  >
                    <Text style={{ fontSize: 14, color: selectedSae ? colors.textPrimary : colors.textMuted, fontWeight: selectedSae ? "600" : "400" }} numberOfLines={1}>
                      {selectedSae ? selectedSae.title : "Choisir une SAé..."}
                    </Text>
                    <Ionicons name={showSaePicker ? "chevron-up" : "chevron-down"} size={16} color={colors.textMuted} />
                  </Pressable>
                  {showSaePicker && (
                    <View style={{ backgroundColor: colors.bgSurface, borderRadius: 10, borderWidth: 1, borderColor: colors.bgBorder, overflow: "hidden", maxHeight: 220 }}>
                      <ScrollView nestedScrollEnabled>
                        {saes.map((sae, idx) => (
                          <Pressable key={sae.id} onPress={() => { setSelectedSae(sae); setShowSaePicker(false); }}
                            style={{ padding: 12, borderBottomWidth: idx < saes.length - 1 ? 1 : 0, borderBottomColor: colors.bgBorder, backgroundColor: selectedSae?.id === sae.id ? colors.accent + "15" : "transparent" }}>
                            <Text style={{ fontSize: 13, fontWeight: "600", color: colors.textPrimary }} numberOfLines={1}>{sae.title}</Text>
                            <Text style={{ fontSize: 11, color: colors.textMuted, marginTop: 2 }}>{sae.domain} · {sae.semester}</Text>
                          </Pressable>
                        ))}
                      </ScrollView>
                    </View>
                  )}
                </View>

                <View style={{ gap: 10 }}>
                  <Field label="Nom du groupe" value={groupName} onChangeText={setGroupName} placeholder="Groupe A, Binôme 3..." />
                  <View style={{ gap: 6 }}>
                    <Text style={{ fontSize: 11, fontWeight: "600", color: colors.textSecondary, letterSpacing: 0.4, textTransform: "uppercase" }}>Année</Text>
                    <View style={{ flexDirection: "row", gap: 8 }}>
                      {YEARS.map((y) => (
                        <Pressable key={y} onPress={() => setGroupYear(y)}
                          style={{ flex: 1, paddingVertical: 10, borderRadius: 8, alignItems: "center", backgroundColor: groupYear === y ? colors.accent : colors.bgSurface, borderWidth: 1, borderColor: groupYear === y ? colors.accent : colors.bgBorder }}>
                          <Text style={{ fontSize: 13, fontWeight: "700", color: groupYear === y ? colors.white : colors.textSecondary }}>{y}</Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                </View>

                <View style={{ gap: 10 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <Text style={{ fontSize: 11, fontWeight: "600", color: colors.textSecondary, letterSpacing: 0.4, textTransform: "uppercase" }}>Membres ({members.length}/6)</Text>
                    {members.length < 6 && (
                      <Pressable onPress={addMember} style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                        <Ionicons name="add-circle" size={18} color={colors.accent} />
                        <Text style={{ fontSize: 12, fontWeight: "600", color: colors.accent }}>Ajouter</Text>
                      </Pressable>
                    )}
                  </View>
                  {members.map((m, i) => (
                    <View key={i} style={{ backgroundColor: colors.bgSurface, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: i === 0 ? colors.accent + "40" : colors.bgBorder, gap: 8 }}>
                      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                          {i === 0 && <View style={{ backgroundColor: colors.accent + "20", borderRadius: 6, paddingHorizontal: 7, paddingVertical: 2 }}><Text style={{ fontSize: 10, fontWeight: "700", color: colors.accent }}>CHEF</Text></View>}
                          <Text style={{ fontSize: 12, color: colors.textMuted, fontWeight: "500" }}>Membre {i + 1}</Text>
                        </View>
                        {i > 0 && <Pressable onPress={() => removeMember(i)}><Ionicons name="close-circle-outline" size={18} color={colors.textMuted} /></Pressable>}
                      </View>
                      <View style={{ flexDirection: "row", gap: 8 }}>
                        <TextInput value={m.name} onChangeText={(v) => updateMember(i, "name", v)} placeholder="Prénom Nom" placeholderTextColor={colors.textMuted}
                          style={{ flex: 1, backgroundColor: colors.bgCard, borderRadius: 8, borderWidth: 1, borderColor: colors.bgBorder, paddingHorizontal: 12, paddingVertical: 9, fontSize: 13, color: colors.textPrimary }} />
                        <TextInput value={m.grade} onChangeText={(v) => updateMember(i, "grade", v)} placeholder="Note /20" placeholderTextColor={colors.textMuted} keyboardType="decimal-pad"
                          style={{ width: 80, backgroundColor: colors.bgCard, borderRadius: 8, borderWidth: 1, borderColor: colors.bgBorder, paddingHorizontal: 12, paddingVertical: 9, fontSize: 13, color: colors.textPrimary, textAlign: "center" }} />
                      </View>
                    </View>
                  ))}
                  {parsedGrades.length > 0 && (
                    <View style={{ flexDirection: "row", gap: 8 }}>
                      {[{ label: "Moy.", value: gradeAvg?.toFixed(2), color: colors.accent }, { label: "Min", value: gradeMin?.toFixed(1), color: colors.danger }, { label: "Max", value: gradeMax?.toFixed(1), color: colors.success }].map(({ label, value, color }) => (
                        <View key={label} style={{ flex: 1, backgroundColor: color + "12", borderRadius: 10, padding: 10, alignItems: "center", borderWidth: 1, borderColor: color + "25" }}>
                          <Text style={{ fontSize: 16, fontWeight: "800", color }}>{value}</Text>
                          <Text style={{ fontSize: 10, color: colors.textMuted, fontWeight: "500", marginTop: 2 }}>{label}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>

                <View style={{ gap: 10 }}>
                  <Text style={{ fontSize: 11, fontWeight: "600", color: colors.textSecondary, letterSpacing: 0.4, textTransform: "uppercase" }}>Optionnel</Text>
                  <View style={{ gap: 8 }}>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                      <Text style={{ fontSize: 11, fontWeight: "600", color: colors.textSecondary, letterSpacing: 0.4, textTransform: "uppercase" }}>Images ({projectExtras.localImageUris.length}/6)</Text>
                      {projectExtras.localImageUris.length < 6 && (
                        <Pressable onPress={pickProjectImage} style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                          <Ionicons name="add-circle" size={18} color={colors.accent} />
                          <Text style={{ fontSize: 12, fontWeight: "600", color: colors.accent }}>Ajouter</Text>
                        </Pressable>
                      )}
                    </View>
                    {projectExtras.localImageUris.length === 0 ? (
                      <Pressable onPress={pickProjectImage} style={{ padding: 14, backgroundColor: colors.bgSurface, borderRadius: 10, borderWidth: 1, borderColor: colors.bgBorder, alignItems: "center" }}>
                        <Text style={{ color: colors.textMuted, fontWeight: "500" }}>Sélectionner des images...</Text>
                      </Pressable>
                    ) : (
                      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                        {projectExtras.localImageUris.map((uri, index) => (
                          <View key={uri} style={{ position: "relative" }}>
                            <Image source={{ uri }} style={{ width: 80, height: 80, borderRadius: 10, backgroundColor: colors.bgSurface }} resizeMode="cover" />
                            {index === 0 && (
                              <View style={{ position: "absolute", top: 4, left: 4, backgroundColor: colors.accent, borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2 }}>
                                <Text style={{ fontSize: 8, fontWeight: "800", color: colors.white }}>PRINCIPAL</Text>
                              </View>
                            )}
                            <Pressable onPress={() => removeProjectImage(index)} style={{ position: "absolute", top: -6, right: -6, backgroundColor: colors.bg, borderRadius: 10 }}>
                              <Ionicons name="close-circle" size={20} color={colors.danger} />
                            </Pressable>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                  <Field label="Site web" value={projectExtras.websiteUrl} onChangeText={(v) => setProjectExtras((p) => ({ ...p, websiteUrl: v }))} placeholder="https://..." autoCapitalize="none" />
                  <Field label="Code source" value={projectExtras.sourceCodeUrl} onChangeText={(v) => setProjectExtras((p) => ({ ...p, sourceCodeUrl: v }))} placeholder="https://github.com/..." autoCapitalize="none" />
                </View>

                <SubmitBtn label="Enregistrer le projet" loading={isSubmitting} onPress={handleProjectSubmit} />
              </View>
            )}
          </View>
        )}

        {/* ── UE tab ── */}
        {activeTab === "ue" && (
          <View style={{ gap: 14 }}>
            <SectionHeader title={`UE existantes (${ues.length})`} showForm={showUeForm} onToggle={() => setShowUeForm((v) => !v)} />

            {ues.length > 0 && !showUeForm && (
              <View style={{ gap: 8 }}>
                {ues.map((ue) => (
                  <View key={ue.id} style={{ backgroundColor: colors.bgCard, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: colors.bgBorder, flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <View style={{ backgroundColor: colors.accent + "18", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1, borderColor: colors.accent + "30" }}>
                      <Text style={{ fontSize: 12, fontWeight: "700", color: colors.accent }}>{ue.code}</Text>
                    </View>
                    <Text style={{ fontSize: 14, fontWeight: "600", color: colors.textPrimary, flex: 1 }}>{ue.name}</Text>
                  </View>
                ))}
              </View>
            )}

            {ues.length === 0 && !showUeForm && (
              <Text style={{ fontSize: 13, color: colors.textMuted, fontStyle: "italic" }}>Aucune UE créée.</Text>
            )}

            {showUeForm && (
              <View style={{ backgroundColor: colors.bgCard, borderRadius: 16, padding: 18, borderWidth: 1, borderColor: colors.bgBorder, gap: 14 }}>
                <Text style={{ fontSize: 17, fontWeight: "700", color: colors.textPrimary }}>Nouvelle UE</Text>
                <Field label="Code" value={ueForm.code} onChangeText={(v) => setUeForm((p) => ({ ...p, code: v }))} placeholder="UE6.1" autoCapitalize="none" />
                <Field label="Nom" value={ueForm.name} onChangeText={(v) => setUeForm((p) => ({ ...p, name: v }))} placeholder="Développer" />
                <SubmitBtn label="Créer l'UE" loading={isSubmitting} onPress={handleUeSubmit} />
              </View>
            )}
          </View>
        )}

      </ScrollView>

      <BottomNav />
    </View>
  );
}

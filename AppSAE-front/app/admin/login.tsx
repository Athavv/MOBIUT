import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { apiBaseUrl } from "../../theme";
import { colors } from "../../theme";
import { BottomNav } from "../../components/ui/BottomNav";

declare global { var authToken: string | undefined; }

export default function AdminLoginScreen() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const response = await fetch(`${apiBaseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      if (!response.ok) {
        setErrorMessage("Identifiants invalides");
        return;
      }

      const data = await response.json();
      global.authToken = data.token;
      router.replace("/admin/dashboard");
    } catch {
      setErrorMessage("Erreur de connexion");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ paddingTop: 56, paddingHorizontal: 20 }}>
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => ({
            flexDirection: "row", alignItems: "center", gap: 6,
            alignSelf: "flex-start", opacity: pressed ? 0.6 : 1,
            backgroundColor: colors.bgCard, borderRadius: 10,
            paddingHorizontal: 12, paddingVertical: 8,
            borderWidth: 1, borderColor: colors.bgBorder,
          })}
        >
          <Ionicons name="arrow-back" size={16} color={colors.textSecondary} />
          <Text style={{ fontSize: 13, fontWeight: "600", color: colors.textSecondary }}>Retour</Text>
        </Pressable>
      </View>

      <View style={{ flex: 1, justifyContent: "center", paddingHorizontal: 24, paddingBottom: 120 }}>

        <View style={{ alignItems: "center", marginBottom: 40, gap: 12 }}>
          <View style={{ width: 64, height: 64, borderRadius: 18, backgroundColor: colors.accent + "20", borderWidth: 1, borderColor: colors.accent + "40", alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="shield-checkmark" size={28} color={colors.accent} />
          </View>
          <View style={{ alignItems: "center", gap: 4 }}>
            <Text style={{ fontSize: 24, fontWeight: "800", color: colors.textPrimary, letterSpacing: -0.5 }}>
              Espace admin
            </Text>
            <Text style={{ fontSize: 14, color: colors.textSecondary }}>
              AppSAE — IUT MLV Meaux
            </Text>
          </View>
        </View>

        <View style={{ gap: 14 }}>
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 12, fontWeight: "500", color: colors.textSecondary, letterSpacing: 0.3 }}>
              Nom d'utilisateur
            </Text>
            <TextInput
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="admin"
              placeholderTextColor={colors.textMuted}
              returnKeyType="next"
              style={{ backgroundColor: colors.bgCard, borderRadius: 12, borderWidth: 1, borderColor: colors.bgBorder, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: colors.textPrimary }}
            />
          </View>

          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 12, fontWeight: "500", color: colors.textSecondary, letterSpacing: 0.3 }}>
              Mot de passe
            </Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="••••••••"
              placeholderTextColor={colors.textMuted}
              returnKeyType="done"
              onSubmitEditing={handleSubmit}
              style={{ backgroundColor: colors.bgCard, borderRadius: 12, borderWidth: 1, borderColor: colors.bgBorder, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, color: colors.textPrimary }}
            />
          </View>

          {!!errorMessage && (
            <View style={{ backgroundColor: colors.danger + "12", borderRadius: 10, padding: 12, borderWidth: 1, borderColor: colors.danger + "25" }}>
              <Text style={{ fontSize: 13, color: colors.danger }}>{errorMessage}</Text>
            </View>
          )}

          <Pressable
            onPress={handleSubmit}
            disabled={isSubmitting}
            style={({ pressed }) => ({
              backgroundColor: colors.action,
              borderRadius: 12,
              paddingVertical: 16,
              alignItems: "center",
              opacity: pressed || isSubmitting ? 0.7 : 1,
              marginTop: 8,
            })}
          >
            <Text style={{ fontSize: 16, fontWeight: "700", color: colors.white }}>
              {isSubmitting ? "Connexion..." : "Se connecter"}
            </Text>
          </Pressable>
        </View>

      </View>

      <BottomNav />
    </View>
  );
}

import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { brandPrimary, colors } from "../../theme";

type Variant = "primary" | "secondary" | "ghost";

type Props = {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: Variant;
  isLoading?: boolean;
  disabled?: boolean;
  style?: object;
};

export function Button({ children, onPress, variant = "primary", isLoading, disabled, style }: Props) {
  const isDisabled = disabled || isLoading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        variant === "primary" && styles.primary,
        variant === "secondary" && styles.secondary,
        variant === "ghost" && styles.ghost,
        isDisabled && styles.disabled,
        pressed && { opacity: 0.75 },
        style,
      ]}
    >
      {isLoading ? (
        <ActivityIndicator color={variant === "primary" ? colors.white : brandPrimary} size="small" />
      ) : (
        <Text style={[styles.text, variant === "secondary" && styles.textSecondary, variant === "ghost" && styles.textGhost]}>
          {children}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  primary: {
    backgroundColor: colors.action,
  },
  secondary: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: colors.accentBorder,
  },
  ghost: {
    backgroundColor: "transparent",
  },
  disabled: { opacity: 0.4 },
  text: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.white,
    letterSpacing: 0.2,
  },
  textSecondary: { color: brandPrimary },
  textGhost: { color: colors.textSecondary },
});

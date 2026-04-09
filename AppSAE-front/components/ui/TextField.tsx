import { useState } from "react";
import { StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import { colors } from "../../theme";

type Props = TextInputProps & {
  label?: string;
};

export function TextField({ label, style, onFocus, onBlur, ...props }: Props) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={[styles.input, isFocused && styles.inputFocused, style]}
        placeholderTextColor={colors.textMuted}
        onFocus={(focusEvent) => { setIsFocused(true); onFocus?.(focusEvent); }}
        onBlur={(blurEvent) => { setIsFocused(false); onBlur?.(blurEvent); }}
        {...props}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 6 },
  label: { fontSize: 12, fontWeight: "500", color: colors.textSecondary, letterSpacing: 0.3 },
  input: {
    backgroundColor: colors.bgSurface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.bgBorder,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: colors.textPrimary,
  },
  inputFocused: { borderColor: colors.accent },
});

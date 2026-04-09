import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import { colors } from "../../theme";

type Props = {
  children: React.ReactNode;
  backgroundColor?: string;
  scroll?: boolean;
  style?: object;
};

export function Screen({ children, backgroundColor, scroll = false, style }: Props) {
  const bg = backgroundColor ?? colors.bg;

  const inner = (
    <View style={[styles.inner, style]}>
      {children}
    </View>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: bg }]}>
      {scroll ? (
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.inner}
        >
          {children}
        </ScrollView>
      ) : inner}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  inner: { flex: 1, paddingHorizontal: 16, paddingTop: 16 },
});

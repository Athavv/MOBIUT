import { StyleSheet, View, ViewProps } from "react-native";
import { colors } from "../../theme";

type Props = ViewProps & {
  style?: object;
  children: React.ReactNode;
};

export function Card({ children, style, ...props }: Props) {
  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.bgCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.bgBorder,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 4,
  },
});

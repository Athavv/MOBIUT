import { useEffect, useRef } from "react";
import { Dimensions, StyleSheet } from "react-native";
import { Image } from "expo-image";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { colors } from "../theme";

type Props = { onFinish: () => void };

const LOGO_H = 80;
const FULL_W = LOGO_H * (1014 / 210);

export function IntroAnimation({ onFinish }: Props) {
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;
  const rotation = useSharedValue(0);
  const logoWidth = useSharedValue(LOGO_H);
  const translateY = useSharedValue(0);

  useEffect(() => {
    const h = Dimensions.get("window").height;
    rotation.value = withTiming(360, { duration: 1200, easing: Easing.inOut(Easing.quad) });
    logoWidth.value = withDelay(
      1200,
      withTiming(FULL_W, { duration: 800, easing: Easing.inOut(Easing.cubic) }),
    );
    translateY.value = withDelay(
      2100,
      withTiming(-h, { duration: 600, easing: Easing.bezier(0.76, 0, 0.24, 1) }),
    );
    const done = setTimeout(() => onFinishRef.current(), 2700);
    return () => clearTimeout(done);
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));
  const logoWrapperStyle = useAnimatedStyle(() => ({
    width: logoWidth.value,
    height: LOGO_H,
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View style={[styles.root, containerStyle]} pointerEvents="none">
      <Animated.View style={[styles.logoClip, logoWrapperStyle]}>
        <Image
          source={require("../assets/images/logogustaveeiffel.png")}
          style={styles.logoImage}
          contentFit="contain"
          cachePolicy="memory-disk"
        />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.accent,
    zIndex: 9999,
    alignItems: "center",
    justifyContent: "center",
  },
  logoClip: { overflow: "hidden", alignItems: "flex-start", justifyContent: "center" },
  logoImage: { width: FULL_W, height: LOGO_H },
});

import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withDelay,
    withTiming,
} from "react-native-reanimated";
import Loader from "../components/ui/Loader";
import { LogoComponent } from "./../components/ui/logoComponent";
import { logoTitleComponent as LogoTitleComponent } from "./../components/ui/logoTitleComponent";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function Splash() {
  const router = useRouter();

  const [showLoader, setShowLoader] = useState(false);

  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.8);

  const textOpacity = useSharedValue(0);
  const textTranslate = useSharedValue(20);

  useEffect(() => {
    const run = async () => {
      await SplashScreen.hideAsync();

      // Logo animation
      logoOpacity.value = withTiming(1, { duration: 800 });
      logoScale.value = withTiming(1, {
        duration: 800,
        easing: Easing.out(Easing.exp),
      });

      // Text animation (بعد اللوجو)
      textOpacity.value = withDelay(
        600,
        withTiming(1, { duration: 700 })
      );

      textTranslate.value = withDelay(
        600,
        withTiming(0, { duration: 700 })
      );

      // بعد 2.5 ثانية روح للوجين — show loader then navigate
      setShowLoader(true);
      setTimeout(() => {
        router.replace("/login");
      }, 2500);
    };

    run();
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslate.value }],
  }));

  return (
    <View style={styles.container}>
        <Animated.View style={[styles.logo, logoAnimatedStyle]}>
     <LogoComponent/>
      </Animated.View>
      <Animated.View style={textAnimatedStyle}>
       <LogoTitleComponent />
      </Animated.View>
      {showLoader && <Loader />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0891b2",
    alignItems: "center",
    justifyContent: "center",
  },
});
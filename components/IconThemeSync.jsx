import { useEffect } from "react";
import { Appearance, Platform } from "react-native";
import Constants from "expo-constants";

export default function IconThemeSync() {
  useEffect(() => {
    const isExpoGo = Constants.appOwnership === "expo";

    // Expo Go: مفيش native module => متشغّلوش
    if (isExpoGo) return;

    const apply = async () => {
      const scheme = Appearance.getColorScheme();
      const target = scheme === "dark" ? "IconDark" : "IconLight";

      // dynamic import عشان ما يعملش crash وقت الـ bundle
      const mod = await import("expo-alternate-app-icons");
      const current = await mod.getAppIconName();
      if (current !== target) await mod.setAlternateAppIcon(target);
    };

    apply();
    const sub = Appearance.addChangeListener(() => apply());
    return () => sub.remove();
  }, []);

  return null;
}
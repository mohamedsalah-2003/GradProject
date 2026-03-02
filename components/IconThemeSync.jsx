import { useEffect } from "react";
import { Appearance, Platform } from "react-native";
import Constants from "expo-constants";

export default function IconThemeSync() {
  useEffect(() => {
    // 1) Web مش مدعوم
    if (Platform.OS === "web") return;

    // 2) Expo Go غالبًا مش بيحتوي native module
    const isExpoGo = Constants.appOwnership === "expo";
    if (isExpoGo) return;

    let cancelled = false;

    const apply = async () => {
      try {
        const scheme = Appearance.getColorScheme();
        const target = scheme === "dark" ? "IconDark" : "IconLight";

        const mod = await import("expo-alternate-app-icons");
        if (cancelled) return;

        const current = await mod.getAppIconName();
        if (cancelled) return;

        if (current !== target) {
          await mod.setAlternateAppIcon(target);
        }
      } catch (e) {
        // لو الموديول مش available (build ناقص / منصة غير مدعومة) ما نكسرش التطبيق
        // ممكن تحط console.warn لو تحب
        // console.warn("IconThemeSync skipped:", e);
      }
    };

    apply();

    const sub = Appearance.addChangeListener(() => {
      apply();
    });

    return () => {
      cancelled = true;
      sub.remove();
    };
  }, []);

  return null;
}
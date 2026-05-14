import { Platform } from "react-native";

export const platformCardStyle = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,
  },

  android: {
    elevation: 3,
  },

  web: {
    boxShadow: "0px 4px 12px rgba(0,0,0,0.06)",
  },
});

export const platformContainerWidth = Platform.select({
  web: {
    width: 420,
    alignSelf: "center" as const,
  },

  default: {
    width: "100%" as const,
  },
});
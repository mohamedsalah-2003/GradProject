import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";

type MessageType = "success" | "error" | "info";

type Props = {
  message?: string | null;
  type?: MessageType;
  style?: ViewStyle;
  children?: React.ReactNode; // ✅ جديد
};

export default function ResponseMessage({
  message,
  type = "success",
  style,
  children,
}: Props) {
  // ✅ لو مفيش message ولا children مفيش حاجة تتعرض
  if (!message && !children) return null;

  const boxStyle =
    type === "success"
      ? styles.successBox
      : type === "error"
      ? styles.errorBox
      : styles.infoBox;

  const textStyle =
    type === "success"
      ? styles.successText
      : type === "error"
      ? styles.errorText
      : styles.infoText;

  return (
    <View style={[styles.baseBox, boxStyle, style]}>
      {/* ✅ لو فيه children اعرضهم، وإلا اعرض message */}
      {children ? (
        <Text style={[styles.baseText, textStyle]}>{children}</Text>
      ) : (
        <Text style={[styles.baseText, textStyle]}>{message}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  baseBox: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 15,
  },
  baseText: {
    fontWeight: "600",
  },

  successBox: { backgroundColor: "#DCFCE7" },
  successText: { color: "#166534" },

  errorBox: { backgroundColor: "#FEE2E2" },
  errorText: { color: "#991B1B" },

  infoBox: { backgroundColor: "#DBEAFE" },
  infoText: { color: "#1E40AF" },
});
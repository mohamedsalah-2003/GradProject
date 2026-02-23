import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function Loader({ size = "large", color = "#fff", style }) {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
});

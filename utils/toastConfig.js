import { View, Text, StyleSheet } from "react-native";

export const toastConfig = {
  success: ({ text1, text2 }) => (
    <View style={[styles.container, styles.success]}>
      <Text style={styles.title}>{text1}</Text>
      <Text style={styles.message}>{text2}</Text>
    </View>
  ),

  error: ({ text1, text2 }) => (
    <View style={[styles.container, styles.error]}>
      <Text style={styles.title}>{text1}</Text>
      <Text style={styles.message}>{text2}</Text>
    </View>
  ),

  info: ({ text1, text2 }) => (
    <View style={[styles.container, styles.info]}>
      <Text style={styles.title}>{text1}</Text>
      <Text style={styles.message}>{text2}</Text>
    </View>
  ),
};

const styles = StyleSheet.create({
  container: {
    width: "90%",
    padding: 14,
    borderRadius: 12,
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },

  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },

  message: {
    fontSize: 13,
    color: "#f2f2f2",
    marginTop: 4,
  },

  success: {
    backgroundColor: "#16a34a",
  },

  error: {
    backgroundColor: "#dc2626",
  },

  info: {
    backgroundColor: "#2563eb",
  },
});
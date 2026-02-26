import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

export default function HeroSection() {
  return (
    <View style={styles.heroContainer}>
      <View style={styles.heroInner}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>Mohamed Salah</Text>
        </View>
        <View style={styles.avatarCircle}>
          <Text style={{ color: "#fff", fontWeight: "700" }}>MS</Text>
        </View>
      </View>

      <View style={styles.heroCard}>
        <View style={styles.heroCardInner}>
          <View style={styles.heroCardIcon}>
            <Ionicons name="shield-checkmark" size={20} color="#10B981" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroCardTitle}>All Systems Safe</Text>
            <Text style={styles.heroCardSubtitle}>Your property is secure</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heroContainer: {
    backgroundColor: "#10B981",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 18,
  },
  heroInner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  welcomeText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 16,
    marginBottom: 6,
  },
  userName: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "800",
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
  },
  heroCard: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 16,
    padding: 14,
    marginBottom: 8,
  },
  heroCardInner: {
    flexDirection: "row",
    alignItems: "center",
  },
  heroCardIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  heroCardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  heroCardSubtitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    marginTop: 4,
  },
});
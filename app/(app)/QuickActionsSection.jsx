import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function QuickActionsSection() {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsContainer}>
        {/* Emergency Button */}
        <TouchableOpacity style={[styles.actionButton, styles.emergencyButton]}>
          <View style={styles.actionIconContainer}>
            <Ionicons name="call" size={32} color="#DC2626" />
          </View>
          <Text style={styles.actionText}>Emergency</Text>
        </TouchableOpacity>

        {/* Silence Button */}
        <TouchableOpacity style={[styles.actionButton, styles.normalButton]}>
          <View style={styles.actionIconContainer}>
            <Ionicons name="volume-mute" size={32} color="#1F2937" />
          </View>
          <Text style={styles.actionText}>Silence</Text>
        </TouchableOpacity>

        {/* Devices Button */}
        <TouchableOpacity style={[styles.actionButton, styles.normalButton]}>
          <View style={styles.actionIconContainer}>
            <Ionicons name="hardware-chip" size={32} color="#1F2937" />
          </View>
          <Text style={styles.actionText}>Devices</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 12,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionButton: {
    width: "31%",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  emergencyButton: {
    backgroundColor: "#FCE7E7",
  },
  normalButton: {
    backgroundColor: "#FFFFFF",
  },
  actionIconContainer: {
    marginBottom: 8,
  },
  actionText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1F2937",
  },
});
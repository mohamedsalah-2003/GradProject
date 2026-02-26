import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function SensorsSection(){
  const [smokeStatus, setSmokeStatus] = useState("Clear");
  const [motionStatus, setMotionStatus] = useState("Active");
  const [waterStatus, setWaterStatus] = useState("Dry");
  const [humidity, setHumidity] = useState("45%");
  const [gasLevel, setGasLevel] = useState("Normal");
  const [temperature, setTemperature] = useState("22°C");
  return (
    <>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Sensors</Text>
        </View>
        {/* <Ionicons name="settings-outline" size={24} color="#1F2937" /> */}
      </View>

      {/* Status Cards Grid */}
      <View style={styles.gridContainer}>
        {/* Smoke Card */}
        <TouchableOpacity style={styles.statusCard}>
          <View style={[styles.iconCircle, { backgroundColor: "#C6F6D5" }]}>
            <Ionicons name="cloud" size={28} color="#22863A" />
          </View>
          <Text style={styles.statusLabel}>Smoke</Text>
          <Text style={styles.statusValue}>{smokeStatus}</Text>
        </TouchableOpacity>

        {/* Motion Card */}
        <TouchableOpacity style={styles.statusCard}>
          <View style={[styles.iconCircle, { backgroundColor: "#FEEBC8" }]}>
            <Ionicons name="walk" size={28} color="#92400E" />
          </View>
          <Text style={styles.statusLabel}>Motion</Text>
          <Text style={styles.statusValue}>{motionStatus}</Text>
        </TouchableOpacity>

        {/* Water Card */}
        <TouchableOpacity style={styles.statusCard}>
          <View style={[styles.iconCircle, { backgroundColor: "#C6F6D5" }]}>
            <Ionicons name="water" size={28} color="#22863A" />
          </View>
          <Text style={styles.statusLabel}>Water</Text>
          <Text style={styles.statusValue}>{waterStatus}</Text>
        </TouchableOpacity>

        {/* Humidity Card */}
        <TouchableOpacity style={styles.statusCard}>
          <View style={[styles.iconCircle, { backgroundColor: "#C6F6D5" }]}>
            <Ionicons name="water-outline" size={28} color="#22863A" />
          </View>
          <Text style={styles.statusLabel}>Humidity</Text>
          <Text style={styles.statusValue}>{humidity}</Text>
        </TouchableOpacity>

        {/* Gas Level Card */}
        <TouchableOpacity style={styles.statusCard}>
          <View style={[styles.iconCircle, { backgroundColor: "#FFECE6" }]}>
            <Ionicons name="flame-outline" size={28} color="#DC2626" />
          </View>
          <Text style={styles.statusLabel}>Gas Level</Text>
          <Text style={styles.statusValue}>{gasLevel}</Text>
        </TouchableOpacity>

        {/* Temperature Card */}
        <TouchableOpacity style={styles.statusCard}>
          <View style={[styles.iconCircle, { backgroundColor: "#FEEBC8" }]}>
            <Ionicons name="thermometer-outline" size={28} color="#92400E" />
          </View>
          <Text style={styles.statusLabel}>Temperature</Text>
          <Text style={styles.statusValue}>{temperature}</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statusCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statusLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
    marginBottom: 4,
  },
  statusValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
  },
});
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Home() {

  const [smokeStatus, setSmokeStatus] = useState("Clear");
  const [motionStatus, setMotionStatus] = useState("Active");
  const [waterStatus, setWaterStatus] = useState("Dry");
  const [humidity, setHumidity] = useState("45%");
  const [gasLevel, setGasLevel] = useState("Normal");
  const [temperature, setTemperature] = useState("22°C");

  const recentActivities = [
    { title: "Motion detected in Garage", time: "5 minutes ago" },
    { title: "Temperature normalized in Living Room", time: "15 minutes ago" },
    { title: "All systems operational", time: "30 minutes ago" },
    { title: "Device check completed", time: "about 1 hour ago" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Hero: welcome + status card */}
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

        {/* Quick Actions Section */}
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

        {/* Recent Activity Section */}
        <View style={styles.section}>
          <View style={styles.activityHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All </Text>
            </TouchableOpacity>
          </View>

          {recentActivities.map((activity, index) => (
            <View key={index} style={styles.activityCard}>
              <Text style={styles.activityTitle}>{activity.title}</Text>
              <Text style={styles.activityTime}>{activity.time}</Text>
            </View>
          ))}
     
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  scrollContent: {
    paddingHorizontal: 16,
    // paddingTop: 16,
    paddingBottom: 80,
  },
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 12,
  },
  activityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  viewAll: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
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
  activityCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 13,
    color: "#9CA3AF",
    fontWeight: "500",
  },
});

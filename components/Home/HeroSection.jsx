import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";


import { C } from "../../constants/colors";

const HeroSection = ({ user, systemStatus }) => {
  const userName = (user?.fullname || "John Anderson")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const isAlert = systemStatus === "alert";
  const isWarning = systemStatus === "warning";

  const statusBg = isAlert
    ? C.red
    : isWarning
    ? "#d97706"
    : C.greenHeader;

  return (
    <View style={[styles.header, { backgroundColor: statusBg }]}>
      <View style={styles.headerTop}>
        <View>
          <Text style={styles.welcomeText}>Welcome back,</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
      </View>

      <View style={styles.statusBanner}>
        <View style={styles.statusIconWrap}>
          <Ionicons
            name={
              isAlert
                ? "warning-outline"
                : isWarning
                ? "alert-circle-outline"
                : "shield-checkmark-outline"
            }
            size={22}
            color={C.white}
          />
        </View>

        <View>
          <Text style={styles.statusTitle}>
            {isAlert
              ? "Anomaly Detected"
              : isWarning
              ? "Attention Required"
              : "All Systems Safe"}
          </Text>

          <Text style={styles.statusSub}>
            {isAlert
              ? "Check recent activity below"
              : isWarning
              ? "Medium severity event detected"
              : "Your property is secure"}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 52,
    paddingBottom: 28,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 20,
  },

  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },

  welcomeText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.85)",
  },

  userName: {
    fontSize: 22,
    color: C.white,
    fontWeight: "700",
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: C.white,
    fontWeight: "700",
  },

  statusBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 14,
    padding: 14,
    gap: 12,
  },

  statusIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.25)",
  },

  statusTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: C.white,
  },

  statusSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
  },
});

export default HeroSection;
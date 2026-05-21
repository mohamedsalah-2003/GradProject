import React from "react";
import { View, Text, StyleSheet, Pressable, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

type Props = {
  name: string;
  role: string;
  email: string;
  phone: string;
};

export default function UserCard({ name, role, email, phone }: Props) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

  const handleEditProfile = () => {
    router.replace("/(app)/profile/editProfileInfo");
  }


  return (
    <View style={styles.card}>
      {/* Cyan top strip */}
      <View style={styles.topStrip} />

      <View style={styles.body}>
        {/* Avatar row */}
        <View style={styles.topRow}>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initials || "U"}</Text>
            </View>
            <View style={styles.onlineDot} />
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={styles.name}>{name}</Text>
            {/* <View style={styles.rolePill}>
              <Text style={styles.roleText}>{role}</Text>
            </View> */}
          </View>

        </View>

        <View style={styles.divider} />


        {/* Email */}
        <View style={styles.infoRow}>
          <View style={styles.infoIconWrap}>
            <Ionicons name="mail-outline" size={16} color="#0891b2" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.infoLabel}>Email address</Text>
            <Text style={styles.infoValue}>{email}</Text>
          </View>
        </View>

        {/* Phone */}
        <View style={[styles.infoRow, { marginBottom: 0 }]}>
          <View style={styles.infoIconWrap}>
            <Ionicons name="call-outline" size={16} color="#0891b2" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.infoLabel}>Phone number</Text>
            <Text style={styles.infoValue}>{phone}</Text>
          </View>
        </View>
        <View style={styles.divider} />
        <View  >
          <TouchableOpacity style={styles.editBtn} onPress={handleEditProfile}>
            <Text style={styles.editBtnText}>Edit your info</Text>
            <Ionicons name="create-outline" size={25} color="#0891b2" />
          </TouchableOpacity>
        </View>
      </View>

    </View >
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E6ECF3",
    shadowColor: "#0891b2",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    overflow: "hidden",
  },
  topStrip: {
    height: 5,
    backgroundColor: "#0891b2",
  },
  body: {
    padding: 16,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatarWrap: {
    position: "relative",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#0891b2",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 18,
    letterSpacing: 1,
  },
  onlineDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#22C55E",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  name: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  rolePill: {
    marginTop: 5,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
    backgroundColor: "#E0F2FE",
  },
  roleText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0891b2",
  },
  editBtn: {
    // width: 36,
    // height: 36,
    padding: 10,

    flex: 1,
    flexDirection: "row",
    gap: 10,
    borderRadius: 10,
    backgroundColor: "#E0F2FE",
    alignItems: "center",
    justifyContent: "center",
  },
  editBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -0.3,
  },
  divider: {
    height: 1,
    backgroundColor: "#E6ECF3",
    marginVertical: 14,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  infoIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#E0F2FE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  infoLabel: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  infoValue: {
    marginTop: 2,
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
});
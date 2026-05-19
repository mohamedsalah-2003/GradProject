import { router } from "expo-router";
import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";

const QuickActionsSection = ({  }) => {
  return (
    <>
      <Text style={styles.title}>Quick Actions</Text>

      <View style={styles.row}>
        <TouchableOpacity style={styles.btn}
        onPress={() => router.push("/(app)/EmergencyContacts/EmergencyContactsScreen")}>
          <Ionicons name="call-outline" size={22} color="red" />
          <Text>Emergency</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn}>
          <Ionicons
            name="notifications-off-outline"
            size={22}
            color="black"
          />
          <Text>Silence</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => router.push("/(app)/devices/devices") }
        >
          <Ionicons
            name="hardware-chip-outline"
            size={22}
            color="black"
          />
          <Text>Devices</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    paddingHorizontal: 20,
  },

  row: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },

  btn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: "#fff",
  },
});

export default QuickActionsSection;
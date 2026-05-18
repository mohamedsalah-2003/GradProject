import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import Ionicons from "react-native-vector-icons/Ionicons";

import ActivityItem from "./ActivityItem";
import { router } from "expo-router";

const RecentActivitySection = ({
  activities
}) => {
  console.log(activities);
  
  return (
    <>
      <View style={styles.header}>
        <Text style={styles.title}>Recent Activity</Text>

        <TouchableOpacity
          style={styles.viewAllBtn}
          onPress={() => router.push("/alerts")}
        >
          <Text style={styles.viewAllText}>View All</Text>

          <Ionicons
            name="chevron-forward"
            size={14}
            color="#22c55e"
          />
        </TouchableOpacity>
      </View>

      {activities?.length > 0 ? (
        activities.map((item, i) => (
          <ActivityItem
            key={item.id || i}
            item={item}
          />
        ))
      ) : (
        <View style={styles.empty}>
          <Text>No recent activity</Text>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 20,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    paddingHorizontal: 20,
  },

  viewAllBtn: {
    flexDirection: "row",
    alignItems: "center",
  },

  viewAllText: {
    color: "#22c55e",
  },

  empty: {
    alignItems: "center",
    paddingVertical: 30,
  },
});

export default RecentActivitySection;
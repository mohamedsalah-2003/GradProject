import React from "react";
import { View, Text, StyleSheet } from "react-native";

import SensorCard from "./SensorCard";
import { SENSORS } from "../../constants/sensors";

const SensorsSection = ({ sensors }) => {
  return (
    <>
      <Text style={styles.sectionTitle}>Sensors</Text>

  <View style={styles.grid}>
  {SENSORS.map((sensor) => {
    const val = sensors?.[sensor.key];

    return (
      <SensorCard
        key={sensor.key}
        sensor={sensor}
        value={val}
      />
    );
  })}
</View>
    </>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    paddingHorizontal: 20,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 24,
  },
});

export default SensorsSection;
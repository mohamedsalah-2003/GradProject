import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";

import { C } from "../../constants/colors";

const { width } = Dimensions.get("window");

const CARD_WIDTH = (width - 48 - 12) / 2;

const SensorCard = ({ sensor, value }) => {
  const display =
    value !== undefined && value !== null
      ? sensor.format(value)
      : "--";

  const hideUnit =
    typeof value === "boolean" ||
    display === "Clear" ||
    display === "Active" ||
    display === "None" ||
    display === "Dry" ||
    display === "Detected";

  return (
    <View style={styles.card}>
      <View
        style={[
          styles.iconWrapper,
          {
            backgroundColor: sensor.bg,
          },
        ]}
      >
        {sensor.icon(sensor.color)}
      </View>

      <Text style={styles.label}>
        {sensor.label}
      </Text>

      <Text style={styles.value}>
        {display}

        {!hideUnit && sensor.unit ? (
          <Text style={styles.unit}>
            {" "}
            {sensor.unit}
          </Text>
        ) : null}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 16,

    borderWidth: 1,
    borderColor: C.border,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.04,
    shadowRadius: 4,

    elevation: 1,
  },

  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 10,
  },

  label: {
    fontSize: 12,
    color: C.textSecondary,
    marginBottom: 4,
  },

  value: {
    fontSize: 18,
    fontWeight: "700",
    color: C.textPrimary,
  },

  unit: {
    fontSize: 13,
    fontWeight: "400",
    color: C.textSecondary,
  },
});

export default SensorCard;
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const filters = ["All", "Critical", "Warning"];

interface Props {
  selected: string;
  onSelect: (value: any) => void;
}
export default function AlertFilter({
  selected,
  onSelect,
}: Props) {
  return (
    <View style={styles.row}>
      {filters.map((filter) => {
        const active = selected === filter;

        return (
          <TouchableOpacity
            key={filter}
            activeOpacity={0.8}
            onPress={() => onSelect(filter)}
            style={[
              styles.button,
              active && styles.activeButton,
            ]}
          >
            <Text
              style={[
                styles.text,
                active && styles.activeText,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
    flexWrap: "wrap",
  },

  button: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#EEF2F7",
  },

  activeButton: {
    backgroundColor: "#0891B2",
  },

  text: {
    color: "#64748B",
    fontWeight: "500",
    fontSize: 13,
  },

  activeText: {
    color: "white",
  },
});
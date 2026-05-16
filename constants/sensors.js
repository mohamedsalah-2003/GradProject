import React from "react";

import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import { C } from "./colors";

export const SENSORS = [
  {
    key: "temp",

    label: "Temperature",

    unit: "°C",

    icon: (color) => (
      <Ionicons
        name="thermometer-outline"
        size={22}
        color={color}
      />
    ),

    color: C.greenDark,

    bg: C.greenBg,

    format: (value) => `${value}`,
  },

  {
    key: "gas",

    label: "Gas Level",

    unit: "ppm",

    icon: (color) => (
      <MaterialCommunityIcons
        name="gas-cylinder"
        size={22}
        color={color}
      />
    ),

    color: C.amber,

    bg: C.amberBg,

    format: (value) => `${value}`,
  },

  {
    key: "smoke",

    label: "Smoke",

    unit: "",

    icon: (color) => (
      <MaterialCommunityIcons
        name="smoke-detector-variant"
        size={22}
        color={color}
      />
    ),

    color: C.textSecondary,

    bg: "#f3f4f6",

    format: (value) =>
      value > 10 ? "Detected" : "Clear",
  },

  {
    key: "motion",

    label: "Motion",

    unit: "",

    icon: (color) => (
      <MaterialCommunityIcons
        name="motion-sensor"
        size={22}
        color={color}
      />
    ),

    color: C.amber,

    bg: C.amberBg,

    format: (value) =>
      value ? "Active" : "None",
  },

  {
    key: "water_flow",

    label: "Water",

    unit: "",

    icon: (color) => (
      <Ionicons
        name="water-outline"
        size={22}
        color={color}
      />
    ),

    color: C.blue,

    bg: C.blueBg,

    format: (value) =>
      value > 0 ? `${value} L/m` : "Dry",
  },

  {
    key: "power",

    label: "Power",

    unit: "W",

    icon: (color) => (
      <MaterialCommunityIcons
        name="lightning-bolt-outline"
        size={22}
        color={color}
      />
    ),

    color: C.purple,

    bg: C.purpleBg,

    format: (value) => `${value}`,
  },
];
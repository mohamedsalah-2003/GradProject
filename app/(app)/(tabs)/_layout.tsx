import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet, Platform } from "react-native";

function TabIcon({
  focused,
  iconFocused,
  icon,
  label,
}: {
  focused: boolean;
  iconFocused: keyof typeof Ionicons.glyphMap;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
}) {
  const activeColor = "#0B84FF";
  const inactiveColor = "#7C8798";

  return (
    <View style={[styles.item, focused && styles.itemActive]}>
      <Ionicons
        name={focused ? iconFocused : icon}
        size={22}
        color={focused ? activeColor : inactiveColor}
      />
      <Text style={[styles.label, { color: focused ? activeColor : inactiveColor }]}>
        {label}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        // نخلي الـ tabBarButton هو اللي ياخد المساحة بدل الـ icon/label الافتراضيين
        tabBarShowLabel: false,

        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon="home-outline"
              iconFocused="home"
              label="Home"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="alerts"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon="notifications-outline"
              iconFocused="notifications"
              label="Alerts"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="devices"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon="hardware-chip-outline"
              iconFocused="hardware-chip"
              label="Devices"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="analytics"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon="bar-chart-outline"
              iconFocused="bar-chart"
              label="Analytics"
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon="person-outline"
              iconFocused="person"
              label="Profile"
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: Platform.OS === "ios" ? 88 : 70,
    paddingTop: 10,
    paddingBottom: Platform.OS === "ios" ? 22 : 10,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E6ECF3",
  },
  tabBarItem: {
    // مهم عشان الـ pill ياخد مساحة مريحة
    paddingHorizontal: 6,
  },
  item: {
    height: 52,
    minWidth: 72,
    paddingHorizontal: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  itemActive: {
    backgroundColor: "#EAF4FF", // نفس تأثير الصورة تقريبًا
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
  },
});
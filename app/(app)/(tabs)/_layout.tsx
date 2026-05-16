import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useAlertsStore } from "../../store/alertsStore";
function TabIcon({
  focused,
  iconFocused,
  icon,
  label,
  badgeCount,
}: {
  focused: boolean;
  iconFocused: keyof typeof Ionicons.glyphMap;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  badgeCount?: number;
}) {
  const activeColor = "#0891b2";
  const inactiveColor = "#7C8798";

  return (
    <View style={[styles.item, focused && styles.itemActive]}>

      {/* ICON WRAPPER */}
      <View style={styles.iconWrapper}>
        <Ionicons
          name={focused ? iconFocused : icon}
          size={22}
          color={focused ? activeColor : inactiveColor}
        />

        {badgeCount !== undefined && badgeCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {badgeCount > 99 ? "99+" : badgeCount}
            </Text>
          </View>
        )}
      </View>

      {/* LABEL */}
      <Text
        style={[
          styles.label,
          { color: focused ? activeColor : inactiveColor },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

export default function TabsLayout() {
  const unreadCount = useAlertsStore((state) => state.unreadCount);
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
  name="dashboard"
  options={{
    tabBarIcon: ({ focused }) => (
      <TabIcon
        focused={focused}
        icon="speedometer-outline"
        iconFocused="speedometer"
        label="Dashboard"
        badgeCount={undefined}
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
              badgeCount={unreadCount}
            />
          ),
        }}
      />



      <Tabs.Screen
        name="homes"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon="home-outline"
              iconFocused="home"
              label="Homes"
              badgeCount={undefined}
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
              badgeCount={undefined}
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
              badgeCount={undefined}
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
    fontSize: 9,
    fontWeight: "600",
  },

  badge: {
    position: "absolute",
    top: -6,
    right: -10,
    backgroundColor: "red",
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },

  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  iconWrapper: {
  position: "relative",
  alignItems: "center",
  justifyContent: "center",
},
});
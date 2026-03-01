export const PROFILE_SETTINGS = [
  {
    key: "notifications",
    title: "Notifications",
    subtitle: "Manage alert preferences",
    type: "link" as const,
    icon: "notifications-outline" as const,
  },
  {
    key: "darkMode",
    title: "Dark Mode",
    subtitle: "Toggle dark theme",
    type: "switch" as const,
    icon: "moon-outline" as const,
  },
  {
    key: "emergency",
    title: "Emergency Contacts",
    subtitle: "Manage your emergency list",
    type: "link" as const,
    icon: "people-outline" as const,
  },
  {
    key: "security",
    title: "Security",
    subtitle: "Password and authentication",
    type: "link" as const,
    icon: "shield-checkmark-outline" as const,
  },
];

export const SYSTEM_INFO = [
  { key: "version", label: "App Version", value: "2.1.0" },
  { key: "status", label: "System Status", value: "Operational", valueType: "status" as const },
  { key: "devices", label: "Connected Devices", value: "6" },
];
import Constants from 'expo-constants';

export const PROFILE_SETTINGS = [
  {
    key: "notifications",
    title: "Notifications",
    subtitle: "Manage alert preferences",
    type: "link" as const,
    icon: "notifications-outline" as const,
  },
  // {
  //   key: "darkMode",
  //   title: "Dark Mode",
  //   subtitle: "Toggle dark theme",
  //   type: "switch" as const,
  //   icon: "moon-outline" as const,
  // },
  {
    key: "emergency-contacts",
    title: "Emergency Contacts",
    subtitle: "Manage your emergency list",
    type: "link" as const,
    icon: "people-outline" as const,
  },
  {
    key: "ChangePassword",
    title: "Change Password",
    subtitle: "Change Password",
    type: "link" as const,
    icon: "shield-checkmark-outline" as const,
  },
];

export const SYSTEM_INFO = [
  { key: "version", label: "App Version", value: Constants.expoConfig?.version ?? "1.0.0" },

];
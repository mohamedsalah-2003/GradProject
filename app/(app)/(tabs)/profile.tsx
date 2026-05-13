import { useRouter } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StatusBar, StyleSheet, View } from "react-native";

import ProfileHeader from "../../../components/profile/ProfileHeader";
import SectionCard from "../../../components/profile/SectionCard";
import SettingRow from "../../../components/profile/SettingRow";
import SignOutButton from "../../../components/profile/SignOutButton";
import SystemInfoCard from "../../../components/profile/SystemInfoCard";
import UserCard from "../../../components/profile/UserCard";

import { PROFILE_SETTINGS, SYSTEM_INFO } from "../../../constants/profile";
import { useAuth } from "../../../context/AuthContext";

export default function Profile() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
   const { user, isAuthReady } = useAuth();

const formatName = (name: string) => {
  if (!name) return "";

  return name
    .split(" ")
    .map((word: string) =>
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(" ");
};

  if (!isAuthReady) return null;

const handlePressSetting = (key: string) => {
    switch (key) {
      case "notifications":
        router.push("/alerts");
        break;
      case "security":
        router.push("/settings/security"); 
        break;
      case "emergency-contacts":
        router.push("/settings/emergency-contacts"); 
        break;
      default:
        console.log("No route defined for:", key);
    }
  };

  const handleSignOut = () => {
    router.replace("/(auth)/login");
  };

  return (
    <ScrollView
      style={[
        styles.screen,
        { backgroundColor: darkMode ? "#0F172A" : "#F8FAFC" },
      ]}
      contentContainerStyle={styles.content}
    >
      <ProfileHeader darkMode={darkMode} />

   <UserCard
  darkMode={darkMode}
  name={formatName(user?.fullname || "") || "User"}
  role={user?.role || "User"}
  email={user?.email || ""}
  phone={user?.phoneNumber || "Not provided"}
/>

      <SectionCard title="Settings" darkMode={darkMode}>
        {PROFILE_SETTINGS.map((item, idx) => (
          <SettingRow
            key={item.key}
            icon={item.icon}
            title={item.title}
            subtitle={item.subtitle}
            type={item.type}
            value={item.key === "darkMode" ? darkMode : undefined}
            onToggle={item.key === "darkMode" ? setDarkMode : undefined}
            onPress={item.type === "link" ? () => handlePressSetting(item.key) : undefined}
            isLast={idx === PROFILE_SETTINGS.length - 1}
            darkMode={darkMode}
          />
        ))}
      </SectionCard>

      <SystemInfoCard darkMode={darkMode} data={SYSTEM_INFO} />

      <View style={{ height: 6 }} />
      <SignOutButton onPress={handleSignOut} darkMode={darkMode} />
      <View style={{ height: 18 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
    
  },
  content: { padding: 16 },
});
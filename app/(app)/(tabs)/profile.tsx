import React, { useState } from "react";
import { ScrollView, StyleSheet, Alert, View } from "react-native";
import { useRouter } from "expo-router";

import ProfileHeader from "../../../components/profile/ProfileHeader";
import UserCard from "../../../components/profile/UserCard";
import SectionCard from "../../../components/profile/SectionCard";
import SettingRow from "../../../components/profile/SettingRow";
import SystemInfoCard from "../../../components/profile/SystemInfoCard";
import SignOutButton from "../../../components/profile/SignOutButton";

import { PROFILE_SETTINGS, SYSTEM_INFO } from "../../../constants/profile";

export default function Profile() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);

  const handlePressSetting = (key: string) => {
    Alert.alert("Pressed", key);
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
        name="John Anderson"
        role="Account Owner"
        email="john.anderson@email.com"
        phone="+1 (555) 123-4567"
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
  screen: { flex: 1 },
  content: { padding: 16 },
});
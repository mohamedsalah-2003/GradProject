import { useRouter } from "expo-router";
import React from "react";
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
  const { user, isAuthReady, logout } = useAuth();

  const formatName = (name: string) => {
    if (!name) return "";
    return name
      .split(" ")
      .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  if (!isAuthReady) return null;

  const handlePressSetting = (key: string) => {
    switch (key) {
      case "notifications":
        router.push("/alerts");
        break;
      case "ChangePassword":
        router.push("/(app)/profile/settings/ChangePassword");
        break;
      case "emergency-contacts":
        router.push("/(app)/EmergencyContacts/ManageEmergencyContactsScreen");
        break;
      default:
        console.log("No route defined for:", key);
    }
  };

  const handleSignOut =async () => {
    await logout();
    router.replace("/(auth)/login");

  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <ProfileHeader />

      <UserCard
        name={formatName(user?.fullname || "") || "User"}
        role={user?.role || "User"}
        email={user?.email || ""}
        phone={user?.phoneNumber || "Not provided"}
      />

      <SectionCard title="Settings">
        {PROFILE_SETTINGS.map((item, idx) => (
          <SettingRow
            key={item.key}
            icon={item.icon}
            title={item.title}
            subtitle={item.subtitle}
            type={item.type}
            onPress={item.type === "link" ? () => handlePressSetting(item.key) : undefined}
            isLast={idx === PROFILE_SETTINGS.length - 1}
          />
        ))}
      </SectionCard>

      <SystemInfoCard data={SYSTEM_INFO} />

      <View style={{ height: 6 }} />
      <SignOutButton onPress={handleSignOut} />
      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    marginTop: StatusBar.currentHeight || 0,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
});
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Linking,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useThemeColor } from "@/hooks/use-theme-color";
import { getEmergencyContacts } from "@/services/emergencyContact.service";

interface Contact {
  _id: string;
  name: string;
  phone: string;
}

// Avatar color palette — assigned by index
const AVATAR_COLORS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#14b8a6", "#3b82f6", "#8b5cf6", "#ec4899",
];

export default function EmergencyContactsScreen() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [callingId, setCallingId] = useState<string | null>(null);

  const tint = "#0590b3";

  // Hardcoded light mode
  const bg = "#f8f8f8";
  const card = "#ffffff";
  const text = "#111111";
  const muted = "#888888";
  const border = "#eeeeee";

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      const data = await getEmergencyContacts();
      console.log(data);
      
      setContacts(data.emergencyContacts);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCall = async (contact: Contact) => {
    setCallingId(contact._id);
    const url = `tel:${contact.phone}`;
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
    setTimeout(() => setCallingId(null), 1500);
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("");

  const renderItem = ({ item, index }: { item: Contact; index: number }) => {
    const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
    const isCalling = callingId === item._id;

    return (
      <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
        {/* Avatar */}
        <View style={[styles.avatar, { backgroundColor: `${color}20` }]}>
          <Text style={[styles.avatarText, { color }]}>{getInitials(item.name)}</Text>
        </View>

        {/* Info */}
        <View style={styles.info}>
          <Text style={[styles.contactName, { color: text }]} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.phoneRow}>
            <Ionicons name="call-outline" size={12} color={muted} />
            <Text style={[styles.phoneText, { color: muted }]}>{item.phone}</Text>
          </View>
        </View>

        {/* Call button */}
        <TouchableOpacity
          style={[
            styles.callBtn,
            { backgroundColor: isCalling ? "#22c55e" : `${color}18` },
          ]}
          onPress={() => handleCall(item)}
          activeOpacity={0.8}
        >
          {isCalling ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="call" size={20} color={color} />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <StatusBar barStyle="dark-content" backgroundColor={bg} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: "#f0f0f0" }]}
        >
          <Ionicons name="chevron-back" size={20} color={text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: text }]}>Emergency Contacts</Text>
          <Text style={[styles.subtitle, { color: muted }]}>
            {contacts.length} contact{contacts.length !== 1 ? "s" : ""}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.manageBtn, { backgroundColor: tint }]}
          onPress={() => router.push("/(app)/EmergencyContacts/ManageEmergencyContactsScreen" as any)}
          activeOpacity={0.85}
        >
          <Ionicons name="settings-outline" size={16} color="#fff" />
          <Text style={styles.manageBtnText}>Manage</Text>
        </TouchableOpacity>
      </View>

      {/* SOS Banner */}
      <View style={[styles.sosBanner, { backgroundColor: "#fff1f1", borderColor: "#fecaca" }]}>
        <View style={styles.sosLeft}>
          <Ionicons name="warning-outline" size={18} color="#ef4444" />
          <Text style={[styles.sosText, { color: "#ef4444" }]}>
            In an emergency, tap any contact to call immediately
          </Text>
        </View>
      </View>

      {/* List */}
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={tint} />
          <Text style={[styles.stateText, { color: muted }]}>Loading contacts…</Text>
        </View>
      ) : contacts.length === 0 ? (
        <View style={styles.center}>
          <View style={[styles.emptyIconWrap, { backgroundColor: "#f0f0f0" }]}>
            <Ionicons name="people-outline" size={32} color={muted} />
          </View>
          <Text style={[styles.stateText, { color: muted }]}>No emergency contacts yet</Text>
          <TouchableOpacity
            style={[styles.addFirstBtn, { backgroundColor: tint }]}
            onPress={() => router.push("/(app)/EmergencyContacts/ManageEmergencyContactsScreen" as any)}
          >
            <Ionicons name="add" size={16} color="#fff" />
            <Text style={styles.addFirstText}>Add a contact</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={contacts}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: (StatusBar.currentHeight || 20) + 8,
    paddingBottom: 14,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  title: { fontSize: 20, fontWeight: "800", letterSpacing: -0.4 },
  subtitle: { fontSize: 12, marginTop: 1 },
  manageBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  manageBtnText: { color: "#fff", fontSize: 13, fontWeight: "600" },

  sosBanner: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginBottom: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1,
  },
  sosLeft: { flexDirection: "row", alignItems: "center", gap: 8, flex: 1 },
  sosText: { fontSize: 12, fontWeight: "500", flex: 1, lineHeight: 17 },

  list: { paddingHorizontal: 16, paddingBottom: 32 },

  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { fontSize: 16, fontWeight: "800" },
  info: { flex: 1, gap: 4 },
  contactName: { fontSize: 15, fontWeight: "700" },
  phoneRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  phoneText: { fontSize: 13 },

  callBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  emptyIconWrap: {
    width: 68,
    height: 68,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  stateText: { fontSize: 14, textAlign: "center" },
  addFirstBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 11,
  },
  addFirstText: { color: "#fff", fontSize: 13, fontWeight: "600" },
});
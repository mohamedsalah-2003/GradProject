import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import AddHomeModal from "@/components/Homes/add-home-modal";
import DeleteHomeModal from "@/components/Homes/delete-home-modal";
import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { getAllHomes } from "@/services/homes.service";
import { TouchableOpacity } from "react-native";

export default function Home() {
  const router = useRouter();
  const [homes, setHomes] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [tokenError, setTokenError] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ visible: false, homeId: null, homeName: null })
  const [addModalVisible, setAddModalVisible] = useState(false);

  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const muted = useThemeColor({}, "icon");
  const border = useThemeColor({}, "border");
  const tint = useThemeColor({}, "tint");

  const fetchHomes = async () => {
    try {
      setIsLoading(true);
      setTokenError(false);
      const data = await getAllHomes();
      setHomes(data.homes || []);
    } catch (err) {
      console.log("Error fetching homes:", err);
      if (err.response?.status === 401) {
        setTokenError(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshToken = () => {
    router.push("/(auth)/login");
  };

  useEffect(() => {
    fetchHomes();
  }, []);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return homes;

    return homes.filter((h) =>
      [h.name, h.location].some((x) => x?.toLowerCase().includes(q))
    );
  }, [query, homes]);

  const handleDeletePress = (homeId, homeName, event) => {
    event.stopPropagation();
    setDeleteModal({ visible: true, homeId, homeName });
  };

  const handleDeleteSuccess = () => {
    setHomes((prev) => prev.filter((h) => h._id !== deleteModal.homeId));
  };

  const handleAddHomeSuccess = (newHome) => {
    setHomes((prev) => [newHome, ...prev]);
  };

  const renderItem = ({ item }) => {
    return (
      <Pressable
        onPress={() => router.push(`/(app)/homes/${item._id}`)}
        style={({ pressed }) => [
          styles.cardPressable,
          pressed && styles.cardPressed,
        ]}
      >
        <View style={[styles.card, { borderColor: border }]}>
          {/* Header */}
          <View style={styles.cardHeader}>
            <View style={[styles.homeIcon, { backgroundColor: `${tint}20` }]}>
              <Ionicons name="home" size={24} color={tint} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.homeName, { color: text }]}>{item.name}</Text>
              <Text style={[styles.homeLocation, { color: muted }]}>
                📍 {item.location}
              </Text>
            </View>

            {/* Delete button with event propagation stopped */}
            <TouchableOpacity
              onPress={(event) => handleDeletePress(item._id, item.name, event)}
              style={styles.deleteButton}
              activeOpacity={0.7}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="trash-outline" size={20} color="#ff3b30" />
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={[styles.footer, { borderTopColor: border }]}>
            <Text style={[styles.footerText, { color: muted }]}>
              Created {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <ThemedView style={[styles.container, { backgroundColor: background }]}>
      {/* Add Home Modal */}
      <AddHomeModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onSuccess={handleAddHomeSuccess}
      />

      {/* Delete Home Modal */}
      <DeleteHomeModal
        visible={deleteModal.visible}
        homeId={deleteModal.homeId}
        homeName={deleteModal.homeName}
        onClose={() => setDeleteModal({ visible: false })}
        onSuccess={handleDeleteSuccess}
      />

      {/* Token Error Banner */}
      {tokenError && (
        <View style={[styles.errorBanner, { backgroundColor: "#ff3b30" }]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.errorText}>Session expired. Please login again.</Text>
          </View>
          <Pressable onPress={handleRefreshToken}>
            <Text style={styles.errorLink}>Login</Text>
          </Pressable>
        </View>
      )}

      {/* Header with Add Button */}
      <View style={[styles.headerRow, { paddingBottom: 12 }]}>
        <View>
          <ThemedText style={[styles.h1, { color: text }]}>
            Homes
          </ThemedText>
          <ThemedText style={{ color: muted }}>
            {homes.length} total
          </ThemedText>
        </View>
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: tint }]}
          onPress={() => setAddModalVisible(true)}
        >
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={[styles.search, { borderColor: border }]}>
        <Ionicons name="search" size={18} color={muted} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Search homes..."
          placeholderTextColor={muted}
          style={{ flex: 1, color: text }}
        />
      </View>

      {/* List */}
      {isLoading ? (
        <View style={styles.centerContent}>
          <Ionicons name="hourglass-outline" size={40} color={muted} />
          <Text style={[styles.loadingText, { color: muted }]}>
            Loading homes...
          </Text>
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.centerContent}>
          <Ionicons name="home-outline" size={40} color={muted} />
          <Text style={[styles.emptyText, { color: muted }]}>
            {query ? "No homes match your search" : "No homes found"}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: StatusBar.currentHeight || 20,
  },

  headerRow: {
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  h1: {
    fontSize: 30,
    fontWeight: "800",
  },

  search: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },

  cardPressable: {
    marginBottom: 12,
  },

  cardPressed: {
    opacity: 0.7,
  },

  card: {
    borderWidth: 1,
    borderRadius: 16,
    overflow: "hidden",
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
  },

  homeIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  homeName: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },

  homeLocation: {
    fontSize: 12,
  },

  deleteButton: {
    padding: 8,
    marginRight: -8,
  },

  addButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
  },

  footerText: {
    fontSize: 11,
    fontWeight: "500",
  },

  errorBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  errorText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
  },

  errorLink: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
    textDecorationLine: "underline",
  },

  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },

  loadingText: {
    fontSize: 14,
    marginTop: 8,
  },

  emptyText: {
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
});

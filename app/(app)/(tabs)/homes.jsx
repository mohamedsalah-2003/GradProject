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
  TouchableOpacity,
} from "react-native";

import AddHomeModal from "@/components/Homes/add-home-modal";
import DeleteHomeModal from "@/components/Homes/delete-home-modal";
import { useThemeColor } from "@/hooks/use-theme-color";
import { getAllHomes } from "@/services/homes.service";
import Loader from "../../../components/ui/Loader";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const router = useRouter();
  const [homes, setHomes] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [tokenError, setTokenError] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ visible: false, homeId: null, homeName: null });
  const [addModalVisible, setAddModalVisible] = useState(false);

  const background = "#F8FAFC"
  const text = "#111111";
  const muted = "#888888";
  const border = "#e5e5e5";
  const tint = "#0590b3";
  const card = "#ffffff";

  const fetchHomes = async () => {
    try {
      setIsLoading(true);
      setTokenError(false);
      const data = await getAllHomes();
      setHomes(data.homes || []);
    } catch (err) {
      console.log("Error fetching homes:", err);
      if (err.response?.status === 401) setTokenError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchHomes(); }, []);

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

  const handleAddHomeSuccess = () => {
    fetchHomes();
  };

  const renderItem = ({ item }) => (
    <Pressable
      onPress={() => router.push(`/(app)/homes/${item._id}`)}
      style={({ pressed }) => [styles.cardPressable, pressed && styles.cardPressed]}
    >
      <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
        <View style={styles.cardTop}>
          {/* Icon */}
          <View style={[styles.iconWrap, { backgroundColor: `${tint}18` }]}>
            <Ionicons name="home-outline" size={22} color={tint} />
          </View>

          {/* Info */}
          <View style={styles.cardInfo}>
            <Text style={[styles.homeName, { color: text }]} numberOfLines={1}>
              {item.name}
            </Text>
            <View style={styles.metaRow}>
              <Ionicons name="location-outline" size={12} color={muted} />
              <Text style={[styles.homeMeta, { color: muted }]} numberOfLines={1}>
                {item.location}
              </Text>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.cardActions}>
            <TouchableOpacity
              onPress={(e) => handleDeletePress(item._id, item.name, e)}
              style={[styles.iconBtn, { backgroundColor: "#ff3b3012" }]}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="trash-outline" size={16} color="#ff3b30" />
            </TouchableOpacity>
            <Ionicons name="chevron-forward" size={16} color={muted} style={{ marginLeft: 6 }} />
          </View>
        </View>

        {/* Footer */}
        <View style={[styles.cardFooter, { borderTopColor: border }]}>
          <View style={styles.footerItem}>
            <Ionicons name="calendar-outline" size={12} color={muted} />
            <Text style={[styles.footerText, { color: muted }]}>
              {new Date(item.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, { backgroundColor: background }]}>
        <AddHomeModal
          visible={addModalVisible}
          onClose={() => setAddModalVisible(false)}
          onSuccess={handleAddHomeSuccess}
        />
        <DeleteHomeModal
          visible={deleteModal.visible}
          homeId={deleteModal.homeId}
          homeName={deleteModal.homeName}
          onClose={() => setDeleteModal({ visible: false })}
          onSuccess={handleDeleteSuccess}
        />

        {/* Token Error Banner */}
        {tokenError && (
          <View style={styles.errorBanner}>
            <Ionicons name="warning-outline" size={16} color="#fff" />
            <Text style={styles.errorText}>Session expired</Text>
            <Pressable onPress={() => router.push("/(auth)/login")} style={styles.errorAction}>
              <Text style={styles.errorActionText}>Login</Text>
            </Pressable>
          </View>
        )}

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: text }]}>Homes</Text>
            <View style={styles.subtitleRow}>
              <Ionicons name="layers-outline" size={13} color={muted} />
              <Text style={[styles.subtitle, { color: muted }]}>{homes.length} total</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.addBtn, { backgroundColor: "#0590b3" }]}
            onPress={() => setAddModalVisible(true)}
            activeOpacity={0.85}
          >
            <Ionicons name="add" size={22} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={[styles.searchBar, { borderColor: border, backgroundColor: `${muted}0A` }]}>
          <Ionicons name="search-outline" size={17} color={muted} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search homes..."
            placeholderTextColor={muted}
            style={[styles.searchInput, { color: text }]}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery("")}>
              <Ionicons name="close-circle" size={17} color={muted} />
            </TouchableOpacity>
          )}
        </View>

        {/* States */}
        {isLoading ? (
          <View style={styles.center}>
            <Loader color="#0590b3" />
          </View>
        ) : filtered.length === 0 ? (
          <View style={styles.center}>
            <View style={[styles.stateIconWrap, { backgroundColor: `${muted}15` }]}>
              <Ionicons name="home-outline" size={28} color={muted} />
            </View>
            <Text style={[styles.stateText, { color: muted }]}>
              {query ? "No homes match your search" : "No homes yet"}
            </Text>
            {!query && (
              <TouchableOpacity
                style={[styles.emptyAction, { backgroundColor: "#0590b3" }]}
                onPress={() => setAddModalVisible(true)}
              >
                <Ionicons name="add" size={16} color="#ffffff" />
                <Text style={styles.emptyActionText}>Add your first home</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={(item) => item._id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 32 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
    safeArea: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: StatusBar.currentHeight || 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
    marginTop: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  subtitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  subtitle: {
    fontSize: 13,
  },
  addBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  cardPressable: {
    marginBottom: 10,
  },
  cardPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.99 }],
  },
  card: {
    borderWidth: 1,
    borderRadius: 14,
    overflow: "hidden",
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
  },
  cardInfo: {
    flex: 1,
    gap: 4,
  },
  homeName: {
    fontSize: 15,
    fontWeight: "700",
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  homeMeta: {
    fontSize: 12,
  },
  cardActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  cardFooter: {
    flexDirection: "row",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderTopWidth: 1,
  },
  footerItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  footerText: {
    fontSize: 11,
    fontWeight: "500",
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#ff3b30",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 12,
  },
  errorText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "500",
    flex: 1,
  },
  errorAction: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 6,
  },
  errorActionText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  stateIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  stateText: {
    fontSize: 14,
    textAlign: "center",
  },
  emptyAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
  },
  emptyActionText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
});
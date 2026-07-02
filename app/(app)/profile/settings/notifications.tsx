import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl } from "react-native";
import { getUserAlerts } from "../../../../services/alert.service";
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { alertColors } from "../../../../constants/alertColors";
import { normalizeAlert } from "@/utils/mapAlert";

export default function NotificationsScreen() {
  const initialData = [
    {
      _id: 'temp-1',
      title: 'High Severity Alert',
      message: 'Unauthorized access detected in Zone A.',
      isRead: false,
      createdAt: new Date().toISOString(),
    },
    {
      _id: 'temp-2',
      title: 'Device Offline',
      message: 'Sensor Node 04 has lost connection.',
      isRead: true,
      createdAt: new Date().toISOString(),
    }
  ];

  const [alerts, setAlerts] = useState<any[]>(initialData);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
  try {
    const response = await getUserAlerts();

  if (response && response.alerts && response.alerts.length > 0) {
    setAlerts(response.alerts); 
    } else if (response && Array.isArray(response)) {
        setAlerts(response);
    } else if (response && response.alerts) {
        setAlerts(response.alerts); 
    }
    
  } catch (error) {
    console.log("Error loading alerts:", error);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const getAlertConfig = (item: any) => {
    const { type } = normalizeAlert(item);
    return alertColors[type];
  };

  const renderAlertIcon = (item: any, color: string) => {
    const { type } = normalizeAlert(item);

    if (item.title?.toLowerCase().includes("gas")) {
      return <Ionicons name="flame" size={24} color={color} />;
    }

    if (type === "Critical") {
      return <MaterialIcons name="error-outline" size={24} color={color} />;
    }

    return <Ionicons name="warning-outline" size={24} color={color} />;
  };

  const renderItem = ({ item }: { item: any }) => {
    const config = getAlertConfig(item);
    const isUnread = !item.isRead;

    return (
    <TouchableOpacity 
      style={[
        styles.notificationCard,
        isUnread && { borderLeftWidth: 4, borderLeftColor: config.primary },
      ]}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.iconContainer,
          isUnread && { backgroundColor: config.iconBg },
        ]}
      >
        {renderAlertIcon(item, isUnread ? config.primary : "#64748B")}
      </View>
      <View style={styles.textContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>{item.title || "New Alert"}</Text>
          <Text style={styles.timeText}>Just now</Text>
        </View>
        <Text style={styles.message} numberOfLines={2}>{item.message}</Text>
      </View>
    </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
    
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity>
          <Text style={styles.markRead}>Mark all as read</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={alerts}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
  
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3B82F6" />
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="mail-open-outline" size={60} color="#334155" />
              <Text style={styles.emptyText}>Everything looks good!</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A", paddingHorizontal: 20, paddingTop: 40 },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 25, 
    alignItems: 'center' 
  },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#fff', letterSpacing: 0.5 },
  markRead: { color: '#3B82F6', fontSize: 14, fontWeight: '600' },
  notificationCard: { 
    flexDirection: 'row', 
    backgroundColor: "#1E293B", 
    padding: 18, 
    borderRadius: 16, 
    marginBottom: 15,
    alignItems: 'center',

    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  iconContainer: { 
    width: 48, height: 48, borderRadius: 14, 
    backgroundColor: '#334155', justifyContent: 'center', alignItems: 'center', marginRight: 15 
  },
  textContainer: { flex: 1 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: '#fff', fontWeight: 'bold', fontSize: 16, maxWidth: '70%' },
  timeText: { color: '#64748B', fontSize: 11 },
  message: { color: '#94A3B8', marginTop: 4, fontSize: 13, lineHeight: 18 },
  emptyContainer: { marginTop: 80, alignItems: 'center', opacity: 0.6 },
  emptyText: { color: '#64748B', fontSize: 16, marginTop: 10 }
});
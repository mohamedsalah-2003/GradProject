import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function RecentActivitySection() {
    const recentActivities = [
        { title: "Motion detected in Garage", time: "5 minutes ago" },
        { title: "Temperature normalized in Living Room", time: "15 minutes ago" },
        { title: "All systems operational", time: "30 minutes ago" },
        { title: "Device check completed", time: "about 1 hour ago" },
    ];
    return (
        <View style={styles.section}>
            <View style={styles.activityHeader}>
                <Text style={styles.sectionTitle}>Recent Activity</Text>
                <TouchableOpacity>
                    <Text style={styles.viewAll}>View All </Text>
                </TouchableOpacity>
            </View>

            {recentActivities.map((activity, index) => (
                <View key={index} style={styles.activityCard}>
                    <Text style={styles.activityTitle}>{activity.title}</Text>
                    <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#1F2937",
        marginBottom: 12,
    },
    activityHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    viewAll: {
        fontSize: 14,
        fontWeight: "600",
        color: "#1F2937",
    },
    activityCard: {
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 16,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    activityTitle: {
        fontSize: 16,
        fontWeight: "600",
        color: "#1F2937",
        marginBottom: 4,
    },
    activityTime: {
        fontSize: 13,
        color: "#9CA3AF",
        fontWeight: "500",
    },
});
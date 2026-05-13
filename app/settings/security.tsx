import React, { useState } from "react";
import { 
  StyleSheet, View, Text, TextInput, TouchableOpacity, 
  Alert, ActivityIndicator, ScrollView 
} from "react-native";
import { useAuth } from "../../context/AuthContext"; 
import { userService } from "../../services/user.service";

export default function Security() {
  const { logout } = useAuth(); 
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!oldPassword || !newPassword) {
      Alert.alert("Validation Error", "Please provide both current and new passwords.");
      return;
    }

    setLoading(true);
    try {
      
      await userService.updatePassword(oldPassword, newPassword);
      
      Alert.alert(
        "Success", 
        "Password has been updated. You will be logged out now.",
        [{ text: "OK", onPress: () => logout() }] 
      );
      
    } catch (error: any) {
      
      const message = error.response?.data?.message || "Something went wrong";
      Alert.alert("Update Failed", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Security</Text>
      <Text style={styles.headerSubtitle}>Password and authentication</Text>

      <View style={styles.formCard}>
        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>Current Password</Text>
          <TextInput 
            style={styles.textInputField} 
            secureTextEntry 
            value={oldPassword} 
            onChangeText={setOldPassword}
            placeholder="Enter current password"
            placeholderTextColor="#64748B"
          />
        </View>

        <View style={styles.inputWrapper}>
          <Text style={styles.inputLabel}>New Password</Text>
          <TextInput 
            style={styles.textInputField} 
            secureTextEntry 
            value={newPassword} 
            onChangeText={setNewPassword}
            placeholder="Enter new password"
            placeholderTextColor="#64748B"
          />
        </View>

        <TouchableOpacity 
          style={styles.submitButton} 
          onPress={handleUpdate} 
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitButtonText}>Update Password</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F172A", padding: 20, paddingTop: 60 },
  headerTitle: { fontSize: 28, fontWeight: "bold", color: "#fff", marginBottom: 4 },
  headerSubtitle: { fontSize: 14, color: "#94A3B8", marginBottom: 32 },
  formCard: { backgroundColor: "#1E293B", padding: 24, borderRadius: 16, elevation: 3 },
  inputWrapper: { marginBottom: 20 },
  inputLabel: { color: "#94A3B8", marginBottom: 8, fontSize: 14, fontWeight: "600" },
  textInputField: { 
    backgroundColor: "#0F172A", color: "#fff", padding: 16, borderRadius: 12, 
    borderWidth: 1, borderColor: "#334155" 
  },
  submitButton: { 
    backgroundColor: "#3B82F6", padding: 18, borderRadius: 12, 
    alignItems: "center", marginTop: 12 
  },
  submitButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 }
});
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { useAuth } from "../../context/AuthContext";
import { userService } from "../../services/user.service";
import Toast from "react-native-toast-message";

const COLORS = {
  background: "#F4F7FB",
  surface: "#FFFFFF",
  text: "#0F172A",
  textSecondary: "#64748B",
  border: "#E2E8F0",
  primary: "#0EA5B7",
  danger: "#EF4444",
};

export default function Security() {
  const router = useRouter();
  const { logout } = useAuth();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = (password: string) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/;

    return passwordRegex.test(password);
  };

const handleUpdate = async () => {
  if (
    !oldPassword.trim() ||
    !newPassword.trim() ||
    !confirmPassword.trim()
  ) {
    Toast.show({
      type: "error",
      text1: "Validation Error",
      text2: "Please fill all required fields.",
    });

    return;
  }

  if (!validatePassword(newPassword)) {
    Toast.show({
      type: "error",
      text1: "Weak Password",
      text2:
        "Use uppercase, lowercase, special character and 8+ characters",
    });

    return;
  }

  if (oldPassword === newPassword) {
    Toast.show({
      type: "error",
      text1: "Invalid Password",
      text2:
        "New password must be different from current password.",
    });

    return;
  }

  if (newPassword !== confirmPassword) {
    Toast.show({
      type: "error",
      text1: "Password Mismatch",
      text2: "Confirm password does not match.",
    });

    return;
  }

  try {
    setLoading(true);

    await userService.updatePassword(
      oldPassword,
      newPassword
    );

    Toast.show({
      type: "success",
      text1: "Password Updated",
      text2: "Please login again.",
      visibilityTime: 2000,
    });

    setTimeout(async () => {
      await logout();

      router.replace("/(auth)/login");
    }, 1800);

  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      "Something went wrong";

    Toast.show({
      type: "error",
      text1: "Update Failed",
      text2: message,
    });

  } finally {
    setLoading(false);
  }
};
  const renderPasswordInput = ({
    label,
    value,
    onChangeText,
    showPassword,
    togglePassword,
    placeholder,
  }: any) => (
    <View style={styles.inputWrapper}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          secureTextEntry={!showPassword}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#94A3B8"
        />

        <Pressable onPress={togglePassword}>
          <Ionicons
            name={
              showPassword
                ? "eye-off-outline"
                : "eye-outline"
            }
            size={20}
            color="#64748B"
          />
        </Pressable>
      </View>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Top Bar */}

      <View style={styles.topBar}>
        <Pressable
          style={({ pressed }) => [
            styles.backButton,
            pressed && { opacity: 0.7 },
          ]}
          onPress={() => router.back()}
        >
          <Ionicons
            name="arrow-back"
            size={22}
            color={COLORS.text}
          />
        </Pressable>
      </View>

      {/* Header */}

      <Text style={styles.headerTitle}>
        Security
      </Text>

      <Text style={styles.headerSubtitle}>
        Update your password and secure your account
      </Text>

      {/* Card */}

      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <Ionicons
            name="shield-checkmark-outline"
            size={28}
            color={COLORS.primary}
          />
        </View>

        <Text style={styles.cardTitle}>
          Change Password
        </Text>

        <Text style={styles.cardSubtitle}>
          Use a strong password to improve
          your account security.
        </Text>

        {renderPasswordInput({
          label: "Current Password",
          value: oldPassword,
          onChangeText: setOldPassword,
          showPassword: showOldPassword,
          togglePassword: () =>
            setShowOldPassword((prev) => !prev),
          placeholder: "Enter current password",
        })}

        {renderPasswordInput({
          label: "New Password",
          value: newPassword,
          onChangeText: setNewPassword,
          showPassword: showNewPassword,
          togglePassword: () =>
            setShowNewPassword((prev) => !prev),
          placeholder: "Enter new password",
        })}

        {renderPasswordInput({
          label: "Confirm New Password",
          value: confirmPassword,
          onChangeText: setConfirmPassword,
          showPassword: showConfirmPassword,
          togglePassword: () =>
            setShowConfirmPassword((prev) => !prev),
          placeholder: "Re-enter new password",
        })}

        {/* Password Rules */}

        <View style={styles.rulesContainer}>
          <Text style={styles.rulesTitle}>
            Password Requirements
          </Text>

          <Text style={styles.rule}>
            • At least 8 characters
          </Text>

          <Text style={styles.rule}>
            • One uppercase letter
          </Text>

          <Text style={styles.rule}>
            • One lowercase letter
          </Text>

          <Text style={styles.rule}>
            • One special character
          </Text>
        </View>

        {/* Submit Button */}

        <Pressable
          style={({ pressed }) => [
            styles.button,
            pressed && {
              transform: [{ scale: 0.98 }],
            },
            loading && {
              opacity: 0.7,
            },
          ]}
          onPress={handleUpdate}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons
                name="lock-closed-outline"
                size={18}
                color="#fff"
              />

              <Text style={styles.buttonText}>
                Update Password
              </Text>
            </>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 40,
  },

  topBar: {
    marginBottom: 16,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",

    alignItems: "center",
    justifyContent: "center",

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 2,
  },

  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: COLORS.text,
    letterSpacing: -1,
  },

  headerSubtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.textSecondary,
    marginTop: 8,
    marginBottom: 28,
  },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 28,
    padding: 24,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: 8,
    },

    elevation: 4,
  },

  iconContainer: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: "#D9F5F8",

    alignItems: "center",
    justifyContent: "center",

    marginBottom: 18,
  },

  cardTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.text,
  },

  cardSubtitle: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.textSecondary,
    marginBottom: 28,
  },

  inputWrapper: {
    marginBottom: 20,
  },

  label: {
    marginBottom: 10,
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
  },

  inputContainer: {
    height: 58,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: "#F8FAFC",

    paddingHorizontal: 16,

    flexDirection: "row",
    alignItems: "center",
  },

  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: 15,
  },

  rulesContainer: {
    backgroundColor: "#F8FAFC",
    borderRadius: 18,
    padding: 16,
    marginTop: 6,
    marginBottom: 24,
  },

  rulesTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 10,
  },

  rule: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 6,
  },

  button: {
    height: 58,
    borderRadius: 18,
    backgroundColor: COLORS.primary,

    alignItems: "center",
    justifyContent: "center",

    flexDirection: "row",
    gap: 10,
  },

  buttonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },
});
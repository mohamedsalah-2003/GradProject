import { createHome } from "@/services/homes.service";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface AddHomeModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddHomeModal({
  visible,
  onClose,
  onSuccess,
}: AddHomeModalProps) {
  const background = "#ffffff";
  const text = "#111111";
  const muted = "#888888";
  const border = "#e5e5e5";
  const tint = "#0590b3";

  const [formData, setFormData] = useState({
    name: "",
    location: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isSubmittingRef = React.useRef(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Home name is required";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddHome = async () => {
    if (isSubmittingRef.current || isLoading) return;
    if (!validateForm()) return;

    try {
      isSubmittingRef.current = true;
      setIsLoading(true);
      setMessage(null);

      await createHome({
        name: formData.name.trim(),
        location: formData.location.trim(),
      });

      setMessage({ text: "Home added successfully!", type: "success" });

      setTimeout(() => {
        resetForm();
        onClose();
        onSuccess?.();
      }, 1500);
    } catch (error: any) {
      setMessage({
        text: error?.response?.data?.message || "Failed to add home",
        type: "error",
      });
    } finally {
      setIsLoading(false);
      isSubmittingRef.current = false;
    }
  };

  const resetForm = () => {
    setFormData({ name: "", location: "" });
    setErrors({});
    setMessage(null);
    isSubmittingRef.current = false;
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const renderInput = (
    label: string,
    placeholder: string,
    field: keyof typeof formData,
    multiline = false
  ) => (
    <View style={styles.fieldContainer}>
      <Text style={[styles.label, { color: text }]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          { borderColor: errors[field] ? "#ff3b30" : border, color: text },
          multiline && { height: 100, textAlignVertical: "top" },
        ]}
        placeholder={placeholder}
        placeholderTextColor={muted}
        value={formData[field]}
        onChangeText={(value) => {
          setFormData((prev) => ({ ...prev, [field]: value }));
          if (errors[field]) {
            setErrors((prev) => {
              const next = { ...prev };
              delete next[field];
              return next;
            });
          }
        }}
        multiline={multiline}
        editable={!isLoading}
      />
      {errors[field] && (
        <Text style={styles.errorText}>{errors[field]}</Text>
      )}
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.overlay}>
          <View style={[styles.sheet, { backgroundColor: background }]}>
            {/* Drag handle */}
            <View style={styles.handle} />

            {/* Header */}
            <View style={[styles.header, { borderBottomColor: border }]}>
              <View style={[styles.headerIcon, { backgroundColor: `${tint}18` }]}>
                <Ionicons name="home-outline" size={18} color={tint} />
              </View>

              <Text style={[styles.title, { color: text }]}>Add New Home</Text>
              <Pressable
                onPress={handleClose}
                disabled={isLoading}
                style={[styles.closeBtn, { backgroundColor: "#f0f0f0" }]}
              >
                <Ionicons name="close" size={18} color={text} />
              </Pressable>
            </View>

            {/* Content */}
            <ScrollView
              style={styles.content}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Message */}
              {message && (
                <View
                  style={[
                    styles.messageBanner,
                    {
                      backgroundColor:
                        message.type === "success" ? "#22c55e18" : "#ff3b3018",
                    },
                  ]}
                >
                  <Ionicons
                    name={
                      message.type === "success"
                        ? "checkmark-circle"
                        : "alert-circle"
                    }
                    size={16}
                    color={message.type === "success" ? "#22c55e" : "#ff3b30"}
                  />
                  <Text
                    style={[
                      styles.messageText,
                      {
                        color:
                          message.type === "success" ? "#22c55e" : "#ff3b30",
                      },
                    ]}
                  >
                    {message.text}
                  </Text>
                </View>
              )}

              {renderInput("Home Name", "e.g., My Villa", "name")}
              {renderInput("Location", "e.g., Cairo, Nasr City", "location")}
            </ScrollView>

            {/* Footer */}
            <View style={[styles.footer, { borderTopColor: border }]}>
              <TouchableOpacity
                style={[styles.cancelBtn, { borderColor: border }]}
                onPress={handleClose}
                disabled={isLoading}
              >
                <Text style={[styles.cancelText, { color: text }]}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.submitBtn,
                  { backgroundColor: tint },
                  isLoading && { opacity: 0.7 },
                ]}
                onPress={handleAddHome}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Ionicons name="add" size={18} color="#fff" />
                    <Text style={styles.submitText}>Add Home</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
    maxHeight: "90%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#d0d0d0",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  headerIcon: {
    width: 34,
    height: 34,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    flex: 1,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  fieldContainer: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 7,
  },
  input: {
    borderWidth: 1,
    borderRadius: 11,
    paddingHorizontal: 13,
    paddingVertical: 11,
    fontSize: 15,
    backgroundColor: "#fafafa",
  },
  errorText: {
    color: "#ff3b30",
    fontSize: 12,
    marginTop: 5,
    fontWeight: "500",
  },
  messageBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderRadius: 11,
    marginBottom: 16,
  },
  messageText: {
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  cancelBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 13,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelText: {
    fontSize: 15,
    fontWeight: "600",
  },
  submitBtn: {
    flex: 2,
    borderRadius: 12,
    paddingVertical: 13,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 7,
  },
  submitText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
import { useThemeColor } from "@/hooks/use-theme-color";
import { addDevice } from "@/services/devices.service";
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

interface AddDeviceModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  homeId?: string;
}

export default function AddDeviceModal({
  visible,
  onClose,
  onSuccess,
  homeId: initialHomeId,
}: AddDeviceModalProps) {
  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const muted = useThemeColor({}, "icon");
  const border = useThemeColor({}, "border");
  const tint = useThemeColor({}, "tint");

  const [formData, setFormData] = useState({
    homeId: initialHomeId || "",
    name: "",
    location: "",
    isActive: true,
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

    if (!formData.homeId.trim()) {
      newErrors.homeId = "Home ID is required";
    }
    if (!formData.name.trim()) {
      newErrors.name = "Device name is required";
    }
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddDevice = async () => {
    // Prevent duplicate submissions
    if (isSubmittingRef.current || isLoading) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      isSubmittingRef.current = true;
      setIsLoading(true);
      setMessage(null);

      const payload = {
        homeId: formData.homeId.trim(),
        name: formData.name.trim(),
        location: formData.location.trim(),
        isActive: formData.isActive,
      };

      await addDevice(payload);

      setMessage({
        text: "Device added successfully! ✅",
        type: "success",
      });

      setTimeout(() => {
        resetForm();
        onClose();
        onSuccess?.();
      }, 1500);
    } catch (error: any) {
      setMessage({
        text: error?.response?.data?.message || "Failed to add device",
        type: "error",
      });
    } finally {
      setIsLoading(false);
      isSubmittingRef.current = false;
    }
  };

  const resetForm = () => {
    setFormData({
      homeId: initialHomeId || "",
      name: "",
      location: "",
      isActive: true,
    });
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
  ) => {
    return (
      <View style={styles.fieldContainer}>
        <Text style={[styles.label, { color: text }]}>{label}</Text>
        <TextInput
          style={[
            styles.input,
            {
              borderColor: errors[field] ? "#ff3b30" : border,
              color: text,
              backgroundColor:
                Platform.OS === "web"
                  ? "rgba(255,255,255,0.05)"
                  : "transparent",
            },
            multiline && { height: 100, textAlignVertical: "top" },
          ]}
          placeholder={placeholder}
          placeholderTextColor={muted}
          value={formData[field] as string}
          onChangeText={(value) => {
            setFormData((prev) => ({ ...prev, [field]: value }));
            if (errors[field]) {
              setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
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
  };

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
        <View
          style={[
            styles.overlay,
            { backgroundColor: "rgba(0,0,0,0.5)" },
          ]}
        >
          <View
            style={[
              styles.modalContainer,
              { backgroundColor: background },
            ]}
          >
            {/* Header */}
            <View
              style={[
                styles.header,
                { borderBottomColor: border },
              ]}
            >
              <Text style={[styles.title, { color: text }]}>
                Add New Device
              </Text>
              <Pressable
                onPress={handleClose}
                disabled={isLoading}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={text} />
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
                    styles.messageContainer,
                    {
                      backgroundColor:
                        message.type === "success"
                          ? "#1DB95420"
                          : "#ff3b3020",
                    },
                  ]}
                >
                  <Ionicons
                    name={
                      message.type === "success"
                        ? "checkmark-circle"
                        : "alert-circle"
                    }
                    size={18}
                    color={
                      message.type === "success" ? "#1DB954" : "#ff3b30"
                    }
                  />
                  <Text
                    style={[
                      styles.messageText,
                      {
                        color:
                          message.type === "success"
                            ? "#1DB954"
                            : "#ff3b30",
                      },
                    ]}
                  >
                    {message.text}
                  </Text>
                </View>
              )}

              {/* Device Name */}
              {renderInput(
                "Device Name",
                "e.g., Living Room Sensor",
                "name"
              )}

              {/* Location */}
              {renderInput(
                "Location",
                "e.g., Living Room",
                "location"
              )}

              {/* Home ID */}
              {renderInput(
                "Home ID",
                "e.g., 6a03a41ca4b1db919bada59a",
                "homeId"
              )}

              {/* Status */}
              <View style={styles.fieldContainer}>
                <Text style={[styles.label, { color: text }]}>Status</Text>
                <View style={styles.statusToggle}>
                  <TouchableOpacity
                    style={[
                      styles.statusButton,
                      {
                        backgroundColor: formData.isActive
                          ? tint
                          : border,
                      },
                    ]}
                    onPress={() =>
                      !isLoading &&
                      setFormData((prev) => ({
                        ...prev,
                        isActive: true,
                      }))
                    }
                    disabled={isLoading}
                  >
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color={formData.isActive ? "#fff" : muted}
                    />
                    <Text
                      style={[
                        styles.statusButtonText,
                        {
                          color: formData.isActive ? "#fff" : text,
                        },
                      ]}
                    >
                      Active
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.statusButton,
                      {
                        backgroundColor: !formData.isActive
                          ? "#ff3b30"
                          : border,
                      },
                    ]}
                    onPress={() =>
                      !isLoading &&
                      setFormData((prev) => ({
                        ...prev,
                        isActive: false,
                      }))
                    }
                    disabled={isLoading}
                  >
                    <Ionicons
                      name="close-circle"
                      size={16}
                      color={!formData.isActive ? "#fff" : muted}
                    />
                    <Text
                      style={[
                        styles.statusButtonText,
                        {
                          color: !formData.isActive ? "#fff" : text,
                        },
                      ]}
                    >
                      Inactive
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>

            {/* Footer */}
            <View
              style={[
                styles.footer,
                { borderTopColor: border },
              ]}
            >
              <TouchableOpacity
                style={[styles.cancelButton, { borderColor: border }]}
                onPress={handleClose}
                disabled={isLoading}
              >
                <Text style={[styles.cancelButtonText, { color: text }]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.addButton,
                  { backgroundColor: tint },
                  isLoading && styles.buttonDisabled,
                ]}
                onPress={handleAddDevice}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Ionicons name="add" size={18} color="#fff" />
                    <Text style={styles.addButtonText}>Add Device</Text>
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
  },

  modalContainer: {
    maxHeight: "90%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },

  title: {
    fontSize: 20,
    fontWeight: "800",
  },

  closeButton: {
    padding: 8,
    marginRight: -8,
  },

  content: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    flex: 1,
  },

  fieldContainer: {
    marginBottom: 18,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },

  errorText: {
    color: "#ff3b30",
    fontSize: 12,
    marginTop: 6,
    fontWeight: "500",
  },

  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    marginBottom: 16,
  },

  messageText: {
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },

  statusToggle: {
    flexDirection: "row",
    gap: 10,
  },

  statusButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
  },

  statusButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },

  footer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
  },

  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  cancelButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },

  addButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },

  addButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  buttonDisabled: {
    opacity: 0.7,
  },
});

import { useThemeColor } from "@/hooks/use-theme-color";
import { deleteDevice } from "@/services/devices.service";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface DeleteDeviceModalProps {
  visible: boolean;
  deviceId?: string;
  deviceName?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function DeleteDeviceModal({
  visible,
  deviceId,
  deviceName,
  onClose,
  onSuccess,
}: DeleteDeviceModalProps) {
  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const muted = useThemeColor({}, "icon");
  const border = useThemeColor({}, "border");

  const [isLoading, setIsLoading] = useState(false);
  const isSubmittingRef = React.useRef(false);

  // Reset state when modal closes
  useEffect(() => {
    if (!visible) {
      isSubmittingRef.current = false;
      setIsLoading(false);
    }
  }, [visible]);

  const handleDelete = async () => {
    if (isSubmittingRef.current || isLoading || !deviceId) {
      return;
    }

    try {
      isSubmittingRef.current = true;
      setIsLoading(true);

      await deleteDevice(deviceId);

      setTimeout(() => {
        isSubmittingRef.current = false;
        setIsLoading(false);
        onClose();
        onSuccess?.();
      }, 800);
    } catch (error: any) {
      console.error("Delete device error:", error);
      isSubmittingRef.current = false;
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      isSubmittingRef.current = false;
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: background }]}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <Ionicons name="trash-outline" size={48} color="#ff3b30" />
          </View>

          {/* Title */}
          <Text style={[styles.title, { color: text }]}>Delete Device?</Text>

          {/* Message */}
          <Text style={[styles.message, { color: muted }]}>
            Are you sure you want to delete{" "}
            <Text style={{ fontWeight: "700", color: text }}>
              {deviceName}
            </Text>
            ? This action cannot be undone.
          </Text>

          {/* Divider */}
          <View style={[styles.divider, { backgroundColor: border }]} />

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton, { borderColor: border }]}
              onPress={handleClose}
              disabled={isLoading}
            >
              <Text style={[styles.cancelButtonText, { color: text }]}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.deleteButton,
                isLoading && styles.buttonDisabled,
              ]}
              onPress={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Ionicons name="trash" size={16} color="#fff" />
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  container: {
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 28,
    alignItems: "center",
    maxWidth: 320,
  },

  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#ff3b3020",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  title: {
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 12,
    textAlign: "center",
  },

  message: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 20,
  },

  divider: {
    height: 1,
    width: "100%",
    marginBottom: 20,
  },

  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },

  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 6,
  },

  cancelButton: {
    borderWidth: 1,
  },

  cancelButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },

  deleteButton: {
    backgroundColor: "#ff3b30",
  },

  deleteButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  buttonDisabled: {
    opacity: 0.7,
  },
});

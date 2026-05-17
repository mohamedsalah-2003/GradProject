import { useThemeColor } from "@/hooks/use-theme-color";
import { createHome } from "@/services/homes.service";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

interface AddHomeModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: (newHome: any) => void;
}

export default function AddHomeModal({
  visible,
  onClose,
  onSuccess,
}: AddHomeModalProps) {
  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const muted = useThemeColor({}, "icon");
  const border = useThemeColor({}, "border");
  const tint = useThemeColor({}, "tint");

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const isSubmittingRef = React.useRef(false);

  // Reset state when modal closes
  useEffect(() => {
    if (!visible) {
      isSubmittingRef.current = false;
      setIsLoading(false);
      setFormData({
        name: "",
        location: "",
      });
      setErrors({});
    }
  }, [visible]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Home name is required";
    }
    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (isSubmittingRef.current || isLoading) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      isSubmittingRef.current = true;
      setIsLoading(true);

      const newHome = await createHome(formData);

      setTimeout(() => {
        isSubmittingRef.current = false;
        setIsLoading(false);
        onClose();
        onSuccess?.(newHome);
      }, 800);
    } catch (error: any) {
      console.error("Create home error:", error);
      isSubmittingRef.current = false;
      setIsLoading(false);
      setErrors({
        submit: error?.response?.data?.message || "Failed to create home",
      });
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
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: background }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: text }]}>Add New Home</Text>
            <TouchableOpacity onPress={handleClose} disabled={isLoading}>
              <Ionicons name="close" size={24} color={text} />
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Name */}
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: text }]}>Home Name *</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: errors.name ? "#ff3b30" : border,
                    color: text,
                  },
                ]}
                placeholder="e.g., My House"
                placeholderTextColor={muted}
                value={formData.name}
                onChangeText={(val) =>
                  setFormData({ ...formData, name: val })
                }
                editable={!isLoading}
              />
              {errors.name && (
                <Text style={styles.errorText}>{errors.name}</Text>
              )}
            </View>

            {/* Location */}
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: text }]}>
                Location *
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: errors.location ? "#ff3b30" : border,
                    color: text,
                  },
                ]}
                placeholder="e.g., Downtown"
                placeholderTextColor={muted}
                value={formData.location}
                onChangeText={(val) =>
                  setFormData({ ...formData, location: val })
                }
                editable={!isLoading}
              />
              {errors.location && (
                <Text style={styles.errorText}>{errors.location}</Text>
              )}
            </View>



            {/* Error Message */}
            {errors.submit && (
              <Text style={styles.errorText}>{errors.submit}</Text>
            )}
          </View>

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
                styles.createButton,
                { backgroundColor: tint },
                isLoading && styles.buttonDisabled,
              ]}
              onPress={handleCreate}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Ionicons name="add" size={16} color="#fff" />
                  <Text style={styles.createButtonText}>Create Home</Text>
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
    justifyContent: "flex-end",
  },

  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    maxHeight: "90%",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: "700",
  },

  form: {
    maxHeight: 400,
    marginBottom: 20,
  },

  formGroup: {
    marginBottom: 16,
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
  },

  textArea: {
    textAlignVertical: "top",
    paddingTop: 10,
  },

  errorText: {
    color: "#ff3b30",
    fontSize: 11,
    marginTop: 4,
  },

  buttonContainer: {
    flexDirection: "row",
    gap: 12,
  },

  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },

  cancelButton: {
    borderWidth: 1,
  },

  cancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },

  createButton: {
    backgroundColor: "#007AFF",
  },

  createButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  buttonDisabled: {
    opacity: 0.6,
  },
});

import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Modal, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { BlurView } from "expo-blur";

export default function GenderField({
  gender,
  setGender,
  errors,
  focusedField,
  setFocusedField,
  clearError,
}) {
  const [open, setOpen] = useState(false);
  const [tempGender, setTempGender] = useState(gender || "");

  const callClearError = () => {
    if (typeof clearError === "function") {
      try {
        clearError("gender");
      } catch {
        clearError();
      }
    }
  };

  const close = () => {
    setOpen(false);
    setFocusedField?.(null);
  };

  const openPicker = () => {
    setTempGender(gender || "");
    setFocusedField?.("gender");
    callClearError();
    setOpen(true);
  };

  const label = gender === "male" ? "Male" : gender === "female" ? "Female" : "";

  // ================== FIELD (shared) ==================
  const Field = (
    <>
      <Text style={s.label}>Gender</Text>

      <Pressable
        onPress={openPicker}
        style={[
          s.inputWrapper,
          errors?.gender && s.inputError,
          focusedField === "gender" && s.inputFocused,
        ]}
        hitSlop={12}
      >
        <View style={s.inner} pointerEvents="none">
          <Ionicons name="male-female-outline" size={20} color="#8A8A8A" />
          <Text style={[s.inputText, { color: gender ? "#111827" : "#8A8A8A" }]}>
            {gender ? label : "Select gender..."}
          </Text>
          <Ionicons name="chevron-down" size={18} color="#8A8A8A" />
        </View>
      </Pressable>

      {!!errors?.gender && <Text style={s.errorText}>{errors.gender}</Text>}
    </>
  );

  // ================== WEB: your blur dropdown ==================
  if (Platform.OS === "web") {
    return (
      <>
        {Field}

        <Modal transparent visible={open} animationType="none" onRequestClose={close}>
          <Pressable style={w.full} onPress={close}>
            <BlurView intensity={80} tint="dark" experimentalBlurMethod="css" style={w.blur} />
            <Pressable style={w.center} onPress={() => {}}>
              <View style={w.card}>
                <Pressable
                  style={w.item}
                  onPress={() => {
                    setGender("male");
                    callClearError();
                    close();
                  }}
                >
                  <Text style={w.itemText}>Male</Text>
                </Pressable>

                <Pressable
                  style={w.item}
                  onPress={() => {
                    setGender("female");
                    callClearError();
                    close();
                  }}
                >
                  <Text style={w.itemText}>Female</Text>
                </Pressable>

                <Pressable style={w.cancelBtn} onPress={close}>
                  <Text style={w.cancelText}>Cancel</Text>
                </Pressable>
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      </>
    );
  }

  // ================== iOS: Spinner Picker (good UX on iOS) ==================
  if (Platform.OS === "ios") {
    return (
      <>
        {Field}

        <Modal transparent visible={open} animationType="fade" onRequestClose={close}>
          <Pressable style={ios.backdrop} onPress={close}>
            <Pressable style={ios.card} onPress={() => {}}>
              <Text style={ios.title}>Select gender</Text>

              <Picker
                selectedValue={tempGender}
                onValueChange={(value) => {
                  setTempGender(value);
                  callClearError();
                }}
              >
                <Picker.Item label="Select gender..." value="" />
                <Picker.Item label="Male" value="male" />
                <Picker.Item label="Female" value="female" />
              </Picker>

              <View style={ios.actions}>
                <Pressable onPress={close} style={ios.btnGhost}>
                  <Text style={ios.btnGhostText}>Cancel</Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    setGender(tempGender);
                    callClearError();
                    close();
                  }}
                  style={ios.btnPrimary}
                >
                  <Text style={ios.btnPrimaryText}>Confirm</Text>
                </Pressable>
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      </>
    );
  }

  // ================== ANDROID: Bottom Sheet List (best look) ==================
  return (
    <>
      {Field}

      <Modal transparent visible={open} animationType="fade" onRequestClose={close}>
        <Pressable style={and.backdrop} onPress={close}>
          <Pressable style={and.sheet} onPress={() => {}}>
            <View style={and.handle} />
            <Text style={and.title}>Select gender</Text>

            <Pressable
              style={[and.item, gender === "male" && and.itemActive]}
              android_ripple={{ color: "#E5E7EB" }}
              onPress={() => {
                setGender("male");
                callClearError();
                close();
              }}
            >
              <Text style={and.itemText}>Male</Text>
              {gender === "male" ? (
                <Ionicons name="checkmark" size={18} color="#0891b2" />
              ) : null}
            </Pressable>

            <Pressable
              style={[and.item, gender === "female" && and.itemActive]}
              android_ripple={{ color: "#E5E7EB" }}
              onPress={() => {
                setGender("female");
                callClearError();
                close();
              }}
            >
              <Text style={and.itemText}>Female</Text>
              {gender === "female" ? (
                <Ionicons name="checkmark" size={18} color="#0891b2" />
              ) : null}
            </Pressable>

            <Pressable style={and.cancelBtn} onPress={close}>
              <Text style={and.cancelText}>Cancel</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const s = StyleSheet.create({
  label: { fontWeight: "600", marginBottom: 8, marginTop: 10 },

  inputWrapper: {
    backgroundColor: "#E5E7EB",
    borderRadius: 16,
    paddingHorizontal: 15,
    height: 55,
    marginBottom: 10,
    justifyContent: "center",
  },

  inner: { flexDirection: "row", alignItems: "center" },
  inputText: { flex: 1, marginLeft: 10, fontSize: 14 },

  inputError: { borderWidth: 1, borderColor: "#DC2626" },
  inputFocused: { borderWidth: 2, borderColor: "#0891b2" },

  errorText: { color: "#DC2626", fontSize: 12, marginBottom: 10, marginTop: 2 },
});

// web styles (زي بتاعتك)
const w = {
  full: { flex: 1 },
  blur: { position: "absolute", width: "100%", height: "100%" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  card: {
    width: 320,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 8,
    boxShadow: "0 10px 30px rgba(0,0,0,0.20)",
  },
  item: { paddingVertical: 14, paddingHorizontal: 16 },
  itemText: { fontSize: 16, color: "#111827" },
  cancelBtn: {
    marginTop: 6,
    paddingVertical: 12,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  cancelText: { fontSize: 14, fontWeight: "700", color: "#6B7280" },
};

const ios = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    padding: 20,
  },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16 },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    color: "#111827",
    textAlign: "center",
  },
  actions: { flexDirection: "row", justifyContent: "space-between", marginTop: 12, gap: 10 },
  btnGhost: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
  },
  btnGhostText: { fontWeight: "700", color: "#111827" },
  btnPrimary: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#0891b2",
    alignItems: "center",
  },
  btnPrimaryText: { fontWeight: "700", color: "#fff" },
});

const and = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingBottom: 14,
    paddingTop: 10,
  },
  handle: {
    width: 42,
    height: 4,
    borderRadius: 999,
    backgroundColor: "#E5E7EB",
    alignSelf: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
    marginBottom: 8,
  },
  item: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  itemActive: {
    backgroundColor: "#F3F4F6",
  },
  itemText: { fontSize: 16, color: "#111827", fontWeight: "600" },
  cancelBtn: {
    marginTop: 6,
    paddingVertical: 14,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  cancelText: { fontSize: 14, fontWeight: "800", color: "#6B7280" },
});
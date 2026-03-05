import { Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  Platform,
  Pressable,
  Text,
  View,
  Modal,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { BlurView } from "expo-blur";

export default function DOBField({
  dob,
  setDob,
  errors,
  focusedField,
  setFocusedField,
  clearError,
}) {
  const [open, setOpen] = useState(false);

  const initialDate = useMemo(() => {
    // dob expected format: YYYY-MM-DD
    if (dob) {
      const parsed = new Date(dob);
      if (!Number.isNaN(parsed.getTime())) return parsed;
    }
    return new Date();
  }, [dob]);

  const [tempDate, setTempDate] = useState(initialDate);

  const formatDate = (dateObj) => {
    const y = dateObj.getFullYear();
    const m = String(dateObj.getMonth() + 1).padStart(2, "0");
    const d = String(dateObj.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const callClearError = () => {
    // supports both: clearError() and clearError("dob")
    if (typeof clearError === "function") {
      try {
        clearError("dob");
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
    callClearError();
    setFocusedField?.("dob");
    setTempDate(initialDate);
    setOpen(true);
  };

  const onChangeMobile = (event, selectedDate) => {
    if (Platform.OS === "android") {
      if (event?.type === "dismissed") return close();
      const d = selectedDate || tempDate;
      setDob(formatDate(d));
      callClearError();
      return close();
    }

    // iOS changes live (when display is spinner)
    if (selectedDate) setTempDate(selectedDate);
  };

  const confirmIOS = () => {
    setDob(formatDate(tempDate));
    callClearError();
    close();
  };

  return (
    <>
      <Text style={dStyles.label}>Date of Birth</Text>

      <Pressable
        onPress={openPicker}
        style={[
          dStyles.inputWrapper,
          errors?.dob && dStyles.inputError,
          focusedField === "dob" && dStyles.inputFocused,
        ]}
        hitSlop={12}
      >
        {/* important: prevent inner items from eating taps on iOS */}
        <View style={dStyles.inner} pointerEvents="none">
          <Ionicons name="calendar-outline" size={20} color="#8A8A8A" />
          <Text style={[dStyles.inputText, { color: dob ? "#111827" : "#8A8A8A" }]}>
            {dob ? dob : "Select date"}
          </Text>
          <Ionicons name="chevron-down" size={18} color="#8A8A8A" />
        </View>
      </Pressable>

      {!!errors?.dob && <Text style={dStyles.errorText}>{errors.dob}</Text>}

      {/* =========================
          MOBILE: iOS + Android
         ========================= */}
      {Platform.OS !== "web" && open && (
        <>
          {/* Android: show native picker directly */}
          {Platform.OS === "android" && (
            <DateTimePicker
              value={tempDate}
              mode="date"
              maximumDate={new Date()}
              display="default"
              onChange={onChangeMobile}
            />
          )}

          {/* iOS: show inside a modal with confirm */}
          {Platform.OS === "ios" && (
            <Modal transparent visible={open} animationType="fade" onRequestClose={close}>
              <Pressable style={iStyles.backdrop} onPress={close}>
                <Pressable style={iStyles.card} onPress={() => {}}>
                  <Text style={iStyles.title}>Select date</Text>

                  <DateTimePicker
                    value={tempDate}
                    mode="date"
                    maximumDate={new Date()}
                    display="spinner"
                    onChange={onChangeMobile}
                  />

                  <View style={iStyles.actions}>
                    <Pressable onPress={close} style={iStyles.btnGhost}>
                      <Text style={iStyles.btnGhostText}>Cancel</Text>
                    </Pressable>

                    <Pressable onPress={confirmIOS} style={iStyles.btnPrimary}>
                      <Text style={iStyles.btnPrimaryText}>Confirm</Text>
                    </Pressable>
                  </View>
                </Pressable>
              </Pressable>
            </Modal>
          )}
        </>
      )}

      {/* =========================
          WEB: blur + input date
         ========================= */}
      {Platform.OS === "web" && (
        <Modal transparent visible={open} animationType="none" onRequestClose={close}>
          <Pressable style={wStyles.full} onPress={close}>
            <BlurView
              intensity={30}
              tint="dark"
              experimentalBlurMethod="css"
              style={wStyles.blur}
            />

            <Pressable style={wStyles.center} onPress={() => {}}>
              <View style={wStyles.card}>
                <Text style={wStyles.cardTitle}>Select date</Text>

                <input
                  type="date"
                  value={dob || ""}
                  max={formatDate(new Date())}
                  onChange={(e) => {
                    setDob(e.target.value);
                    callClearError();
                    close();
                  }}
                  style={wStyles.dateInput}
                />

                <Pressable style={wStyles.cancelBtn} onPress={close}>
                  <Text style={wStyles.cancelText}>Cancel</Text>
                </Pressable>
              </View>
            </Pressable>
          </Pressable>
        </Modal>
      )}
    </>
  );
}

const dStyles = StyleSheet.create({
  label: { fontWeight: "600", marginBottom: 8, marginTop: 10 },

  inputWrapper: {
    backgroundColor: "#E5E7EB",
    borderRadius: 16,
    paddingHorizontal: 15,
    height: 55,
    marginBottom: 10,
    justifyContent: "center",
  },

  inner: {
    flexDirection: "row",
    alignItems: "center",
  },

  inputText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
  },

  inputError: { borderWidth: 1, borderColor: "#DC2626" },
  inputFocused: { borderWidth: 2, borderColor: "#0891b2" },

  errorText: { color: "#DC2626", fontSize: 12, marginBottom: 10, marginTop: 2 },
});

const iStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    color: "#111827",
    textAlign: "center",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
    gap: 10,
  },
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

const wStyles = {
  full: { flex: 1 },
  blur: { position: "absolute", width: "100%", height: "100%" },
  center: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  card: {
    width: 340,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    boxShadow: "0 10px 30px rgba(0,0,0,0.20)",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
    color: "#111827",
  },
  dateInput: {
    width: "90%",
    padding: 12,
    fontSize: 16,
    borderRadius: 10,
    border: "1px solid #E5E7EB",
    outline: "none",
  },
  cancelBtn: {
    marginTop: 6,
    paddingVertical: 12,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  cancelText: { fontSize: 14, fontWeight: "700", color: "#6B7280" },
};
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useThemeColor } from "@/hooks/use-theme-color";
import {
  addEmergencyContact,
  deleteEmergencyContact,
  getEmergencyContacts,
  updateEmergencyContact,
}  from "@/services/emergencyContact.service";


interface Contact {
  _id: string;
  name: string;
  phone: string;
}

const AVATAR_COLORS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#14b8a6", "#3b82f6", "#8b5cf6", "#ec4899",
];

type ModalMode = "add" | "edit";

export default function ManageEmergencyContactsScreen() {
  const router = useRouter();
  const tint = "#0590b3";

  // Hardcoded light mode
  const bg = "#f8f8f8";
  const card = "#ffffff";
  const text = "#111111";
  const muted = "#888888";
  const border = "#eeeeee";

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("add");
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formErrors, setFormErrors] = useState<{ name?: string; phone?: string }>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Delete confirm
  const [deleteTarget, setDeleteTarget] = useState<Contact | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const isSubmitting = useRef(false);

  useEffect(() => { fetchContacts(); }, []);

  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      const data = await getEmergencyContacts();
      setContacts(data.emergencyContacts);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Modal helpers ───────────────────────────────────────────────

  const openAdd = () => {
    setModalMode("add");
    setEditingContact(null);
    setFormName("");
    setFormPhone("");
    setFormErrors({});
    setSaveMessage(null);
    setModalVisible(true);
  };

  const openEdit = (contact: Contact) => {
    setModalMode("edit");
    setEditingContact(contact);
    setFormName(contact.name);
    setFormPhone(contact.phone);
    setFormErrors({});
    setSaveMessage(null);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setEditingContact(null);
    setFormName("");
    setFormPhone("");
    setFormErrors({});
    setSaveMessage(null);
    isSubmitting.current = false;
  };

  const validate = () => {
    const errs: { name?: string; phone?: string } = {};
    if (!formName.trim()) errs.name = "Name is required";
    if (!formPhone.trim()) errs.phone = "Phone number is required";
    else if (!/^\+?[\d\s\-()]{7,}$/.test(formPhone.trim()))
      errs.phone = "Enter a valid phone number";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    if (isSubmitting.current || isSaving) return;
    if (!validate()) return;

    try {
      isSubmitting.current = true;
      setIsSaving(true);
      setSaveMessage(null);

      if (modalMode === "add") {
        const data = await addEmergencyContact({ name: formName.trim(), phone: formPhone.trim() });
        setSaveMessage({ text: "Contact added!", type: "success" });
        setTimeout(() => {
          closeModal();
          fetchContacts();
        }, 1000);
      } else if (editingContact) {
        await updateEmergencyContact(editingContact._id, {
          name: formName.trim(),
          phone: formPhone.trim(),
        });
        setSaveMessage({ text: "Contact updated!", type: "success" });
        setTimeout(() => {
          closeModal();
          fetchContacts();
        }, 1000);
      }
    } catch (err: any) {
      setSaveMessage({
        text: err?.response?.data?.message || "Something went wrong",
        type: "error",
      });
    } finally {
      setIsSaving(false);
      isSubmitting.current = false;
    }
  };

  // ─── Delete ──────────────────────────────────────────────────────

  const handleDelete = async () => {
    if (!deleteTarget || isDeleting) return;
    try {
      setIsDeleting(true);
      await deleteEmergencyContact(deleteTarget._id);
      setContacts((prev) => prev.filter((c) => c._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  // ─── Render ──────────────────────────────────────────────────────

  const getInitials = (name: string) =>
    name.split(" ").slice(0, 2).map((w) => w[0]?.toUpperCase()).join("");

  const renderItem = ({ item, index }: { item: Contact; index: number }) => {
    const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
    return (
      <View style={[styles.card, { backgroundColor: card, borderColor: border }]}>
        <View style={[styles.avatar, { backgroundColor: `${color}20` }]}>
          <Text style={[styles.avatarText, { color }]}>{getInitials(item.name)}</Text>
        </View>
        <View style={styles.info}>
          <Text style={[styles.contactName, { color: text }]} numberOfLines={1}>
            {item.name}
          </Text>
          <View style={styles.phoneRow}>
            <Ionicons name="call-outline" size={12} color={muted} />
            <Text style={[styles.phoneText, { color: muted }]}>{item.phone}</Text>
          </View>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: `${tint}15` }]}
            onPress={() => openEdit(item)}
          >
            <Ionicons name="pencil-outline" size={16} color={tint} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: "#ff3b3012" }]}
            onPress={() => setDeleteTarget(item)}
          >
            <Ionicons name="trash-outline" size={16} color="#ff3b30" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: bg }]}>
      <StatusBar barStyle="dark-content" backgroundColor={bg} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.backBtn, { backgroundColor: "#f0f0f0" }]}
        >
          <Ionicons name="chevron-back" size={20} color={text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: text }]}>Manage Contacts</Text>
          <Text style={[styles.subtitle, { color: muted }]}>
            {contacts.length} contact{contacts.length !== 1 ? "s" : ""}
          </Text>
        </View>
        <TouchableOpacity
          style={[styles.addBtn, { backgroundColor: tint }]}
          onPress={openAdd}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* List */}
      {isLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={tint} />
          <Text style={[styles.stateText, { color: muted }]}>Loading…</Text>
        </View>
      ) : contacts.length === 0 ? (
        <View style={styles.center}>
          <View style={[styles.emptyIconWrap, { backgroundColor: "#f0f0f0" }]}>
            <Ionicons name="people-outline" size={32} color={muted} />
          </View>
          <Text style={[styles.stateText, { color: muted }]}>No contacts yet</Text>
          <TouchableOpacity
            style={[styles.addFirstBtn, { backgroundColor: tint }]}
            onPress={openAdd}
          >
            <Ionicons name="add" size={16} color="#fff" />
            <Text style={styles.addFirstText}>Add first contact</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={contacts}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* ── Add / Edit Modal ── */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={styles.overlay}>
            <View style={[styles.sheet, { backgroundColor: card }]}>
              {/* Handle */}
              <View style={styles.handle} />

              {/* Sheet header */}
              <View style={[styles.sheetHeader, { borderBottomColor: border }]}>
                <View style={[styles.sheetIcon, { backgroundColor: `${tint}18` }]}>
                  <Ionicons
                    name={modalMode === "add" ? "person-add-outline" : "pencil-outline"}
                    size={17}
                    color={tint}
                  />
                </View>
                <Text style={[styles.sheetTitle, { color: text }]}>
                  {modalMode === "add" ? "Add Contact" : "Edit Contact"}
                </Text>
                <TouchableOpacity
                  onPress={closeModal}
                  style={[styles.closeBtn, { backgroundColor: "#f0f0f0" }]}
                  disabled={isSaving}
                >
                  <Ionicons name="close" size={17} color={text} />
                </TouchableOpacity>
              </View>

              {/* Fields */}
              <View style={styles.sheetBody}>
                {saveMessage && (
                  <View
                    style={[
                      styles.messageBanner,
                      {
                        backgroundColor:
                          saveMessage.type === "success" ? "#22c55e18" : "#ff3b3018",
                      },
                    ]}
                  >
                    <Ionicons
                      name={saveMessage.type === "success" ? "checkmark-circle" : "alert-circle"}
                      size={15}
                      color={saveMessage.type === "success" ? "#22c55e" : "#ff3b30"}
                    />
                    <Text
                      style={[
                        styles.messageText,
                        {
                          color: saveMessage.type === "success" ? "#22c55e" : "#ff3b30",
                        },
                      ]}
                    >
                      {saveMessage.text}
                    </Text>
                  </View>
                )}

                {/* Name */}
                <View style={styles.field}>
                  <Text style={[styles.fieldLabel, { color: text }]}>Full Name</Text>
                  <View
                    style={[
                      styles.inputWrap,
                      { borderColor: formErrors.name ? "#ff3b30" : border },
                    ]}
                  >
                    <Ionicons name="person-outline" size={16} color={muted} />
                    <TextInput
                      style={[styles.input, { color: text }]}
                      placeholder="e.g. John Doe"
                      placeholderTextColor={muted}
                      value={formName}
                      onChangeText={(v) => {
                        setFormName(v);
                        if (formErrors.name) setFormErrors((p) => ({ ...p, name: undefined }));
                      }}
                      editable={!isSaving}
                    />
                  </View>
                  {formErrors.name && (
                    <Text style={styles.errText}>{formErrors.name}</Text>
                  )}
                </View>

                {/* Phone */}
                <View style={styles.field}>
                  <Text style={[styles.fieldLabel, { color: text }]}>Phone Number</Text>
                  <View
                    style={[
                      styles.inputWrap,
                      { borderColor: formErrors.phone ? "#ff3b30" : border },
                    ]}
                  >
                    <Ionicons name="call-outline" size={16} color={muted} />
                    <TextInput
                      style={[styles.input, { color: text }]}
                      placeholder="e.g. +1 555 000 0000"
                      placeholderTextColor={muted}
                      value={formPhone}
                      onChangeText={(v) => {
                        setFormPhone(v);
                        if (formErrors.phone) setFormErrors((p) => ({ ...p, phone: undefined }));
                      }}
                      keyboardType="phone-pad"
                      editable={!isSaving}
                    />
                  </View>
                  {formErrors.phone && (
                    <Text style={styles.errText}>{formErrors.phone}</Text>
                  )}
                </View>
              </View>

              {/* Footer */}
              <View style={[styles.sheetFooter, { borderTopColor: border }]}>
                <TouchableOpacity
                  style={[styles.cancelBtn, { borderColor: border }]}
                  onPress={closeModal}
                  disabled={isSaving}
                >
                  <Text style={[styles.cancelText, { color: text }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.saveBtn,
                    { backgroundColor: tint },
                    isSaving && { opacity: 0.7 },
                  ]}
                  onPress={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <>
                      <Ionicons
                        name={modalMode === "add" ? "add" : "checkmark"}
                        size={18}
                        color="#fff"
                      />
                      <Text style={styles.saveText}>
                        {modalMode === "add" ? "Add Contact" : "Save Changes"}
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── Delete Confirm Modal ── */}
      <Modal
        visible={!!deleteTarget}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteTarget(null)}
      >
        <View style={styles.confirmOverlay}>
          <View style={[styles.confirmSheet, { backgroundColor: card }]}>
            <View style={[styles.confirmIconWrap, { backgroundColor: "#ff3b3015" }]}>
              <Ionicons name="trash-outline" size={26} color="#ff3b30" />
            </View>
            <Text style={[styles.confirmTitle, { color: text }]}>Remove Contact</Text>
            <Text style={[styles.confirmBody, { color: muted }]}>
              Remove{" "}
              <Text style={{ color: text, fontWeight: "700" }}>{deleteTarget?.name}</Text>{" "}
              from your emergency contacts?
            </Text>
            <View style={styles.confirmBtns}>
              <TouchableOpacity
                style={[styles.cancelBtn, { borderColor: border, flex: 1 }]}
                onPress={() => setDeleteTarget(null)}
                disabled={isDeleting}
              >
                <Text style={[styles.cancelText, { color: text }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.deleteConfirmBtn, isDeleting && { opacity: 0.7 }]}
                onPress={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Ionicons name="trash-outline" size={16} color="#fff" />
                    <Text style={styles.deleteConfirmText}>Remove</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: (StatusBar.currentHeight || 20) + 8,
    paddingBottom: 14,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  title: { fontSize: 20, fontWeight: "800", letterSpacing: -0.4 },
  subtitle: { fontSize: 12, marginTop: 1 },
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 11,
    justifyContent: "center",
    alignItems: "center",
  },

  list: { paddingHorizontal: 16, paddingBottom: 32 },

  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { fontSize: 16, fontWeight: "800" },
  info: { flex: 1, gap: 4 },
  contactName: { fontSize: 15, fontWeight: "700" },
  phoneRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  phoneText: { fontSize: 13 },
  actions: { flexDirection: "row", gap: 8 },
  actionBtn: {
    width: 34,
    height: 34,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },

  center: { flex: 1, justifyContent: "center", alignItems: "center", gap: 10 },
  emptyIconWrap: {
    width: 68,
    height: 68,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  stateText: { fontSize: 14, textAlign: "center" },
  addFirstBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 11,
  },
  addFirstText: { color: "#fff", fontSize: 13, fontWeight: "600" },

  // Sheet modal
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  sheet: {
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
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  sheetIcon: {
    width: 34,
    height: 34,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  sheetTitle: { fontSize: 16, fontWeight: "700", flex: 1 },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  sheetBody: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 4 },
  messageBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 11,
    marginBottom: 14,
  },
  messageText: { fontSize: 13, fontWeight: "600", flex: 1 },
  field: { marginBottom: 16 },
  fieldLabel: { fontSize: 13, fontWeight: "600", marginBottom: 7 },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderRadius: 11,
    paddingHorizontal: 13,
    paddingVertical: 11,
    backgroundColor: "#fafafa",
  },
  input: { flex: 1, fontSize: 15 },
  errText: { color: "#ff3b30", fontSize: 12, marginTop: 5, fontWeight: "500" },
  sheetFooter: {
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
  cancelText: { fontSize: 15, fontWeight: "600" },
  saveBtn: {
    flex: 2,
    borderRadius: 12,
    paddingVertical: 13,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 7,
  },
  saveText: { color: "#fff", fontSize: 15, fontWeight: "600" },

  // Delete confirm
  confirmOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.45)",
    paddingHorizontal: 32,
  },
  confirmSheet: {
    width: "100%",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    gap: 10,
  },
  confirmIconWrap: {
    width: 60,
    height: 60,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  confirmTitle: { fontSize: 18, fontWeight: "800" },
  confirmBody: { fontSize: 14, textAlign: "center", lineHeight: 20, marginBottom: 8 },
  confirmBtns: { flexDirection: "row", gap: 10, width: "100%" },
  deleteConfirmBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "#ff3b30",
    borderRadius: 12,
    paddingVertical: 13,
  },
  deleteConfirmText: { color: "#fff", fontSize: 15, fontWeight: "600" },
});
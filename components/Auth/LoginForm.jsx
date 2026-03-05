import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import ResponseMessage from "../../components/Auth/responseMessage";
import Loader from "../../components/ui/Loader";

import { signinRequest } from "../../services/auth.service";
import useLoginForm from "../../hooks/Auth/useLoginForm";
import { useAuth } from "../../context/AuthContext";
import { storage } from "../../utils/storage";
import { LogoComponent } from "../ui/logoComponent";

export default function LoginForm() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [serverMessage, setServerMessage] = useState(null);
  const [serverMessageType, setServerMessageType] = useState("success");
  const [isLoading, setIsLoading] = useState(false);

  const { values, setters, ui, errors, actions } = useLoginForm();
  const { setUser } = useAuth();

  const clearServerMessage = () => {
    if (serverMessage) setServerMessage(null);
  };

  const handleSignIn = async () => {
    if (isLoading) return;


    const { ok, payload } = actions.validate();

  

    if (!ok) return;

    try {
      setServerMessage(null);
      setIsLoading(true);

      const res = await signinRequest(payload);

      console.log(res);
      
      setServerMessageType("success");
      setServerMessage(res?.message || "Signed in successfully ✅");

      if (res?.accesstoken) await storage.set("accesstoken", res.accesstoken);
      if (res?.refreshtoken) await storage.set("refreshtoken", res.refreshtoken);

      if (res?.user) {
        setUser(res.user);
        await storage.set("user", JSON.stringify(res.user));
      }

      router.replace("/(app)/(tabs)/home");
    } catch (error) {
      setServerMessageType("error");
      if (error?.response) {
        setServerMessage(error.response.data?.message || "Invalid email or password");
      } else {
        setServerMessage(error?.message || "Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const Content = (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      keyboardDismissMode={Platform.OS === "ios" ? "interactive" : "on-drag"}
      {...(Platform.OS === "ios" ? { automaticallyAdjustKeyboardInsets: true } : {})}
    >
      <View style={styles.iconWrapper}>
        <LogoComponent />
      </View>

      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>Sign in to your AegisIQ account</Text>

      <ResponseMessage message={serverMessage} type={serverMessageType} />

      {/* Email */}
      <Text style={styles.label}>Email</Text>
      <View
        style={[
          styles.inputWrapper,
          errors.email && styles.inputError,
          ui.focusedField === "email" && styles.inputFocused,
        ]}
      >
        <Ionicons name="mail-outline" size={20} color="#8A8A8A" />
        <TextInput
          placeholder="your.email@example.com"
          placeholderTextColor="#8A8A8A"
          style={[styles.input, Platform.OS === "web" && { outline: "none" }]}
          value={values.email}
          onChangeText={(t) => {
            clearServerMessage();
            setters.setEmail(t);
            actions.clearError("email");
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          onFocus={() => ui.setFocusedField("email")}
          onBlur={() => ui.setFocusedField(null)}
        />
      </View>
      {!!errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      {/* Password */}
      <Text style={styles.label}>Password</Text>
      <View
        style={[
          styles.inputWrapper,
          errors.password && styles.inputError,
          ui.focusedField === "password" && styles.inputFocused,
        ]}
      >
        <Ionicons name="lock-closed-outline" size={20} color="#8A8A8A" />
        <TextInput
          placeholder="Enter your password"
          placeholderTextColor="#8A8A8A"
          style={[styles.input, Platform.OS === "web" && { outline: "none" }]}
          value={values.password}
          onChangeText={(t) => {
            clearServerMessage();
            setters.setPassword(t);
            actions.clearError("password");
          }}
          secureTextEntry={ui.secure}
          onFocus={() => ui.setFocusedField("password")}
          onBlur={() => ui.setFocusedField(null)}
        />
        <TouchableOpacity onPress={() => ui.setSecure(!ui.secure)}>
          <Ionicons
            name={ui.secure ? "eye-outline" : "eye-off-outline"}
            size={20}
            color="#8A8A8A"
          />
        </TouchableOpacity>
      </View>
      {!!errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

      <TouchableOpacity disabled={isLoading}>
        <Text style={styles.forgot}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleSignIn}
        disabled={isLoading}
        activeOpacity={0.85}
      >
        {isLoading ? <Loader /> : <Text style={styles.buttonText}>Sign In</Text>}
      </TouchableOpacity>

      <View style={styles.bottomText}>
        <Text style={{ color: "#6B7280" }}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push("/register")} disabled={isLoading}>
          <Text style={styles.signUp}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  // ✅ iOS فقط: KeyboardAvoidingView
  if (Platform.OS === "ios") {
    return (
      <KeyboardAvoidingView
        style={styles.flex}
        behavior="padding"
        keyboardVerticalOffset={insets.top}
      >
        {Content}
      </KeyboardAvoidingView>
    );
  }

  // ✅ Android + Web: ScrollView مباشرة (scroll شغال)
  return <View style={styles.flex}>{Content}</View>;
}

const styles = StyleSheet.create({
  flex: { flex: 1 },

  iconWrapper: { alignSelf: "center", justifyContent: "center", alignItems: "center" },

  content: {
    flexGrow: 1, // ✅ مهم للـ web
    paddingHorizontal: 24,
    paddingBottom: 50,
    paddingTop: 20,
  },

  title: { fontSize: 24, fontWeight: "700", textAlign: "center" },
  subtitle: { textAlign: "center", color: "#6B7280", marginTop: 8, marginBottom: 20 },

  label: { fontWeight: "600", marginBottom: 8, marginTop: 10 },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E5E7EB",
    borderRadius: 16,
    paddingHorizontal: 15,
    height: 55,
    marginBottom: 10,
  },

  input: { flex: 1, marginLeft: 10, borderWidth: 0, underlineColorAndroid: "transparent" },

  inputError: { borderWidth: 1, borderColor: "#DC2626" },
  inputFocused: { borderWidth: 2, borderColor: "#0891b2" },

  errorText: { color: "#DC2626", fontSize: 12, marginBottom: 10, marginTop: 2 },

  forgot: { marginTop: 5, marginBottom: 20, fontWeight: "600", color: "#0891b2" },

  button: {
    backgroundColor: "#0891b2",
    height: 55,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  bottomText: { flexDirection: "row", justifyContent: "center", marginTop: 30 },
  signUp: { fontWeight: "700", color: "#0891b2" },
});
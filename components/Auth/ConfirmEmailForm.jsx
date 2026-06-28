import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
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
import { confirmEmailRequest } from "../../services/auth.service";
import { LogoComponent } from "../ui/logoComponent.jsx";

export default function ConfirmEmailForm() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [focusedField, setFocusedField] = useState(null);
  const [errors, setErrors] = useState({});

  const [serverMessage, setServerMessage] = useState(null);
  const [serverMessageType, setServerMessageType] = useState("success");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeof params.email === "string") {
      setEmail(params.email);
    }
  }, [params.email]);

  const clearServerMessage = () => {
    if (serverMessage) setServerMessage(null);
  };

  const validate = () => {
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!otp.trim()) {
      newErrors.otp = "OTP is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirmEmail = async () => {
    if (isLoading) return;

    const isValid = validate();
    if (!isValid) return;

    try {
      setIsLoading(true);
      setServerMessage(null);

      const payload = {
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
      };

      const res = await confirmEmailRequest(payload);

      setServerMessageType("success");
      setServerMessage(res?.message || "Email confirmed successfully ✅");

      setTimeout(() => {
        router.replace("/login");
      }, 900);
    } catch (error) {
      setServerMessageType("error");

      if (error?.response) {
        setServerMessage(error.response.data?.message || "Invalid OTP");
      } else {
        setServerMessage("Network error, please try again");
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
      {...(Platform.OS === "ios"
        ? { automaticallyAdjustKeyboardInsets: true }
        : {})}
    >
      <View style={styles.iconWrapper}>
        <LogoComponent />
      </View>

      <Text style={styles.title}>Confirm Email</Text>
      <Text style={styles.subtitle}>
        Enter the OTP sent to your registered email
      </Text>

      <ResponseMessage message={serverMessage} type={serverMessageType} />

      <Text style={styles.label}>Email</Text>
      <View
        style={[
          styles.inputWrapper,
          errors.email && styles.inputError,
          focusedField === "email" && styles.inputFocused,
        ]}
      >
        <Ionicons name="mail-outline" size={20} color="#8A8A8A" />

        <TextInput
          placeholder="your.email@example.com"
          placeholderTextColor="#8A8A8A"
          style={[styles.input, Platform.OS === "web" && { outline: "none" }]}
          value={email}
          onChangeText={(text) => {
            clearServerMessage();
            setEmail(text);
            setErrors((prev) => ({ ...prev, email: undefined }));
          }}
          keyboardType="email-address"
          autoCapitalize="none"
          onFocus={() => setFocusedField("email")}
          onBlur={() => setFocusedField(null)}
        />
      </View>
      {!!errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      <Text style={styles.label}>OTP Code</Text>
      <View
        style={[
          styles.inputWrapper,
          errors.otp && styles.inputError,
          focusedField === "otp" && styles.inputFocused,
        ]}
      >
        <Ionicons name="key-outline" size={20} color="#8A8A8A" />

        <TextInput
          placeholder="Enter OTP"
          placeholderTextColor="#8A8A8A"
          style={[styles.input, Platform.OS === "web" && { outline: "none" }]}
          value={otp}
          onChangeText={(text) => {
            clearServerMessage();
            setOtp(text);
            setErrors((prev) => ({ ...prev, otp: undefined }));
          }}
          autoCapitalize="none"
          textContentType="oneTimeCode"
          onFocus={() => setFocusedField("otp")}
          onBlur={() => setFocusedField(null)}
        />
      </View>
      {!!errors.otp && <Text style={styles.errorText}>{errors.otp}</Text>}

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleConfirmEmail}
        disabled={isLoading}
        activeOpacity={0.85}
      >
        {isLoading ? (
          <Loader />
        ) : (
          <Text style={styles.buttonText}>Confirm Email</Text>
        )}
      </TouchableOpacity>

      <View style={styles.bottomText}>
        <Text style={{ color: "#6B7280" }}>Already confirmed? </Text>
        <TouchableOpacity onPress={() => router.push("/login")} disabled={isLoading}>
          <Text style={styles.signUp}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

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

  return <View style={styles.flex}>{Content}</View>;
}

const styles = StyleSheet.create({
  flex: { flex: 1 },

  iconWrapper: {
    alignSelf: "center",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    flexGrow: 1,
    paddingTop: 30,
    paddingHorizontal: 24,
    paddingBottom: 50,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
  },

  subtitle: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 8,
    marginBottom: 20,
  },

  label: {
    fontWeight: "600",
    marginBottom: 8,
    marginTop: 10,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E5E7EB",
    borderRadius: 16,
    paddingHorizontal: 15,
    height: 55,
    marginBottom: 10,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    borderWidth: 0,
    underlineColorAndroid: "transparent",
  },

  inputError: {
    borderWidth: 1,
    borderColor: "#DC2626",
  },

  inputFocused: {
    borderWidth: 2,
    borderColor: "#0891b2",
  },

  errorText: {
    color: "#DC2626",
    fontSize: 12,
    marginBottom: 10,
    marginTop: 2,
  },

  button: {
    backgroundColor: "#0891b2",
    height: 55,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  buttonDisabled: {
    opacity: 0.7,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },

  bottomText: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },

  signUp: {
    fontWeight: "700",
    color: "#0891b2",
  },
});
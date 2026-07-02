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

import DOBField from "../../components/Auth/DOBField.jsx";
import GenderField from "../../components/Auth/GenderField.jsx";
import ResponseMessage from "../../components/Auth/responseMessage";
import Loader from "../../components/ui/Loader";

import { useSafeAreaInsets } from "react-native-safe-area-context";
import useRegisterForm from "../../hooks/Auth/useRegisterForm";
import { signupRequest } from "../../services/auth.service";
import { LogoComponent } from "../ui/logoComponent.jsx";

export default function RegisterForm() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [serverMessage, setServerMessage] = useState(null);
  const [serverMessageType, setServerMessageType] = useState("success");
  const [isLoading, setIsLoading] = useState(false);

  const { values, setters, ui, errors, actions } = useRegisterForm();

  const clearServerMessage = () => {
    if (serverMessage) setServerMessage(null);
  };

  // const handleSignUp = async () => {
  //   if (isLoading) return;

  //   const { ok, payload } = actions.validate();
  //   if (!ok) return;

  //   try {
  //     setIsLoading(true);
  //     await signupRequest(payload);
  //     setServerMessageType("success");
  //     setServerMessage("REGISTER_SUCCESS");
  //   } catch (error) {
  //     setServerMessageType("error");
  //     if (error?.response) {
  //       setServerMessage(error.response.data?.message || "Something went wrong");
  //     } else {
  //       setServerMessage("Network error, please try again");
  //     }
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
const handleSignUp = async () => {
  if (isLoading) return;

  const { ok, payload } = actions.validate();
  if (!ok) return;

  try {
    setIsLoading(true);
    await signupRequest(payload);

    router.push({
      pathname: "/confirm-email",
      params: { email: payload.email },
    });
  } catch (error) {
    setServerMessageType("error");
    if (error?.response) {
      setServerMessage(error.response.data?.message || "Something went wrong");
    } else {
      setServerMessage("Network error, please try again");
    }
  } finally {
    setIsLoading(false);
  }
};
  const FormContent = (
    <ScrollView
      style={styles.flex} // ✅ مهم للـ web
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
      {...(Platform.OS === "ios" ? { automaticallyAdjustKeyboardInsets: true } : {})}
    >
      <View style={styles.iconWrapper}>
        <LogoComponent />
      </View>

      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Sign up for your AegisIQ account</Text>

      {/* Name */}
      <Text style={styles.label}>Name</Text>
      <View style={styles.row}>
        <View style={styles.half}>
          <View
            style={[
              styles.inputWrapper,
              errors.firstname && styles.inputError,
              ui.focusedField === "firstname" && styles.inputFocused,
            ]}
          >
            <Ionicons name="person-outline" size={20} color="#8A8A8A" />
            <TextInput
              placeholder="First Name"
              placeholderTextColor="#8A8A8A"
              style={[styles.input, Platform.OS === "web" && { outline: "none" }]}
              value={values.firstname}
              onChangeText={(t) => {
                clearServerMessage();
                setters.setFirstname(t);
                actions.clearError("firstname");
              }}
              onFocus={() => ui.setFocusedField("firstname")}
              onBlur={() => ui.setFocusedField(null)}
            />
          </View>
          {!!errors.firstname && <Text style={styles.errorText}>{errors.firstname}</Text>}
        </View>

        <View style={styles.half}>
          <View
            style={[
              styles.inputWrapper,
              errors.lastname && styles.inputError,
              ui.focusedField === "lastname" && styles.inputFocused,
            ]}
          >
            <Ionicons name="person-outline" size={20} color="#8A8A8A" />
            <TextInput
              placeholder="Last Name"
              placeholderTextColor="#8A8A8A"
              style={[styles.input, Platform.OS === "web" && { outline: "none" }]}
              value={values.lastname}
              onChangeText={(t) => {
                clearServerMessage();
                setters.setLastname(t);
                actions.clearError("lastname");
              }}
              onFocus={() => ui.setFocusedField("lastname")}
              onBlur={() => ui.setFocusedField(null)}
            />
          </View>
          {!!errors.lastname && <Text style={styles.errorText}>{errors.lastname}</Text>}
        </View>
      </View>

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

      {/* Phone */}
      <Text style={styles.label}>Phone Number</Text>
      <View
        style={[
          styles.inputWrapper,
          errors.phoneNumber && styles.inputError,
          ui.focusedField === "phoneNumber" && styles.inputFocused,
        ]}
      >
        <Ionicons name="call-outline" size={20} color="#8A8A8A" />
        <TextInput
          placeholder="+2010xxxxxxx"
          placeholderTextColor="#8A8A8A"
          style={[styles.input, Platform.OS === "web" && { outline: "none" }]}
          value={values.phoneNumber}
          onChangeText={(t) => {
            clearServerMessage();
            actions.setPhone(t);
          }}
          keyboardType="phone-pad"
          onFocus={() => ui.setFocusedField("phoneNumber")}
          onBlur={() => ui.setFocusedField(null)}
        />
      </View>
      {!!errors.phoneNumber && <Text style={styles.errorText}>{errors.phoneNumber}</Text>}

      {/* DOB */}
      <DOBField
        dob={values.dob}
        setDob={(v) => {
          clearServerMessage();
          setters.setDob(v);
          actions.clearError("dateOfBirth");
        }}
        errors={{ dob: errors.dateOfBirth }}
        focusedField={ui.focusedField}
        setFocusedField={ui.setFocusedField}
        clearError={() => actions.clearError("dateOfBirth")}
      />

      {/* Gender */}
      <GenderField
        gender={values.gender}
        setGender={(v) => {
          clearServerMessage();
          setters.setGender(v);
          actions.clearError("gender");
        }}
        errors={errors}
        focusedField={ui.focusedField}
        setFocusedField={ui.setFocusedField}
        clearError={actions.clearError}
      />

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
          <Ionicons name={ui.secure ? "eye-outline" : "eye-off-outline"} size={20} color="#8A8A8A" />
        </TouchableOpacity>
      </View>
      {!!errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

      {/* Confirm Password */}
      <Text style={styles.label}>Confirm Password</Text>
      <View
        style={[
          styles.inputWrapper,
          errors.confirmPassword && styles.inputError,
          ui.focusedField === "confirmPassword" && styles.inputFocused,
        ]}
      >
        <Ionicons name="lock-closed-outline" size={20} color="#8A8A8A" />
        <TextInput
          placeholder="Re-enter your password"
          placeholderTextColor="#8A8A8A"
          style={[styles.input, Platform.OS === "web" && { outline: "none" }]}
          value={values.confirmPassword}
          onChangeText={(t) => {
            clearServerMessage();
            setters.setConfirmPassword(t);
            actions.clearError("confirmPassword");
          }}
          secureTextEntry={ui.secure}
          onFocus={() => ui.setFocusedField("confirmPassword")}
          onBlur={() => ui.setFocusedField(null)}
        />
        <TouchableOpacity onPress={() => ui.setSecure(!ui.secure)}>
          <Ionicons name={ui.secure ? "eye-outline" : "eye-off-outline"} size={20} color="#8A8A8A" />
        </TouchableOpacity>
      </View>
      {!!errors.confirmPassword && (
        <Text style={styles.errorText}>{errors.confirmPassword}</Text>
      )}

      {/* Response */}
<ResponseMessage
  type={serverMessageType}
  message={serverMessageType === "error" ? serverMessage : null}
/>

      {/* Sign Up */}
      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleSignUp}
        disabled={isLoading}
        activeOpacity={0.85}
      >
        {isLoading ? <Loader /> : <Text style={styles.buttonText}>Sign Up</Text>}
      </TouchableOpacity>

      <View style={styles.bottomText}>
        <Text style={{ color: "#6B7280" }}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push("/login")} disabled={isLoading}>
          <Text style={styles.signUp}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.flex}>
      {Platform.OS === "ios" ? (
        <KeyboardAvoidingView style={styles.flex} behavior="padding"
          keyboardVerticalOffset={insets.top}
        >
          {FormContent}
        </KeyboardAvoidingView>
      ) : (
        FormContent
      )}
    </View>
  );
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
    flexGrow: 1, // ✅ مهم جدًا للـ web
    paddingTop: 30,
    paddingHorizontal: 24,
    paddingBottom: 50,
  },

  title: { fontSize: 24, fontWeight: "700", textAlign: "center", color: "#111827" },
  subtitle: { textAlign: "center", color: "#6B7280", marginTop: 8, marginBottom: 20 },

  label: { fontWeight: "600", marginBottom: 8, marginTop: 10, color: "#111827" },

  row: { flexDirection: "row", gap: 10 },
  half: { flex: 1 },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E5E7EB",
    borderRadius: 16,
    paddingHorizontal: 15,
    height: 55,
    marginBottom: 10,
  },

  input: { flex: 1, marginLeft: 10, borderWidth: 0, underlineColorAndroid: "transparent", color: "#111827" },

  inputError: { borderWidth: 1, borderColor: "#DC2626" },
  inputFocused: { borderWidth: 2, borderColor: "#0891b2" },

  errorText: { color: "#DC2626", fontSize: 12, marginBottom: 10, marginTop: 2 },

  button: {
    backgroundColor: "#0891b2",
    height: 55,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  bottomText: { flexDirection: "row", justifyContent: "center", marginTop: 30 },
  signUp: { fontWeight: "700", color: "#0891b2" },
});
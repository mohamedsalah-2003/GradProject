import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { LogoComponent } from "../../components/ui/logoComponent.jsx";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setrePassword] = useState("");
  const [secure, setSecure] = useState(true);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const router = useRouter();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!repassword.trim()) {
      newErrors.repassword = "Please confirm your password";
    } else if (password !== repassword) {
      newErrors.repassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = () => {
    if (validateForm()) {
      router.push("/home");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Top Icon */}
        <View style={styles.iconWrapper}>
          <LogoComponent />
        </View>

        {/* Title */}
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>
          Sign up for your AegisIQ account
        </Text>

        {/* Name */}
        <Text style={styles.label}>Name</Text>
        <View style={[styles.inputWrapper, errors.name && styles.inputError, focusedField === 'name' && styles.inputFocused]}>
          <Ionicons name="person-outline" size={20} color="#8A8A8A" />
          <TextInput
            placeholder="Your Name"
            placeholderTextColor="#8A8A8A"
            style={[styles.input, Platform.OS === 'web' && { outline: 'none' }]}
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (errors.name) {
                setErrors({ ...errors, name: null });
              }
            }}
            onFocus={() => setFocusedField('name')}
            onBlur={() => setFocusedField(null)}
          />
        </View>
        {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

        {/* Email */}
        <Text style={styles.label}>Email</Text>
        <View style={[styles.inputWrapper, errors.email && styles.inputError, focusedField === 'email' && styles.inputFocused]}>
          <Ionicons name="mail-outline" size={20} color="#8A8A8A" />
          <TextInput
            placeholder="your.email@example.com"
            placeholderTextColor="#8A8A8A"
            style={[styles.input, Platform.OS === 'web' && { outline: 'none' }]}
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              if (errors.email) {
                setErrors({ ...errors, email: null });
              }
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
          />
        </View>
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

        {/* Password */}
        <Text style={styles.label}>Password</Text>
        <View style={[styles.inputWrapper, errors.password && styles.inputError, focusedField === 'password' && styles.inputFocused]}>
          <Ionicons name="lock-closed-outline" size={20} color="#8A8A8A" />
          <TextInput
            placeholder="Enter your password"
            placeholderTextColor="#8A8A8A"
            style={[styles.input, Platform.OS === 'web' && { outline: 'none' }]}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password) {
                setErrors({ ...errors, password: null });
              }
            }}
            secureTextEntry={secure}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField(null)}
          />
          <TouchableOpacity onPress={() => setSecure(!secure)}>
            <Ionicons
              name={secure ? "eye-outline" : "eye-off-outline"}
              size={20}
              color="#8A8A8A"
            />
          </TouchableOpacity>
        </View>
        {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

        {/* rePassword */}
        <Text style={styles.label}>confirm Password</Text>
        <View style={[styles.inputWrapper, errors.repassword && styles.inputError, focusedField === 'repassword' && styles.inputFocused]}>
          <Ionicons name="lock-closed-outline" size={20} color="#8A8A8A" />
          <TextInput
            placeholder="re Enter your password"
            placeholderTextColor="#8A8A8A"
            style={[styles.input, Platform.OS === 'web' && { outline: 'none' }]}
            value={repassword}
            onChangeText={(text) => {
              setrePassword(text);
              if (errors.repassword) {
                setErrors({ ...errors, repassword: null });
              }
            }}
            secureTextEntry={secure}
            onFocus={() => setFocusedField('repassword')}
            onBlur={() => setFocusedField(null)}
          />
          <TouchableOpacity onPress={() => setSecure(!secure)}>
            <Ionicons
              name={secure ? "eye-outline" : "eye-off-outline"}
              size={20}
              color="#8A8A8A"
            />
          </TouchableOpacity>
        </View>
        {errors.repassword && <Text style={styles.errorText}>{errors.repassword}</Text>}

        {/* Sign Up Button */}
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        {/* Already have an account */}
        <View style={styles.bottomText}>
          <Text style={{ color: "#6B7280" }}>
            Already have an account?{" "}
          </Text>
          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={styles.signUp}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {

    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  content: {
    paddingTop: 40,
    paddingHorizontal: 24,
    paddingBottom: 30, // Added padding at the bottom for better spacing
  },
  iconWrapper: {
    alignSelf: "center",
 
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    // marginBottom: 10,
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
    // marginBottom: 30,
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
    underlineColorAndroid: 'transparent',
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
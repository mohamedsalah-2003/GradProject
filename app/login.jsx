import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import SVGComponent from "./../components/icons/sheildsvg.jsx";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secure, setSecure] = useState(true);
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Top Icon */}
        <View style={styles.iconWrapper}>
          <SVGComponent width={32} height={32} color="#fff" />
        </View>

        {/* Title */}
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>
          Sign in to your SafeGuard account
        </Text>

        {/* Email */}
        <Text style={styles.label}>Email</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="mail-outline" size={20} color="#8A8A8A" />
          <TextInput
            placeholder="your.email@example.com"
            placeholderTextColor="#8A8A8A"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Password */}
        <Text style={styles.label}>Password</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="lock-closed-outline" size={20} color="#8A8A8A" />
          <TextInput
            placeholder="Enter your password"
            placeholderTextColor="#8A8A8A"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={secure}
          />
          <TouchableOpacity onPress={() => setSecure(!secure)}>
            <Ionicons
              name={secure ? "eye-outline" : "eye-off-outline"}
              size={20}
              color="#8A8A8A"
            />
          </TouchableOpacity>
        </View>

        {/* Forgot Password */}
        <TouchableOpacity>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>

        {/* Sign In Button */}
        <TouchableOpacity style={styles.button} onPress={() => router.push("/home")}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        {/* Sign Up */}
        <View style={styles.bottomText}>
          <Text style={{ color: "#6B7280" }}>
            Don't have an account?{" "}
          </Text>
          <TouchableOpacity onPress={() => router.push("/register")}>
            <Text style={styles.signUp}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  content: {
    paddingHorizontal: 24,
    marginTop: 60,
  },
  iconWrapper: {
    alignSelf: "center",
    backgroundColor: "#eee",
    // color:"#fff",
    width: 70,
    height: 70,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
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
    marginBottom: 30,
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
  },
  forgot: {
    marginTop: 5,
    marginBottom: 20,
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#000",
    height: 55,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
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
  },
});
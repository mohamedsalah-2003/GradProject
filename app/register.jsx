import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView, // Import ScrollView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import SVGComponent from "./../components/icons/sheildsvg.jsx";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setrePassword] = useState("");
  const [secure, setSecure] = useState(true);
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Top Icon */}
        <View style={styles.iconWrapper}>
          <SVGComponent width={32} height={32} color="#fff" />
        </View>

        {/* Title */}
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>
          Sign up for your SafeGuard account
        </Text>

        {/* Name */}
        <Text style={styles.label}>Name</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="person-outline" size={20} color="#8A8A8A" />
          <TextInput
            placeholder="Your Name"
            placeholderTextColor="#8A8A8A"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
        </View>

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

{/* rePassword */}
        <Text style={styles.label}>confirm Password</Text>
        <View style={styles.inputWrapper}>
          <Ionicons name="lock-closed-outline" size={20} color="#8A8A8A" />
          <TextInput
            placeholder="re Enter your password"
            placeholderTextColor="#8A8A8A"
            style={styles.input}
            value={repassword}
            onChangeText={setrePassword}
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

        {/* Sign Up Button */}
        <TouchableOpacity style={styles.button}>
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
    backgroundColor: "#eee",
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
  button: {
    backgroundColor: "#000",
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
  },
});
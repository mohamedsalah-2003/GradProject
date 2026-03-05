import { SafeAreaView, StyleSheet, View } from "react-native";

import LoginForm from "../../components/Auth/LoginForm.jsx";

export default function Login() {
  return (
    <SafeAreaView style={styles.container}>
      <LoginForm />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  }


});
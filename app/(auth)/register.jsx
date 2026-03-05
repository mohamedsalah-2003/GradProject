import { SafeAreaView, StyleSheet } from "react-native";
import RegisterForm from "../../components/Auth/RegisterForm.jsx";

export default function Register() {
  return (
    <SafeAreaView style={styles.container}>
      <RegisterForm />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
});
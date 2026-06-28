import { SafeAreaView, StyleSheet } from "react-native";
import ConfirmEmailForm from "../../components/Auth/ConfirmEmailForm.jsx";

export default function ConfirmEmail() {
  return (
    <SafeAreaView style={styles.container}>
      <ConfirmEmailForm />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
});
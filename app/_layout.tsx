import { Stack } from "expo-router";
import IconThemeSync from "../components/IconThemeSync";

export default function Layout() {
  return (
    <>
      <IconThemeSync />
      <Stack screenOptions={{ headerShown: false }} />
    </>
  );
}
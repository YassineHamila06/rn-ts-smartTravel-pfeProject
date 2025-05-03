import { Stack } from "expo-router";

export default function LoyaltyProgramLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="rewards-info" options={{ headerShown: false }} />
    </Stack>
  );
}

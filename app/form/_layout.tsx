import { Stack } from "expo-router";

export default function FormLayout() {
  return (
    <Stack>
      <Stack.Screen name="[id]" options={{ headerShown: false }} />
    </Stack>
  );
}
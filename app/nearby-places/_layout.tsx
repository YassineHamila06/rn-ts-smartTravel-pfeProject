import { Stack } from "expo-router";
import React from "react";

export default function NearbyPlacesLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          // Navigation animation to match the app's style
          animation: "slide_from_right",
        }}
      />
    </Stack>
  );
}

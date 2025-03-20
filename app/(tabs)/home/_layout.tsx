import { Stack, useRouter } from "expo-router";
import { Text, TouchableOpacity } from "react-native";

const Stacklayout = () => {
  const router = useRouter();
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#f0f0f0" },
        headerTintColor: "#000000",
        headerTitleStyle: { fontWeight: "regular" },
        // headerLeft: () => <DefaultHeaderLeft />,
        // headerRight: () => <DefaultHeaderRight />,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
};
export default Stacklayout;
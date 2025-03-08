// import DefaultHeaderLeft from "@/Components/Header/DefaultHeaderLeft";
// import DefaultHeaderRight from "@/Components/Header/DefaultHeaderRight";
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
      <Stack.Screen
        name="Signup"
        options={{ headerShown: false, animation: "fade" }}
      />
      <Stack.Screen
        name="Forget"
        options={{ headerShown: false, animation: "fade" }}
      />
      <Stack.Screen
        name="ResetPassword"
        options={{ headerShown: false, animation: "fade" }}
      />
      <Stack.Screen
        name="Login"
        options={{ headerShown: false, animation: "fade" }}
      />
    </Stack>
  );
};
export default Stacklayout;

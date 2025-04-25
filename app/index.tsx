import { useEffect, useState } from "react";
import { Redirect, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View } from "react-native";
import { decodeJWT } from "@/utils/utils";

export default function Index() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      // await AsyncStorage.setItem("userToken", "");
      const userToken = await AsyncStorage.getItem("userToken");

      // Check if we have a token
      if (userToken) {
        // Make sure we also have a userId stored
        const userId = await AsyncStorage.getItem("userId");
        if (!userId) {
          try {
            // Extract userId from token and store it
            const decoded = decodeJWT(userToken);
            if (decoded && decoded.id) {
              await AsyncStorage.setItem("userId", decoded.id);
            }
          } catch (error) {
            console.error("Failed to extract userId from token:", error);
          }
        }
        setIsLogged(true);
      } else {
        setIsLogged(false);
      }

      setIsLoading(false);
    };

    checkLoginStatus();
  }, []);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#46A996",
        }}
      >
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return isLogged ? (
    <Redirect href="/(tabs)/home" />
  ) : (
    <Redirect href="/auth/Login" />
  );
}

import { useEffect, useState } from "react";
import { Redirect, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      // await AsyncStorage.setItem("userToken", "");
      const userToken = await AsyncStorage.getItem("userToken");
      setIsLogged(userToken === "userToken" ? true : false);
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

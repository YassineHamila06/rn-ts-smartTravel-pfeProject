import { StyleSheet, ImageBackground } from "react-native";
import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.push("/auth/Login"); // Navigate to home page after 10 sec
    }, 3000);

    return () => clearTimeout(timeout); // Clear timeout when component unmounts
  }, []);

  return (
    <ImageBackground
      source={require("../assets/images/Splash.png")}
      style={styles.styleBackground}
    />
  );
};

export default Index;

const styles = StyleSheet.create({
  styleBackground: {
    height: "100%",
    width: wp("100%"),
  },
});

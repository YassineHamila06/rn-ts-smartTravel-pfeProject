import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import AsyncStorage from "@react-native-async-storage/async-storage";

const index = () => {
  return (
    <View
      style={{
        backgroundColor: "white",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>hola home</Text>
      <Pressable
        style={{
          backgroundColor: "red",
          paddingHorizontal: wp("7"),
          marginVertical: hp("3"),
          paddingVertical: wp("3"),
          borderRadius: 20,
        }}
        onPress={async () => {
          // console.log("logout");
          await AsyncStorage.setItem("userToken", "");
        }}
      >
        Log out
      </Pressable>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({});

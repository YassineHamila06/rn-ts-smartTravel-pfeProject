import React from "react";
import { Text, TouchableOpacity, StyleSheet, Alert, View } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const AuthButton = ({
  facebook,
  title,
  Logo,
}: {
  facebook?: boolean;
  title?: string;
  Logo?: any;
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.StyledButton,
        {
          backgroundColor: facebook ? "#1877F2" : "white",
        },
      ]}
    >
      {Logo && <Logo />}
      <Text style={[{ color: facebook ? "white" : "black" }]}>{title}</Text>
    </TouchableOpacity>
  );
};
export default AuthButton;

const styles = StyleSheet.create({
  StyledButton: {
    backgroundColor: "white",
    paddingHorizontal: wp("2%"),
    paddingVertical: wp("3%"),
    borderRadius: wp("50%"),
    minWidth: wp("32%"),
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: wp("2%"),
  },
});

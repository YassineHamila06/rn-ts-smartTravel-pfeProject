import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  Pressable,
  ImageBackground,
  Text,
  View,
  Keyboard,
} from "react-native";
import { useRouter } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const ResetPassword = () => {
  const router = useRouter();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSetNewPassword = () => {
    if (newPassword && confirmPassword) {
      if (newPassword === confirmPassword) {
        // Simulate setting a new password
        setMessage("Your password has been reset successfully.");
        setNewPassword("");
        setConfirmPassword("");
        // Navigate to the login screen after resetting the password
        router.push("/auth/Login"); // Adjust to the path for your login screen
      } else {
        setMessage("Passwords do not match. Please try again.");
      }
    } else {
      setMessage("Please fill in both fields.");
    }
  };

  return (
    <Pressable onPress={() => Keyboard.dismiss()}>
      <ImageBackground
        source={require("../../assets/images/signup.jpg")}
        style={styles.sytleBackground}
      >
        <View style={styles.container}>
          <Text style={styles.styleText}>Create New Password</Text>
        </View>
        <View style={styles.styledForm}>
          <TextInput
            placeholder="Enter your new password"
            style={styles.inputstyle}
            value={newPassword}
            onChangeText={(text) => setNewPassword(text)}
            secureTextEntry
          />
          <TextInput
            placeholder="Confirm your new password"
            style={styles.inputstyle}
            value={confirmPassword}
            onChangeText={(text) => setConfirmPassword(text)}
            secureTextEntry
          />
        </View>
        <View style={styles.container2}>
          <Pressable style={styles.button} onPress={handleSetNewPassword}>
            <Text style={styles.buttonText}>Set New Password</Text>
          </Pressable>
        </View>
        {message ? <Text style={styles.messageText}>{message}</Text> : null}
      </ImageBackground>
    </Pressable>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  sytleBackground: {
    height: "100%",
    width: wp("100%"),
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: wp("30%"),
  },
  styleText: {
    fontSize: hp("5%"),
    fontFamily: "Exo2",
    color: "white",
    textAlign: "center",
  },
  inputstyle: {
    width: wp("80%"),
    height: hp("7.5%"),
    backgroundColor: "white",
    borderRadius: wp("3%"),
    paddingHorizontal: wp("5%"),
  },
  styledForm: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp("12%"),
    gap: hp("7%"),
  },
  messageText: {
    fontFamily: "Exo2",
    fontSize: hp("2%"),
    color: "white",
    marginTop: hp("3%"),
    textAlign: "center",
  },
  container2: {
    marginTop: hp("6.5%"),
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: wp("80%"),
    height: hp("7%"),
    backgroundColor: "#46A996",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
  buttonText: {
    fontFamily: "Exo2",
    fontSize: hp("2.5%"),
    color: "white",
  },
});

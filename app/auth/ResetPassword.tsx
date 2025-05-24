import React, { useState } from "react";
import {
  StyleSheet,
  TextInput,
  Pressable,
  ImageBackground,
  Text,
  View,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useResetPasswordMutation } from "@/services/API";

const ResetPassword = () => {
  const router = useRouter();
  const { userId } = useLocalSearchParams(); // Now receiving userId instead of email and code

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const handleSetNewPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setMessage("Please fill in both fields.");
      return;
    }

    if (newPassword.length < 8) {
      setMessage("Password must be at least 8 characters long");
      return;
    }

    if (!/[A-Z]/.test(newPassword)) {
      setMessage("Password must contain at least one uppercase letter");
      return;
    }
    if (!/[0-9]/.test(newPassword)) {
      setMessage("Password must contain at least one number");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match. Please try again.");
      return;
    }

    try {
      const res = await resetPassword({
        userId: String(userId),
        newPassword,
      }).unwrap();

      setMessage("Password reset successfully!");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        router.replace("/auth/Login");
      }, 1500);
    } catch (err: any) {
      console.log("Reset password error:", err);
      setMessage(err?.data?.message || "Something went wrong. Try again.");
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
            onChangeText={setNewPassword}
            secureTextEntry
          />
          <TextInput
            placeholder="Confirm your new password"
            style={styles.inputstyle}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>
        <View style={styles.container2}>
          <Pressable style={styles.button} onPress={handleSetNewPassword}>
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Set New Password</Text>
            )}
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

import {
  StyleSheet,
  TextInput,
  Pressable,
  Keyboard,
  ImageBackground,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useRouter } from "expo-router";
import { useForgotPasswordMutation } from "@/services/API";

const ForgetPassword = () => {
  const router = useRouter();
  const [userMail, setUserMail] = useState("");
  const [message, setMessage] = useState("");

  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const handleResetPassword = async () => {
    if (!userMail) {
      setMessage("Please enter a valid email address.");
      return;
    }

    try {
      await forgotPassword({ email: userMail }).unwrap();
      setMessage("OTP has been sent to your email.");

      // Store email in a temporary variable before clearing
      const emailToSend = userMail;
      // Clear input field
      setUserMail("");

      setTimeout(() => {
        router.push({
          pathname: "/auth/Otp",
          params: { email: emailToSend },
        });
      }, 1000);
    } catch (err: any) {
      console.log("Forgot password error:", err);
      setMessage(err?.data?.message || "Something went wrong. Try again.");
    }
  };

  return (
    <Pressable onPress={() => Keyboard.dismiss()} style={styles.container}>
      <ImageBackground
        source={require("../../assets/images/signup.jpg")}
        style={styles.sytleBackground}
      >
        <View style={styles.innerContainer}>
          <Text style={styles.titleText}>Forgot Password</Text>

          <TextInput
            placeholder="Enter your Email"
            style={styles.inputstyle}
            value={userMail}
            onChangeText={setUserMail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Pressable style={styles.button} onPress={handleResetPassword}>
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Send</Text>
            )}
          </Pressable>

          {message ? <Text style={styles.messageText}>{message}</Text> : null}

          <View style={styles.backLink}>
            <Text style={styles.backText}>Remembered your password?</Text>
            <Pressable onPress={() => router.push("/auth/Login")}>
              <Text style={styles.backLinkText}>Login</Text>
            </Pressable>
          </View>
        </View>
      </ImageBackground>
    </Pressable>
  );
};

export default ForgetPassword;

const styles = StyleSheet.create({
  sytleBackground: {
    height: "100%",
    width: wp("100%"),
  },
  container: {
    flex: 1,
  },
  innerContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp("30%"),
  },
  titleText: {
    fontSize: hp("4.5%"),
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
    marginTop: hp("5%"),
  },
  button: {
    width: wp("80%"),
    height: hp("7%"),
    backgroundColor: "#46A996",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    marginTop: hp("3%"),
  },
  buttonText: {
    fontFamily: "Exo2",
    fontSize: hp("2.5%"),
    color: "white",
  },
  messageText: {
    fontFamily: "Exo2",
    fontSize: hp("2%"),
    color: "white",
    marginTop: hp("3%"),
    textAlign: "center",
  },
  backLink: {
    marginTop: hp("5%"),
    justifyContent: "center",
    alignItems: "center",
  },
  backText: {
    fontSize: hp("1.55%"),
    fontFamily: "Exo2",
    color: "white",
  },
  backLinkText: {
    fontSize: hp("1.55%"),
    fontFamily: "Exo2",
    color: "white",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});

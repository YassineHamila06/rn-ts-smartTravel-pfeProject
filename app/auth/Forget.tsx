import {
  StyleSheet,
  TextInput,
  Pressable,
  Keyboard,
  ImageBackground,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useRouter } from "expo-router";

const ForgetPassword = () => {
  const router = useRouter();
  const [userMail, setUserMail] = useState("");
  const [message, setMessage] = useState("");

  const handleResetPassword = () => {
    if (userMail) {
      // Simulate sending reset password email
      setMessage("Password reset instructions sent to your email.");
      setUserMail("");
      // After sending the email, navigate to the reset password page
      router.push("/auth/ResetPassword"); // Adjust the path to your actual ResetPasswordPage
    } else {
      setMessage("Please enter a valid email address.");
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
            onChangeText={(text) => setUserMail(text)}
          />

          <Pressable style={styles.button} onPress={handleResetPassword}>
            <Text style={styles.buttonText}>Send</Text>
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

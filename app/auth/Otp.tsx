import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useVerifyResetCodeMutation } from "@/services/API";

const OTP = () => {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const inputRefs = useRef<TextInput[]>([]);

  const [verifyResetCode] = useVerifyResetCodeMutation();

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length === 6) {
      setIsLoading(true);
      setErrorMessage("");

      try {
        // Verify the reset code and get the userId
        const response = await verifyResetCode({
          resetCode: enteredOtp,
        }).unwrap();

        // Navigate to reset password with userId
        router.push({
          pathname: "/auth/ResetPassword",
          params: {
            userId: response.userId, // ✅ pass only userId
          },
        });
        
      } catch (err: any) {
        console.log("Verification error:", err);
        setErrorMessage(
          err?.data?.message ||
            "Invalid or expired reset code. Please try again."
        );
      } finally {
        setIsLoading(false);
      }
    } else {
      setErrorMessage("Please enter the full 6-digit code.");
    }
  };

  return (
    <Pressable onPress={() => Keyboard.dismiss()}>
      <ImageBackground
        source={require("../../assets/images/login.jpg")}
        style={styles.sytleBackground}
      >
        <View style={styles.container}>
          <Text style={styles.styleText}>Enter Reset Code</Text>
        </View>

        <View style={styles.otpContainer}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref!)}
              value={digit}
              onChangeText={(text) => handleChange(text, index)}
              keyboardType="number-pad"
              maxLength={1}
              style={styles.otpInput}
              returnKeyType="next"
            />
          ))}
        </View>

        {errorMessage ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}

        <View style={styles.container1}>
          <Pressable>
            <Text style={styles.styleText1}>Resend Reset code?</Text>
          </Pressable>
        </View>

        <View style={styles.container2}>
          <Pressable style={styles.button} onPress={handleSubmit}>
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Verify</Text>
            )}
          </Pressable>
        </View>
      </ImageBackground>
    </Pressable>
  );
};

export default OTP;

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
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: wp("80%"),
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: hp("10%"),
  },
  otpInput: {
    width: wp("10%"),
    height: hp("8%"),
    backgroundColor: "white",
    borderRadius: wp("3%"),
    textAlign: "center",
    fontSize: hp("2.5%"),
  },
  container1: {
    marginTop: hp("7%"),
    justifyContent: "center",
    alignItems: "center",
  },
  styleText1: {
    fontSize: hp("1.55%"),
    fontFamily: "Exo2",
    color: "white",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  container2: {
    marginTop: hp("5%"),
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
  errorText: {
    fontFamily: "Exo2",
    fontSize: hp("2%"),
    color: "#FF6B6B", // Reddish color for error
    marginTop: hp("2%"),
    textAlign: "center",
    paddingHorizontal: wp("5%"),
  },
});

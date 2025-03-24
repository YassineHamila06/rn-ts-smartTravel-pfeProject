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
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useLocalSearchParams, useRouter } from "expo-router";

const { email } = useLocalSearchParams();


const OTP = () => {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<TextInput[]>([]);

  const handleChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length === 6) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        router.push({
            pathname: "/auth/ResetPassword",
            params: {
              email: String(email),
              code: otp.join(""),
            },
          });
          
      }, 1000);
    } else {
      alert("Please enter the full 6-digit code.");
    }
  };

  return (
    <Pressable onPress={() => Keyboard.dismiss()}>
      <ImageBackground
        source={require("../../assets/images/login.jpg")}
        style={styles.sytleBackground}
      >
        <View style={styles.container}>
          <Text style={styles.styleText}>Enter OTP</Text>
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

        <View style={styles.container1}>
          <Pressable>
            <Text style={styles.styleText1}>Resend OTP?</Text>
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
    justifyContent: "center",
    alignItems: "center",
    gap: wp("3%"),
    marginTop: hp("8%"),
  },
  otpInput: {
    width: wp("12%"),
    height: hp("7%"),
    backgroundColor: "white",
    borderRadius: wp("3%"),
    textAlign: "center",
    fontSize: hp("3%"),
    fontWeight: "bold",
  },
  container1: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: hp("4%"),
  },
  styleText1: {
    fontSize: 14,
    color: "#46A996",
  },
  container2: {
    marginTop: hp("4.5%"),
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

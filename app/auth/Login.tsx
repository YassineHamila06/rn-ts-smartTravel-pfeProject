import React, { useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  EyeIcon,
  EyeOffIcon,
  FacebookIcon,
  GoogleIcon,
} from "@/assets/icons/Svg";
import AuthButton from "@/components/AuthButton";
import Input from "@/components/shared/Input";
import { Controller, useForm } from "react-hook-form";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLoginUserMutation } from "@/services/API";

const Login = () => {
  const router = useRouter();
  const handeleSignup = () => {
    router.push("/auth/Signup");
  };
  let [isEyeHidden, setIsEyeHidden] = useState<Boolean>(true);
  const emailRef = React.useRef<TextInput>(null);
  const passwordRef = React.useRef<TextInput>(null);
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [loginUser, { isLoading, isError }] = useLoginUserMutation();

  const onSubmit = async () => {
    const { email, password } = getValues();
    try {
      const response = await loginUser({ email, password }).unwrap();

      if (response?.token) {
        // Store the token for authentication
        await AsyncStorage.setItem("userToken", response.token);

        // Decode the JWT token to get the user ID
        const decoded = JSON.parse(atob(response.token.split(".")[1]));
        // Store the userId for reservation and other features
        await AsyncStorage.setItem("userId", decoded.id);

        // Redirect to home page
        router.replace("/(tabs)/home");
      }
    } catch (err) {
      console.log("Login error:", err || "Something went wrong");
    }
  };
  return (
    <Pressable onPress={() => Keyboard.dismiss()}>
      <ImageBackground
        source={require("../../assets/images/login.jpg")}
        style={styles.sytleBackground}
      >
        <View style={styles.container}>
          <Text style={styles.styleText}>
            {isError ? "Try again!" : "Login"}
          </Text>
        </View>
        <View style={styles.styledForm}>
          <Controller
            control={control}
            name="email"
            rules={{
              required: "This field is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Please enter a valid email",
              },
            }}
            render={() => (
              <Input
                ref={emailRef}
                onSubmitEditing={() => {
                  passwordRef.current?.focus();
                }}
                control={control}
                name="email"
                placeholder={"Enter your email"}
                errors={errors}
                style={styles.valueInput}
                rules={undefined}
                width={50}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            rules={{
              required: "This field is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters long",
              },
              validate: {
                hasUppercase: (value) =>
                  /[A-Z]/.test(value) ||
                  "Password must contain at least one uppercase letter",
                hasNumber: (value) =>
                  /\d/.test(value) ||
                  "Password must contain at least one number",
              },
            }}
            render={() => (
              <View>
                <Input
                  ref={passwordRef}
                  control={control}
                  name="password"
                  placeholder={"Enter your password"}
                  errors={errors}
                  style={styles.valueInput}
                  rules={undefined}
                  secureTextEntry={isEyeHidden ? true : false}
                  width={50}
                />
                <TouchableOpacity
                  onPress={() => setIsEyeHidden(!isEyeHidden)}
                  style={styles.styledPasswordIcon}
                >
                  {isEyeHidden ? <EyeOffIcon /> : <EyeIcon />}
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
        <View style={styles.container1}>
          <Pressable onPress={() => router.replace("/auth/Forget")}>
            <Text style={styles.styleText1}>Forget password ?</Text>
          </Pressable>
        </View>
        <View style={styles.container2}>
          <Pressable style={styles.button} onPress={handleSubmit(onSubmit)}>
            {/* <Pressable style={styles.button} onPress={onSubmit}> */}
            {isLoading ? (
              <ActivityIndicator />
            ) : (
              <Text style={styles.buttonText}>login</Text>
            )}
          </Pressable>
        </View>

        <View style={styles.container4}>
          <Text style={styles.styleText2}>Don't have an account? </Text>
          <Pressable style={{ padding: wp("3%") }} onPress={handeleSignup}>
            <Text style={styles.styleText3}>Sign up</Text>
          </Pressable>
        </View>
      </ImageBackground>
    </Pressable>
  );
};

export default Login;

const styles = StyleSheet.create({
  sytleBackground: {
    height: "100%",
    width: wp("100%"),
  },
  styledPasswordIcon: {
    position: "absolute",
    right: wp("5%"),
    top: hp("2.6%"),
    opacity: 0.5,
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: wp("30%"),
  },
  valueInput: {
    width: wp("80%"),
    height: hp("7.5%"),
    backgroundColor: "white",
    borderRadius: wp("3%"),
    paddingHorizontal: wp("5%"),
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
    marginTop: hp("7%"),
    gap: hp("4%"),
  },
  container1: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    width: wp("150%"), // Ensure it takes up the full width to the right si
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
  container3: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  container4: {
    marginTop: hp("7%"),
    justifyContent: "center",
    alignItems: "center",
  },
  styleText3: {
    fontSize: hp("1.55%"),
    fontFamily: "Exo2",
    color: "white",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  styleText2: {
    fontSize: hp("1.55%"),
    fontFamily: "Exo2",
    color: "white",
  },
  // Google Button Style
  googleButton: {
    width: "80%",
    height: 50,
    backgroundColor: "#4285F4", // Google Blue
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    flexDirection: "row",
    marginTop: 20,
  },
  googleButtonText: {
    fontSize: 18,
    color: "white",
    marginLeft: 10,
  },

  // Facebook Button Style
  facebookButton: {
    width: "80%",
    height: 50,
    backgroundColor: "#3b5998", // Facebook Blue
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    flexDirection: "row",
    marginTop: 20,
  },
  facebookButtonText: {
    fontSize: 18,
    color: "white",
    marginLeft: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: wp("5%"),
    width: wp("100%"),
    marginTop: hp("4%"),
  },
});

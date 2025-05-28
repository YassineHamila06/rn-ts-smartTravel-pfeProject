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
import { useSignupUserMutation } from "@/services/API";
import { EyeIcon, EyeOffIcon } from "@/assets/icons/Svg";

const Signup = () => {
  const router = useRouter();
  const [userMail, setUserMail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [isEyeHidden, setIsEyeHidden] = useState(true);

  const [signupUser, { isLoading, isError }] = useSignupUserMutation();

  const handleSubmit = async () => {
    if (!userMail || !userPassword || !userName || !userLastName) {
      alert("Please fill in all fields");
      return;
    }

    //cntrl sur name , last name
    const lettersOnlyRegex = /^[A-Za-z]+$/;
    if (!lettersOnlyRegex.test(userName)) {
      alert("Name must contain only letters");
      return;
    }

    if (!lettersOnlyRegex.test(userLastName)) {
      alert("Last name must contain only letters");
      return;
    }

    // cntrl sur password
    if (userPassword.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }

    if (!/[A-Z]/.test(userPassword)) {
      alert("Password must contain at least one uppercase letter");
      return;
    }
    if (!/[0-9]/.test(userPassword)) {
      alert("Password must contain at least one number");
      return;
    }

    try {
      const res = await signupUser({
        name: userName,
        lastname: userLastName,
        email: userMail,
        password: userPassword,
      }).unwrap();

      console.log("Signup successful:", res);
      alert("Account created successfully! Please log in.");
      router.replace("/auth/Login");
    } catch (err: any) {
      console.log("Signup error (full):", err);
      alert(err?.data?.message || "Signup failed. Please try again.");
    }
  };

  return (
    <Pressable onPress={() => Keyboard.dismiss()}>
      <ImageBackground
        source={require("../../assets/images/signup.jpg")}
        style={styles.sytleBackground}
      >
        <View style={styles.container}>
          <Text style={styles.styleText}>Create Account</Text>
        </View>
        <View style={styles.styledForm}>
          <TextInput
            placeholder="Enter your Name"
            style={styles.inputstyle}
            value={userName}
            onChangeText={setUserName}
          />
          <TextInput
            placeholder="Enter your Last Name"
            style={styles.inputstyle}
            value={userLastName}
            onChangeText={setUserLastName}
          />
          <TextInput
            placeholder="Enter your Email"
            style={styles.inputstyle}
            value={userMail}
            onChangeText={setUserMail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <View style={{ position: "relative", width: wp("80%") }}>
            <TextInput
              placeholder="Enter your Password"
              style={styles.inputstyle}
              value={userPassword}
              onChangeText={setUserPassword}
              secureTextEntry={isEyeHidden}
            />
            <Pressable
              onPress={() => setIsEyeHidden(!isEyeHidden)}
              style={styles.styledPasswordIcon}
            >
              {isEyeHidden ? <EyeOffIcon /> : <EyeIcon />}
            </Pressable>
          </View>
        </View>
        <View style={styles.container2}>
          <Pressable style={styles.button} onPress={handleSubmit}>
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </Pressable>
        </View>
        <View style={styles.container4}>
          <Text style={styles.styleText2}>Already have an account? </Text>
          <Pressable
            style={{ padding: wp("3%") }}
            onPress={() => router.replace("/auth/Login")}
          >
            <Text style={styles.styleText3}>Login</Text>
          </Pressable>
        </View>
      </ImageBackground>
    </Pressable>
  );
};

export default Signup;

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
    marginTop: hp("7%"),
    gap: hp("5%"),
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
  container4: {
    marginTop: hp("5%"),
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
  styledPasswordIcon: {
  position: "absolute",
  right: wp("5%"),
  top: hp("2%"),
  opacity: 0.5,
  padding: 5,
},

});

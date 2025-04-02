import React, { useState } from "react";
import { Image, StyleSheet, Text, View, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";
import CustomText from "../components/CustomText";
import CustomPasswordInput from "../components/CustomPasswordInput";
import {
  useFonts,
  Philosopher_700Bold,
} from "@expo-google-fonts/philosopher";
import { useLoginMutation } from "../redux/api/authApi";
import { setCredentials } from "../redux/slices/authSlice";
import { useDispatch } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("test123@gmail.com");
  const [password, setPassword] = useState("Test@123");
  const [errorMsg, setErrorMsg] = useState("");

  const [login, { isLoading }] = useLoginMutation();

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const handleSubmit = async () => {
  if (!email || !password) {
    setErrorMsg("Please fill in both fields.");
    return;
  }

  if (!emailRegex.test(email)) {
    setErrorMsg("Invalid email format.");
    return;
  }

  if (!passwordRegex.test(password)) {
    setErrorMsg("Password must be at least 8 characters long, contain one uppercase letter, one number, and one special character.");
    return;
  }

  try {
    const userData = await login({ email, password }).unwrap();
    
    await AsyncStorage.setItem("userToken", userData.token);
    await AsyncStorage.setItem("user", JSON.stringify(userData.user));

    setEmail("");
    setPassword("");
    setErrorMsg("");
    dispatch(setCredentials({ user: userData.user, token: userData.token }));

    navigation.reset({ index: 0, routes: [{ name: "tabs" }] });
  } catch (err) {
    console.error("Login error:", err);
    setErrorMsg("Login failed. Please check your credentials.");
    // Alert.alert("Login Error", "There was an issue logging in. Please try again.");
  }
};


  const handleSignUp = () => {
    navigation.navigate("signup");
  };

  let [fontsLoaded] = useFonts({
    Philosopher_700Bold,
  });

  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/favicon.png")}
        style={styles.logo}
      />
      <CustomText text={"PLANTIFY"} style={styles.heading} />
      <CustomText text={"Login"} style={styles.title} />
      <CustomText
        text={"Grow Green, Shop Smart – Welcome to Plantify!"}
        style={styles.subtitle}
      />
      <CustomInput
        label="Email"
        placeholder="Enter email"
        value={email}
        onChangeText={setEmail}
      />
      <CustomPasswordInput value={password} onChangeText={setPassword} />
      <CustomButton
        onPress={handleSubmit}
        style={styles.button}
        text={isLoading ? "Logging in..." : "Log In"}
      />
      {errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
      <Text style={styles.footertitle}>
        New to Plantify?{" "}
        <Text style={styles.clickText} onPress={handleSignUp}>
          Sign-up
        </Text>{" "}
        now!
      </Text>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    paddingTop: "20%",
    flex: 1,
    backgroundColor: "white",
    padding: 15,
    textAlign: "center",
  },
  logo: {
    height: 60,
    width: 73,
    alignSelf: "center",
  },
  heading: {
    fontFamily: "Philosopher_700Bold",
    fontSize: 30,
    color: "#002140",
    alignSelf: "center",
  },
  title: {
    marginTop: 10,
    fontSize: 30,
    textAlign: "center",
    fontWeight: "800",
    color: "grey",
  },
  subtitle: {
    marginTop: 10,
    alignSelf: "center",
    marginBottom: 20,
  },
  button: {
    marginTop: 20,
  },
  footertitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginTop: 10,
    alignSelf: "center",
  },
  clickText: {
    fontSize: 16,
    color: "#0D986A",
    textDecorationLine: "underline",
  },
  errorText: {
    marginTop: 10,
    color: "red",
    textAlign: "center",
  },
});

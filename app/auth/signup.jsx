import React from "react";
import {
  Image, StyleSheet,
  Text, View
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";
import CustomText from "../components/CustomText";
import CustomPasswordInput from "../components/CustomPasswordInput";
import {
  useFonts,
  Philosopher_400Regular,
  Philosopher_400Regular_Italic,
  Philosopher_700Bold,
  Philosopher_700Bold_Italic,
} from "@expo-google-fonts/philosopher";

const SignupScreen = () => {
  const navigation = useNavigation();

  const handleSubmit = () => {
    navigation.navigate("tabs");
  };

  const handleLogin = () => {
    navigation.navigate("login");
  };
  

  let [fontsLoaded] = useFonts({
    Philosopher_400Regular,
    Philosopher_400Regular_Italic,
    Philosopher_700Bold,
    Philosopher_700Bold_Italic,
  });
  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/favicon.png")}
        style={styles.logo}
      />
      <CustomText text={"PLANTIFY"} style={styles.heading} />
      <CustomText text={"Signup"} style={styles.title} />
      <CustomText
        text={"Start Your Plantify Journey Today!"}
        style={styles.subtitle}
      />
      <CustomInput label="Username" placeholder="Enter username" />
      <CustomInput label="Email" placeholder="Enter email" />
      <CustomPasswordInput />
      <CustomPasswordInput label="Confirm Password" />
      <CustomButton onPress={handleSubmit} style={styles.button} text="Sign Up"/>
      <Text style={styles.footertitle}>
        Already have an account on Plantify?{" "}
        <Text style={styles.clickText} onPress={handleLogin}>
          log-in{" "}
        </Text>
        now!
      </Text>
    </View>
  );
};

export default SignupScreen;

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
    fontWeight:"600",
    color: "#333",
    marginTop: 10,
    alignSelf: "center",
  },
  clickText: {
    fontSize: 16,
    color: "#0D986A",
    textDecorationLine: "underline",
  },
});


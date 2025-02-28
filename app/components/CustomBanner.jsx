import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import {
  useFonts,
  Philosopher_400Regular,
  Philosopher_700Bold,
} from "@expo-google-fonts/philosopher";

const CustomBanner = () => {
  let [fontsLoaded] = useFonts({
    Philosopher_400Regular,
    Philosopher_700Bold,
  });
  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.heading}>There's a Plant {"\n"}for everyone</Text>
        <Text style={styles.title}>Get your 1st plant</Text>
        <View>
          <Text style={styles.subtitle}>@ 40% off</Text>
          <View style={styles.bar}></View>
        </View>
      </View>
      <View>
        <Image
          source={require("@/assets/images/bannerImage1.png")}
          style={styles.image}
        />
      </View>
    </View>
  );
};

export default CustomBanner;

const styles = StyleSheet.create({
  container: {
    height: 200,
    marginHorizontal: 10,
    borderRadius: 16,
    backgroundColor: "#FDC7BE",
    flexDirection: "row",
    padding: 20,
  },
  image: {
    height: 190,
      width: 340,
      marginLeft: -190,
      marginTop:-10
  },
  heading: {
    fontSize: 30,
    color: "#002140",
    fontFamily: "Philosopher_700Bold",
  },
  title: {
    fontSize: 16,
    fontWeight: 500,
    color: "#002140",
    marginTop: 10,
  },
  subtitle: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: 500,
    color: "#002140",
  },
  bar: {
    marginLeft: 20,
    height: 4,
    width: 50,
    backgroundColor: "green",
  },
});

import { StyleSheet, Text, View } from "react-native";
import React from "react";
import CustomBanner from "../components/CustomBanner";
import ProductCard from '../components/ProductCard'
import {
  useFonts,
  Philosopher_400Regular,
  Philosopher_700Bold,
} from "@expo-google-fonts/philosopher";

const HomeScreen = () => {
  let [fontsLoaded] = useFonts({
    Philosopher_400Regular,
    Philosopher_700Bold,
  });

  const options = ["Top Pick", "Indoor", "Outdoor", "Seed"];

  return (
    <View style={styles.container}>
      <CustomBanner />
      <View>
        {options.map((option, key) => (
          <Text key={key} >{option}</Text>
        ))}
      </View>
      <ProductCard/>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 10,
    paddingTop:20
  },
});

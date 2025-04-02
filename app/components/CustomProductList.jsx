import {
  Image,
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import CustomText from "./CustomText";
import { useFonts, Philosopher_700Bold } from "@expo-google-fonts/philosopher";
import { useNavigation } from "@react-navigation/native";
import { useGetProductsQuery } from "../redux/api/productApi";
const colors = [
  "#9CE5CB",
  "#FDC7BE",
  "#FFE899",
  "#56D1A7",
  "#B2E28D",
  "#DEEC8A",
  "#F5EDA8",
];

const ProductCard = ({ id, title, subtitle, prices, image,description, bgColor }) => {
  const navigation = useNavigation();
  let [fontsLoaded] = useFonts({
    Philosopher_700Bold,
  });

  const handlePress = () => {
    navigation.navigate("ProductDetails", {
      productId: id,
      cardColor: bgColor,
    });
  };
  function truncateDescription(text, wordsPerLine = 4, maxLines = 2) {
    if (!text) return "";
    const words = text.split(" ");
    let result = "";
  
    for (let lineIndex = 0; lineIndex < maxLines; lineIndex++) {
      const start = lineIndex * wordsPerLine;
      const end = start + wordsPerLine;
      const lineWords = words.slice(start, end);
      if (lineWords.length === 0) break; // no more words
  
      let line = lineWords.join(" ");
      // If it's the last allowed line and there are more words, add ellipsis.
      if (lineIndex === maxLines - 1 && end < words.length) {
        line += " ...";
      }
      result += line;
      if (lineIndex < maxLines - 1 && end < words.length) {
        result += "\n"; // add a newline if there is another line coming
      }
    }
  
    return result;
  }

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={[styles.container, { backgroundColor: bgColor }]}>
        <Image
          source={require("@/assets/images/Vector.png")}
          style={styles.vector}
        />
        <Image
          source={require("@/assets/images/Vector2.png")}
          style={styles.vector2}
        />
        <View>
          <View style={{ flexDirection: "row", gap: 20 }}>
            <CustomText text={subtitle} style={styles.subtitle} />
            <Image
              source={require("@/assets/images/tagIcon.png")}
              style={styles.tagIcon}
            />
          </View>
          <CustomText text={title} style={styles.title} />
          <Text style={styles.des}>
            {/* Aloe vera is a succulent{"\n"}plant with thick, fleshy leaves. */}
            {truncateDescription(description)}
          </Text>
          <Text style={styles.prices}>₹{prices}/- Rs.</Text>
        </View>
        <View style={{right:0}}>
          <Image source={{ uri: image }} style={styles.image} />
        </View>
      </View>
    </TouchableOpacity>
  );
};
export default ProductCard;

const styles = StyleSheet.create({
  headerText: {
    alignSelf: "center",
    fontSize: 24,
    marginVertical: 10,
  },
    headerContainer: {
    // paddingVertical: 24,
      // paddingHorizontal: 8,
      // alignSelf:"center"
    },
    headerTitle: {
    alignSelf:"center",
    fontSize: 32,
    fontFamily: "Philosopher_700Bold",
    color: "#002140",
    // marginBottom: 8,
  },
  headerSubtitle: {
    alignSelf:"center",
    fontSize: 18,
    color: "#6B7280",
  },
  container: {
    marginTop: 20,
    height: 200,
    marginHorizontal: 10,
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    justifyContent:"space-between"
  },
  vector: {
    position: "absolute",
    height: 200,
    width: "100%",
    marginLeft: 70,
    marginTop: 10,
  },
  vector2: {
    position: "absolute",
    height: 190,
    width: 390,
    marginTop: 5,
  },
  subtitle: {
    fontSize: 20,
    color: "#002140",
    fontWeight: "500",
  },
  title: {
    fontSize: 35,
    color: "#002140",
    fontFamily: "Philosopher_700Bold",
  },
  tagIcon: {
    height: 30,
    width: 30,
  },
  image: {
    height: 200,
    width: 130,
  },
  des: {
    fontSize: 16,
    fontWeight: "400",
  },
  prices: {
    marginTop: 20,
    fontSize: 20,
    color: "#002140",
    fontWeight: "600",
  },
});

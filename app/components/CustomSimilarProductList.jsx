import {
  Image,
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  TouchableOpacity,
} from "react-native";
import React from "react";
import CustomText from "./CustomText";
import { useFonts, Philosopher_700Bold } from "@expo-google-fonts/philosopher";
import { useNavigation } from "@react-navigation/native";

const colors = [
  "#9CE5CB",
  "#FDC7BE",
  "#FFE899",
  "#56D1A7",
  "#B2E28D",
  "#DEEC8A",
  "#F5EDA8",
];

const ProductCard = ({ id, title, subtitle, price, image, bgColor }) => {
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
            <Text
              style={styles.subtitle}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {subtitle}
            </Text>
            <Image
              source={require("@/assets/images/tagIcon.png")}
              style={styles.tagIcon}
            />
          </View>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
        </View>
        <View>
          <Image source={{ uri: image }} style={styles.image} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const CustomSimilarProductList = ({ products }) => {
  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item._id.toString()}
      renderItem={({ item, index }) => (
        <ProductCard
          id={item._id}
          title={item.title}
          subtitle={item.subtitle}
          prices={item.price}
          image={item.thumbnail}
          bgColor={colors[index % colors.length]}
        />
      )}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  );
};

export default CustomSimilarProductList;

const styles = StyleSheet.create({
  container: {
    height: 215,
    width: 160,
    marginHorizontal: 5,
    borderRadius: 16,
    padding: 20,
    marginBottom:5,
    flexDirection: "column",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
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
    fontSize: 16,
    color: "#002140",
    maxWidth: "80%",
    fontWeight: "500",
  },
  title: {
    fontSize: 25,
    color: "#002140",
    fontFamily: "Philosopher_700Bold",
  },
  tagIcon: {
    height: 20,
    width: 20,
  },
  image: {
    height: 150,
    width: 130,
    marginLeft: -10,
  },
});

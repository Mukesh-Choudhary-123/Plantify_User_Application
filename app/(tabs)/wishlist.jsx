import {
  Image,
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React from "react";
import CustomText from "../components/CustomText";
import { useFonts, Philosopher_700Bold } from "@expo-google-fonts/philosopher";
import { useNavigation } from "@react-navigation/native";
import CustomHeader from "../components/CustomHeader";
import { FontAwesome } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { useGetWishlistQuery } from "../redux/api/wishlistApi";
import LottieView from "lottie-react-native";
import EmptyCart from "../../assets/animation/EmptyCart.json";
const { width, height } = Dimensions.get("window");
const colors = [
  "#9CE5CB",
  "#FDC7BE",
  "#FFE899",
  "#56D1A7",
  "#B2E28D",
  "#DEEC8A",
  "#F5EDA8",
];

const ProductCard = ({ id, title, subtitle, prices, image, bgColor }) => {
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
    <TouchableOpacity
      onPress={handlePress}
      style={{ padding: 5, flexDirection: "row", flexWrap: "wrap" }}
    >
      <View style={[styles.container, { backgroundColor: bgColor }]}>
        <Image
          source={require("@/assets/images/Vector.png")}
          style={styles.vector}
        />
        <Image
          source={require("@/assets/images/Vector2.png")}
          style={styles.vector2}
        />
        {/* <TouchableOpacity style={{position:"absolute" , left:135 ,marginTop:12}}>
            <FontAwesome name="heart" size={30} color={"#002140"} />
        </TouchableOpacity> */}
        <View>
          <View style={{ flexDirection: "row", gap: 20 }}>
            <CustomText text={subtitle} style={styles.subtitle} />
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

const WishlistScreen = () => {
  const userData = useSelector((state) => state.auth.user);
  const {
    data: wishlistData,
    isError: isWishlistError,
    isLoading: isWishlistLoading,
    error,
  } = useGetWishlistQuery(userData?.id, { skip: !userData?.id });

  // console.log("wishlistData : ", wishlistData?.wishlist);

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <CustomHeader />
      {wishlistData?.wishlist.length === 0 && (
        <View style={{ width: "100%", height: "100%", alignItems: "center" }}>
          <LottieView source={EmptyCart} autoPlay loop style={styles.lottie} />
          <Text
            style={{
              fontSize: 20,
              textAlign: "center",
              marginTop: -50,
              fontWeight: 600,
              color: "#002140",
            }}
          >
            Your Wishlist is Empty {"\n"} Start{" "}
            <Text style={{ color: "#0D986A" }}>Dreaming!</Text>
          </Text>
        </View>
      )}
      {isWishlistLoading ? (
        <View style={{ marginTop: "70%", alignItems: "center" }}>
          <ActivityIndicator size={"large"} color={"black"} />
          <Text
            style={{
              fontSize: 18,
              marginTop: 5,
              fontWeight: 600,
              color: "#002140",
              marginLeft: 15,
            }}
          >
            Loading...
          </Text>
        </View>
      ) : (
        <View style={{ paddingHorizontal: 10, paddingBottom: 70 }}>
          <FlatList
            data={wishlistData?.wishlist}
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
            numColumns={2}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </View>
  );
};

export default WishlistScreen;

const styles = StyleSheet.create({
  container: {
    height: 215,
    width: 180,
    marginHorizontal: 5,
    borderRadius: 16,
    padding: 20,
    flexDirection: "column",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  lottie: {
    alignSelf: "center",
    width: width * 1,
    height: height * 0.7,
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

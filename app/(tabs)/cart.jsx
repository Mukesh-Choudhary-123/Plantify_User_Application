import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import CustomHeader from "../components/CustomHeader";
import { useFonts, Philosopher_700Bold } from "@expo-google-fonts/philosopher";
import { FontAwesome } from "@expo/vector-icons";
import CustomButton from "../components/CustomButton";
import { useNavigation } from "@react-navigation/native";
import {
  useGetCartQuery,
  useRemoveFromCartMutation,
  useUpdateToCartMutation,
} from "../redux/api/cartApi";
import { useSelector } from "react-redux";
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

const CartScreen = () => {
  let [fontsLoaded] = useFonts({
    Philosopher_700Bold,
  });
  const navigation = useNavigation();

  const userData = useSelector((state) => state.auth.user);

  const {
    data: fetchedData,
    isLoading: isCartLoading,
    isError: isCartError,
    error: cartError,
  } = useGetCartQuery(userData?.id, { skip: !userData?.id });

  const userId = userData?.id;

  const [
    updateToCart,
    {
      isLoading: isUpdateToCartLoading,
      isError: isUpdateToCartError,
      isSuccess: isUpdateToCartSuccess,
    },
  ] = useUpdateToCartMutation();

  const handleDecrease = (productId) => {
    const action = "decrease";
    updateToCart({ id: userId, productId, action });
  };

  const handleIncrease = (productId) => {
    const action = "increase";
    updateToCart({ id: userId, productId, action });
  };

  const [
    removeFromCart,
    {
      isLoading: isRemoveFromCartLoading,
      isError: isRemoveFromCartError,
      isSuccess: isRemoveFromCartSuccess,
    },
  ] = useRemoveFromCartMutation();

  const handleRemove = (productId) => {
    Alert.alert(
      "Remove Plant",
      "Are you sure you want to remove this plant from your cart?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            removeFromCart({ id: userId, productId });
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handlePlaceOrder = () => {
    navigation.navigate("PlaceOrder");
  };

  return (
    <View style={styles.container}>
      <CustomHeader />
      {/* <Text style={styles.headingText}>My Cart</Text> */}
      {fetchedData?.cart.length === 0 && (
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
            Time to Shop {"\n"} Your Cart is{" "}
            <Text style={{ color: "#0D986A" }}>Lonely!</Text>
          </Text>
        </View>
      )}
      {isCartLoading ? (
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
        <FlatList
          data={fetchedData?.cart}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <View
              style={[
                styles.card,
                { backgroundColor: colors[index % colors.length] },
              ]}
            >
              <Image
                source={require("@/assets/images/Vector.png")}
                style={styles.vector}
              />
              <Image
                source={require("@/assets/images/Vector2.png")}
                style={styles.vector2}
              />
              <View style={styles.productContainer}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <View style={styles.detailsContainer}>
                  <View>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.subtitle}>{item.subtitle}</Text>
                  </View>
                  {/* <View style={styles.quantityContainer}>
                    <TouchableOpacity
                      disabled={item.quantity === 1}
                      style={[
                        styles.quantityButton,
                        item.quantity === 1 && { opacity: 0.5 },
                      ]}
                      onPress={() => handleDecrease(item.productId)}
                    >
                      <FontAwesome name="minus" size={18} color="#FFF" />
                    </TouchableOpacity>

                    <Text style={styles.quantityText}>{item.quantity}</Text>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => handleIncrease(item.productId)}
                    >
                      <FontAwesome name="plus" size={18} color="#FFF" />
                    </TouchableOpacity>
                  </View> */}
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity
                      disabled={
                        isCartLoading ||
                        isUpdateToCartLoading ||
                        item.quantity === 1
                      }
                      style={[
                        styles.quantityButton,
                        item.quantity === 1 ||
                        isCartLoading ||
                        isUpdateToCartLoading
                          ? { opacity: 0.5 }
                          : {},
                      ]}
                      onPress={() => handleDecrease(item.productId)}
                    >
                      <FontAwesome name="minus" size={18} color="#FFF" />
                    </TouchableOpacity>

                    <View>
                      {isCartLoading || isUpdateToCartLoading ? (
                        <ActivityIndicator size="small" color="#FFF" />
                      ) : (
                        <Text style={styles.quantityText}>{item.quantity}</Text>
                      )}
                    </View>

                    <TouchableOpacity
                      disabled={isCartLoading || isUpdateToCartLoading}
                      style={[
                        styles.quantityButton,
                        isCartLoading || isUpdateToCartLoading
                          ? { opacity: 0.5 }
                          : {},
                      ]}
                      onPress={() => handleIncrease(item.productId)}
                    >
                      <FontAwesome name="plus" size={18} color="#FFF" />
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.rightSection}>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleRemove(item.productId)}
                  >
                    <FontAwesome name="trash-o" size={22} color="#FF4D4F" />
                  </TouchableOpacity>
                  <Text style={styles.price}>
                    ₹{item.price * item.quantity}
                  </Text>
                </View>
              </View>
            </View>
          )}
        />
      )}
      {fetchedData?.cart.length > 0 && (
        <View style={{ marginVertical: 10 }}>
          <CustomButton
            text="Place Order"
            style={{ marginTop: 15 }}
            onPress={handlePlaceOrder}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
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
  listContainer: {
    paddingHorizontal: 15,
    // paddingBottom: 20,
  },
  headingText: {
    fontSize: 23,
    fontFamily: "Philosopher_700Bold",
    color: "#0D986A",
    // marginVertical: 20,
    marginLeft: 20,
    textAlign: "center",
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    overflow: "hidden",
  },
  productContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  detailsContainer: {
    flex: 1,
  },
  title: {
    fontSize: 23,
    fontFamily: "Philosopher_700Bold",
    color: "#002140",
  },
  subtitle: {
    fontSize: 14,
    fontWeight: 500,
    color: "#6C757D",
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 8,
  },
  quantityButton: {
    backgroundColor: "#0D986A",
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#002140",
  },
  rightSection: {
    alignItems: "flex-end",
  },
  deleteButton: {
    padding: 4,
  },
  price: {
    fontSize: 18,
    fontWeight: "700",
    color: "#002140",
    marginTop: 8,
  },
  totalsCard: {
    borderTopWidth: 1,
    borderTopColor: "#0D986A",
    paddingTop: 10,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  totalLabel: {
    fontSize: 16,
    color: "#6C757D",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "500",
    color: "#002140",
  },
  grandTotal: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0D986A",
  },
  checkoutButton: {
    backgroundColor: "#0D986A",
    paddingVertical: 18,
    alignItems: "center",
    marginHorizontal: 20,
    borderRadius: 12,
  },
  checkoutText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "700",
  },
});

export default CartScreen;

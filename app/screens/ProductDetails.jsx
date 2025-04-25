import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import CustomHeader from "../components/CustomHeader";
import { useFonts, Philosopher_700Bold } from "@expo-google-fonts/philosopher";
import CustomText from "../components/CustomText";
import CustomSimilarProductList from "../components/CustomSimilarProductList";
import {
  FontAwesome,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import CustomButton from "../components/CustomButton";
import { useGetProductsByCategoryQuery, useProductDetailsQuery } from "../redux/api/productApi";
import { useSelector } from "react-redux";
import {
  useAddToWishlistMutation,
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
} from "../redux/api/wishlistApi";
import {
  useAddToCartMutation,
  useGetCartQuery,
  useRemoveFromCartMutation,
} from "../redux/api/cartApi";

const ProductDetails = ({ route }) => {
  const { productId, cardColor } = route.params;
  
  

  let [fontsLoaded] = useFonts({
    Philosopher_700Bold,
  });

  const id = productId;
  // console.log("product-ID -**-", id);
  const { data, isLoading, isError, isFetching } = useProductDetailsQuery(id);

  const userData = useSelector((state) => state.auth.user);
  
  // console.log("*($*()@*)($*)@($*)(&%(*$%)(@*$)(@&(*$@(*$57049", data?.product?.category)
  const category = data?.product?.category;

  const {data :similarProduct , isLoading :isSimilarProductLoading  }= useGetProductsByCategoryQuery(category , {skip: !category} )

  // console.log("similarProduct ",similarProduct?.data)

  //**************** WishList *******************//

  const {
    data: wishlistData,
    isError: isWishlistError,
    isLoading: isWishlistLoading,
    error,
  } = useGetWishlistQuery(userData?.id, { skip: !userData?.id });

  // console.log("Get Wishlist :=== ", wishlistData?.wishlist)

  const wishlistIds = wishlistData?.wishlist?.map((item) => item._id);
  const isProductInWishlist = wishlistIds?.includes(productId);
  // console.log("Wishlist IDs:", wishlistIds);
  // console.log("isProductInWishlist:", isProductInWishlist);

  const [
    addToWishlist,
    {
      isLoading: isAddToWishlistLoading,
      isError: isAddToWishlistError,
      isSuccess: isAddToWishlistSuccess,
    },
  ] = useAddToWishlistMutation();

  const [
    removeFromWishlist,
    {
      isLoading: isRemoveFromLoading,
      isError: isRemoveFromError,
      isSuccess: isRemoveFromSuccess,
    },
  ] = useRemoveFromWishlistMutation();

  const handleWishlist = () => {
    const userId = userData?.id;
    if (isProductInWishlist) {
      removeFromWishlist({ id: userId, productId });
      console.log("Product is already in wishlist");
    } else {
      addToWishlist({ id: userId, productId });
      console.log("Product added in wishlist");
    }
  };

  //************** Cart *************//

  const {
    data: cartData,
    isLoading: isCartLoading,
    isError: isCartError,
    error: cartError,
  } = useGetCartQuery(userData?.id, { skip: !userData?.id });

  // console.log("cartData :- ", cartData);


  const cartProductIds = cartData?.cart?.map((item) => item.productId);
  const isProductInCart = cartProductIds?.includes(productId);
  
  // console.log("cartProductIds :- ", cartProductIds);
  // console.log("isProductInCart :- ", isProductInCart);
  
  const [
    addToCart,
    {
      isLoading: isAddToCartLoading,
      isError: isAddToCartError,
      isSuccess: isAddToCartSuccess,
    },
  ] = useAddToCartMutation();

  const [
    removeFromCart,
    {
      isLoading: isRemoveFromCartLoading,
      isError: isRemoveFromCartError,
      isSuccess: isRemoveFromCartSuccess,
    },
  ] = useRemoveFromCartMutation();

  const handleCart = () => {
    const userId = userData?.id;
    if (isProductInCart) {
      removeFromCart({ id: userId, productId });
      console.log("Product is already in cart");
    } else {
      addToCart({ id: userId, productId });
      console.log("Product added in cart");
    }
  };

  const product = data?.product;
  const [expandedSection, setExpandedSection] = React.useState(null);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const DetailRow = ({ icon, title, value }) => (
    <View style={styles.detailRow}>
      <MaterialCommunityIcons name={icon} size={24} color="#0D986A" />
      <View style={styles.detailTextContainer}>
        <Text style={styles.detailTitle}>{title}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );
  return (
    <View style={styles.container}>
      <CustomHeader color={cardColor} />
      {isFetching ? (
        <View
          style={{
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator size={"large"} color={cardColor} />
          <Text
            style={{
              fontSize: 18,
              marginTop: 5,
              fontWeight: 600,
              color: "#002140",
            }}
          >
            Loading...
          </Text>
        </View>
      ) : (
        <>
          <View style={[styles.upperContainer, { backgroundColor: cardColor }]}>
            <Image
              source={require("@/assets/images/Vector.png")}
              style={styles.vector}
            />
            <Image
              source={require("@/assets/images/Vector2.png")}
              style={styles.vector2}
            />
            <View
              style={{ paddingHorizontal: 20, paddingTop: 10, marginLeft: 10 }}
            >
              <View style={{ flexDirection: "row", gap: 10 }}>
                <CustomText text={product?.subtitle} style={styles.subtitle} />
                <Image
                  source={require("@/assets/images/tagIcon.png")}
                  style={styles.tagIcon}
                />
              </View>
              <Text style={styles.title}>{product?.title}</Text>
              <View style={{ marginTop: 10 }}>
                <Text
                  style={{ color: "grey", fontSize: 16, fontWeight: "700" }}
                >
                  PRICE
                </Text>
                <Text
                  style={{ color: "#002140", fontSize: 16, fontWeight: "600" }}
                >
                  ₹ {product?.price}/- Rs.
                </Text>

                <View style={{ flexDirection: "row", marginTop: 20 }}>
                  <TouchableOpacity onPress={handleCart} >
                    {isAddToCartLoading || isRemoveFromCartLoading ? (
                      <View style={{ marginTop:35 ,marginLeft:45 ,paddingRight:35}}>
                        <ActivityIndicator size="small" color="#002140" />
                      </View>
                    ) : isProductInCart ? (
                      <Image
                        source={require("@/assets/images/cart2.png")}
                        style={styles.cartIcon}
                      />
                    ) : (
                      <Image
                        source={require("@/assets/images/cart.png")}
                        style={styles.cartIcon}
                      />
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity onPress={handleWishlist}>
                    <View
                      style={{
                        position: "absolute",
                        marginTop: 30,
                        zIndex: 1,
                        marginLeft: 35,
                      }}
                    >
                      {isAddToWishlistLoading || isRemoveFromLoading ? (
                        <View style={{ marginLeft: 5, marginTop: 5 }}>
                          <ActivityIndicator size="small" color="#002140" />
                        </View>
                      ) : isProductInWishlist ? (
                        <FontAwesome name="heart" size={30} color="#002140" />
                      ) : (
                        <FontAwesome name="heart-o" size={30} color="#002140" />
                      )}
                    </View>
                    <Image
                      source={require("@/assets/images/heartBg.png")}
                      style={styles.heartIcon}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View>
              <Image source={{ uri: product?.thumbnail }} style={styles.image} />
            </View>
          </View>
          <ScrollView>
            {/* Overview */}
            <View style={{ padding: 10 }}>
              <Text style={styles.overviewText}>Overview </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  marginTop: 10,
                  gap: 20,
                }}
              >
                {/* water */}
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <Image
                    source={require("@/assets/images/waterIcon.png")}
                    style={{ height: 25, width: 15, marginTop: 7 }}
                  />
                  <View>
                    <Text
                      style={{ color: "grey", fontSize: 16, fontWeight: "700" }}
                    >
                      WATER
                    </Text>
                    <Text
                      style={{
                        color: "#0D986A",
                        fontWeight: "700",
                        fontSize: 18,
                      }}
                    >
                      {product.overview.water}ml
                    </Text>
                  </View>
                </View>
                {/* light */}
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <Image
                    source={require("@/assets/images/lightIcon.png")}
                    style={{ height: 25, width: 25, marginTop: 7 }}
                  />
                  <View>
                    <Text
                      style={{ color: "grey", fontSize: 16, fontWeight: "800" }}
                    >
                      LIGHT
                    </Text>
                    <Text
                      style={{
                        color: "#0D986A",
                        fontWeight: "700",
                        fontSize: 18,
                      }}
                    >
                      {product.overview.light - 5}-{product.overview.light}%
                    </Text>
                  </View>
                </View>
                {/* fertilizer */}
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <Image
                    source={require("@/assets/images/fertilizerIcon.png")}
                    style={{ height: 30, width: 32, marginTop: 7 }}
                  />
                  <View>
                    <Text
                      style={{ color: "grey", fontSize: 16, fontWeight: "800" }}
                    >
                      FERTILIZER
                    </Text>
                    <Text
                      style={{
                        color: "#0D986A",
                        fontWeight: "700",
                        fontSize: 18,
                      }}
                    >
                      {product.overview.fertilizer}gm
                    </Text>
                  </View>
                </View>
              </View>
            </View>
            {/* Plant Bio */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Plant Bio</Text>
              <Text style={styles.bioText}>{product.description}</Text>
            </View>
            {/* Care Instructions */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Care Instructions</Text>
              {Object.entries(product.careInstructions).map(([key, value]) => (
                <TouchableOpacity
                  key={key}
                  style={styles.careItem}
                  onPress={() => toggleSection(key)}
                >
                  <View style={styles.careHeader}>
                    <MaterialIcons
                      name={
                        expandedSection === key
                          ? "keyboard-arrow-up"
                          : "keyboard-arrow-down"
                      }
                      size={24}
                      color="#0D986A"
                    />
                    <Text style={styles.careTitle}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </Text>
                  </View>
                  {expandedSection === key && (
                    <Text style={styles.careDescription}>{value}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Details Grid */}
            <View style={styles.gridContainer}>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <DetailRow icon="earth" title="Origin" value={product.origin} />
                <DetailRow
                  icon="thermometer"
                  title="Temperature"
                  value={product.idealTemperature}
                />
              </View>
              <View style={{ flexDirection: "row", gap: 10 }}>
                <DetailRow
                  icon="water-percent"
                  title="Humidity"
                  value={product.humidity}
                />
                <DetailRow
                  icon="paw"
                  title="Toxicity"
                  value={product.toxicity}
                />
              </View>
            </View>

            <CustomButton text={isProductInCart ? "Remove from Cart" :"Add to Cart"} onPress={handleCart}/>

            <Text style={[styles.sectionTitle, { marginLeft: 35 }]}>
              Similar Plant
            </Text>

            <View style={{ padding: 10  }}>
              <CustomSimilarProductList products={similarProduct?.data}/>
            </View>
          </ScrollView>
        </>
      )}
    </View>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  upperContainer: {
    height: "32%",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    flexDirection: "row",
  },
  vector: {
    position: "absolute",
    height: 200,
    width: "80%",
    marginLeft: 90,
    marginTop: 50,
  },
  vector2: {
    position: "absolute",
    height: 240,
    width: "100%",
    marginLeft: 35,
  },
  image: {
    marginTop: 50,
    marginLeft: -20,
    height: 210,
    width: 200,
  },
  tagIcon: {
    height: 30,
    width: 30,
  },
  subtitle: {
    fontSize: 18,
    color: "#002140",
    fontWeight: "500",
  },
  title: {
    fontSize: 35,
    color: "#002140",
    fontFamily: "Philosopher_700Bold",
  },
  cartIcon: {
    height: 100,
    width: 100,
  },
  heartIcon: {
    height: 100,
    width: 100,
  },
  overviewText: {
    color: "#002140",
    fontWeight: 700,
    fontSize: 20,
    marginLeft: 20,
  },

  sectionContainer: {
    marginHorizontal: 15,
    // marginVertical: 16,
    // backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: "#002140",
    marginTop: 10,
  },
  bioText: {
    fontSize: 16,
    lineHeight: 24,
    color: "#4B5563",
  },
  careItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingVertical: 12,
  },
  careHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  careTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  careDescription: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginTop: 8,
    paddingLeft: 32,
  },
  gridContainer: {
    flexDirection: "column",
    // flexWrap: "wrap",
    gap: 16,
    marginVertical: 16,
    marginHorizontal: 15,
    // height:"50%"
  },
  detailRow: {
    width: "48%",
    // flexDirection: "column",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailTitle: {
    fontSize: 12,
    color: "#6B7280",
    // alignSelf:"center"
  },
  detailValue: {
    // alignSelf:"center",
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  footerPriceLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  footerPrice: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0D986A",
  },
  buyButton: {
    backgroundColor: "#0D986A",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  buyButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },

  footerContainer: {
    height: 70,
    width: "100%",
    bottom: 0,
    position: "sticky",
    borderTopRightRadius: 30,
    borderTopLeftRadius: 30,
  },
});

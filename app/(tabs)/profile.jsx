import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import React from "react";
import CustomHeader from "../components/CustomHeader";
import { useFonts, Philosopher_700Bold } from "@expo-google-fonts/philosopher";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "../redux/api/authApi";
import { useNavigation } from "@react-navigation/native";
import { logout } from "../redux/slices/authSlice";
import { useGetOrderQuery } from "../redux/api/orderApi";
import LottieView from "lottie-react-native";
import EmptyCart from "../../assets/animation/EmptyCart.json";
import AsyncStorage from "@react-native-async-storage/async-storage";
const { width, height } = Dimensions.get("window");

const orderSteps = ["order", "shipped", "delivered"];
const ProfileScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [triggerLogout, { isLoading, error }] = useLogoutMutation();

  let [fontsLoaded] = useFonts({
    Philosopher_700Bold,
  });

  const userData = useSelector((state) => state.auth.user);
  const userId = userData?.id;
  const {
    data: fetchOrder,
    isLoading: isOrderLoading,
    isError: isOrderError,
    error: orderError,
  } = useGetOrderQuery(userId, { skip: !userData?.id });

  // Our orders data now is an array of order groups
  const orders = fetchOrder?.orders || [];

  console.log(JSON.stringify(orders, null, 2));

  const handleLogout = async () => {
    try {
      await triggerLogout().unwrap();

      // Remove credentials from AsyncStorage
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("user");

      // Dispatch logout action to update Redux state
      dispatch(logout());

      // Reset navigation to the auth screen
      navigation.reset({ index: 0, routes: [{ name: "auth" }] });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Define the order steps for progress visualization
  const orderSteps = ["order", "shipped", "delivered"];

  // Render each order group
  const renderOrderGroup = ({ item: orderGroup, index: groupIndex }) => {
    // Colors for different order cards
    const colors = [
      "#56D1A7",
      "#DEEC8A",
      "#F5EDA8",
      "#B2E28D",
      "#9CE5CB",
      "#FDC7BE",
      "#FFE899",
    ];

    return (
      <View
        key={orderGroup.orderId}
        style={{
          marginBottom: 20,
          backgroundColor: "#fff",
          borderRadius: 16,
          paddingHorizontal: 10,
        }}
      >
        <View style={{ marginTop: 10 }}></View>
        {orderGroup.items.map((orderItem, idx) => {
          // Configuration for status badges
          const statusConfig = {
            order: { color: "#FFB800", label: "Processing" },
            shipped: { color: "#0D986A", label: "Shipped" },
            delivered: { color: "#2E7D32", label: "Delivered" },
            cancelled: { color: "#D32F2F", label: "Cancelled" },
          };

          // Map "pending" to "order"
          const mappedStatus =
            orderItem.status && orderItem.status.toLowerCase() === "pending"
              ? "order"
              : orderItem.status
              ? orderItem.status.toLowerCase()
              : "order";

          const config = statusConfig[mappedStatus] || {
            color: "#000",
            label: "Unknown",
          };
          const { color, label } = config;
          const currentStepIndex = orderSteps.indexOf(mappedStatus);

          return (
            <View
              key={orderItem.id}
              style={[
                styles.orderCard,
                { backgroundColor: colors[idx % colors.length] },
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
              <View style={styles.orderDetails}>
                <View style={{ flexDirection: "row" }}>
                  <Image
                    source={{ uri: orderItem.image }}
                    style={styles.orderImage}
                  />
                  <View style={{ flex: 1 }}>
                    <View style={styles.orderHeader}>
                      <Text style={styles.orderTitle}>{orderItem.title}</Text>
                      <View
                        style={[styles.statusBadge, { backgroundColor: color }]}
                      >
                        <Text style={styles.statusText}>{label}</Text>
                      </View>
                    </View>
                    <Text style={styles.orderSubtitle}>
                      {orderItem.subtitle}
                    </Text>
                    <View style={styles.orderFooter}>
                      <Text style={styles.orderPrice}>₹{orderItem.prices}</Text>
                      <Text style={styles.totalText}>
                        Quantity: {orderItem.quantity}
                      </Text>
                    </View>
                  </View>
                </View>
                <View>
                  {orderItem.status !== "cancelled" && (
                    <View style={styles.progressContainer}>
                      {orderSteps.map((step, idx) => (
                        <View key={step} style={styles.stepContainer}>
                          <View
                            style={[
                              styles.stepIcon,
                              idx <= currentStepIndex && {
                                backgroundColor: "#0D986A",
                              },
                            ]}
                          >
                            <Text style={styles.stepText}>
                              {idx <= currentStepIndex ? "✓" : idx + 1}
                            </Text>
                          </View>
                          <Text
                            style={[
                              styles.stepLabel,
                              idx <= currentStepIndex && { color: "#0D986A" },
                            ]}
                          >
                            {step}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            </View>
          );
        })}
        <View style={{ marginBottom: 10, marginHorizontal:10 }}>

          <Text style={{ fontSize: 17, fontWeight: 500 }}>
            Your Order ID <Text style={{color:"grey"}}>#{orderGroup.orderId.slice(-6)}</Text>
          </Text>
          <View style={{flexDirection:"row" , justifyContent:"space-between" ,marginTop:5}}>
          <Text style={{ fontSize: 17, fontWeight: 500 ,color:"#0D986A"}}>
            Total Amount: <Text style={{color:"#002140"}}>{orderGroup.totalAmount} Rs</Text>
          </Text>
          <Text style={{ fontSize: 17, fontWeight: 500 , color:"#0D986A"}}>
            Total Item: <Text style={{color:"#002140"}}>{orderGroup.totalItems}</Text>
          </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      {/* <StatusBar backgroundColor={"#56D1A7"}/> */}
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <CustomHeader color="#56D1A7" />
        <View style={styles.profileContent}>
          <View style={styles.avatarContainer}></View>
          <View style={styles.userDetails}>
            <View>
              <Text style={styles.username}>{userData?.username}</Text>
              <Text style={styles.email}>{userData?.email}</Text>
            </View>
            <TouchableOpacity style={styles.editButton} onPress={handleLogout}>
              <Text style={styles.editText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.contentContainer}>
        {isOrderLoading ? (
          <View style={{ marginTop: "70%", alignItems: "center" }}>
            <ActivityIndicator size={"large"} color={"black"} />
            <Text
              style={{
                fontSize: 18,
                marginTop: 5,
                fontWeight: "600",
                color: "#002140",
                marginLeft: 15,
              }}
            >
              Loading...
            </Text>
          </View>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(order) => order.orderId}
            renderItem={renderOrderGroup}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.ordersList}
            ListEmptyComponent={
              <View
                style={{
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                  top: -120,
                }}
              >
                <LottieView
                  source={EmptyCart}
                  autoPlay
                  loop
                  style={styles.lottie}
                />
                <Text
                  style={{
                    fontSize: 20,
                    textAlign: "center",
                    marginTop: -50,
                    fontWeight: "600",
                    color: "#002140",
                  }}
                >
                  No problem {"\n"} Start shopping{" "}
                  <Text style={{ color: "#0D986A" }}>Now!</Text>
                </Text>
              </View>
            }
            ListHeaderComponent={
              <Text style={styles.sectionTitle}>Order History</Text>
            }
          />
        )}
      </View>
      </View>
      </>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#F8FAFC",
  },
  lottie: {
    alignSelf: "center",
    width: width * 1,
    height: height * 0.7,
  },
  profileHeader: {
    backgroundColor: "#56D1A7",
    paddingBottom: 15,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    zIndex:50
  },
  profileContent: {},
  avatarContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  editButton: {
    marginTop: 5,
    height: 40,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#002140",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#002140",
  },
  editText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "500",
  },
  userDetails: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  username: {
    fontSize: 24,
    color: "#002140",
    fontWeight: 600,
    marginBottom: 3,
  },
  email: {
    fontSize: 16,
    color: "#002140",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 10,
    marginTop: -20,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Philosopher_700Bold",
    color: "#002140",
    marginTop: 30,
    marginBottom: 10,
    paddingLeft: 8,
  },
  ordersList: {
    paddingBottom: 20,
  },
  orderCard: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    // flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: "hidden",
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
  orderImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  orderDetails: {
    flex: 1,
    // flexDirection:"row"
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  orderTitle: {
    fontSize: 23,
    fontFamily: "Philosopher_700Bold",
    color: "#002140",
    flexShrink: 1,
  },
  statusBadge: {
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  statusText: {
    color: "white",
    fontSize: 15,
    fontWeight: "500",
  },
  orderSubtitle: {
    marginTop: -8,
    fontSize: 16,
    fontWeight: 600,
    color: "#6C757D",
    // marginBottom: 8,
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderPrice: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0D986A",
  },
  orderId: {
    fontSize: 16,
    fontWeight: 500,
    color: "#94A3B8",
  },
  totalsContainer: {
    color: "#6C757D",
  },
  totalText: {
    fontSize: 16,
    color: "#6C757D",
  },
  progressContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  stepContainer: {
    alignItems: "center",
    flex: 1,
  },
  stepIcon: {
    width: 30,
    height: 30,
    borderRadius: 50,
    backgroundColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  stepText: {
    color: "#002140",
    fontSize: 16,
    fontWeight: "600",
  },
  stepLabel: {
    fontSize: 14,
    fontWeight: 600,
    color: "#94A3B8",
    textAlign: "center",
    textTransform: "capitalize",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: "#94A3B8",
    fontSize: 16,
  },
});

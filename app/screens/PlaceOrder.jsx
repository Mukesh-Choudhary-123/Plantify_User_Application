import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import CustomHeader from "../components/CustomHeader";
import { useFonts, Philosopher_700Bold } from "@expo-google-fonts/philosopher";
import CustomButton from "../components/CustomButton";
import CustomInput from "../components/CustomInput";
import { useDispatch, useSelector } from "react-redux";
import { useGetCartQuery } from "../../redux/api/cartApi";
import { useUserUpdateMutation } from "../../redux/api/authApi";
import { setAddress } from "../../redux/slices/authSlice";
import { useCreateOrderMutation } from "../../redux/api/orderApi";
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

const ProductList = ({ products }) => {
  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item, index }) => (
        <View
          style={[
            styles.listCard,
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
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={{ uri: item.image }}
              style={{ height: 50, width: 50 }}
            />
            <Text style={styles.title}>{item.title}</Text>
          </View>
          <View>
            <Text style={styles.price}>
              <Text
                style={{ color: "#6B7280", fontWeight: "400", fontSize: 16 }}
              >
                Quantity:
              </Text>{" "}
              {item.quantity}
            </Text>
            <Text style={styles.price}>
              <Text
                style={{ color: "#6B7280", fontWeight: "400", fontSize: 16 }}
              >
                Price:
              </Text>{" "}
              ₹ {item.price * item.quantity}
            </Text>
          </View>
        </View>
      )}
      style={styles.flatList}
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
    />
  );
};

const PlaceOrder = () => {
  let [fontsLoaded] = useFonts({
    Philosopher_700Bold,
  });
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const userData = useSelector((state) => state.auth.user);
  const userAddress = userData?.address[0];

  // Toggle state: if there is no address then show the form, otherwise show the address card.
  const [isEditing, setIsEditing] = useState(
    !(userData?.address && userData.address.length > 0)
  );

  const {
    data: fetchedData,
    isLoading: isCartLoading,
    isError: isCartError,
    error: cartError,
  } = useGetCartQuery(userData?.id, { skip: !userData?.id });

  // console.log("fetchedData.cart :- ", fetchedData.cart);

  const [
    userUpdate,
    {
      isLoading: isUserUpdateLoading,
      isError: isUserUpdateError,
      error: userUpdateError,
    },
  ] = useUserUpdateMutation();

  const [fullName, setFullName] = useState(userData?.username || "");
  const [contactNum, setContactNum] = useState("6376092882");
  const [email, setEmail] = useState(userData?.email || "");
  const [streetAddress, setStreetAddress] = useState("S.S Hill");
  const [stateValue, setStateValue] = useState("Rajasthan");
  const [city, setCity] = useState("Udaipur");
  const [zipCode, setZipCode] = useState("313003");

  const handleAddressSubmit = () => {
    const address = {
      fullName: fullName,
      contactNumber: Number(contactNum),
      email: email,
      streetAddress: streetAddress,
      city: city,
      state: stateValue,
      zipCode: Number(zipCode),
    };

    const id = userData?.id;
    userUpdate({ id, address });
    dispatch(setAddress({ address: [address] }));
    setFullName("");
    setContactNum("");
    setEmail("");
    setStreetAddress("");
    setStateValue("");
    setCity("");
    setZipCode("");
    setIsEditing(false);
  };

  const handleEdit = () => {
    if (userData?.address && userData.address.length > 0) {
      const currentAddress = userData.address[0];
      setFullName(currentAddress.fullName);
      setContactNum(String(currentAddress.contactNumber));
      setEmail(currentAddress.email);
      setStreetAddress(currentAddress.streetAddress);
      setStateValue(currentAddress.state);
      setCity(currentAddress.city);
      setZipCode(String(currentAddress.zipCode));
      setIsEditing(true);
    }
  };

  const [
    placeOrder,
    { isLoading: isPlaceOrderLoading, isError: isPlaceOrderError },
  ] = useCreateOrderMutation();

  // Calculate total price
  const subtotal = fetchedData?.cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = 60;
  const total = subtotal + deliveryFee;
  const handlePlaceOrder = () => {
    const id = userData?.id;
    const items = fetchedData.cart;
    const shippingAddress = userData?.address[0];
    console.log("Click handlePlaceOrder");
    placeOrder({ id, items, shippingAddress })
      .unwrap().
      then()
      .catch()
      .finally(navigation.reset({ index: 0, routes: [{ name: "tabs" }] }));
  };

  return (
    <View style={styles.container}>
      <CustomHeader />
      {isUserUpdateLoading && <ActivityIndicator size="large" color="black" />}
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text
          style={{
            alignSelf: "center",
            fontSize: 15,
            letterSpacing: 2,
            marginBottom: 10,
          }}
        >
          Your Selected Product
        </Text>
        {fetchedData?.cart && <ProductList products={fetchedData.cart} />}
        <View
          style={{
            height: 2,
            width: "90%",
            marginVertical: 10,
            backgroundColor: "lightgrey",
            alignSelf: "center",
          }}
        />
        <Text
          style={{
            alignSelf: "center",
            fontSize: 15,
            letterSpacing: 2,
            marginBottom: 10,
          }}
        >
          {isEditing ? "Fill Shipping Address" : "Shipping Address"}
        </Text>

        {isUserUpdateError && (
          <Text
            style={{
              color: "red",
              fontSize: 20,
              fontWeight: "600",
              alignSelf: "center",
            }}
          >
            {userUpdateError?.data?.message || "Error updating address"}
          </Text>
        )}

        {isEditing ? (
          // Address Form
          <View style={{ marginBottom: 20 }}>
            <CustomInput
              label="Full Name"
              placeholder="Full Name"
              value={fullName}
              onChangeText={setFullName}
            />
            <CustomInput
              label="Contact Number"
              placeholder="Contact Number"
              value={contactNum}
              onChangeText={setContactNum}
            />
            <CustomInput
              label="Email Address"
              placeholder="Email Address"
              value={email}
              onChangeText={setEmail}
            />
            <CustomInput
              label="Street Address"
              placeholder="Street Address"
              value={streetAddress}
              onChangeText={setStreetAddress}
            />
            <CustomInput
              label="State"
              placeholder="State"
              value={stateValue}
              onChangeText={setStateValue}
            />
            <CustomInput
              label="City"
              placeholder="City"
              value={city}
              onChangeText={setCity}
            />
            <CustomInput
              label="ZIP Code"
              placeholder="Zip Code"
              value={zipCode}
              onChangeText={setZipCode}
            />
            <CustomButton
              text={
                userData?.address?.length > 0 ? "Update Address" : "Add Address"
              }
              style={{ marginTop: 15 }}
              onPress={handleAddressSubmit}
            />
          </View>
        ) : (
          // Address Card
          <View style={styles.addressCard}>
            <View style={styles.header}>
              <Text style={styles.headerText}>Shipping Address</Text>
              <TouchableOpacity onPress={handleEdit}>
                <Text style={styles.editButton}>Edit</Text>
              </TouchableOpacity>
            </View>
            {userAddress && (
              <>
                <View style={styles.addressDetail}>
                  <Text style={styles.label}>Fullname:</Text>
                  <Text style={styles.value}>{userAddress?.fullName}</Text>
                </View>
                <View style={styles.addressDetail}>
                  <Text style={styles.label}>Contact:</Text>
                  <Text style={styles.value}>{userAddress?.contactNumber}</Text>
                </View>
                <View style={styles.addressDetail}>
                  <Text style={styles.label}>Email:</Text>
                  <Text style={styles.value}>{userAddress?.email}</Text>
                </View>
                <View style={styles.addressDetail}>
                  <Text style={styles.label}>Street:</Text>
                  <Text style={styles.value}>{userAddress?.streetAddress}</Text>
                </View>
                <View style={styles.addressDetail}>
                  <Text style={styles.label}>State:</Text>
                  <Text style={styles.value}>{userAddress?.state}</Text>
                </View>
                <View style={styles.addressDetail}>
                  <Text style={styles.label}>City:</Text>
                  <Text style={styles.value}>{userAddress?.city}</Text>
                </View>
                <View style={styles.addressDetail}>
                  <Text style={styles.label}>PinCode:</Text>
                  <Text style={styles.value}>{userAddress?.zipCode}</Text>
                </View>
              </>
            )}
          </View>
        )}
      </ScrollView>

      {/* Footer Card */}
      <View style={styles.totalsCard}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal:</Text>
          <Text style={styles.totalValue}>₹{subtotal}</Text>
        </View>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Delivery:</Text>
          <Text style={styles.totalValue}>+ ₹{deliveryFee}</Text>
        </View>
        <View style={[styles.totalRow, { marginTop: 8 }]}>
          <Text style={styles.grandTotal}>Total:</Text>
          <Text style={styles.grandTotal}>₹{total}</Text>
        </View>
        <CustomButton
          text="Order Confirm"
          style={{ marginTop: 10 }}
          onPress={handlePlaceOrder}
        />
      </View>
    </View>
  );
};

export default PlaceOrder;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
  },
  flatList: {},
  listCard: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#f0f0f0",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  title: {
    color: "#002140",
    marginTop: 6,
    marginLeft: 5,
    fontSize: 25,
    fontFamily: "Philosopher_700Bold",
  },
  price: {
    fontSize: 18,
    fontWeight: "500",
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
  addressCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginHorizontal: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  editButton: {
    borderColor: "#0D986A",
    borderWidth: 2,
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 3,
    fontSize: 14,
    color: "#0D986A",
    fontWeight: "600",
  },
  addressDetail: {
    flexDirection: "row",
    marginBottom: 10,
  },
  label: {
    fontWeight: "600",
    color: "#555",
    width: 90,
  },
  value: {
    color: "#333",
    flexShrink: 1,
  },
});

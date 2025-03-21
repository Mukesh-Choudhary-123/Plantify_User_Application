import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { FontAwesome } from "@expo/vector-icons";
import Home from "./home";
import Cart from "./cart";
import Profile from "./profile";
import Wishlist from "./wishlist";
import React from "react";
import { Keyboard, View } from "react-native";

const Tab = createBottomTabNavigator();

const TabLayout = () => {
  const [isKeyboardVisible, setKeyboardVisible] = React.useState(false);

  React.useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Common style for tab icons
  const iconContainerStyle = (focused) => ({
    backgroundColor: focused ? "lightgrey" : "transparent",
    width: 70,
    borderRadius: 19,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
  });

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#0D986A",
          tabBarInactiveTintColor: "#808080",
          tabBarStyle: {
            backgroundColor: "#fff",
            height: 65,
            display: isKeyboardVisible ? "none" : "flex",
          },
          tabBarLabelStyle: {
            fontSize: 16,
            fontWeight: "600",
          },
          tabBarItemStyle: { paddingTop: 7 },
        }}
      >
        <Tab.Screen
          name="home"
          component={Home}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <View style={iconContainerStyle(focused)}>
                <FontAwesome name="home" size={30} color={color} />
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="wishlist"
          component={Wishlist}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <View style={iconContainerStyle(focused)}>
                <FontAwesome name="heart" size={30} color={color} />
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="cart"
          component={Cart}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <View style={iconContainerStyle(focused)}>
                <FontAwesome name="shopping-cart" size={30} color={color} />
              </View>
            ),
          }}
        />

        <Tab.Screen
          name="profile"
          component={Profile}
          options={{
            tabBarIcon: ({ focused, color, size }) => (
              <View style={iconContainerStyle(focused)}>
                <FontAwesome name="user" size={30} color={color} />
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

export default TabLayout;

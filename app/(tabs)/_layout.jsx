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

  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          // tabBarShowLabel: false,
          tabBarActiveTintColor: "#0D986A",
          tabBarInactiveTintColor: "#808080",
          tabBarStyle: {
            backgroundColor: "#fff",
            height: 70,
            display: isKeyboardVisible ? "none" : "flex", 
          },
          tabBarItemStyle: { paddingTop: 10 },
        }}
      >
        <Tab.Screen
          name="home"
          component={Home}
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="home" size={size} color={color}/>
            ),
          }}
        />
        <Tab.Screen
          name="wishlist"
          component={Wishlist}
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="heart" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="cart"
          component={Cart}
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="shopping-cart" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="profile"
          component={Profile}
          options={{
            tabBarIcon: ({ color, size }) => (
              <FontAwesome name="user" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

export default TabLayout;

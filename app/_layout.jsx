import React from "react";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import AuthLayout from "./auth/_layout";
import TabLayout from "./(tabs)/_layout";
import NotFoundScreen from "./+not-found";
import { Provider } from "react-redux";
import { store } from "../redux/store";
import "../global.css";

const Stack = createStackNavigator();

const RootLayout = () => {
  return (
    <Provider store={store}> 
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="auth"
        component={AuthLayout}
        options={{
          gestureEnabled: true,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Stack.Screen
        name="tabs"
        component={TabLayout}
        options={{
          gestureEnabled: true,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <Stack.Screen name="NotFound" component={NotFoundScreen} />
      </Stack.Navigator>
      </Provider>
  );
};

export default RootLayout;

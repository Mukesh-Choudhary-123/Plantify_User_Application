import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { setCredentials } from "../redux/slices/authSlice";

const AppInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        const userString = await AsyncStorage.getItem("user");
        const user = userString ? JSON.parse(userString) : null;

        if (token && user) {
          // Dispatch the credentials to Redux store
          dispatch(setCredentials({ user, token }));
        }
      } catch (error) {
        console.error("Error retrieving user credentials:", error);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, [dispatch]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return children;
};

export default AppInitializer;

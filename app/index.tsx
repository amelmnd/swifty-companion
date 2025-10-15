import { Pressable, Text, View } from "react-native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./screens/LoginScreen";
import ProfileScreen from "./ProfileScreen";
import { router } from "expo-router";

export default function Index() {
  const Stack = createNativeStackNavigator();
  return (
    <LoginScreen />
    //       <OpenConnect />

  );
}



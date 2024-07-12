import React, { useState, useEffect } from "react";
import {
  Button,
  Pressable,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useFonts } from "expo-font";
import Ionicons from "@expo/vector-icons/Ionicons";

const Loginpage = ({ promptAsync }:any) => {
  const [fontsLoaded] = useFonts({
    Poppins: require("../assets/fonts/Poppins-SemiBold.ttf"),
  });

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <LinearGradient
      colors={["rgba(132, 155, 218, 0.3)", "rgba(77, 98, 179, 0.4)"]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.upper}>
        <Image
          source={require("../assets/images/Avatar.png")}
          alt="Avatar"
          style={styles.avatar}
          contentFit="contain"
        />
      </View>
      <View style={styles.lower}>
        <Image
          source={require("../assets/images/geekyants.png")}
          alt="GeekyAnts Logo"
          style={styles.geekyants}
          contentFit="contain"
        />
        <Text style={styles.para}>Log In To Your Account</Text>
        <Pressable style={styles.button} onPress={() => promptAsync()}>
          <Ionicons name="logo-google" size={16} color="white" />
          <Text style={styles.buttontext}>Continue With Google</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
};

export default Loginpage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 0,
    padding: "10%",
    gap: 20,
  },
  upper: {
    flex: 0.5,
    justifyContent: "flex-end",
  },
  avatar: {
    height: 200,
  },
  lower: {
    flex: 0.5,
    top: 20,
  },
  geekyants: {
    height: 50,
    width: "50%",
  },
  para: {
    color: "black",
    fontWeight: "600",
    fontSize: 24,
    fontFamily: "Poppins",
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    alignItems: "center",
    backgroundColor: "#FC5A5A",
    height: 50,
    width: "95%",
    top: 13,
    borderRadius: 10,
  },
  buttontext: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
    fontFamily: "Poppins",
  },
});

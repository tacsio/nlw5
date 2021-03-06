import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { getStatusBarHeight } from "react-native-iphone-x-helper";
import AsyncStorage from "@react-native-async-storage/async-storage";

import img from "../../assets/icon.png";
import colors from "../styles/colors";
import fonts from "../styles/fonts";

export function Header() {
  const [username, setUsername] = useState<string>();

  useEffect(() => {
    async function loadUsernameFromStorage() {
      const user = await AsyncStorage.getItem("@plantmanager:user");
      setUsername(user || "");
    }

    loadUsernameFromStorage();
  }, []);

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.greeting}>Olá,</Text>
        <Text style={styles.username}>{username}</Text>
      </View>

      <Image style={styles.avatar} source={img} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    marginTop: getStatusBarHeight(),
  },
  greeting: {
    fontSize: 30,
    color: colors.heading,
    fontFamily: fonts.text,
  },
  username: {
    fontSize: 30,
    fontFamily: fonts.heading,
    color: colors.heading,
    lineHeight: 40,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 40,
  },
});

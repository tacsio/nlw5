import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, FlatList } from "react-native";
import { Header } from "../components/Header";
import colors from "../styles/colors";

import { loadPlants, PlantProps } from "../libs/Storage";
import { formatDistance } from "date-fns";
import { pt } from "date-fns/locale";
import fonts from "../styles/fonts";
import { PlantCardSecondary } from "../components/PlantCardSecondary";

import waterdrop from "../assets/waterdrop.png";

export default function MyPlants() {
  const [myPlants, setMyPlants] = useState<PlantProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextWatered, setNextWatered] = useState<string>();

  useEffect(() => {
    async function loadStorageData() {
      const storedPlants = await loadPlants();

      const nextTime = formatDistance(
        new Date(storedPlants[0].dateTimeNotification).getTime(),
        new Date().getTime(),
        { locale: pt }
      );

      setNextWatered(
        `Não esqueça de regar a ${storedPlants[0].name} à ${nextTime}`
      );

      setMyPlants(storedPlants);
      setLoading(false);
    }

    loadStorageData();
  }, []);

  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.spotlight}>
        <Image source={waterdrop} style={styles.spotlightImage} />
        <Text style={styles.spotlightText}>{nextWatered}</Text>
      </View>

      <View style={styles.plants}>
        <Text style={styles.plantTitle}>Próximas Regadas</Text>

        <FlatList
          data={myPlants}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <PlantCardSecondary data={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 10 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 30,
    paddingTop: 50,
    backgroundColor: colors.background,
  },
  spotlight: {
    backgroundColor: colors.blue_light,
    paddingHorizontal: 20,
    borderRadius: 20,
    height: 110,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  spotlightImage: {
    width: 60,
    height: 60,
  },
  spotlightText: {
    flex: 1,
    color: colors.blue,
    paddingHorizontal: 20,
  },
  plants: {
    flex: 1,
    width: "100%",
  },
  plantTitle: {
    fontSize: 24,
    fontFamily: fonts.heading,
    color: colors.heading,
    marginVertical: 20,
  },
});

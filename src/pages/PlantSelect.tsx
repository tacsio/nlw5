import React, { useEffect, useState } from "react";

import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";

import { PlantProps } from "../libs/Storage";
import { EnvironmentButton } from "../components/EnvironmentButton";

import { Header } from "../components/Header";
import { PlantCardPrimary } from "../components/PlantCardPrimary";
import { Load } from "../components/Load";

import api from "../services/api";

import colors from "../styles/colors";
import fonts from "../styles/fonts";
import { useNavigation } from "@react-navigation/core";

interface EnvironmentProps {
  key: string;
  title: string;
}


export function PlantSelect() {
  const navigation = useNavigation();

  const [environments, setEnvironments] = useState<EnvironmentProps[]>([]);
  const [plants, setPlants] = useState<PlantProps[]>([]);
  const [selectedEnv, setSelectedEnv] = useState("all");
  const [filteredPlants, setFilteredPlants] = useState<PlantProps[]>([]);

  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    async function fetchEnvironment() {
      const { data } = await api.get(
        "plants_environments?_sort=title&order=asc"
      );
      setEnvironments([
        {
          key: "all",
          title: "Todos",
        },
        ...data,
      ]);
    }

    fetchEnvironment();
  }, []);

  useEffect(() => {
    fetchPlants();
  }, []);

  async function fetchPlants() {
    const { data } = await api.get(
      `plants?_sort=name&order=asc&_page=${page}&_limit=8`
    );

    if (!data) {
      return setLoading(true);
    }

    if (page > 1) {
      setPlants((oldValue) => [...oldValue, ...data]);
      setFilteredPlants((oldValue) => [...oldValue, ...data]);
    } else {
      setPlants(data);
      setFilteredPlants(data);
    }
    setLoading(false);
    setLoadingMore(false);
  }

  function handleEnvSelection(selectedEnv: string) {
    setSelectedEnv(selectedEnv);

    if (selectedEnv === "all") {
      return setFilteredPlants(plants);
    }

    const filtered = plants.filter((plant) =>
      plant.environments.includes(selectedEnv)
    );
    setFilteredPlants(filtered);
  }

  function handleFetchMore(distance: number) {
    if (distance < 1) {
      return;
    }

    setLoadingMore(true);
    setPage((oldValue) => oldValue + 1);
    fetchPlants();
  }

  function handlePlantSelect(plant: PlantProps) {
    navigation.navigate("PlantSave", { plant });
  }

  if (loading) {
    return <Load />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header />
        <Text style={styles.title}>Em qual ambiente</Text>
        <Text style={styles.subtitle}>Você quer colocar sua planta?</Text>
      </View>

      <View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.environmentList}
          data={environments}
          keyExtractor={(item) => String(item.key)}
          renderItem={({ item }) => (
            <EnvironmentButton
              title={item.title}
              active={item.key === selectedEnv}
              onPress={() => handleEnvSelection(item.key)}
            />
          )}
        />
      </View>

      <View style={styles.plants}>
        <FlatList
          showsVerticalScrollIndicator={false}
          numColumns={2}
          data={filteredPlants}
          onEndReachedThreshold={0.1}
          keyExtractor={(item) => String(item.id)}
          onEndReached={({ distanceFromEnd }) =>
            handleFetchMore(distanceFromEnd)
          }
          renderItem={({ item }) => (
            <PlantCardPrimary
              data={item}
              onPress={() => handlePlantSelect(item)}
            />
          )}
          ListFooterComponent={
            loadingMore ? <ActivityIndicator color={colors.green} /> : <></>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 17,
    color: colors.heading,
    fontFamily: fonts.heading,
    lineHeight: 20,
    marginTop: 15,
  },
  subtitle: {
    fontSize: 17,
    color: colors.heading,
    fontFamily: fonts.text,
    lineHeight: 20,
  },
  environmentList: {
    height: 40,
    justifyContent: "center",
    paddingBottom: 5,
    marginHorizontal: 32,
    marginVertical: 32,
  },
  plants: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: "center",
  },
});

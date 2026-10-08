import { Text, View, StyleSheet, Pressable, ScrollView } from "react-native";
import { globalStyles } from "../constants/styles";
import {
  getItems,
  removeItem,
  type Item,
} from '../constants/storage'
import { useCallback, useState } from "react";
import { Stack, useFocusEffect, useRouter } from 'expo-router'
import { Search } from 'lucide-react-native'
import CityCard from "@/components/CityCard";

export default function Index() {

  const [items, setItems] = useState<Item[]>([])
  
  const router = useRouter()

  useFocusEffect(
    useCallback(() => {
      async function loadItems() {
        const savedItems = await getItems()
        setItems(savedItems)
      }

      loadItems()
    }, []),
  )

  return (
    <>
    <Stack.Screen
      options={{
        title: 'Favoris',

        headerRight: () => (
          <Pressable
            onPress={() => router.push('/search' as any)}
            hitSlop={20}
            style={{
              margin: 15
            }}
          >
            <Search color='white' />
          </Pressable>
        )
      }}
    />

    <View style={globalStyles.screen}>
      <ScrollView
        contentContainerStyle={
          globalStyles.centerColumn
        }
      >
        {items.map((entry) => (
          <CityCard key={entry.id} name={entry.name} country={entry.country} region={entry.region} district={entry.district} lat={entry.lat} long={entry.long} />
        ))}
      </ScrollView>
    </View>
    </>
  );
}



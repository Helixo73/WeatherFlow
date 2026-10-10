import CityCard from '@/components/CityCard'
import { APICall } from '@/composables/API'
import { globalStyles } from '@/constants/styles'
import { Stack, useRouter } from 'expo-router'
import { ChevronLeft } from 'lucide-react-native'
import { useEffect, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native'
export default function SearchPage() {

  type City = {
    id: number,
    name: string,
    latitude: number,
    longitude: number,
    country: string,
    admin1: string,
    admin2: string,
  };

  const [searchedText, setSearchedText] = useState("")
  const [results, setResults] = useState<City[]>([])
  const router = useRouter()
  const searchCity = async () => {
    const response = await APICall.searchCity(searchedText)
    setResults(response?.results ?? []);
  }
  useEffect(() => {
    searchCity()
  }, [searchedText]) 
  return (
    <>
    <Stack.Screen 
      options={{
        title: 'Rechercher',
        headerLeft: () => (
          <Pressable
            onPress={() => router.back()}
            hitSlop={20}
            style={{
              margin: 15
            }}
          >
            <ChevronLeft color='white' />
          </Pressable>
        ),
      }}
    />
    <View
    style={[
        globalStyles.screen,
        globalStyles.centerColumn
    ]}>
      <TextInput
        style={styles.input}
        value={searchedText}
        onChangeText={setSearchedText}
        placeholder='Rechercher une ville'
        placeholderTextColor= 'white'
      />
      <ScrollView
        style={{
          margin: 20,
        }}
      >
        {results.map((city) => (
          <CityCard key={city.id} name={city?.name} country={city.country} region={city.admin1} district={city.admin2} lat={city.latitude} long={city.longitude} />
        ))}
      </ScrollView>
    </View>
    </>
  )
}
const styles = StyleSheet.create({
  input: {
    backgroundColor: '#ffffff80',
    padding: 10,
    margin: 10,
    width: 350,
    borderStyle: 'solid',
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 10,
    color: 'white',
    fontFamily: 'PoppinsBlack'
  }
})
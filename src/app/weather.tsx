import { Stack, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { APICall } from '@/composables/API';
import { globalStyles } from '@/constants/styles';
import { View, StyleSheet, ActivityIndicator, Text, ScrollView, Pressable } from 'react-native';
import { WeatherCard } from '@/components/WeatherCard';
import { HourlyCard } from '@/components/HourlyCard';
import { DailyCard } from '@/components/DailyCard';
import { addItem, getItems, Item, removeItem } from '@/constants/storage';
import { Star } from 'lucide-react-native';

type Props = {
    latitude: string,
    longitude: string,
    name: string,
    country: string,
    region: string,
    district: string
}
type CurrentWeatherInfo = {
  time: string,
  interval: number,
  temperature_2m: number,
  weather_code: number,
  is_day: number,
}
type HourlyWeatherRaw = {
  time: string[],
  temperature_2m: number[],
  weather_code: number[],
  is_day: number[],
}
type HourlyWeatherEntry = {
  time: string,
  temperature_2m: number,
  weather_code: number,
  is_day: number,
}
type HourlyWeatherInfo = HourlyWeatherEntry[]

type DailyWeatherRaw = {
  time: string[],
  temperature_2m_max: number[],
  temperature_2m_min: number[],
  weather_code: number[],
}
type DailyWeatherEntry = {
  time: string,
  temperature_2m_max: number,
  temperature_2m_min: number,
  weather_code: number,
}
type DailyWeatherInfo = DailyWeatherEntry[]



export default function WeatherPage() {
    const { latitude, longitude, name, country, region, district } = useLocalSearchParams<Props>()
    const lat = Number(latitude)
    const long = Number(longitude)
    const id = `${lat},${long}`
    const [currentWeather, setCurrentWeather] = useState<CurrentWeatherInfo>()
    const [hourlyWeather, setHourlyWeather] = useState<HourlyWeatherInfo>()
    const [dailyWeather, setDailyWeather] = useState<DailyWeatherInfo>()
    const [isLoadingWeather, setIsLoadingWeather] = useState(true)
    const [items, setItems] = useState<Item[]>([])
    const [isFavourite, setIsFavourite] = useState(false)

    useEffect(() => {
      getList()
    }, [])

    useEffect(() => {
      setIsFavourite(isInList)
    }, [items])


    const getList = () => {
      getItems().then(setItems)
    }
    const isInList = items.some((item) => item.id === id)
    const handleChange = async () => {
      setIsFavourite(!isFavourite)
      if(!isFavourite) await addItem({name, lat, long, country, district, region, id})
      else await removeItem(id)
    }
    const transformHourlyWeather = (hourly: HourlyWeatherRaw): HourlyWeatherInfo => {
      return hourly.time.map((time, index) => ({
        time,
        temperature_2m: hourly.temperature_2m[index],
        weather_code: hourly.weather_code[index],
        is_day: hourly.is_day[index],
      }))
    }
    const transformDailyWeather = (daily: DailyWeatherRaw): DailyWeatherInfo => {
      return daily.time.map((time, index) => ({
        time,
        temperature_2m_max: daily.temperature_2m_max[index],
        temperature_2m_min: daily.temperature_2m_min[index],
        weather_code: daily.weather_code[index],
      }))
    }

    const getCurrentWeather = async () => {
      const response = await APICall.getCurrentWeather(lat, long)
      setCurrentWeather(response?.current)
    }
    const getHourlyWeather = async () => {
      const response = await APICall.getHourlyWeather(lat, long)
      setHourlyWeather(transformHourlyWeather(response?.hourly))
    }
    const getdailyWeather = async () => {
      const response = await APICall.getDailyWeather(lat, long)
      setDailyWeather(transformDailyWeather(response?.daily))
    }

    useFocusEffect(
      useCallback(() => {
        const fetchAll = async () => {
          setIsLoadingWeather(true)
          await Promise.all([getCurrentWeather(), getHourlyWeather(), getdailyWeather()])
          setIsLoadingWeather(false)
        }
        fetchAll()
      }, []),
    )

    return <>
        <Stack.Screen
          options={{
            title: name,
            headerRight: () => (
              <Pressable
                onPress={() => handleChange()}
                hitSlop={20}
                style={{
                  margin: 15
                }}
              >
                <Star fill={isFavourite ? 'white' : 'none'} color='white' />
              </Pressable>
            )
          }}
        />
        <View
          style={[
            globalStyles.screen,
            styles.screen,
          ]}
        >
          <ScrollView
            contentContainerStyle={[
              globalStyles.centerColumn,
              styles.contrainer,
            ]}
          >
            {isLoadingWeather ? (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#ffffff" style={{ transform: [{ scale: 3 }] }} />
              </View>
            ) : (
              <>
                {currentWeather && (
                  <WeatherCard
                    weather_code={currentWeather.weather_code}
                    is_day={currentWeather.is_day}
                  />
                )}
                {hourlyWeather && (
                  <HourlyCard hourlyWeather={hourlyWeather} />
                )}
                {dailyWeather && (
                  <DailyCard dailyWeather={dailyWeather} />
                )}
              </>
            )}
          </ScrollView>
        </View>
    </>
}

const styles = StyleSheet.create({
  screen: {
    gap: 10,
    padding: 8,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contrainer: {
    gap: 8,
  }
});
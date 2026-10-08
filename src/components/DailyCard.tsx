import { View, StyleSheet, Text } from "react-native"
import { DayCard } from "./DayCard";

type DailyWeatherEntry = {
  time: string,
  temperature_2m_max: number,
  temperature_2m_min: number,
  weather_code: number,
}
type DailyCardProps = {
  dailyWeather: DailyWeatherEntry[];
};

export function DailyCard({ dailyWeather }: DailyCardProps) {
  return (
    <View style={styles.card}>
      {dailyWeather.map((entry) => (
        <DayCard key={entry.time} time={entry.time} weather_code={entry.weather_code} temperature_2m_max={entry.temperature_2m_max} temperature_2m_min={entry.temperature_2m_min} />
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff80',
        padding: 15,
        width: '100%',
        height: 350,
        gap: 8,
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 20,
    },
    
})
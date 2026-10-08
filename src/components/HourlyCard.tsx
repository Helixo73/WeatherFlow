import { ScrollView, StyleSheet, View } from "react-native"
import { HourCard } from "./HourCard"

type HourlyWeatherEntry = {
    time: string,
    temperature_2m: number,
    weather_code: number,
    is_day: number,
}

type Props = {
    hourlyWeather: HourlyWeatherEntry[]
}

export function HourlyCard({ hourlyWeather }: Props) {
    return (
        <View style={styles.card}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ padding: 16, gap: 12 }}
            >
                {hourlyWeather.map((entry) => (
                    <HourCard
                        key={entry.time}
                        time={entry.time}
                        weather_code={entry.weather_code}
                        is_day={entry.is_day}
                        temperature_2m={entry.temperature_2m}
                    />
                ))}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff80',
        padding: 2,
        width: '100%',
        height: 150,
        gap: 8,
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 20,
    }
})
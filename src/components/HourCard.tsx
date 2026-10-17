import { globalStyles } from "@/constants/styles";
import { StyleSheet, Text, View } from "react-native";
import { getWeatherIcon, icons } from '../composables/InterpretWeatherCode';


type Props = {
    time: string,
    weather_code: number,
    is_day: number,
    temperature_2m: number,
}

export function HourCard({ time, weather_code, is_day, temperature_2m }: Props) {

    const iconName = getWeatherIcon(weather_code, is_day)
    const IconComponent = iconName ? icons[iconName] : icons.ShieldQuestionMark
    const formatTime = formatHeureFr(time)
    const newTemperature = Math.round(temperature_2m)

    return (
        <View style={[
            globalStyles.centerColumn,
            styles.card
        ]}>
            <IconComponent size={32} color="white" />
            <Text style={styles.title}>{newTemperature}°C</Text>
            <Text style={styles.title}>{formatTime}</Text>
        </View>
    )
}

function formatHeureFr(isoString: string): string {
  const date = new Date(isoString);
  return date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

const styles = StyleSheet.create({
    title: {
        fontFamily: 'PoppinsBlack',
        fontSize: 20,
        color: 'white',
    },
    card: {
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: 'white',
        padding: 10,
        borderRadius: 20,
    }
})
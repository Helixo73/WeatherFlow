import { getWeatherIcon, icons } from '@/composables/InterpretWeatherCode'
import { Text, StyleSheet, View } from 'react-native'



type DailyWeatherEntry = {
  time: string,
  temperature_2m_max: number,
  temperature_2m_min: number,
  weather_code: number,
}

export function DayCard({time, temperature_2m_max, temperature_2m_min, weather_code}: DailyWeatherEntry) {

    const updatedTime = formatDateRelative(time)
    const iconName = getWeatherIcon(weather_code, 1)
    const IconComponent = iconName ? icons[iconName] : icons.ShieldQuestionMark
    return <>
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Text style={styles.title}>{updatedTime}:</Text>
            <View
                style={{
                    marginLeft: 'auto',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: 10,
                }}
            >
                <Text style={styles.title}>{temperature_2m_min}°C</Text>
                <Text style={styles.title}>{temperature_2m_max}°C</Text>
                <IconComponent size={32} color='white' />
            </View>
        </View>
    </>
}

function formatDateRelative(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  if (date.getTime() === today.getTime()) return "Aujourd'hui";
  if (date.getTime() === tomorrow.getTime()) return "Demain";

  const weekday = new Intl.DateTimeFormat('fr-FR', { weekday: 'long' }).format(date);
  return weekday.charAt(0).toUpperCase() + weekday.slice(1);
}

const styles = StyleSheet.create({
    title: {
        fontFamily: 'PoppinsBlack',
        fontSize: 20,
        color: 'white',
    },
})
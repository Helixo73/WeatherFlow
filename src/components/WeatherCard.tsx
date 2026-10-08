import { View, StyleSheet,Text } from 'react-native'
import { getWeatherIcon, icons, getWeatherKeyword } from '../composables/InterpretWeatherCode'
import { globalStyles } from '@/constants/styles'


type Props = {
    weather_code: number,
    is_day: number,        
}

export function WeatherCard({ weather_code, is_day }: Props) {
    const iconName = getWeatherIcon(weather_code, is_day)
    const IconComponent = iconName ? icons[iconName] : icons.ShieldQuestionMark
    const keyword = getWeatherKeyword(weather_code)
    return <>
        <View style={styles.card} >
            <IconComponent size={100} color="white" />
        </View>
        <Text style={globalStyles.title}>{keyword}</Text>
    </>
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff80',
        padding: 20,
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 40,
    }
})
import { globalStyles } from '@/constants/styles'
import { ArrowUp, MoveUp, Wind } from 'lucide-react-native'
import { View, Text, StyleSheet } from 'react-native'

type Props = {
    time: string,
    interval: number,
    wind_speed_10m: number,
    wind_direction_10m: number,
    wind_gusts_10m: number,
}

export function WindCard({ time, interval, wind_speed_10m, wind_direction_10m, wind_gusts_10m }: Props) {

    const kts = Math.round(wind_speed_10m)
    const kmh = Math.round(wind_speed_10m * 1.852)

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Vent:</Text>
            <View style={styles.interCard}>
                <View style={styles.item}>
                    <Wind color="white" size={70} />
                    <Text style={styles.title}>{kts} kts/ {kmh} km/h</Text>
                </View>
                <View style={styles.item}>
                    <View style={styles.compass}>
                        <Text style={[styles.letter, styles.north]}>N</Text>
                        <Text style={[styles.letter, styles.east]}>E</Text>
                        <Text style={[styles.letter, styles.south]}>S</Text>
                        <Text style={[styles.letter, styles.west]}>O</Text>

                        <View style={{ transform: [{ rotate: `${(wind_direction_10m + 180) % 360}deg` }] }}>
                            <MoveUp color="white" size={40} />
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#ffffff80',
        padding: 2,
        width: '100%',
        height: 200,
        
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    interCard: {
        padding: 2,
        margin: 5,
        height: '75%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 32,
        flexDirection: 'row',
        marginBottom: 10,
    },
    item: {
        padding: 2,
        width: '40%',
        height: '95%',
        justifyContent: 'center',
        alignItems: 'center',
        borderStyle: 'solid',
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 20
    },
    compass: {
        width: 110,
        height: 110,
        justifyContent: 'center',
        alignItems: 'center',
    },
    letter: {
        position: 'absolute',
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    title: {
        fontFamily: 'PoppinsBlack',
        fontSize: 16,
        color: 'white',
    },
    north: { top: 0 },
    south: { bottom: 0 },
    east: { right: 0 },
    west: { left: 0 },
})
import { useRouter } from "expo-router"
import { Pressable, StyleSheet, Text, View } from "react-native"

type CityCard = {
    name: string,
    country: string,
    region: string,
    district: string,
    lat: number,
    long: number
}

export default function CityCard({name, country, region, district, lat, long}: CityCard) {

    const router = useRouter()


    return (
        <>
        <Pressable
            style={styles.Card}
            onPress={() => {
                router.push({
                    pathname: '/weather',
                    params: {
                        latitude: lat,
                        longitude: long,
                        name: name,
                        country: country,
                        region: region,
                        district: district
                    }
                })
            }}
        >
            <View>
                <Text style={{
                    color: 'white',
                    fontFamily: 'PoppinsBlack',
                    fontSize: 15,
                }}>{name}</Text>
                <Text style={{
                    color: 'white',
                    fontFamily: 'PoppinsBlack',
                    fontSize: 15,
                }}>{country}, {region}, {district}</Text>
            </View>
        </Pressable>
        </>
    )
}

const styles = StyleSheet.create({
    Card: {
        borderStyle: 'solid',
        backgroundColor: '#ffffff80',
        width: 325,
        height: 90,
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 20,
        margin: 5,
        padding: 10,
    }
})
import { StyleSheet } from "react-native";

export const globalStyles = StyleSheet.create({
    title: {
        fontFamily: 'PoppinsBlack',
        fontSize: 24,
        color: 'white',
    },
    screen: {
        backgroundColor: '#00aeff',
        flex: 1,
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    centerColumn: {
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
})
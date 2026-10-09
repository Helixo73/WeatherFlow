import { Stack } from "expo-router";
import { useFonts } from 'expo-font';
import { ActivityIndicator, View } from 'react-native';
import { globalStyles } from "@/constants/styles";

export default function RootLayout() {

  const [fontsLoaded] = useFonts({
    Poppins: require('../../assets/fonts/Poppins_400Regular.ttf'),
    PoppinsSemiBold: require('../../assets/fonts/Poppins_600SemiBold.ttf'),
    PoppinsBold: require('../../assets/fonts/Poppins_700Bold.ttf'),
    PoppinsBlack: require('../../assets/fonts/Poppins_900Black.ttf'),
  });

  if(!fontsLoaded) {
    return <View style={[
      globalStyles.screen,
      globalStyles.centerContent
    ]}>
      <ActivityIndicator size="large" color="#ffffff" style={{ transform: [{ scale: 1.5 }] }} />
    </View>
  }

  return <Stack
      screenOptions={{
        headerTintColor: '#ffffff',
        headerStyle: {
          backgroundColor: '#00aeff',
        },
        headerTitleStyle: {
          fontFamily: 'PoppinsBlack',
          fontSize: 24,
          color: 'white'
        },
      }}
    />;
}
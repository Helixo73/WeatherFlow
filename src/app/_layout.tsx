import { Stack } from "expo-router";
import { useFonts } from 'expo-font';
import { ActivityIndicator, View } from 'react-native';
import { globalStyles } from "@/constants/styles";
import {
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_900Black,
} from '@expo-google-fonts/poppins';
export default function RootLayout() {

  const [fontsLoaded] = useFonts({
    Poppins: Poppins_400Regular,
    PoppinsSemiBold: Poppins_600SemiBold,
    PoppinsBold: Poppins_700Bold,
    PoppinsBlack: Poppins_900Black,
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

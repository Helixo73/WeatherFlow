import { Sun, Moon, CloudSun, CloudMoon, Cloud, CloudFog, CloudDrizzle, CloudRain, CloudRainWind, CloudHail, CloudSnow, Snowflake, CloudSunRain, CloudMoonRain, CloudLightning, ShieldQuestionMark } from 'lucide-react-native'

export const icons = {
  Sun, Moon, CloudSun, CloudMoon, Cloud, CloudFog, CloudDrizzle,
  CloudRain, CloudRainWind, CloudHail, CloudSnow, Snowflake,
  CloudSunRain, CloudMoonRain, CloudLightning, ShieldQuestionMark
}

type IconName = keyof typeof icons

type WeatherIcons = { day: IconName; night: IconName; keyword: string }

const WeatherIcons: Partial<Record<number, WeatherIcons>> = {
    0: { day: 'Sun', night: 'Moon', keyword: 'Ciel dégagé' },
    1: { day: 'CloudSun', night: 'CloudMoon', keyword: 'Principalement dégagé' },
    2: { day: 'CloudSun', night: 'CloudMoon', keyword: 'Partiellement nuageux' },
    3: { day: 'Cloud', night: 'Cloud', keyword: 'Couvert' },
    45: { day: 'CloudFog', night: 'CloudFog', keyword: 'Brouillard' },
    48: { day: 'CloudFog', night: 'CloudFog', keyword: 'Brouillard givrant' },
    51: { day: 'CloudDrizzle', night: 'CloudDrizzle', keyword: 'Bruine légère' },
    53: { day: 'CloudDrizzle', night: 'CloudDrizzle', keyword: 'Bruine modérée' },
    55: { day: 'CloudDrizzle', night: 'CloudDrizzle', keyword: 'Bruine dense' },
    56: { day: 'CloudDrizzle', night: 'CloudDrizzle', keyword: 'Bruine verglaçante légère' },
    57: { day: 'CloudDrizzle', night: 'CloudDrizzle', keyword: 'Bruine verglaçante dense' },
    61: { day: 'CloudRain', night: 'CloudRain', keyword: 'Pluie légère' },
    63: { day: 'CloudRain', night: 'CloudRain', keyword: 'Pluie modérée' },
    65: { day: 'CloudRainWind', night: 'CloudRainWind', keyword: 'Pluie forte' },
    66: { day: 'CloudHail', night: 'CloudHail', keyword: 'Pluie verglaçante légère' },
    67: { day: 'CloudHail', night: 'CloudHail', keyword: 'Pluie verglaçante forte' },
    71: { day: 'CloudSnow', night: 'CloudSnow', keyword: 'Neige légère' },
    73: { day: 'CloudSnow', night: 'CloudSnow', keyword: 'Neige modérée' },
    75: { day: 'Snowflake', night: 'Snowflake', keyword: 'Neige forte' },
    77: { day: 'Snowflake', night: 'Snowflake', keyword: 'Grains de neige' },
    80: { day: 'CloudSunRain', night: 'CloudMoonRain', keyword: 'Averses légères' },
    81: { day: 'CloudSunRain', night: 'CloudMoonRain', keyword: 'Averses modérées' },
    82: { day: 'CloudRainWind', night: 'CloudRainWind', keyword: 'Averses violentes' },
    85: { day: 'CloudSnow', night: 'CloudSnow', keyword: 'Averses de neige légères' },
    86: { day: 'CloudSnow', night: 'CloudSnow', keyword: 'Averses de neige fortes' },
    95: { day: 'CloudLightning', night: 'CloudLightning', keyword: 'Orage' },
    96: { day: 'CloudLightning', night: 'CloudLightning', keyword: 'Orage avec grêle légère' },
    99: { day: 'CloudLightning', night: 'CloudLightning', keyword: 'Orage avec grêle forte' },
}

export function getWeatherIcon(code: number, isDay: number) {
    const response = WeatherIcons[code]
    if(isDay === 1) return response?.day
    if(isDay === 0) return response?.night
}

export function getWeatherKeyword(code: number) {
    return WeatherIcons[code]?.keyword
}
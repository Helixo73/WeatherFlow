export const APICall = {
    searchCity: async (searchedText: string) => {
        const reponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${searchedText}&count=100&language=fr`)
        const data = reponse.json()
        return data
    },
    getCurrentWeather: async (lat: number, long: number) => {
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,is_day&timezone=auto`
        )
        const data = response.json()
        return data
    },
    getHourlyWeather: async (lat: number, long: number) => {
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&hourly=temperature_2m,weather_code,is_day&forecast_days=1&timezone=auto`)
        const data = await response.json()
        return data
    },
    getDailyWeather: async (lat: number, long: number) => {
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum&timezone=auto`
        )
        const data = await response.json()
        return data
    }
}

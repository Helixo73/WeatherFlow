const API_KEY_MAREE = '5c2be344c9221c26bc1c6fb8186fba70'

let sitesCache: any[] | null = null

async function fetchJson(url: string, options?: RequestInit) {
    const res = await fetch(url, options)
    const text = await res.text()
    if (!res.ok) {
        console.log(`Erreur ${res.status} sur ${url} :`, text.slice(0, 200))
        throw new Error(`Erreur API ${res.status}`)
    }
    try {
        return JSON.parse(text)
    } catch {
        console.log(`Réponse non JSON sur ${url} :`, text.slice(0, 200))
        throw new Error('Réponse non JSON')
    }
}

function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371
    const toRad = (d: number) => (d * Math.PI) / 180
    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lon2 - lon1)
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2
    return 2 * R * Math.asin(Math.sqrt(a))
}

function siteCoords(s: any) {
    return {
        lat: Number(s.latitude ?? s.lat),
        lon: Number(s.longitude ?? s.lon ?? s.lng),
    }
}

async function getSites(): Promise<any[]> {
    if (!sitesCache) {
        const json = await fetchJson(`https://api-maree.fr/sites?key=${API_KEY_MAREE}`)
        sitesCache = json.sites ?? json.data ?? json
    }
    return sitesCache as any[]
}

async function getNearestSite(lat: number, long: number) {
    const sites = await getSites()
    let best: any = null
    let bestDist = Infinity
    for (const s of sites) {
        const { lat: sLat, lon: sLon } = siteCoords(s)
        if (isNaN(sLat) || isNaN(sLon)) continue
        const d = distanceKm(lat, long, sLat, sLon)
        if (d < bestDist) {
            bestDist = d
            best = s
        }
    }
    return { site: best, distance: bestDist }
}

export const APICall = {
    searchCity: async (searchedText: string) => {
        return fetchJson(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchedText)}&count=100&language=fr`
        )
    },

    getCurrentWeather: async (lat: number, long: number) => {
        return fetchJson(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}` +
            `&current=temperature_2m,weather_code,is_day&timezone=auto`
        )
    },

    getHourlyWeather: async (lat: number, long: number) => {
        return fetchJson(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}` +
            `&hourly=temperature_2m,weather_code,is_day&forecast_days=2&timezone=auto`
        )
    },

    getDailyWeather: async (lat: number, long: number) => {
        return fetchJson(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}` +
            `&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`
        )
    },

    isCoastale: async (lat: number, long: number, radius: number): Promise<boolean> => {
        try {
            const { site, distance } = await getNearestSite(lat, long)
            if (!site) return false
            return distance * 1000 <= radius
        } catch (e) {
            console.log('Erreur isCoastale :', e)
            return false
        }
    },

    getWindInfo: async (lat: number, long: number) => {
        const json = await fetchJson(
            `https://api.open-meteo.com/v1/forecast` +
            `?latitude=${lat}&longitude=${long}` +
            `&current=wind_speed_10m,wind_direction_10m,wind_gusts_10m` +
            `&wind_speed_unit=kn&timezone=auto`
        )
        const { time, interval, wind_speed_10m, wind_direction_10m, wind_gusts_10m } = json.current
        return { time, interval, wind_speed_10m, wind_direction_10m, wind_gusts_10m }
    },
}
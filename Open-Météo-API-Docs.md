# Open-Meteo — Use Cases for the Project

This document lists the useful requests for the weather dashboard. For each one you get the URL, what it is used for in the app, and an example of the JSON response as it is received.

---

## 1. Geocoding — city name → coordinates

This is the very first step of the flow: the user types a city name in the search field, and this endpoint is queried to get its latitude/longitude (and to handle the case where several cities share the same name, by offering a list of results to pick from).

**Useful parameters**
- `name` (required) — name of the searched city
- `count` — max number of results (default 10)
- `language` — language of the results (e.g. `fr`, to get translated region/country names)

**Request**
```
https://geocoding-api.open-meteo.com/v1/search?name=Cherbourg&count=5&language=fr
```

**JSON response**
```json
{
  "results": [
    {
      "id": 2997563,
      "name": "Cherbourg-en-Cotentin",
      "latitude": 49.63996,
      "longitude": -1.61587,
      "elevation": 12.0,
      "feature_code": "PPLA4",
      "country_code": "FR",
      "timezone": "Europe/Paris",
      "population": 78766,
      "postcodes": ["50100", "50110", "50130"],
      "country_id": 3017382,
      "country": "France",
      "admin1": "Normandy",
      "admin2": "Manche",
      "admin3": "Arrondissement of Cherbourg",
      "admin4": "Cherbourg-en-Cotentin"
    }
  ],
  "generationtime_ms": 0.38
}
```

**Key points**
- `results` is an **array**, even for a single result. If there is no match, the `results` key may be missing from the response, so make sure to handle that case
- The fields that really matter for the next steps are `name`, `latitude` and `longitude`. The rest (`admin1`, `admin2`...) is mostly useful to disambiguate the display when several results have similar names
- `country` and `admin1` (region) let you display a subtitle like "Cherbourg-en-Cotentin, Normandy, France" in the results list

---

## 2. Current weather only

For a quick overview in a card of the added cities list, without overloading the request: just the temperature and the weather code to pick an icon, plus `is_day` to choose between the day and night variant of that icon.

**Request**
```
https://api.open-meteo.com/v1/forecast?latitude=49.55849&longitude=-1.83892&current=temperature_2m,weather_code,is_day
```

**JSON response**
```json
{
  "latitude": 49.559998,
  "longitude": -1.8400002,
  "generationtime_ms": 0.28,
  "utc_offset_seconds": 0,
  "timezone": "GMT",
  "timezone_abbreviation": "GMT",
  "elevation": 72.0,
  "current_units": {
    "time": "iso8601",
    "interval": "seconds",
    "temperature_2m": "°C",
    "weather_code": "wmo code",
    "is_day": ""
  },
  "current": {
    "time": "2026-08-23T15:15",
    "interval": 900,
    "temperature_2m": 21.0,
    "weather_code": 3,
    "is_day": 1
  }
}
```

**Key points**
- `is_day` is a **number**: `1` during the day, `0` at night. It is not a boolean, so compare it explicitly (`=== 1`) if a function expects a boolean
- Without `timezone=auto`, `timezone` stays `"GMT"` by default. This is not a problem here since only `current` is requested, but keep it in mind if you add `daily` later (see section 4)
- `interval: 900` means that accumulated values (such as precipitation, if you add it) represent the last 15 minutes. This is not relevant for `temperature_2m`, which is an instantaneous value
- Note that the returned `latitude`/`longitude` are slightly different from the ones sent (`49.559998` vs `49.55849`): the API answers with the coordinates of the center of the weather grid cell used, not the exact ones requested

---

## 3. Enriched current weather — city detail view

For the detail view when the user clicks on a city: feels-like temperature, humidity and wind, in addition to the raw temperature, the weather code and the day/night flag.

**Request**
```
https://api.open-meteo.com/v1/forecast?latitude=49.55849&longitude=-1.83892&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,is_day&timezone=auto
```

**JSON response**
```json
{
  "latitude": 49.559998,
  "longitude": -1.8400002,
  "generationtime_ms": 0.31,
  "utc_offset_seconds": 3600,
  "timezone": "Europe/Paris",
  "timezone_abbreviation": "CEST",
  "elevation": 72.0,
  "current_units": {
    "time": "iso8601",
    "interval": "seconds",
    "temperature_2m": "°C",
    "apparent_temperature": "°C",
    "relative_humidity_2m": "%",
    "weather_code": "wmo code",
    "wind_speed_10m": "km/h",
    "is_day": ""
  },
  "current": {
    "time": "2026-08-23T16:15",
    "interval": 900,
    "temperature_2m": 21.0,
    "apparent_temperature": 20.3,
    "relative_humidity_2m": 68,
    "weather_code": 3,
    "wind_speed_10m": 14.2,
    "is_day": 1
  }
}
```

**Key points**
- With `timezone=auto`, `utc_offset_seconds` becomes `3600` (French summer time) and `timezone_abbreviation` becomes `CEST`. The time in `current.time` is therefore already in local time, so you do not need to convert it yourself
- `apparent_temperature` (feels-like temperature) takes wind and humidity into account. It is often more relevant to display in large text than `temperature_2m`
- Each variable added to `current=` adds a matching key both in `current` and in `current_units`. The pattern is always the same, whatever the number of variables requested

---

## 4. Today's forecast — min/max + weather code

To complete the detail view with the day's temperature range, in addition to the current value.

**Request**
```
https://api.open-meteo.com/v1/forecast?latitude=49.55849&longitude=-1.83892&current=temperature_2m,weather_code,is_day&daily=temperature_2m_max,temperature_2m_min,weather_code&forecast_days=1&timezone=auto
```

**JSON response**
```json
{
  "latitude": 49.559998,
  "longitude": -1.8400002,
  "generationtime_ms": 0.35,
  "utc_offset_seconds": 3600,
  "timezone": "Europe/Paris",
  "timezone_abbreviation": "CEST",
  "elevation": 72.0,
  "current_units": {
    "time": "iso8601",
    "interval": "seconds",
    "temperature_2m": "°C",
    "weather_code": "wmo code",
    "is_day": ""
  },
  "current": {
    "time": "2026-08-23T16:15",
    "interval": 900,
    "temperature_2m": 21.0,
    "weather_code": 3,
    "is_day": 1
  },
  "daily_units": {
    "time": "iso8601",
    "temperature_2m_max": "°C",
    "temperature_2m_min": "°C",
    "weather_code": "wmo code"
  },
  "daily": {
    "time": ["2026-08-23"],
    "temperature_2m_max": [22.4],
    "temperature_2m_min": [15.2],
    "weather_code": [3]
  }
}
```

**Key points**
- Unlike `current`, each key in `daily` is an **array**, even if only one day is requested. Here `forecast_days=1` limits the response to today, so each array contains a single value (without it, the API returns 7 days by default)
- `daily.time[0]` matches `daily.temperature_2m_max[0]`, `daily.temperature_2m_min[0]`, etc. All arrays are aligned on the same index
- `daily.weather_code` represents the **most severe weather code of the day**, not necessarily the one of the current moment, so it can differ from `current.weather_code`
- **There is no `is_day` in `daily`**: a daily value covers a whole day, so it is neither day nor night. For a daily icon, simply use the day variant. If you need the actual times, request `sunrise` and `sunset` in `daily`

---

## 5. 7-day forecast — for a chart or a strip of cards

For a wider "week ahead" view, useful if you want a small trend chart or a strip of cards per day.

**Request**
```
https://api.open-meteo.com/v1/forecast?latitude=49.55849&longitude=-1.83892&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_sum&timezone=auto
```

**JSON response**
```json
{
  "latitude": 49.559998,
  "longitude": -1.8400002,
  "generationtime_ms": 0.42,
  "utc_offset_seconds": 3600,
  "timezone": "Europe/Paris",
  "timezone_abbreviation": "CEST",
  "elevation": 72.0,
  "daily_units": {
    "time": "iso8601",
    "temperature_2m_max": "°C",
    "temperature_2m_min": "°C",
    "weather_code": "wmo code",
    "precipitation_sum": "mm"
  },
  "daily": {
    "time": [
      "2026-08-23", "2026-08-24", "2026-08-25",
      "2026-08-26", "2026-08-27", "2026-08-28", "2026-08-29"
    ],
    "temperature_2m_max": [22.4, 21.8, 23.1, 20.5, 19.9, 22.0, 23.4],
    "temperature_2m_min": [15.2, 14.9, 16.0, 14.1, 13.8, 15.5, 16.2],
    "weather_code": [3, 61, 2, 80, 3, 1, 0],
    "precipitation_sum": [0.0, 3.2, 0.0, 5.8, 0.1, 0.0, 0.0]
  }
}
```

**Key points**
- Without `current`, the response only has the `daily` part: there is no `current`/`current_units` block at all, and this is not an error
- By default it returns **7 days** (the API default). Add `&forecast_days=N` if you want a different number (up to 16)
- To iterate easily on the front end, the simplest approach is to rebuild an array of objects per day from the parallel arrays, e.g. `daily.time.map((date, i) => ({ date, max: daily.temperature_2m_max[i], ... }))`
- **No `is_day` here** (it does not exist in `daily`): use the day variant of the icon for each day

---

## 6. Hourly forecast — current day

Useful for a chart of the evolution over the next hours (temperature curve throughout the day, for example). `is_day` is available here, so each hour can have its own day or night icon.

**Request**
```
https://api.open-meteo.com/v1/forecast?latitude=49.55849&longitude=-1.83892&hourly=temperature_2m,weather_code,is_day&forecast_days=1&timezone=auto
```

**JSON response**
```json
{
  "latitude": 49.559998,
  "longitude": -1.8400002,
  "generationtime_ms": 0.5,
  "utc_offset_seconds": 3600,
  "timezone": "Europe/Paris",
  "timezone_abbreviation": "CEST",
  "elevation": 72.0,
  "hourly_units": {
    "time": "iso8601",
    "temperature_2m": "°C",
    "weather_code": "wmo code",
    "is_day": ""
  },
  "hourly": {
    "time": [
      "2026-08-23T00:00", "2026-08-23T01:00", "2026-08-23T02:00", "2026-08-23T03:00",
      "2026-08-23T04:00", "2026-08-23T05:00", "2026-08-23T06:00", "2026-08-23T07:00",
      "2026-08-23T08:00", "2026-08-23T09:00", "2026-08-23T10:00", "2026-08-23T11:00",
      "2026-08-23T12:00", "2026-08-23T13:00", "2026-08-23T14:00", "2026-08-23T15:00",
      "2026-08-23T16:00", "2026-08-23T17:00", "2026-08-23T18:00", "2026-08-23T19:00",
      "2026-08-23T20:00", "2026-08-23T21:00", "2026-08-23T22:00", "2026-08-23T23:00"
    ],
    "temperature_2m": [
      16.2, 15.8, 15.4, 15.1, 14.9, 14.8,
      15.0, 16.1, 17.6, 19.0, 20.3, 21.4,
      22.0, 22.4, 22.3, 21.9, 21.3, 20.5,
      19.6, 18.6, 17.8, 17.2, 16.7, 16.4
    ],
    "weather_code": [
      1, 1, 0, 0, 0, 0,
      1, 1, 2, 2, 3, 3,
      3, 3, 3, 3, 3, 2,
      2, 1, 1, 0, 0, 0
    ],
    "is_day": [
      0, 0, 0, 0, 0, 0,
      0, 0, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 0, 0
    ]
  }
}
```

**Key points**
- With `forecast_days=1`, `hourly.time` contains **24 entries** (one per hour of the day, from 00:00 to 23:00). The excerpt above only shows 5 for the example
- Same index logic as `daily`: `hourly.temperature_2m[i]` matches `hourly.time[i]`, and so do `hourly.weather_code[i]` and `hourly.is_day[i]`
- Here `is_day` is an **array** of `0` and `1`, aligned on `hourly.time`. In the excerpt, all five hours are at night (`0`)
- Without `forecast_days=1`, the default behavior returns 7 days of hours (168 entries). Remember to limit it if you only display the current day, to avoid loading data for nothing

---

## Day / night — the `is_day` variable

| Block | `is_day` available? | What to do |
|-------|---------------------|------------|
| `current` | Yes | Add `is_day` to the `current` list → `current.is_day` |
| `hourly` | Yes | Add `is_day` to the `hourly` list → `hourly.is_day[i]` |
| `daily` | No | Use the day variant of the icon (or request `sunrise,sunset` if you need the times) |

- The value is `1` during the day and `0` at night (number, not boolean)
- It is calculated for the requested location, so it stays consistent with the city being displayed
- Recommended: add `timezone=auto` so that the times in the response are in the city's local time

---

## General structure of a forecast request

```
https://api.open-meteo.com/v1/forecast?latitude=X&longitude=Y&current=VAR1,VAR2,is_day&daily=VAR3,VAR4&hourly=VAR5,is_day&timezone=auto
```

- `current` → "now" values (flat object, one value per variable)
- `hourly` → hour-by-hour values (parallel arrays)
- `daily` → values aggregated per day (parallel arrays)
- `timezone=auto` → recommended as soon as you use `daily` or `hourly`, so that days/hours are computed in the local timezone rather than in GMT
- You can combine `current`, `hourly` and `daily` in the same request. Each one appears as an independent section in the response

---

## Weather codes table (WMO — `weather_code`)

| Code | Meaning |
|------|----------------------------------------|
| 0 | Clear sky |
| 1, 2, 3 | Mainly clear, partly cloudy, overcast |
| 45, 48 | Fog |
| 51, 53, 55 | Drizzle: light, moderate, dense |
| 56, 57 | Freezing drizzle: light, dense |
| 61, 63, 65 | Rain: slight, moderate, heavy |
| 66, 67 | Freezing rain: light, heavy |
| 71, 73, 75 | Snow fall: slight, moderate, heavy |
| 77 | Snow grains |
| 80, 81, 82 | Rain showers: slight, moderate, violent |
| 85, 86 | Snow showers: slight, heavy |
| 95 | Thunderstorm: slight or moderate |
| 96, 99 | Thunderstorm with hail: slight, heavy |

---

## Interpreting `weather_code` on the front end

The API only returns a number. To display it in plain words, a simple object that maps each code to a label is enough:

```ts
const weatherLabels: Record<number, string> = {
	0: "Clear sky",
	1: "Mainly clear",
	2: "Partly cloudy",
	3: "Overcast",
	45: "Fog",
	48: "Fog",
	51: "Drizzle",
	53: "Drizzle",
	55: "Drizzle",
	56: "Freezing drizzle",
	57: "Freezing drizzle",
	61: "Rain",
	63: "Rain",
	65: "Heavy rain",
	66: "Freezing rain",
	67: "Freezing rain",
	71: "Snow",
	73: "Snow",
	75: "Heavy snow",
	77: "Snow",
	80: "Showers",
	81: "Showers",
	82: "Violent showers",
	85: "Snow showers",
	86: "Snow showers",
	95: "Thunderstorm",
	96: "Thunderstorm",
	99: "Thunderstorm"
};

function getWeatherLabel(code: number): string {
	return weatherLabels[code] ?? "Unknown";
}
```

**Usage**:
```svelte
<p>{getWeatherLabel(currentWeather.weather_code)}</p>
```

That is all you need to display a word instead of a code. There is no need to distinguish each nuance of intensity (light/moderate/heavy) if you just want a simple label for the user.

---

## Notes

- No API key needed for non-commercial use (up to 10,000 calls/day)
- All responses are JSON
- Full docs: https://open-meteo.com/en/docs
- Geocoding docs: https://open-meteo.com/en/docs/geocoding-api
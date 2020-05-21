from operator import itemgetter

import requests
import json

descriptors = [
    # 'Mostly',
    # 'Partly',
    'Slight Chance',
    'Chance',
    'Likely',
    'Isolated',
    'Scattered',
    'Periods Of',
    'Patchy',
    'Occasional',
    'Very',
]

weather_icon_map = [
    ("clear_frames", ["Sunny", "Clear"]),
    ("clouds", ["Cloudy"]),
    ("scattered_clouds", ["Mostly Cloudy"]),
    ("few_cloud_frames", ["Partly Cloudy"]),
    ("fog", ["Areas Of Fog", "Fog", "Smoke"]),
    ("light_rain_frames", ["Drizzle", "Light Rain"]),
    ("rain_frames", ["Rain Showers", "Rain", "Heavy Rain"]),
    ("thunderstorm", ["Showers And Thunderstorms",
                      "Thunderstorms", "T-storms"])
]

json_file = open("weather_frames.json")
weather_frames = json.load(json_file)


def get_weather_icon():
    response = requests.get(
        "https://api.weather.gov/gridpoints/GSP/56,67/forecast/hourly")
    json = response.json()
    periods = json['properties']['periods']
    isDaytime, shortForecast = itemgetter(
        'isDaytime', 'shortForecast')(periods[0])

    for descriptor in descriptors:
        shortForecast = shortForecast.replace(descriptor, "")
        shortForecast = shortForecast.strip()

    print(shortForecast)

    for (icon_set, search_terms) in weather_icon_map:
        if shortForecast in search_terms:
            selected = weather_frames[icon_set]

            if isDaytime:
                return selected['day']
            else:
                return selected['night']


def get_temperature():
    response = requests.get(
        "https://api.weather.gov/gridpoints/GSP/56,67/forecast/hourly")
    json = response.json()
    periods = json['properties']['periods']
    temperature = itemgetter('temperature')(periods[0])

    return temperature

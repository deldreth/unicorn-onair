from flask import Flask, request
from flask_restful import Resource, Api, reqparse
from flask_cors import CORS
from celery import Celery
from celery.schedules import crontab
from weather_icons import iconMap
from number_icons import number_to_pixels, color_ranges
from onair_icons import onair_frames

import unicornhat as unicorn
import requests
import time
import json

unicorn.set_layout(unicorn.PHAT)
unicorn.rotation(180)
unicorn.brightness(0.5)

app = Flask(__name__)
api = Api(app)
celery = Celery(app.name, broker="pyamqp://guest@localhost//")

CORS(app)

parser = reqparse.RequestParser()

DURATION = 60
WEATHER_BASE_URL = "http://api.openweathermap.org/data/2.5"

file = "mode.json"


def get_mode():
    response = requests.get("http://localhost:5000/mode").json()
    return response["mode"]


def reset_mode():
    payload = {"mode": "auto"}
    respose = requests.post(
        "http://localhost:5000/mode", data=json.dumps(payload), headers={"Content-Type": "application/json"})


@celery.task
def task_update_weather():
    mode = get_mode()

    if (mode == "auto" or mode == "weather"):
        update_weather()


@celery.task
def task_update_temperature():
    mode = get_mode()

    if (mode == "auto" or mode == "temperature"):
        update_temperature()


@celery.task
def task_onair():
    mode = get_mode()
    end_time = time.time() + 1800

    while mode == "onair" and time.time() < end_time:
        cylon()
        mode = get_mode()

    if mode == "onair":
        reset_mode()
    else:
        if mode == "weather":
            task_update_weather.apply_async()
        if mode == "temperature":
            task_update_temperature.apply_async()


@celery.on_after_configure.connect
def setup_after(sender, **kwargs):
    # even minutes
    sender.add_periodic_task(crontab(minute="*/2"), task_update_weather.s())

    # odd minutes
    sender.add_periodic_task(crontab(minute="1-59/2"),
                             task_update_temperature.s())


def update_weather():
    response = requests.get(
        WEATHER_BASE_URL + "/forecast?zip=28748&units=imperial&appid=c5cfd7e0fc16c338ce42928df25078b1")
    json = response.json()
    icon = json["list"][0]["weather"][0]["icon"]

    selectedIcon = iconMap[icon]

    if isinstance(selectedIcon, list):
        end_time = time.time() + 5

        while time.time() < end_time:
            for frame in selectedIcon:
                unicorn.set_pixels(frame)
                unicorn.show()

                time.sleep(0.1)

        unicorn.set_pixels(selectedIcon[0])
        unicorn.show()
    else:
        unicorn.set_pixels(selectedIcon)
        unicorn.show()


def update_temperature():
    response = requests.get(
        WEATHER_BASE_URL + "/weather?zip=28748&units=imperial&appid=c5cfd7e0fc16c338ce42928df25078b1")
    json = response.json()
    temperature = int(json["main"]["temp"])

    [rgb] = [color for (rng, color) in color_ranges if temperature in rng]

    unicorn.set_pixels(number_to_pixels(temperature, rgb))
    unicorn.show()


def cylon():
    for pixels in onair_frames:
        unicorn.set_pixels(pixels)
        unicorn.show()

        time.sleep(0.1)

    onair_frames.reverse()

    for pixels in onair_frames:
        unicorn.set_pixels(pixels)
        unicorn.show()

        time.sleep(0.1)

    onair_frames.reverse()


class Pixel(Resource):
    def post(self):
        data = request.json
        unicorn.set_pixel(data["x"], data["y"], int(data["rgb"]["r"]), int(
            data["rgb"]["g"]), int(data["rgb"]["b"]))
        unicorn.show()


class Pixels(Resource):
    def get(self):
        return unicorn.get_pixels()

    def post(self):
        data = request.json
        unicorn.set_pixels(data["pixels"])
        unicorn.show()


class Weather(Resource):
    def post(self):
        update_weather()


class Temperature(Resource):
    def post(self):
        update_temperature()


class Mode(Resource):
    def get(self):
        with open("mode.json") as json_file:
            return json.load(json_file)

    def post(self):
        data = request.json

        with open("mode.json", "w") as json_file:
            json.dump(data, json_file)


class OnAir(Resource):
    def post(self):
        with open("mode.json", "w") as json_file:
            data = {"mode": "onair"}
            json.dump(data, json_file)

            task_onair.apply_async()


api.add_resource(Pixel, "/")
api.add_resource(Pixels, "/pixels")
api.add_resource(Weather, "/weather")
api.add_resource(Temperature, "/temperature")
api.add_resource(Mode, "/mode")
api.add_resource(OnAir, "/onair")

if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=False)

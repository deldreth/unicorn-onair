from flask import Flask, request
from flask_cors import CORS
from flask_restful import Resource, Api, reqparse
from flask_socketio import SocketIO
from datetime import datetime
from number_icons import number_to_pixels, color_ranges
from onair_icons import onair_frames
from weather_icons import get_weather_icon, get_temperature
from tasks import task_onair

import asyncio
import json
import time
import unicornhat as unicorn

unicorn.set_layout(unicorn.PHAT)
unicorn.rotation(180)
unicorn.brightness(0.5)

app = Flask(__name__)
api = Api(app)
# sockets = Sockets(app)
socketio = SocketIO(app, cors_allowed_origins="*")

CORS(app)

WEATHER_BASE_URL = "http://api.openweathermap.org/data/2.5"

MESSAGES = []
SOCKETS = set()


def set_pixels(pixels):
    unicorn.set_pixels(pixels)
    unicorn.show()

    socketio.emit('pixels', {"data": json.dumps(pixels)})
    socketio.sleep(0)


def update_weather():
    icon = get_weather_icon()

    end_time = time.time() + 5

    while time.time() < end_time:
        for frame in icon:
            set_pixels(frame)

            time.sleep(0.2)

    set_pixels(icon[0])


def update_temperature():
    temperature = get_temperature()

    [rgb] = [color for (rng, color) in color_ranges if temperature in rng]

    set_pixels(number_to_pixels(temperature, rgb))


def cylon():
    for pixels in onair_frames:
        set_pixels(pixels)

        time.sleep(0.1)

    onair_frames.reverse()

    for pixels in onair_frames:
        set_pixels(pixels)

        time.sleep(0.1)

    onair_frames.reverse()


class Pixel(Resource):
    def post(self):
        data = request.json
        unicorn.set_pixel(data["x"], data["y"], int(data["rgb"]["r"]), int(
            data["rgb"]["g"]), int(data["rgb"]["b"]))
        unicorn.show()

        socketio.emit("pixels", {"data": json.dumps(unicorn.get_pixels())})


class Pixels(Resource):
    def get(self):
        return unicorn.get_pixels()

    def post(self):
        data = request.json
        set_pixels(data["pixels"])


class PixelsOff(Resource):
    def post(self):
        unicorn.off()


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

        if data["mode"] == "weather":
            update_weather()
        elif data["mode"] == "temperature":
            update_temperature()

        with open("mode.json", "w") as json_file:
            json.dump(data, json_file)


class OnAir(Resource):
    def post(self):
        with open("mode.json", "w") as json_file:
            data = {"mode": "onair"}
            json.dump(data, json_file)

            task_onair.apply_async()


class OnAirContinue(Resource):
    def post(self):
        cylon()


class Frames(Resource):
    def post(self):
        data = request.json

        frames = data["frames"]
        duration = float(data["duration"])

        for pixels in frames:
            set_pixels(pixels)

            time.sleep(duration)


api.add_resource(Pixel, "/")
api.add_resource(Pixels, "/pixels")
api.add_resource(PixelsOff, "/pixels/off")
api.add_resource(Weather, "/weather")
api.add_resource(Temperature, "/temperature")
api.add_resource(Mode, "/mode")
api.add_resource(OnAir, "/onair")
api.add_resource(OnAirContinue, "/onair/continue")
api.add_resource(Frames, "/frames")


if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000)

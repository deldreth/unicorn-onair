from flask import Flask, request
from flask_restful import Resource, Api, reqparse
from flask_cors import CORS
from weather_icons import iconMap

import unicornhat as unicorn
import requests
import time
import multiprocessing
import signal
import sys

unicorn.set_layout(unicorn.PHAT)
unicorn.rotation(180)
unicorn.brightness(0.5)

app = Flask(__name__)
api = Api(app)

CORS(app)

parser = reqparse.RequestParser()

DURATION = 60


def update_weather(run_event):
    start_time = 0

    while not run_event.is_set():
        if (start_time + DURATION < time.time()):
            response = requests.get(
                "http://api.openweathermap.org/data/2.5/forecast?id=4453066&units=imperial&appid=c5cfd7e0fc16c338ce42928df25078b1")
            json = response.json()
            icon = json['list'][0]['weather'][0]['icon']

            print(time.strftime("%I:%M:%S") + " " +
                  json['list'][0]['weather'][0]['description'])

            unicorn.set_pixels(iconMap[icon])
            unicorn.show()

            start_time = time.time()


run_event = multiprocessing.Event()
weather = multiprocessing.Process(target=update_weather, args=(run_event,))


class Pixel(Resource):
    def post(self):
        data = request.json
        unicorn.set_pixel(data['x'], data['y'], int(data['rgb']['r']), int(
            data['rgb']['g']), int(data['rgb']['b']))
        unicorn.show()


class Pixels(Resource):
    def get(self):
        return unicorn.get_pixels()

    def post(self):
        data = request.json
        unicorn.set_pixels(data['pixels'])
        unicorn.show()


class Weather(Resource):
    def post(self):
        data = request.json

        if(data['active'] is True):
            weather.start()
        else:
            run_event.set()

            weather.terminate()
            weather.join()


api.add_resource(Pixel, '/')
api.add_resource(Pixels, '/pixels')
api.add_resource(Weather, '/weather')

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=False)

    if (weather.is_alive()):
        run_event.set()

        weather.terminate()
        weather.join()

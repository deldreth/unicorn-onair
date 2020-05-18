from flask import Flask, request
from flask_restful import Resource, Api, reqparse
from flask_cors import CORS
from celery import Celery
from celery.schedules import crontab
from weather_icons import iconMap

import unicornhat as unicorn
import requests
import time
import json

unicorn.set_layout(unicorn.PHAT)
unicorn.rotation(180)
unicorn.brightness(0.5)

app = Flask(__name__)
api = Api(app)
celery = Celery(app.name, broker='pyamqp://guest@localhost//')

CORS(app)

parser = reqparse.RequestParser()

DURATION = 60


@celery.task
def task_update_weather():
    response = requests.get("http://localhost:5000/weather")
    isWeatherRunning = response.json()

    if (isWeatherRunning['active']):
        update_weather()


@celery.on_after_configure.connect
def setup_after(sender, **kwargs):
    sender.add_periodic_task(300.0, task_update_weather.s())


def update_weather():
    response = requests.get(
        "http://api.openweathermap.org/data/2.5/forecast?zip=28748&units=imperial&appid=c5cfd7e0fc16c338ce42928df25078b1")
    json = response.json()
    icon = json['list'][0]['weather'][0]['icon']

    print(time.strftime("%I:%M:%S") + " " +
          json['list'][0]['weather'][0]['description'])

    unicorn.set_pixels(iconMap[icon])
    unicorn.show()


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
    file = 'weather_running.json'

    def get(self):
        with open(self.file) as json_file:
            data = json.load(json_file)
            return data

    def post(self):
        data = request.json
        update_weather()

        with open(self.file, 'w') as json_file:
            json.dump(data, json_file)


class OnAir(Resource):
    def get(self):
        return self.running

    def post(self):
        data = request.json

        self.running = data['active']


api.add_resource(Pixel, '/')
api.add_resource(Pixels, '/pixels')
api.add_resource(Weather, '/weather')

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=False)

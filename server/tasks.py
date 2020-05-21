from celery import Celery
from celery.schedules import crontab
from datetime import datetime

import requests
import time
import json

celery = Celery(__name__, broker="pyamqp://guest@localhost//")
hours = range(8, 23)

BASE_URL = "http://onair:5000"


def get_mode():
    response = requests.get(f"{BASE_URL}/mode").json()
    return response["mode"]


def reset_mode():
    payload = {"mode": "auto"}
    requests.post(
        f"{BASE_URL}/mode", data=json.dumps(payload), headers={"Content-Type": "application/json"})


def get_hour():
    now = datetime.now()
    return now.hour


def off():
    requests.post(f"{BASE_URL}/pixels/off")


@celery.task
def task_update_weather():
    mode = get_mode()

    if (mode == "auto" or mode == "weather"):
        if get_hour() in hours:
            requests.post(f"{BASE_URL}/weather")
        else:
            off()


@celery.task
def task_update_temperature():
    mode = get_mode()

    if (mode == "auto" or mode == "temperature"):
        if get_hour() in hours:
            requests.post(f"{BASE_URL}/temperature")
        else:
            off()


@celery.task
def task_onair():
    mode = get_mode()
    end_time = time.time() + 1800

    while mode == "onair" and time.time() < end_time:
        requests.post(f"{BASE_URL}/onair/continue")
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
    sender.add_periodic_task(
        crontab(minute="*/2"), task_update_weather.s())

    # odd minutes
    sender.add_periodic_task(
        crontab(minute="1-59/2"), task_update_temperature.s())

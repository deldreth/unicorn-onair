import requests
import signal
import threading
import time

from weather_icons import iconMap

DURATION = 300  # 5 minutes


def update_weather(run_event):
    start_time = 0

    while not run_event.is_set():
        if (start_time + DURATION < time.time()):
            response = requests.get(
                "http://api.openweathermap.org/data/2.5/forecast?id=4453066&units=imperial&appid=c5cfd7e0fc16c338ce42928df25078b1")
            icon = response.json()['list'][0]['weather'][0]['icon']

            start_time = time.time()


def main():
    run_event = threading.Event()
    t = threading.Thread(target=update_weather, args=(run_event,))
    t.start()

    try:
        while 1:
            time.sleep(.1)
    except KeyboardInterrupt:
        run_event.set()

        t.join()


if __name__ == "__main__":
    main()

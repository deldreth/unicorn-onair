# unicorn-onair

![Image](https://i.imgur.com/9aCPGt4.png)

This project is a second iteration of a physical "on the phone" notifier I use for my home office. It was built with a raspberry pi zero and Pimoroni's [Unicorn pHAT](https://shop.pimoroni.com/products/unicorn-phat).

It also provides a websocket backed React based interface for "painting" colors onto the unicorn's LEDs/pixels.

The automatic running state of the server is intended to pull weather forecast data from [NOAA's Weather API](https://www.weather.gov/documentation/services-web-api) and translate the current hourly forecast into an "icon" or pixelate the numeric temperature up to 99 F.

## Server

The server is built with python's flask, flask*restful, flask_socketio. With a periodic task system using celery. Included in the \_server* directory are several files.

`app.py` file contains the route entries for the API.

`number_icons.py` contains lists of booleans that map to pixels representing number 0-9, and the logic necessary to display numbers 0-99 onto the unicorn.

`onair_icons.py` contains the pixel color mappings for the "onair" mode.

`weather_icons.py` includes logic to map weather.gov api condition types to weather "icons", and a function to do the same with the temperature.

`tasks.py` contains the periodic tasks for celery that run on even and odd minutes to switch the rendered pixels between weather and temperature forecasts.

### Supervisor

I find it easiest to run supervisor for rpi and the configuration used is included in `onair.conf`.

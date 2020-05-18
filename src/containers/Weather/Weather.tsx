import React from "react";

import { BASE_URL } from "../../utils/config";
import { getPixels as fetchPixels } from "../../components/Pixels/utils/getPixels";
import Pixels, { Pixels as PixelsType } from "../../components/Pixels/Pixels";

import "./css/Weather.css";

const WEATHER_URL = `${BASE_URL}/weather`;

function Weather() {
  const [weatherPixels, setWeatherPixels] = React.useState<PixelsType>([]);

  React.useEffect(() => {
    async function getPixels() {
      await fetch(WEATHER_URL, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ active: true }),
      });

      const nextPixels = await fetchPixels();

      setWeatherPixels(nextPixels);
    }

    getPixels();

    return function unmount() {
      fetch(WEATHER_URL, {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ active: false }),
      });
    };
  }, []);

  return (
    <div className="weather-container">
      {weatherPixels.length > 0 && (
        <Pixels width={300} pixels={weatherPixels} />
      )}
    </div>
  );
}

export default Weather;

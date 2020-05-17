import React from "react";

import { Stage, Layer, Circle } from "react-konva";
import { ColorContext } from "../../context/ColorContext";
import { iconMap } from "../../resources/weatherPixels";

type Pixel = number[];
type Row = Pixel[];
type Pixels = Row[];

function componentToHex(c: number) {
  var hex = c.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}

function rgbToHex([r, g, b]: number[]) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

type Props = {
  width: number;
  mode: "paint" | "weather";
};

function Grid({ width, mode }: Props) {
  const [grid, setGrid] = React.useState<Pixels>([]);
  const [isDrawing, setIsDrawing] = React.useState(false);
  const selectedColor = React.useContext(ColorContext);

  const pixelWidth = width / 4;

  React.useEffect(() => {
    async function getPixels() {
      const data = await fetch("http://192.168.1.245:5000/pixels");
      const nextGrid = await data.json();

      setGrid(nextGrid);
    }

    async function getWeather() {
      const data = await fetch(
        "http://api.openweathermap.org/data/2.5/forecast?id=4453066&units=imperial&appid=c5cfd7e0fc16c338ce42928df25078b1"
      );
      const weather = await data.json();
      const { icon } = weather.list[0].weather[0] as { icon: string };
      const iconPixels = iconMap[icon];

      fetch("http://192.168.1.245:5000/pixels", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pixels: iconPixels,
        }),
      });

      setGrid(iconPixels);
    }

    if (mode === "weather") {
      getWeather();
    } else {
      getPixels();
    }
  }, [mode]);

  function updateColor(x: number, y: number, rgb: number[]) {
    const nextGrid: Pixels = [...grid];
    nextGrid[x][y] = rgb;

    setGrid(nextGrid);

    fetch("http://192.168.1.245:5000", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        x: y,
        y: x,
        rgb: selectedColor.rgb,
      }),
    });
  }

  if (grid) {
    return (
      <Stage
        width={width}
        height={width * 2}
        style={{ marginRight: "auto", marginLeft: "auto", width }}
      >
        <Layer
          onTouchStart={() => setIsDrawing(true)}
          onTouchEnd={() => setIsDrawing(false)}
          onMouseDown={() => setIsDrawing(true)}
          onMouseUp={() => setIsDrawing(false)}
        >
          {grid.map((column, colIndex) =>
            column.map((row, rowIndex) => (
              <Circle
                key={`${colIndex}-${rowIndex}`}
                x={pixelWidth * colIndex + pixelWidth / 2}
                y={pixelWidth * rowIndex + pixelWidth / 2}
                radius={pixelWidth / 2 - 5}
                fill={rgbToHex(row)}
                onMouseDown={() =>
                  updateColor(
                    colIndex,
                    rowIndex,
                    Object.values(selectedColor.rgb)
                  )
                }
                onMouseOver={() => {
                  if (isDrawing) {
                    updateColor(
                      colIndex,
                      rowIndex,
                      Object.values(selectedColor.rgb)
                    );
                  }
                }}
                onTouchMove={() => {
                  if (isDrawing) {
                    updateColor(
                      colIndex,
                      rowIndex,
                      Object.values(selectedColor.rgb)
                    );
                  }
                }}
              />
            ))
          )}
        </Layer>
      </Stage>
    );
  } else {
    return <div>Fetching pixels!</div>;
  }
}

export default Grid;

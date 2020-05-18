import React from "react";

import { Stage, Layer, Circle, Rect } from "react-konva";

import { ColorContext } from "../../context/ColorContext";
import { getPixels as fetchPixels } from "../Pixels/utils/getPixels";
import { Pixels } from "../Pixels/Pixels";
import { rgbToHex } from "../../utils/rgbToHex";
import { setPixel } from "../Pixels/utils/setPixel";

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
      setGrid(await fetchPixels());
    }

    getPixels();
  }, [mode]);

  function updateColor(x: number, y: number) {
    const nextGrid: Pixels = [...grid];
    const { rgb } = selectedColor;
    nextGrid[x][y] = Object.values(rgb);

    setGrid(nextGrid);
    setPixel(x, y, rgb);
  }

  if (grid) {
    return (
      <Stage width={width} height={width * 2} style={{ width }}>
        <Layer
          onTouchStart={() => setIsDrawing(true)}
          onTouchEnd={() => setIsDrawing(false)}
          onMouseDown={() => setIsDrawing(true)}
          onMouseUp={() => setIsDrawing(false)}
        >
          <Rect
            x={0}
            y={0}
            width={width}
            height={width * 2}
            cornerRadius={pixelWidth / 2 - 2}
            fill="#222222"
          />

          {grid.map((column, colIndex) =>
            column.map((row, rowIndex) => (
              <Circle
                key={`${colIndex}-${rowIndex}`}
                x={pixelWidth * colIndex + pixelWidth / 2}
                y={pixelWidth * rowIndex + pixelWidth / 2}
                radius={pixelWidth / 2 - 5}
                fill={rgbToHex(row)}
                onMouseDown={() => updateColor(colIndex, rowIndex)}
                onMouseOver={() => {
                  if (isDrawing) {
                    updateColor(colIndex, rowIndex);
                  }
                }}
                onTouchMove={() => {
                  if (isDrawing) {
                    updateColor(colIndex, rowIndex);
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

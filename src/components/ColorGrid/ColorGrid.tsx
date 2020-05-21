import React from "react";

import { Stage, Layer, Circle, Rect } from "react-konva";

import { ColorContext } from "../../context/ColorContext";
import { rgbToHex } from "../../utils/rgbToHex";
import { setPixel } from "../Pixels/utils/setPixel";
import { Pixels as PixelsType } from "../Pixels/Pixels";

type Props = {
  isPainting: boolean;
  width: number;
  pixels: PixelsType;
  onChange: (pixels: PixelsType) => void;
  onDrawChange: (status: boolean) => void;
};

function Grid({ width, pixels, onChange, isPainting, onDrawChange }: Props) {
  const selectedColor = React.useContext(ColorContext);

  const pixelWidth = width / 4;

  function updateColor(x: number, y: number) {
    const nextPixels: PixelsType = [...pixels];
    const {
      rgb: { r, g, b },
    } = selectedColor;
    nextPixels[x][y] = Object.values({ r, g, b });

    onChange(nextPixels);
    setPixel(x, y, { r, g, b });
  }

  if (pixels) {
    return (
      <Stage width={width} height={width * 2} style={{ width }}>
        <Layer
          onTouchStart={() => onDrawChange(true)}
          onTouchEnd={() => onDrawChange(false)}
          onMouseDown={() => onDrawChange(true)}
          onMouseUp={() => onDrawChange(false)}
        >
          <Rect
            x={0}
            y={0}
            width={width}
            height={width * 2}
            cornerRadius={pixelWidth / 2 - 2}
            fill="#222222"
          />

          {pixels.map((column, colIndex) =>
            column.map((row, rowIndex) => (
              <Circle
                key={`${colIndex}-${rowIndex}`}
                x={pixelWidth * colIndex + pixelWidth / 2}
                y={pixelWidth * rowIndex + pixelWidth / 2}
                radius={pixelWidth / 2 - 5}
                fill={rgbToHex(row)}
                onMouseDown={() => updateColor(colIndex, rowIndex)}
                onMouseOver={() => {
                  if (isPainting) {
                    updateColor(colIndex, rowIndex);
                  }
                }}
                onTouchStart={() => updateColor(colIndex, rowIndex)}
                onTouchMove={() => {
                  if (isPainting) {
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

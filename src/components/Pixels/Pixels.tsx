import React from "react";

import { Stage, Layer, Circle } from "react-konva";

import { rgbToHex } from "../../utils/rgbToHex";

type Pixel = number[];
type Row = Pixel[];
type Pixels = Row[];

type Props = {
  pixels: Pixels;
  width: number;
};

function Pixels({ width, pixels }: Props) {
  const pixelWidth = width / 4;

  return (
    <Stage width={width} height={width * 2}>
      <Layer>
        {pixels.map((column, colIndex) =>
          column.map((row, rowIndex) => (
            <Circle
              key={`${colIndex}-${rowIndex}`}
              x={pixelWidth * colIndex + pixelWidth / 2}
              y={pixelWidth * rowIndex + pixelWidth / 2}
              radius={pixelWidth / 2}
              fill={rgbToHex(row)}
            />
          ))
        )}
      </Layer>
    </Stage>
  );
}

export default Pixels;

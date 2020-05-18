import React from "react";

import { Stage, Layer, Circle, Rect } from "react-konva";

import { rgbToHex } from "../../utils/rgbToHex";

type Pixel = number[];
type Row = Pixel[];
export type Pixels = Row[];

type Props = {
  pixels: Pixels;
  width: number;
};

function Pixels({ width, pixels }: Props) {
  const pixelWidth = width / 4;

  return (
    <Stage width={width} height={width * 2}>
      <Layer>
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
              radius={pixelWidth / 2 - 2}
              fill={rgbToHex(row)}
            />
          ))
        )}
      </Layer>
    </Stage>
  );
}

export default Pixels;

import React from "react";

import { Stage, Layer, Rect } from "react-konva";

import Pixel from "../Pixel/Pixel";

type Cell = number[];
type Row = Cell[];
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
          column.map((rgb, rowIndex) => (
            <Pixel
              key={`${colIndex}-${rowIndex}`}
              width={pixelWidth}
              column={colIndex}
              row={rowIndex}
              rgb={rgb}
            />
          ))
        )}
      </Layer>
    </Stage>
  );
}

export default Pixels;

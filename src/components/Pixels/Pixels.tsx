import React from "react";

import { Stage, Layer, Rect } from "react-konva";

import Pixel from "../Pixel/Pixel";

type Cell = number[];
type Row = Cell[];
export type Pixels = Row[];

type PaintableProps = {
  isPainting?: boolean;
  toggleIsPainting?: (nextIsPainting: boolean) => void;
  onPaintPixel?: (x: number, y: number) => void;
};

type Props = PaintableProps & {
  pixels: Pixels;
  width?: number;
};

function Pixels({
  width,
  pixels,
  isPainting,
  onPaintPixel,
  toggleIsPainting,
}: Props) {
  const relativeWidth =
    window.innerWidth < 500 ? window.innerWidth / 2.5 : window.innerWidth / 4;
  const w = width || relativeWidth;
  const pixelWidth = w / 4;

  const paint = (x: number, y: number) => () => {
    onPaintPixel && onPaintPixel(x, y);
  };

  return (
    <Stage width={w * 2} height={w}>
      <Layer
        onMouseDown={() => toggleIsPainting && toggleIsPainting(true)}
        onMouseUp={() => toggleIsPainting && toggleIsPainting(false)}
      >
        <Rect
          x={0}
          y={0}
          width={w * 2}
          height={w}
          cornerRadius={pixelWidth / 2 - 2}
          fill="#222222"
        />

        {pixels.map((column, colIndex) =>
          column.map((rgb, rowIndex) => {
            return (
              <Pixel
                key={`${colIndex}-${rowIndex}`}
                width={pixelWidth}
                column={colIndex}
                row={rowIndex}
                rgb={rgb}
                onMouseDown={paint(colIndex, rowIndex)}
                onMouseOver={() => {
                  isPainting &&
                    onPaintPixel &&
                    onPaintPixel(colIndex, rowIndex);
                }}
              />
            );
          })
        )}
      </Layer>
    </Stage>
  );
}

export default Pixels;

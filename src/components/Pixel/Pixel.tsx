import React from "react";

import { Circle } from "react-konva";
import { ShapeConfig } from "konva/types/Shape";

import { rgbToHex } from "../../utils/rgbToHex";

type Props = ShapeConfig & {
  width: number;
  column: number;
  row: number;
  rgb: number[];
};

function Pixel({ width, column, row, rgb, ...restProps }: Props) {
  const x = width * column + width / 2;
  const y = width * row + width / 2;
  const r = width / 2 - 2;

  return <Circle {...restProps} x={y} y={x} radius={r} fill={rgbToHex(rgb)} />;
}

export default Pixel;

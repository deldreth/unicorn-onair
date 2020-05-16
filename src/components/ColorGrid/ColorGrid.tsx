import React from "react";

import Color from "../Color/Color";
import { ColorContext } from "../../context/ColorContext";

type Props = {
  width: number;
  height: number;
};

type Cell = [number, number, string];
type Grid = Cell[];

function ColorGrid({ width, height }: Props) {
  const [grid, setGrid] = React.useState<Grid>([]);
  const [isDrawing, setIsDrawing] = React.useState(false);
  const selectedColor = React.useContext(ColorContext);

  React.useEffect(() => {
    const firstGrid: Grid = [];

    for (let h = 0; h < height; h++) {
      for (let w = width - 1; w >= 0; w--) {
        firstGrid.push([h, w, "#fff"]);
      }
    }

    setGrid(firstGrid);
  }, [width, height]);

  function updateColor(index: number) {
    const nextGrid: Grid = [...grid];
    nextGrid[index] = [grid[index][0], grid[index][1], selectedColor.hex];
    setGrid(nextGrid);

    fetch("http://192.168.1.245:5000", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        x: grid[index][0],
        y: grid[index][1],
        rgb: selectedColor.rgb,
      }),
    });
  }

  return (
    <div
      className="grid-container"
      onMouseDown={() => setIsDrawing(true)}
      onMouseUp={() => setIsDrawing(false)}
      onTouchStart={() => setIsDrawing(true)}
      onTouchEnd={() => setIsDrawing(false)}
      onTouchMove={() => {
        if (isDrawing) {
        }
      }}
    >
      {grid.map(([x, y, color], index) => (
        <Color
          key={`${x}-${y}`}
          x={x}
          y={y}
          drawing={isDrawing}
          color={color}
          onClick={() => updateColor(index)}
        />
      ))}
    </div>
  );
}

ColorGrid.defaultProps = {
  width: 4,
  height: 8,
};

export default ColorGrid;

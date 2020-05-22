import React from "react";

import { ColorContext } from "../../context/ColorContext";
import { PaintingContext } from "../../context/PaintingContext";
import { setPixel } from "../Pixels/utils/setPixel";
import Pixels, { Pixels as PixelsType } from "../Pixels/Pixels";

type Props = {
  pixels: PixelsType;
  onChange: (pixels: PixelsType) => void;
};

function PaintablePixels({ pixels, onChange }: Props) {
  const { isPainting, toggleIsPainting } = React.useContext(PaintingContext);
  const selectedColor = React.useContext(ColorContext);

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
      <Pixels
        pixels={pixels}
        isPainting={isPainting}
        toggleIsPainting={toggleIsPainting}
        onPaintPixel={updateColor}
      />
    );
  } else {
    return <div>Fetching pixels!</div>;
  }
}

export default PaintablePixels;

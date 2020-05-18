import { BASE_URL } from "../../../utils/config";

import { SelectedColor } from "../../../context/ColorContext";

export async function setPixel(
  x: number,
  y: number,
  color: SelectedColor["rgb"]
) {
  await fetch(BASE_URL, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      x: y,
      y: x,
      rgb: color,
    }),
  });
}

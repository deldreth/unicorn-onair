function componentToHex(c: number) {
  var hex = c.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}

export function rgbToHex([r, g, b]: number[]) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

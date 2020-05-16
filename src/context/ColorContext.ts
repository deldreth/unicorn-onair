import React from "react";

export const defaultValue = {
  hex: "#fff",
  rgb: { r: 255, g: 255, b: 255 },
};

export const ColorContext = React.createContext(defaultValue);

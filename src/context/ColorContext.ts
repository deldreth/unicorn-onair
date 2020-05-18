import React from "react";

export type SelectedColor = {
  hex: string;
  rgb: {
    r: number;
    g: number;
    b: number;
  };
};

export const defaultValue: SelectedColor = {
  hex: "#fff",
  rgb: { r: 255, g: 255, b: 255 },
};

export const ColorContext = React.createContext(defaultValue);

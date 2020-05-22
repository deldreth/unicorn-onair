import React from "react";

export const defaultValue = false;

export const PaintingContext = React.createContext({
  isPainting: defaultValue,
  toggleIsPainting: (nextIsPainting: boolean) => {},
});

import React from "react";

import { HuePicker } from "react-color";

import {
  ColorContext,
  defaultValue as defaultColorValue,
} from "./context/ColorContext";
import ColorGrid from "./components/ColorGrid/ColorGrid";
import ModeSelector from "./components/ModeSelector/ModeSelector";
import Weather from "./containers/Weather/Weather";

import "antd/dist/antd.css";
import "./App.css";

type ColorValue = {
  hex: string;
  rgb: { r: number; g: number; b: number };
};

function renderColorPicker(
  mode: string,
  color: ColorValue,
  setColor: (color: ColorValue) => void
) {
  if (mode === "paint" || mode === "frames") {
    return (
      <div className="color-picker-container">
        <HuePicker
          width="100%"
          height="44px"
          color={color.hex}
          onChangeComplete={({ hex, rgb }) =>
            setColor({
              hex,
              rgb,
            })
          }
        />
      </div>
    );
  }
}

function App() {
  const [color, setColor] = React.useState(defaultColorValue);
  const [mode, setMode] = React.useState("paint");

  return (
    <ColorContext.Provider value={color}>
      <div className="app-container">
        <ModeSelector mode={mode} onChange={setMode} />

        {renderColorPicker(mode, color, setColor)}

        <div className="pixels-container'">
          {mode === "paint" && <ColorGrid width={300} mode={mode} />}

          {mode === "weather" && <Weather />}
        </div>
      </div>
    </ColorContext.Provider>
  );
}

export default App;

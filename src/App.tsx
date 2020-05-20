import React from "react";

import { BASE_URL } from "./utils/config";
import {
  ColorContext,
  defaultValue as defaultColorValue,
} from "./context/ColorContext";
import { getPixels as fetchPixels } from "./components/Pixels/utils/getPixels";
import ColorGrid from "./components/ColorGrid/ColorGrid";
import ColorPicker from "./components/ColorPicker/ColorPicker";
import Frames from "./components/Frames/Frames";
import ModeSelector from "./components/ModeSelector/ModeSelector";
import Pixels, { Pixels as PixelsType } from "./components/Pixels/Pixels";

import "./App.css";

function App() {
  const [color, setColor] = React.useState(defaultColorValue);
  const [mode, setMode] = React.useState("auto");
  const [pixels, setPixels] = React.useState<PixelsType>([]);

  const isPaintable = mode === "paint" || mode === "frames";

  React.useEffect(() => {
    async function getMode() {
      const response = await fetch(`${BASE_URL}/mode`);
      const { mode } = await response.json();

      setMode(mode);
    }

    getMode();
  }, []);

  React.useEffect(() => {
    async function getPixels() {
      setPixels(await fetchPixels());
    }

    getPixels();
  }, [mode]);

  return (
    <ColorContext.Provider value={color}>
      <div className="container">
        <ModeSelector mode={mode} onChange={setMode} />

        {isPaintable && <ColorPicker color={color} onChange={setColor} />}

        <div className="pixels-container">
          {isPaintable && (
            <ColorGrid
              width={150}
              pixels={pixels}
              onChange={(nextPixels) => setPixels(nextPixels)}
            />
          )}

          {!isPaintable && <Pixels width={300} pixels={pixels} />}
        </div>

        {mode === "frames" && <Frames pixels={pixels} />}
      </div>
    </ColorContext.Provider>
  );
}

export default App;

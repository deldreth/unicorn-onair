import React from "react";

import { BASE_URL } from "./utils/config";
import {
  ColorContext,
  defaultValue as defaultColorValue,
} from "./context/ColorContext";
import { getPixels as fetchPixels } from "./components/Pixels/utils/getPixels";
import ColorGrid from "./components/ColorGrid/ColorGrid";
import ColorPicker from "./components/ColorPicker/ColorPicker";
import ModeSelector from "./components/ModeSelector/ModeSelector";
import Pixels, { Pixels as PixelsType } from "./components/Pixels/Pixels";

import "./App.css";

function App() {
  const [color, setColor] = React.useState(defaultColorValue);
  const [mode, setMode] = React.useState("auto");
  const [pixels, setPixels] = React.useState<PixelsType>([]);

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
      <div className="app-container">
        <ModeSelector mode={mode} onChange={setMode} />

        {mode === "paint" && <ColorPicker color={color} onChange={setColor} />}

        <div className="is-centered">
          {mode === "paint" && <ColorGrid width={300} />}

          {mode !== "paint" && <Pixels width={300} pixels={pixels} />}
        </div>
      </div>
    </ColorContext.Provider>
  );
}

export default App;

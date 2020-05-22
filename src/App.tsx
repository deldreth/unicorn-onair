import React from "react";

// @ts-ignore
import io from "socket.io-client";

import { BASE_URL } from "./utils/config";
import {
  ColorContext,
  defaultValue as defaultColorValue,
} from "./context/ColorContext";
import {
  PaintingContext,
  defaultValue as defaultIsPaintingValue,
} from "./context/PaintingContext";
import { getPixels as fetchPixels } from "./components/Pixels/utils/getPixels";
import PaintablePixels from "./components/PaintablePixels/PaintablePixels";
import ColorPicker from "./components/ColorPicker/ColorPicker";
import Frames from "./components/Frames/Frames";
import ModeSelector from "./components/ModeSelector/ModeSelector";
import Pixels, { Pixels as PixelsType } from "./components/Pixels/Pixels";

import "./App.css";

const socket = io("onair:5000");

function App() {
  const [color, setColor] = React.useState(defaultColorValue);
  const [isPainting, setIsPainting] = React.useState(defaultIsPaintingValue);
  const [mode, setMode] = React.useState("auto");
  const [pixels, setPixels] = React.useState<PixelsType>([]);

  const isPaintable = mode === "paint" || mode === "frames";

  React.useEffect(() => {
    (async function init() {
      const response = await fetch(`${BASE_URL}/mode`);
      const { mode } = await response.json();

      setMode(mode);
      setPixels(await fetchPixels());
    })();

    socket.on("pixels", ({ data }: any) => {
      if (!isPainting) {
        setPixels(JSON.parse(data));
      }
    });
  }, []);

  function toggleIsPainting(nextIsPainting: boolean) {
    setIsPainting(nextIsPainting);
  }

  return (
    <ColorContext.Provider value={color}>
      <PaintingContext.Provider value={{ isPainting, toggleIsPainting }}>
        <div className="container">
          <ModeSelector mode={mode} onChange={setMode} />

          {isPaintable && <ColorPicker color={color} onChange={setColor} />}

          <div className="pixels-container">
            {isPaintable && (
              <PaintablePixels
                pixels={pixels}
                onChange={(nextPixels) => setPixels(nextPixels)}
              />
            )}

            {!isPaintable && <Pixels pixels={pixels} />}
          </div>

          {mode === "frames" && <Frames pixels={pixels} />}
        </div>
      </PaintingContext.Provider>
    </ColorContext.Provider>
  );
}

export default App;

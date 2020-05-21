import React from "react";

// @ts-ignore
import io from "socket.io-client";

import { BASE_URL } from "./utils/config";
import {
  ColorContext,
  defaultValue as defaultColorValue,
} from "./context/ColorContext";
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
  const [isPainting, setIsPainting] = React.useState(false);
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

  return (
    <ColorContext.Provider value={color}>
      <div className="container">
        <ModeSelector mode={mode} onChange={setMode} />

        {isPaintable && <ColorPicker color={color} onChange={setColor} />}

        <div className="pixels-container">
          {isPaintable && (
            <PaintablePixels
              isPainting={isPainting}
              width={150}
              pixels={pixels}
              onChange={(nextPixels) => setPixels(nextPixels)}
              onDrawChange={(status) => setIsPainting(status)}
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

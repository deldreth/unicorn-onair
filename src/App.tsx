import React from "react";

import { HuePicker, CompactPicker, ColorResult } from "react-color";
import { Form, Input, Button, Select } from "antd";

import ColorGrid from "./components/ColorGrid/ColorGrid";
import {
  ColorContext,
  defaultValue as defaultColorValue,
} from "./context/ColorContext";
import Pixels from "./components/Pixels/Pixels";
import { iconMap } from "./resources/weatherPixels";

import "antd/dist/antd.css";

const { Option } = Select;

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
    );
  }
}

function App() {
  const [color, setColor] = React.useState(defaultColorValue);
  const [mode, setMode] = React.useState<"paint" | "weather">("paint");

  return (
    <ColorContext.Provider value={color}>
      <div style={{ padding: "24px 24px 0px 24px" }}>
        <Form name="control">
          <Form.Item name="mode" label="Mode">
            <Select
              placeholder="Select a option and change input text above"
              allowClear
              value={mode}
              onChange={(value) => setMode(value)}
            >
              <Option value="paint">Paint</Option>
              <Option value="frames">Frames</Option>
              <Option value="weather">Weather</Option>
            </Select>
          </Form.Item>
        </Form>
      </div>

      {renderColorPicker(mode, color, setColor)}

      {mode === "weather" && (
        <>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <Pixels width={50} pixels={iconMap["01d"]} />
            <Pixels width={50} pixels={iconMap["01n"]} />
            <Pixels width={50} pixels={iconMap["02d"]} />
            <Pixels width={50} pixels={iconMap["02n"]} />
            <Pixels width={50} pixels={iconMap["03d"]} />
            <Pixels width={50} pixels={iconMap["09d"]} />
            <Pixels width={50} pixels={iconMap["10d"]} />
            <Pixels width={50} pixels={iconMap["11d"]} />
            <Pixels width={50} pixels={iconMap["13d"]} />
            <Pixels width={50} pixels={iconMap["50d"]} />
          </div>
        </>
      )}

      {mode === "paint" && <ColorGrid width={300} mode={mode} />}
    </ColorContext.Provider>
  );
}

export default App;

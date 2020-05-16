import React from "react";

import { HuePicker } from "react-color";
import { Form, Input, Button, Select } from "antd";

import ColorGrid from "./components/ColorGrid/ColorGrid";
import {
  ColorContext,
  defaultValue as defaultColorValue,
} from "./context/ColorContext";

import "antd/dist/antd.css";

const { Option } = Select;

function App() {
  const [color, setColor] = React.useState(defaultColorValue);

  return (
    <ColorContext.Provider value={color}>
      <div style={{ padding: "24px 24px 0px 24px" }}>
        <Form name="control">
          <Form.Item name="mode" label="Mode">
            <Select
              placeholder="Select a option and change input text above"
              allowClear
            >
              <Option value="pixel">Pixel</Option>
              <Option value="pixels">Pixels</Option>
            </Select>
          </Form.Item>
        </Form>
      </div>

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

      <ColorGrid />
    </ColorContext.Provider>
  );
}

export default App;

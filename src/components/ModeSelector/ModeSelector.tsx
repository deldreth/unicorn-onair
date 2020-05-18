import React from "react";

import { Radio } from "antd";

import "./css/ModeSelector.css";

type Props = {
  mode: string;
  onChange: (value: string) => void;
};

function ModeSelector({ mode, onChange }: Props) {
  return (
    <div className="mode-selector">
      <Radio.Group
        onChange={(event) => onChange(event.target.value)}
        value={mode}
        buttonStyle="solid"
      >
        <Radio.Button value="paint">Paint</Radio.Button>
        <Radio.Button value="weather">Weather</Radio.Button>
      </Radio.Group>
    </div>
  );
}

export default ModeSelector;

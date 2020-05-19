import React from "react";

import { HuePicker, CompactPicker } from "react-color";
import classNames from "classnames";

import { SelectedColor } from "../../context/ColorContext";

import "./css/ColorPicker.css";

export type Props = {
  color: SelectedColor;
  onChange: (color: SelectedColor) => void;
};

const pickers = ["hue", "compact"];

function ColorPicker({ color, onChange }: Props) {
  const [picker, setPicker] = React.useState("hue");

  return (
    <div className="color-picker-container">
      <div className="buttons has-addons is-centered">
        {pickers.map((opt) => (
          <button
            className={classNames("button", {
              "is-selected": picker === opt,
              "is-info": picker === opt,
            })}
            onClick={() => setPicker(opt)}
          >
            {opt}
          </button>
        ))}
      </div>

      <div className="color-picker">
        {picker === "hue" && (
          <HuePicker
            width="100%"
            height="44px"
            color={color.hex}
            onChangeComplete={({ hex, rgb }) =>
              onChange({
                hex,
                rgb,
              })
            }
          />
        )}

        {picker === "compact" && (
          <CompactPicker
            color={color.hex}
            onChangeComplete={({ hex, rgb }) =>
              onChange({
                hex,
                rgb,
              })
            }
          />
        )}
      </div>
    </div>
  );
}

export default ColorPicker;

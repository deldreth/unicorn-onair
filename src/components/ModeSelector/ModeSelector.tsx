import React from "react";

import classNames from "classnames";

import { BASE_URL } from "../../utils/config";

type Props = {
  mode: string;
  onChange: (value: string) => void;
};

const fetchModes = ["weather", "temperature", "onair"];
const modes = ["auto", "paint", "frames", "weather", "temperature", "onair"];

function updateMode(mode: string) {
  fetch(`${BASE_URL}/mode`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mode }),
  });

  if (fetchModes.includes(mode)) {
    fetch(`${BASE_URL}/${mode}`, {
      method: "post",
    });
  }
}

function ModeSelector({ mode, onChange }: Props) {
  return (
    <div id="mode-selector" className="field">
      <label className="label">mode</label>
      <div className="control">
        <div className="buttons has-addons are-small">
          {modes.map((opt) => (
            <button
              key={opt}
              className={classNames("button", {
                "is-selected": mode === opt,
                "is-info": mode === opt,
              })}
              onClick={() => {
                updateMode(opt);
                onChange(opt);
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ModeSelector;

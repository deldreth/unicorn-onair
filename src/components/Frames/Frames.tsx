import React from "react";

import cloneDeep from "lodash/cloneDeep";
import mapValues from "lodash/mapValues";
import pullAt from "lodash/pullAt";
import classNames from "classnames";

import Pixels, { Pixels as PixelsType } from "../Pixels/Pixels";

import "./css/Frames.css";
import { BASE_URL } from "../../utils/config";

type Props = {
  pixels: PixelsType;
};

type SelectedFrames = {
  [index: number]: boolean;
};

function Frames({ pixels }: Props) {
  const [frames, setFrames] = React.useState<PixelsType[]>([]);
  const [duration, setDuration] = React.useState("0.1");
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [selectedFrames, setSelectedFrames] = React.useState<SelectedFrames>(
    {}
  );

  async function play(frames: PixelsType[], duration: string) {
    await fetch(`${BASE_URL}/frames`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ frames, duration }),
    });

    setIsPlaying(false);
  }

  function addPixels() {
    setFrames([...frames, cloneDeep(pixels)]);
  }

  return (
    <div>
      <div className="field is-grouped">
        <div className="control">
          <button className="button" onClick={() => addPixels()}>
            add frame
          </button>
        </div>

        <div className="control">
          <div className="select">
            <select
              value={duration}
              onChange={(event) => setDuration(event.target.value)}
            >
              <option value="0.1">0.1 s</option>
              <option value="0.25">0.25 s</option>
              <option value="0.5">0.5 s</option>
              <option value="0.75">0.75 s</option>
              <option value="1.0">1.0 s</option>
            </select>
          </div>
        </div>

        <div className="control">
          <button
            className="button"
            disabled={isPlaying}
            onClick={() => {
              setIsPlaying(true);
              play(frames, duration);
            }}
          >
            <span className="icon">
              <i className="fas fa-play"></i>
            </span>
          </button>
        </div>

        {Object.values(selectedFrames).some((value) => value === true) && (
          <div className="control">
            <button
              className="button is-danger"
              onClick={() => {
                const frameIndexes = Object.entries(selectedFrames)
                  .filter(([key, value]) => value === true)
                  .map(([key]) => parseInt(key, 10));

                const nextFrames = frames.filter(
                  (frame, index) => !frameIndexes.includes(index)
                );

                setFrames(nextFrames);
                setSelectedFrames(mapValues(selectedFrames, () => false));
              }}
            >
              remove selected
            </button>
          </div>
        )}
      </div>

      {frames.length > 0 && (
        <div className="frames">
          {frames.map((frame, index) => (
            <div
              className={classNames("frame", {
                selected: selectedFrames[index],
              })}
              onClick={() =>
                setSelectedFrames({
                  ...selectedFrames,
                  [index]: !selectedFrames[index],
                })
              }
            >
              <Pixels pixels={frame} width={50} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Frames;

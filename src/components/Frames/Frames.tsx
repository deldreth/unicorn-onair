import React from "react";

import classNames from "classnames";
import cloneDeep from "lodash/cloneDeep";
import mapValues from "lodash/mapValues";

import { BASE_URL } from "../../utils/config";
import { SelectedFrames } from "./Frames.types";
import FrameControls from "../FrameControls/FrameControls";
import Pixels, { Pixels as PixelsType } from "../Pixels/Pixels";

import "./Frames.css";

type Props = {
  pixels: PixelsType;
};

function Frames({ pixels }: Props) {
  const [frames, setFrames] = React.useState<PixelsType[]>([]);
  const [duration, setDuration] = React.useState("0.1");
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [selectedFrames, setSelectedFrames] = React.useState<SelectedFrames>(
    {}
  );

  async function play(frames: PixelsType[], duration: string) {
    setIsPlaying(true);

    await fetch(`${BASE_URL}/frames`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ frames, duration }),
    });

    setIsPlaying(false);
  }

  function addFrame() {
    setFrames([...frames, cloneDeep(pixels)]);
  }

  function removeFrames() {
    const frameIndexes = Object.entries(selectedFrames)
      .filter(([key, value]) => value === true)
      .map(([key]) => parseInt(key, 10));

    const nextFrames = frames.filter(
      (frame, index) => !frameIndexes.includes(index)
    );

    setFrames(nextFrames);
    setSelectedFrames(mapValues(selectedFrames, () => false));
  }

  return (
    <div>
      <FrameControls
        isPlaying={isPlaying}
        duration={duration}
        selectedFrames={selectedFrames}
        onAddFrame={() => addFrame()}
        onDurationChange={(duration) => setDuration(duration)}
        onPlay={() => play(frames, duration)}
        onRemoveFrames={() => removeFrames()}
      />

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

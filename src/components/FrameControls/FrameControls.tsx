import React from "react";

import { SelectedFrames } from "../Frames/Frames.types";

type Props = {
  isPlaying: boolean;
  duration: string;
  selectedFrames: SelectedFrames;
  onAddFrame: () => void;
  onDurationChange: (duration: string) => void;
  onPlay: () => void;
  onRemoveFrames: () => void;
};

function FrameControls({
  isPlaying,
  duration,
  selectedFrames,
  onAddFrame,
  onDurationChange,
  onPlay,
  onRemoveFrames,
}: Props) {
  return (
    <div className="field is-grouped">
      <div className="control">
        <button className="button" onClick={() => onAddFrame()}>
          add frame
        </button>
      </div>

      <div className="control">
        <div className="select">
          <select
            value={duration}
            onChange={(event) => onDurationChange(event.target.value)}
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
          onClick={() => onPlay()}
        >
          <span className="icon">
            <i className="fas fa-play"></i>
          </span>
        </button>
      </div>

      {Object.values(selectedFrames).some((value) => value === true) && (
        <div className="control">
          <button className="button is-danger" onClick={() => onRemoveFrames()}>
            remove selected
          </button>
        </div>
      )}
    </div>
  );
}

export default FrameControls;

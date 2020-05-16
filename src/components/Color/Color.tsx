import React from "react";

type Props = {
  drawing: boolean;
  color: string;
  x: number;
  y: number;
  onClick: () => void;
};

function Color({ x, y, color, onClick, drawing }: Props) {
  return (
    <div
      style={{
        width: 44,
        height: 44,
        border: "2px solid black",
        display: "inline-block",
        margin: 5,
        backgroundColor: color,
        borderRadius: "50%",
      }}
      onClick={onClick}
      onMouseDown={onClick}
      onMouseOver={() => {
        if (drawing) {
          onClick();
        }
      }}
    />
  );
}

Color.defaultProps = {
  onClick: () => {},
};

export default Color;

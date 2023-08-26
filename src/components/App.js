import React, { useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import { useDrag, usePinch } from "@use-gesture/react";
import { Resizable } from "re-resizable";

function App() {
  const [redCandles, setRedCandles] = useState([]);
  const [greenCandles, setGreenCandles] = useState([]);
  const [candlePositions, setCandlePositions] = useState({});
  const [sizes, setSizes] = useState({ red: [], green: [] });

  const handleGreenCount = () => {
    setGreenCandles((prevCandles) => [...prevCandles, greenCandles.length]);
    setSizes((prevSizes) => ({ ...prevSizes, green: [...prevSizes.green, { width: 50, height: 100 }] }));
  };

  const handleRedCount = () => {
    setRedCandles((prevCandles) => [...prevCandles, redCandles.length]);
    setSizes((prevSizes) => ({ ...prevSizes, red: [...prevSizes.red, { width: 50, height: 100 }] }));
  };

  const bind = useDrag(({ active, movement, event }) => {
    if (active) {
      const index = parseInt(event.target.dataset.index, 10);
      if (!isNaN(index)) {
        const candleType = event.target.dataset.type; // Get the candle type
        setCandlePositions((prevPositions) => ({
          ...prevPositions,
          [event.target.id]: {
            x: movement[0],
            y: movement[1],
            width: sizes[candleType][index]?.width || 0,
            height: sizes[candleType][index]?.height || 0,
          },
        }));
      }
    }
  });

  const handleResizeStop = (candleType, index, d) => {
    setSizes((prevSizes) => {
      const newSizes = { ...prevSizes };
      newSizes[candleType] = [
        ...prevSizes[candleType].slice(0, index),
        {
          width: sizes[candleType][index]?.width + d.width || 50,
          height: sizes[candleType][index]?.height + d.height || 100,
        },
        ...prevSizes[candleType].slice(index + 1),
      ];
      return newSizes;
    });
  };

  return (
    <div>
      <img
        className="graph"
        src="https://www.didax.com/pub/media/catalog/product/cache/541f549daeb5bdd8bd77b8568b2d1c3a/6/6/663030.jpg"
      ></img>
      <button onClick={handleGreenCount}>Add Green Candlestick</button>
      <button onClick={handleRedCount}>Add Red Candlestick</button>

      {greenCandles.map((candleIndex) => (
        <animated.div key={candleIndex}>
          <Resizable
            className={"rectangle"}
            id={`greenCandle_${candleIndex}`}
            data-type="green" // Set the candle type
            data-index={candleIndex}
            {...bind()}
            size={{
              width: sizes.green[candleIndex]?.width || 50,
              height: sizes.green[candleIndex]?.height || 100,
            }}
            onResizeStop={(e, direction, ref, d) => handleResizeStop("green", candleIndex, d)}
            style={{
              left: `${candlePositions[`greenCandle_${candleIndex}`]?.x || 0}px`,
              top: `${candlePositions[`greenCandle_${candleIndex}`]?.y || 0}px`,
              position: "absolute",
            }}
          >
            <div className="smallGreenRectangle"></div>
          </Resizable>
        </animated.div>
      ))}

      {redCandles.map((candleIndex) => (
        <animated.div key={candleIndex}>
          <Resizable
            className={"redRectangle"}
            id={`redCandle_${candleIndex}`}
            data-type="red" // Set the candle type
            data-index={candleIndex}
            {...bind()}
            size={{
              width: sizes.red[candleIndex]?.width || 50,
              height: sizes.red[candleIndex]?.height || 100,
            }}
            onResizeStop={(e, direction, ref, d) => handleResizeStop("red", candleIndex, d)}
            style={{
              left: `${candlePositions[`redCandle_${candleIndex}`]?.x || 0}px`,
              top: `${candlePositions[`redCandle_${candleIndex}`]?.y || 0}px`,
              position: "absolute",
            }}
          >
            <div className="smallRedRectangle"></div>
          </Resizable>
        </animated.div>
      ))}
    </div>
  );
}

export default App;

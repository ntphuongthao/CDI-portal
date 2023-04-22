import React, { useCallback, useEffect, useRef } from "react";
import ReactCanvasConfetti from "react-canvas-confetti";
import { GrFormNextLink } from "react-icons/gr";

const canvasStyles = {
  position: "fixed",
  pointerEvents: "none",
  width: "100%",
  height: "100%",
  top: 100,
  left: 350
};

export default function Confetti({ correct, handleSubmit, restartTriviaGame }) {
  const refAnimationInstance = useRef(null);

  useEffect(() => {
    if (correct) fire();
  }, [correct]);

  const getInstance = useCallback((instance) => {
    refAnimationInstance.current = instance;
  }, []);

  const makeShot = (particleRatio, opts) => {
    refAnimationInstance.current &&
      refAnimationInstance.current({
        ...opts,
        origin: { y: 0.7 },
        particleCount: Math.floor(200 * particleRatio)
      });
  };

  const fire = () => {
    makeShot(0.25, {
      spread: 26,
      startVelocity: 55
    });

    makeShot(0.2, {
      spread: 60
    });

    makeShot(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 45
    });
  };

  const handleClick = () => {
    if (correct) fire();
    handleSubmit();
  }

  return (
    <>
      <div className="flex" style={{margin: '1rem'}}>
        <button className="submitAnsBtn" onClick={handleClick}>Submit your answer</button>
        {correct && (<button onClick={restartTriviaGame} className="nextBtn" style={{background: "#e1ad01"}}>Next <GrFormNextLink /></button>)}
        <ReactCanvasConfetti refConfetti={getInstance} style={canvasStyles} />
      </div>
    </>
  );
}

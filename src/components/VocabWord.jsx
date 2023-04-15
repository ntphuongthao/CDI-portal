import { useState } from "react";
import './VocabWord.css';

const VocabWord = ({ front, back, flipped, handleFlip  }) => {
  return (
    <div className={`flash-card ${flipped ? 'flipped': ''}`} onClick={handleFlip}>
      <div className="card-inner">
        <div className={`front`}>{front}</div>
        <div className="back">{back}</div>
      </div>
    </div>
  );
}

export default VocabWord;
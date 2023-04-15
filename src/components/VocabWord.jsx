import { useState } from "react";
import './VocabWord.css';

const VocabWord = ({ origin, translation }) => {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    setFlipped(flipped => !flipped);
  }

  return (
    <div className={`flash-card ${flipped ? 'flipped': ''}`} onClick={handleFlip}>
      <div className="card-inner">
        <div className={`front`}>{translation}</div>
        <div className="back">{origin}</div>
      </div>
    </div>
  );
}

export default VocabWord;
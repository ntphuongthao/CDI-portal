import { useState } from 'react';
import './Games.css';
import Flashcard from './FlashCard';

const Games = () => {
  const [selectedOption, setSelectedOption] = useState("");

  const handleSelectOption = (e) => {
    setSelectedOption(e.target.value);
  }

  return (
    <div className="container">
      <h2>Games</h2>
      <img className='vocab-image' src="./vocabulary-flashcard.jpeg" alt="Vocabulary Flashcard" width="600px"/>
      <p>Test your familiarity with frequently utilized vocabulary from various countries such 
        as Vietnam, Bangladesh, China, Japan, Korea, and others.
      </p>

      <select className='select-create vocab-select' value={selectedOption} onChange={handleSelectOption}>
        <option value="">Select a language</option>
        <option value="vietnamese">Vietnamese</option>
        <option value="chinese">Chinese</option>
        <option value="korean">Korean</option>
        <option value="japanese">Japanese</option>
        <option value="bangladesh">Bangladesh</option>
      </select>

      {selectedOption && (
        <Flashcard language={selectedOption} />
      )}
    </div>
  );
}

export default Games;
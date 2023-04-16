import { useState } from 'react';
import './Games.css';
import Flashcard from './FlashCard';

const Games = () => {
  const [selectedOption, setSelectedOption] = useState("");

  const handleSelectOption = (e) => {
    setSelectedOption(e.target.value);
  }

  return (
    <>
      <div className="flex" style={{justifyContent: 'space-between'}}>
        <div className="game-introduction container">
          <h2>Flashcard Game</h2>
          <img className='game-image' src="./vocabulary-flashcard.jpeg" alt="Vocabulary Flashcard" width="600px"/>
          <p>Test your familiarity with frequently utilized vocabulary from various countries such 
            as Vietnam, Bangladesh, China, Japan, Korea, and others.
          </p>
        </div>

        <div className="game-container container">
          <select className='select-create flashcard-select' value={selectedOption} onChange={handleSelectOption}>
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
      </div>

      <div className='flex' style={{justifyContent: 'space-between'}}>
        <div className="game-introduction container">
            <h2>Trivia Game</h2>
            <img className='game-image' src="./vocabulary-flashcard.jpeg" alt="Vocabulary Flashcard" width="600px" />
            <p>Some description</p>
        </div>

        <div className="game-container">
          
        </div>
      </div>
    </>
  );
}

export default Games;
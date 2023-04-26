import { useEffect, useState } from "react";
import { vietnameseWords, chineseWords, japaneseWords, bangladeshWords, koreanWords } from "../../server/vocabulary";
import VocabWord from "./VocabWord";
import './FlashCard.css';

const Flashcard = ({ language }) => {
  const [data, setData] = useState(null);
  const [card, setCard] = useState(null);
  const [idArray, setIdArray] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
  const [id, setId] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const languageFormatted = language.charAt(0).toUpperCase() + language.slice(1);

  useEffect(() => {
    shuffleCard();
    if (language == 'vietnamese') setData(vietnameseWords);
    else if (language == 'chinese') setData(chineseWords);
    else if (language == 'korean') setData(koreanWords);
    else if (language == 'japanese') setData(japaneseWords);
    else if (language == 'bangladesh') setData(bangladeshWords);
  }, [language]);

  useEffect(() => {
    if (data) {
      const card = data.filter(c => c.id === idArray[id])[0];
      setCard(card);
    }
  }, [data, id, idArray]);

  const handlePrev = () => {
    setFlipped(false);
    setId((prevId) => {
      if (prevId === 0) return prevId;
      else return prevId - 1;
    });
  }

  const handleNext = () => {
    setFlipped(false);
    setId((prevId) => {
      if (prevId === idArray.length - 1) return prevId;
      else return prevId + 1;
    });
  }

  const shuffleCard = () => {
    setFlipped(false);
    const newIdArray = [...idArray.sort((a, b) => 0.5 - Math.random())];
    setIdArray(newIdArray);
    setId(0);
  }

  const handleFlip = () => {
    setFlipped(flipped => !flipped);
  }

  return (
    <div className={`flashcard-container`}>
      <h4>Check whether you are familiar with these commonly used {languageFormatted} words.</h4>
      {card && <div className="container">
        <VocabWord
          front={card.translation}
          back={card.origin}
          flipped={flipped}
          handleFlip={handleFlip}
        />
      </div>}
      <div className="button-container flex">
        <button type="next" className='nextCard' onClick={handlePrev}>⭠</button>
        <button type="next" className='nextCard' onClick={handleNext}>⭢</button>
        <button type="button" className="shuffleBtn" onClick={shuffleCard}>Shuffle Card</button>
      </div>
    </div>
  );
}

export default Flashcard;
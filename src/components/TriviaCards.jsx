import { useEffect, useState } from "react";
import { trivia } from "../countries";
import './TriviaCards.css';
import { VscDebugRestart } from 'react-icons/vsc';

const TriviaCards = () => {
  const countries = trivia.map(item => Object.keys(item)[0]);
  const [country, setCountry] = useState(null);
  const [food, setFood] = useState(null);
  const [foodUrls, setFoodUrls] = useState([]);
  const [foodDescription, setFoodDescription] = useState(null);
  const [flag, setFlag] = useState(null);
  const [flagUrls, setFlagUrls] = useState([]);
  const [displayedOptions, setDisplayedOptions] = useState(null);

  function generateRandomNumber() {
    return Math.floor(Math.random() * countries.length);
  }

  useEffect(() => {
    const randomCountry = countries[generateRandomNumber()];
    setCountry(randomCountry);
  }, []);

  useEffect(() => {
    if (country) {      
      const countryData = trivia.find((c) => Object.keys(c)[0] === country)[country];
      const foodUrl = countryData.food.url;
      const foodDescription = countryData.food.description;
      const flag = countryData.flag;
      const foodUrls = trivia.map(item => Object.values(item)[0].food.url);
      const flagUrls = trivia.map(item => Object.values(item)[0].flag);

      setFood(foodUrl);
      setFoodDescription(foodDescription);
      setFlag(flag);
      setFoodUrls(foodUrls);
      setFlagUrls(flagUrls);
    }
  }, [country]);

  useEffect(() => {
    if (flagUrls && foodUrls) {
      const incorrectFlagUrls = [...flagUrls.filter((url) => url !== flag).sort(() => Math.random() - 0.5)].slice(0, 4);
      const incorrectFoodUrls = [...foodUrls.filter((url) => url !== food).sort(() => Math.random() - 0.5)].slice(0, 3);
      const incorrectAns = incorrectFlagUrls.concat(incorrectFoodUrls);
      let options = [...incorrectAns, flag, food];
      options = [...options.sort(() => Math.random() - 0.5)];
      setDisplayedOptions(options);
    }
  }, [flag, food, foodUrls, flagUrls, foodDescription]);

  const restartTriviaGame = () => {
    const randomCountry = countries[generateRandomNumber()];
    setCountry(randomCountry);
  }
  
  return (
    <div className="container">
      <button className="flex" onClick={restartTriviaGame}>
        Restart <VscDebugRestart />
      </button>
      <p style={{color: 'black'}}>Can you determine which two of the images shown below depict <b>{country}</b> cuisine and national flag?</p>
      <div className="trivia-options-container">
        {displayedOptions && (
          displayedOptions.map((option) => (
            <img className="trivia-option" src={option} alt="Incorrect Answer" width="100px"/>
          ))
        )}
      </div>
      <button>Submit your answer</button>
    </div>
  );
}

export default TriviaCards;
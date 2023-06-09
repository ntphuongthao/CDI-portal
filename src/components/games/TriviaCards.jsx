import { useEffect, useState } from "react";
import { trivia } from "../../server/countries";
import './TriviaCards.css';
import { VscDebugRestart } from 'react-icons/vsc';
import Confetti from "./Confetti";
import { AiOutlineQuestionCircle, AiOutlineWarning} from 'react-icons/ai';

const TriviaCards = () => {
  const countries = trivia.map(item => Object.keys(item)[0]);
  const [country, setCountry] = useState(null);
  const [food, setFood] = useState(null);
  const [foodUrls, setFoodUrls] = useState([]);
  const [foodDescription, setFoodDescription] = useState(null);
  const [flag, setFlag] = useState(null);
  const [flagUrls, setFlagUrls] = useState([]);
  const [displayedOptions, setDisplayedOptions] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [correct, setCorrect] = useState(false);
  const [errors, setErrors] = useState(null);

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

  useEffect(() => {
    // Implement behaviours if not guessing correctly

  }, [correct]);

  const restartTriviaGame = () => {
    const randomCountry = countries[generateRandomNumber()];
    setSelectedOptions([]);
    setCountry(randomCountry);
    setCorrect(false);
    setErrors(null);
  }

  const handleSelectOption = (e) => {
    setErrors(null);
    const url = new URL(e.target.src);
    const pathname = `.${url.pathname}`;

    if (selectedOptions.includes(pathname)) {
      const newSelectedOptions = selectedOptions.filter((option) => option !== pathname);
      setCorrect(false);
      setSelectedOptions(newSelectedOptions);
      return;
    }

    if (selectedOptions.length < 2) {
      const newSelectedOptions = [...selectedOptions, pathname];
      setCorrect(false);
      setSelectedOptions(newSelectedOptions);
    }
  }

  const handleSubmit = () => {
    if (selectedOptions.length === 0) {
      setErrors(`Select 2 pictures that you think represent ${country}.`);
    }
    if (selectedOptions.length === 1) {
      if (selectedOptions.includes(flag)) {
        setErrors(`You should select one more food picture of ${country}.`);
      }
      else if (selectedOptions.includes(food)) {
        setErrors(`You should select one more flag picture of ${country}.`);
      } 
      else {
        setErrors(`None of your current selections are correct :(.`)
      }
      return;
    }

    if (selectedOptions.length === 2) {
      if (selectedOptions.includes(flag) && selectedOptions.includes(food)) {
        setErrors(null);
        setCorrect(true);
      }
      else if (selectedOptions.includes(flag)) {
        setErrors(`You should reselect the food picture of ${country}.`);
      }
      else if (selectedOptions.includes(food)) {
        setErrors(`You should reselect the flag picture of ${country}.`);
      } 
      else {
        setErrors(`None of your current selections are correct :(.`)
      }
    }
  }
  
  return (
    <div className="container">
      <button className="flex trivia-restartBtn" onClick={restartTriviaGame}>
        Restart <VscDebugRestart />
      </button>
      <p className="trivia-question container">
        Can you determine which two of the images shown below depict 
        <b>{country}</b>
         cuisine and national flag?
      </p>
      <div className="trivia-options-container">
        {displayedOptions && (
          displayedOptions.map((option) => (
            <>
              <img
                onClick={handleSelectOption}
                className={`trivia-option ${selectedOptions.includes(option) ? "option-selected": ""}`}
                key={option}
                src={option}
                alt="Incorrect Answer"
              />
            </>
          ))
        )}
      </div>
      <Confetti
        correct={correct}
        handleSubmit={handleSubmit}
        restartTriviaGame={restartTriviaGame}
      />
      {errors && (
        <p className="flex warning-banner">
          <AiOutlineWarning size={25}/> {errors}
        </p>
      )}
      {correct && (
        <div className="fun-fact">
          <h2 className="correct">Correct!!!</h2>
          <h3 className="flex"><AiOutlineQuestionCircle />Maybe you don't know:</h3>
          <p>{foodDescription}</p>
        </div>
      )}
    </div>
  );
}

export default TriviaCards;
import { useEffect, useState } from "react";
import { trivia } from "../countries";
import './TriviaCards.css';

const TriviaCards = () => {
  const countries = trivia.map(item => Object.keys(item)[0]);
  const [country, setCountry] = useState(null);
  const [food, setFood] = useState(null);
  const [foodUrls, setFoodUrls] = useState([]);
  const [foodDescription, setFoodDescription] = useState(null);
  const [flag, setFlag] = useState(null);
  const [flagUrls, setFlagUrls] = useState([]);
  const [incorrectAnswers, setIncorrectAnser] = useState(null);

  function generateRandomNumber() {
    return Math.floor(Math.random() * countries.length);
  }

  useEffect(() => {
    const randomIndex = generateRandomNumber();
    const randomCountry = countries[randomIndex];
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
      setIncorrectAnser(incorrectAns);
    }
  }, [flag, food, foodUrls, flagUrls, foodDescription]);
  
  return (
    <div className="container">
      <p style={{color: 'black'}}>Can you determine which two of the images shown below depict {country} cuisine and national flag?</p>
      <div className="trivia-options-container">
        {incorrectAnswers && (
          incorrectAnswers.map((incorrectAns) => (
            <img className="trivia-option" src={incorrectAns} alt="Incorrect Answer" width="120px"/>
          ))
        )}
      </div>
      <button>Submit your answer</button>
    </div>
  );
}

export default TriviaCards;
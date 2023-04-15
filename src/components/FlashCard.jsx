import { useEffect, useState } from "react";
import { vietnameseWords, chineseWords, japaneseWords, bangladeshWords, koreanWords } from "../vocabulary";
import VocabWord from "./VocabWord";

const Flashcard = ({ language }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (language == 'vietnamese') setData(vietnameseWords);
    else if (language == 'chinese') setData(chineseWords);
    else if (language == 'korean') setData(koreanWords);
    else if (language == 'japanese') setData(japaneseWords);
    else if (language == 'banglades') setData(bangladeshWords);
  }, []);

  return (
    <div>
      <h1>{language}</h1>
      {data && data.map((word) => (
        <VocabWord origin={word.origin} translation={word.translation} />
      ))}
    </div>
  );
}

export default Flashcard;
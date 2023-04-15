import React, { useState } from 'react';

function StarRating() {
  const [rating, setRating] = useState(0);

  const handleClick = (index) => {
    console.log(index);
    setRating(index);
  };

  return (
    <div>
      {[1, 2, 3, 4, 5].map((index) => (
        <span
          key={index}
          onClick={() => handleClick(index)}
          style={{
            cursor: 'pointer',
            color: index <= rating ? 'gold' : 'gray'
          }}
        >
          &#9733;
        </span>
      ))}
    </div>
  );
}

export default StarRating;

import { AiFillLike, AiFillDislike } from 'react-icons/ai';
import './Reactions.css'

const reactions = [
  { type: 'like', label: 'Like', icon: <AiFillLike /> },
  { type: 'dislike', label: 'Dislike', icon: <AiFillDislike /> },
];

const Reactions = ({ likes, dislikes, handleReactionClick }) => {
  return (
    <div className='flex'>
      {reactions.map(({ type, label, icon }) => (
        <div key={type} className="flex">
          <button className={`${type}Btn`} onClick={() => handleReactionClick(type)}>
            {type === "like" ? `${likes ? likes: '0'} `: `${dislikes ? dislikes : '0'} `}
            {icon}
            {label}
          </button>
        </div>
      ))}
    </div>
  );
};

export default Reactions;

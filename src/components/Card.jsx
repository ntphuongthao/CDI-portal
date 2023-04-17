import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Card.css";
import ToolBar from "./ToolBar";
import StarRating from "./StarRating";
import { CgMoreVerticalO } from 'react-icons/cg';

const Card = (props) => {
  const [post, setPost] = useState({
    title: "",
    description: "",
    likes: 0,
    dislikes: 0,
    image: "",
  });

  useEffect(() => {
    setPost(props.post);
  }, [props]);
  
  return (
    <div className="card">
      <div className="flex card-top" style={{justifyContent: "space-between"}}>
        <div className="card-title">
          <h2>{post.title}</h2>
          <p>{new Date(post.created_at).toString().substring(0, 24)}</p>
        </div>
        <button className="expand-card">
          <Link to={`/edit/${post.id}`} style={{color: "black"}}>
            <CgMoreVerticalO />
          </Link>
        </button>
      </div>
      <div className="content-box">
        <p>{post.description}</p>
        <StarRating />
        {post.image && <img className="content-img" src={post.image} alt="Some image" width="350px"/>}
      </div>
      <ToolBar post={post} />
    </div>
  );
}

export default Card;
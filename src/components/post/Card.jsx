import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Card.css";
import ToolBar from "./ToolBar";
import { FiMoreHorizontal } from 'react-icons/fi';
import { supabase } from "../../context/supabaseClient";

const Card = (props) => {
  const [username, setUsername] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [post, setPost] = useState({
    id: 0,
    title: "",
    description: "",
    likes: 0,
    dislikes: 0,
    image: "",
    user_id: "",
  });

  useEffect(() => {
    setPost(props.post);
    if (avatar) downloadImage(avatar);
  }, [props, avatar]);

  useEffect(() => {
    async function getProfile() {

      let { data, error } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', props.post.user_id)
        .single();

      if (error) {
        return;
      } else if (data) {
        setUsername(data.username);
        setAvatar(data.avatar_url);
      }
    }

    getProfile();
  }, []);

  async function downloadImage(path) {
    try {
      const { data, error } = await supabase.storage.from('avatars').download(path);
      if (error) {
        throw error;
      }
      const url = URL.createObjectURL(data);
      setAvatar(url);
    } catch (error) {
      console.log('Error downloading image: ', error.message);
    }
  }
  
  return (
    <div className="card">
      <div className="flex card-top" style={{justifyContent: "space-between"}}>
        <div className="card-title flex">
          <div className="container">
            {avatar ? (
              <img
                src={avatar}
                alt="Avatar"
                className="card-avatar"
              />
            ) : (
              <img
                className="card-avatar"
                src="./noprofile.png"
                alt="No Profile picture"
              />
            )}
            <p><b>{username}</b></p>
          </div>
          <div style={{marginLeft: '1rem'}}>
            <h3>{post.title}</h3>
            <p className="card-date">{new Date(post.created_at).toString().substring(0, 24)}</p>
          </div>
        </div>

        <button className="expand-card">
          <Link to={`/edit/${post.id}`} style={{color: "black"}}>
            <FiMoreHorizontal />
          </Link>
        </button>
      </div>
      <div className="content-box">
        <p>{post.description}</p>
        {post.image && <img className="content-img" src={post.image} alt="Some image" width="350px"/>}
      </div>
      <ToolBar post={post} userId={props.userId}/>
    </div>
  );
}

export default Card;
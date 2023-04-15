import { useState, useEffect } from "react";
import Reactions from "./Reactions";
import { supabase } from "../supabaseClient";

const ToolBar = (props) => {
  const [post, setPost] = useState(null);

  useEffect(() => {
    setPost(props.post);
  }, [props]);

  useEffect(() => {
    const updatePost = async () => {
      if (!post) return;
      await supabase.from('Posts').update({
        title: post.title,
        description: post.description,
        image: post.image,
        likes: post.likes,
        dislikes: post.dislikes,
      }).eq('id', post.id);
    };
    updatePost();
  }, [post]);

  const handleReactionClick = (type) => {
    if (type === 'like') {
      setPost((prevPost) => ({
        ...prevPost,
        likes: prevPost.likes + 1,
      }))
    } else {
      setPost((prevPost) => ({
        ...prevPost,
        dislikes: prevPost.dislikes + 1,
      }))
    }
  };

  return (
    <>
      {post && post.title && (
        <Reactions
          likes={post.likes}
          dislikes={post.dislikes}
          handleReactionClick={handleReactionClick}
        />
      )}
    </>
  );
}

export default ToolBar;

import { useState, useEffect } from "react";
import Reactions from "./Reactions";
import { supabase } from "../../context/supabaseClient";
import { FiSend } from 'react-icons/fi';
import './ToolBar.css';

const ToolBar = (props) => {
  const [post, setPost] = useState(null);
  const [displayComments, setDisplayComments] = useState(false);
  const [comment, setComment] = useState("");
  const [allComments, setAllComments] = useState([]);
  const [change, setChange] = useState(false);

  useEffect(() => {
    setPost(props.post);
  }, [props]);

  useEffect(() => {
    fetchAllComments();
  }, [displayComments, change]);

  const fetchAllComments = async () => {
    let { data: allComments, error } = await supabase
      .from('Comments')
      .select("*")
      .eq('user_id', props.userId)
      .eq('post_id', post.id);

    if (error) {
      alert(error.message);
      return;
    }

    setAllComments(allComments);
  }

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
    setChange(!change);
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

  const handleShowComments = () => {
    setDisplayComments(!displayComments);
  }

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase
    .from('Comments')
    .insert([
      { content: comment, post_id: post.id, user_id: props.userId},
    ]);

    if (error) console.log(error);
    if (data) console.log(data);

    setComment("");
  }

  return (
    <div className="toolBar-container">
      {displayComments && (
        <div className="comments-box">
          <div>
            {allComments && (
              allComments.map((comment) => (
                <div style={{color: 'black'}} key={comment.id} >{comment.content}</div>
              ))
            )}
          </div>
          <form onSubmit={handleSubmitComment} className="flex comment-writing">
            <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} style={{marginBottom: 0}}/>
            <button type="submit" className="sendCommentBtn"><FiSend/></button>
          </form>
        </div>
      )}
      {post && post.title && (
        <div className="flex" style={{padding: 0}}>
          <Reactions
            likes={post.likes}
            dislikes={post.dislikes}
            handleReactionClick={handleReactionClick}
          />
          <button onClick={handleShowComments} className="commentBtn">Comments</button>
        </div>
      )}
    </div>
  );
}

export default ToolBar;

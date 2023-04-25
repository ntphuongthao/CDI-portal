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
  const [profiles, setProfiles] = useState(null);


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
      .eq('post_id', props.post.id);

    if (error) {
      alert(error.message);
      return;
    }

    const profiles = await getProfiles();
    setProfiles(profiles);
    setAllComments(allComments);
  }

  useEffect(() => {
    if (profiles) {
      const commentsWithUsernames = allComments.map((comment) => {
        const username = profiles[comment.user_id]?.username || '';
        const avatar_url = profiles[comment.user_id]?.avatar_url || '';
        return { ...comment, username, avatar_url };
      });
      setAllComments(commentsWithUsernames);
    }
  }, [profiles]);

  const getProfiles = async () => {
    let { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, username, avatar_url');

    if (error) {
      alert(error.message);
      return {};
    }

    const profilesById = {};
    profiles.forEach((profile) => {
      profilesById[profile.id] = profile;
    });
  
    return profilesById;
  };

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
    // window.location = '/';
  }

  return (
    <div className="toolBar-container">
      {displayComments && (
        <div className="comments-box">
          <div className="comments-box-content">
            {
              allComments.length === 0 && (
                <div className="flex" style={{color: 'black', height: '200px'}}>There are currently no comments.</div>
              )
            }
            {allComments && (
              allComments.map((comment) => {
                const username = comment.username;
                const content = comment.content;
                const avatar = comment.avatar_url; // This will be implemented later!
                return (
                  <div
                    className="flex"
                    style={{color: 'black', justifyContent: 'flex-start'}}
                    key={comment.id}
                  >
                    <b style={{width: '100px'}}><u>{username}:</u></b>
                    <div>{content}</div>
                  </div>
              )})
            )}
          </div>
          <form onSubmit={handleSubmitComment} className="flex comment-writing">
            <img
              src={props.avatar}
              alt="User Avatar"
              width='45px'
              height="45px"
              style={{
                borderRadius: '50%',
                border: '2px solid black'
              }}
            />
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

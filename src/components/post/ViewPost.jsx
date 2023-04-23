import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../../context/supabaseClient";
import { Link } from "react-router-dom";
import { AiOutlineLike, AiOutlineDislike } from "react-icons/ai";
import './ViewPost.css'

const ViewPost = () => {
  const [post, setPost] = useState({
    title: "",
    description: "",
    image: "",
    likes: 0,
    dislikes: "",
  });
  const [allComments, setAllComments] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    const fetchPost = async () => {
      let { data, error } = await supabase
      .from('Posts')
      .select("*")
      .eq('id', id);

      if (error) {
        alert(error.message);
        return;
      }

      setPost(data[0]);
    }

    const fetchAllComments = async () => {
      let { data: allComments, error } = await supabase
        .from('Comments')
        .select("*")
        .eq('post_id', id);
  
      if (error) {
        alert(error.message);
        return;
      }
      setAllComments(allComments);
    }

    fetchPost();
    fetchAllComments();
  }, []);

  return (
    <div className="container">
      <div className="container addMarginTop view-post-container">
        <h1>{post.title}</h1>
        <p>{post.description}</p>
        <p><AiOutlineLike /><b>Likes: </b>{post.likes}</p>
        <p><AiOutlineDislike /><b>Dislikes: </b>{post.dislikes}</p>
        <br /> <br />

        <h2><u>Post's Comments:</u></h2>
        {allComments.length === 0 && <p>There are currently no comments to post</p>}
        {allComments && allComments.map((comment) => (
          <div>{comment.content}</div>
        ))}
        <br />
        <Link to={`/edit/${id}`}><button>Edit Post</button></Link>
      </div>
    </div>
  );
}

export default ViewPost;
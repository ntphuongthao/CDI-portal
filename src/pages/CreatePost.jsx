import { useState } from "react";
import { supabase } from "../supabaseClient";
import './EditPost.css';

const CreatePost = () => {
  const [post, setPost] = useState({
    title: "",
    description: "",
    likes: 0,
    dislikes: 0,
    image: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPost({
      ...post,
      [name]: value,
    });
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    await supabase.from("Posts").insert({title: post.title, description : post.description, image: post.image}).select();
    window.location = "/";
  }

  const handleCancel = () => {
    window.location = "/";
  }

  return (
    <div className="edit">
      <h2 className="title">Create your new Post!</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title</label><br/>
        <input type="text" name="title" value={post.title} onChange={handleChange} /><br/><br/>

        <label htmlFor="description">Description</label><br/>
        <input type="text" name="description" value={post.description} onChange={handleChange} /><br/><br/>

        <label htmlFor="image">Image</label><br/>
        <input type="text" name="image" value={post.image} onChange={handleChange} /><br/><br/>

        <div className="flex">
          <button type="submit">Create Post</button>
          <button className="cancelBtn" type="submit" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

export default CreatePost;
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './EditPost.css';

const EditPost = (props) => {
  const [data, setData] = useState(null);
  const [post, setPost] = useState({
    title: "",
    description: "",
    image: "",
    likes: 0,
    dislikes: "",
  });
  const { id } = useParams();
  
  const handleDelete = async () => {
    await supabase.from('Posts').delete().eq('id', id);
    window.location = '/';
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    await supabase.from('Posts').update({
      title: post.title,
      description: post.description,
      image: post.image,
      likes: post.likes,
      dislikes: post.dislikes,
    }).eq('id', id);

    window.location = '/';
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setPost({
      ...post,
      [name]: value,
    })
  }

  useEffect(() => {
    setData(props.data);
  }, [props]);

  useEffect(() => {
    if (data) {
      const post = data.filter((post) => post.id === parseInt(id))[0];
      setPost(post);
    }
  }, [data]);

  return (
    <div className='edit'>
      <h2 className='title'>Edit your Post here...</h2>
      {post && 
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Title</label><br/>
          <input type="text" name="title" value={post.title} onChange={handleChange} /><br/><br/>

          <label htmlFor="description">Description</label><br/>
          <input type="text" name="description" value={post.description} onChange={handleChange} /><br/><br/>

          <label htmlFor="image">Image</label><br/>
          <input type="text" name="image" value={post.image} onChange={handleChange} /><br/><br/>

          <div className="flex">
            <button type="submit">Edit</button>
            <button className="deleteBtn" onClick={handleDelete}>Delete</button>
          </div>
        </form>
      }
    </div>
  );
}

export default EditPost;
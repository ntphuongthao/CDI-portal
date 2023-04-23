import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../context/supabaseClient';
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
    <div className='edit container'>
      <div className="container edit-post-container">
        <h2 className='title'>Edit your post here...</h2>
        {post && 
          <form onSubmit={handleSubmit}>
            <label htmlFor="title">Title</label>
            <input type="text" placeholder="Add a Title" name="title" value={post.title} onChange={handleChange} />

            <label htmlFor="description">Description</label><br/>
            <textarea rows='8' colums='60' type="text" placeholder="Add a Description" name="description" value={post.description} onChange={handleChange} />

            <label htmlFor="image">Image</label><br/>
            <input type="text" placeholder="Add Image" name="image" value={post.image} onChange={handleChange} />

            <div className="flex">
              <button type="submit">Edit</button>
              <button className="deleteBtn" onClick={handleDelete}>Delete</button>
            </div>
          </form>
        }
      </div>
    </div>
  );
}

export default EditPost;
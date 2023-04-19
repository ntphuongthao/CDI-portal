import { useEffect, useState } from "react";
import Card from "../components/Card";
import './Home.css';

const Home = (props) => {
  const [data, setData] = useState(null);
  const [sortedBy, setSortedBy] = useState('');

  useEffect(() => {
    setData(props.data);
  }, [props]);


  const handleOrderNewest = () => {
    const postsSorted = [...data].sort((a, b) => {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return dateB - dateA;
    });
    setSortedBy("newest");
    setData(postsSorted);
  }

  const handleOrderPopular = () => {
    const postsSorted = [...data].sort((a, b) => b.likes - a.likes);
    setSortedBy("popularity");
    setData(postsSorted);
  }

  return (
    <div className="container addMarginTop">
      <div className="container sortedButtons">
        <div className="flex">
          <h3>Order by:</h3>
          <button className={sortedBy === 'newest' ? 'highlightedBtn' : ''} onClick={handleOrderNewest}>Newest</button>
          <button className={sortedBy === 'popularity' ? 'highlightedBtn' : ''} onClick={handleOrderPopular}>Most Popular</button>
        </div>
        <p>{!sortedBy ? "Posts are currently not sorted by any order!": `Posts are currently sorted by ${sortedBy}!`}</p> 
      </div>

      <h1 className="title">Dashboard</h1>
      {data ? (data.map((post) => (
        <div key={post.id}>
          <Card post={post}/>
          <br /><br />
        </div>
      ))) : (<h4>There are currently no posts available</h4>)}
    </div>
  );
}

export default Home;
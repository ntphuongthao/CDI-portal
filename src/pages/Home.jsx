import { useEffect, useState, useCallback } from "react";
import Card from "../components/post/Card";
import './Home.css';

const Home = (props) => {
  const [data, setData] = useState(null);
  const [sortedBy, setSortedBy] = useState('');
  const [searchInput, setSearchInput] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const userId = props.session.user.id;

  const handleSearch = useCallback((event) => {
    setSearchInput(event.target.value);
    const filteredData = data.filter((post) => post.title.includes(event.target.value.trim()) || post.description.includes(event.target.value.trim()));
    setFilteredData(filteredData);
  }, [data]);

  const handleClear = (e) => {
    e.preventDefault();
    setSearchInput("");
    setFilteredData(data);
  }

  useEffect(() => {
    setData(props.data);
    setFilteredData(props.data);
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
      <form className='flex search-bar'>
        <input
          type="text"
          placeholder="Search..."
          value={searchInput}
          onChange={handleSearch}
          style={{
            fontFamily: "'Raleway', sans-serif"
          }}
        />
        <button type="submit" onClick={handleClear}>Clear</button>
      </form>

      <div className="container sortedButtons">
        <div className="flex">
          <h3>Order by:</h3>
          <button className={sortedBy === 'newest' ? 'highlightedBtn' : ''} onClick={handleOrderNewest}>Newest</button>
          <button className={sortedBy === 'popularity' ? 'highlightedBtn' : ''} onClick={handleOrderPopular}>Most Popular</button>
        </div>
        <p>{!sortedBy ? "Posts are currently not sorted by any order!": `Posts are currently sorted by ${sortedBy}!`}</p> 
      </div>

      <h1 className="title">Dashboard</h1>
      {filteredData && filteredData.length > 0 ? (filteredData.map((post) => (
        <div key={post.id}>
          <Card post={post} userId={userId}/>
          <br /><br />
        </div>
      ))) : (<h4>There are currently no posts available</h4>)}
    </div>
  );
}

export default Home;
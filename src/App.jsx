import './App.css';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import { Routes, Route, Link } from "react-router-dom";
import { useEffect, useState, useCallback } from 'react';
import { supabase } from './supabaseClient';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import DePauw from './pages/DePauw';
import CustomCalendar from './components/CustomCalendar';
import CreateEvent from './pages/CreateEvent';

function App() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [session, setSession] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.from("Posts").select();
      setData(data);
      setFilteredData(data);
    }
    fetchData();

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    })
    
    return () => subscription.unsubscribe();
  }, []);

  const handleSearch = useCallback((event) => {
    setSearchInput(event.target.value);
    const filteredData = data.filter((post) => post.title.includes(event.target.value.trim()) || post.description.includes(event.target.value.trim()));
    setFilteredData(filteredData);
  }, [data]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
  }

  return (
    <>
      <nav className='flex' style={{justifyContent: "space-between"}}>
        <Link to='/'>
          <img src="depauw-logo.jpeg" alt="depauw logo" width="60px" height="50px" className='depauw-logo'/>
        </Link>
        {session && <form className='flex search-bar'>
          <input
            type="text"
            placeholder="Search..."
            value={searchInput}
            onChange={handleSearch}
            style={{
              fontFamily: "'Raleway', sans-serif"
            }}
          />
          <button type="submit">Search</button>
        </form>}
        <ul className='flex nav-links'>
          {session &&
            (<>
              <li><Link to='/'>Home</Link></li> | 
              <li><Link to='/calendar'>Ongoing events</Link></li> | 
              <li>
                <select value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
                  <option value="">Create</option>
                  <option value="new-post"><Link to='/new-post'>Create a new Post</Link></option>
                  <option value="new-event"><Link to='/new-event'>Create a new Event</Link></option>
                </select>
              </li> | 
              <li><button onClick={handleSignOut}>Sign Out</button></li> 
            </>)
          }
          {!session &&
            (
              <>
                <li><Link to='/sign-up'>Sign Up</Link></li> | 
                <li><Link to='/sign-in'>Sign In</Link></li>
              </>
            )
          }
        </ul>
      </nav>

      {session ? (
        <>
          <Routes>
            <Route path='/' element={<Home data={filteredData} />} />
            <Route path='/new-post' element={<CreatePost />} />
            <Route path='/new-event' element={<CreateEvent />} />
            <Route path='/edit/:id' element={<EditPost data={filteredData} />} />
            <Route path='/calendar' element={<CustomCalendar />} />
          </Routes>
        </>
      ) : (
        <DePauw />
      )}

      {!session && <Routes>
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/sign-in' element={<SignIn />} />
        <Route path='*' element={<SignIn />}/>
      </Routes>}
    </>
  );
}

export default App;

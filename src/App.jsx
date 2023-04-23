import './App.css';
import Home from './pages/Home';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import { Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from 'react';
import { supabase } from './context/supabaseClient';
import SignUp from './pages/SignUp';
import SignIn from './pages/SignIn';
import DePauw from './pages/DePauw';
import CustomCalendar from './components/event/CustomCalendar';
import CreateEvent from './pages/CreateEvent';
import Games from './components/games/Games';
import Account from './pages/Account';
import RealTimeChat from './components/chat/RealTimeChat';
import { FaSignOutAlt } from 'react-icons/fa';
import { IoMdAddCircleOutline } from 'react-icons/io';
import { AiOutlineUser } from 'react-icons/ai';
import Users from './pages/Users';

function App() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [session, setSession] = useState(null);
  const [username, setUsername] = useState(null);
  const [website, setWebsite] = useState(null);
  const [avatar_url, setAvatarUrl] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  
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

  useEffect(() => {
    async function getProfile() {
      const { user } = session;

      let { data, error } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', user.id)
        .single();

      if (error) {
        alert("Change your profile!");
        return;
      } else if (data) {
        setUsername(data.username);
        setWebsite(data.website);
        setAvatarUrl(data.avatar_url);
      }
    }
    if (session) getProfile();
  }, [session]);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert(error.message);
      return;
    }
    window.location = '/';
  }

  const handleSearchInput = (e) => {
    setSearchInput(e.target.value);
  }

  return (
    <>
      <nav className='flex' style={{justifyContent: "space-between", padding: "0"}}>
        <div className='flex' style={{color: "#e1ad01"}}>
          <Link to='/'>
            <img src="depauw-logo.jpeg" alt="depauw logo" width="60px" height="50px" className='depauw-logo'/>
          </Link>
          {session && (
            <>
              <li><Link to='/'>Dashboard</Link></li> | 
              <li><Link to='/users'> All Users</Link></li> |
              <li><Link to='/calendar'>Ongoing events</Link></li> | 
              <li><Link to='/games'>Games</Link></li> | 
              <li><Link to="/chat">Alumni chat</Link></li> 
            </>
          )}
        </div>
        <ul className='flex nav-links'>
          {session &&
            (<>
              <li className='nav-icon'><Link to='/account'><AiOutlineUser /> {username ? username: "Anonymous"}</Link></li> | 
              <li className='nav-icon' onClick={handleSignOut}>Sign Out <FaSignOutAlt /></li> 
            </>)
          }
          {!session &&
            (
              <>
                <li><Link to='/sign-up'>Register</Link></li> | 
                <li><Link to='/sign-in'>Log In</Link></li>
              </>
            )
          }
        </ul>
      </nav>
      {session && (
        <div className='dropdown-box'>
          <li className="dropdown">
            <ul className='dropdown-list'>
              <li><Link to="/new-post">New Post</Link></li>
              <li><Link to="/new-event" style={{marginBottom: '5px'}}>New Event</Link></li>
            </ul>
            <IoMdAddCircleOutline size={45} />
          </li>
          
        </div>
      )}

      {session ? 
        (
          <Routes>
            <Route path='/' element={<Home data={data} session={session} />} />
            <Route path='/new-post' element={<CreatePost session={session} />} />
            <Route path='/new-event' element={<CreateEvent session={session} />} />
            <Route path='/edit/:id' element={<EditPost data={filteredData} />} />
            <Route path='/calendar' element={<CustomCalendar />} />
            <Route path='/games' element={<Games />} />
            <Route path='/chat' element={<RealTimeChat session={session} />} />
            <Route path='/account' element={<Account session={session} />} />
            <Route path='/users' element={<Users />} />
          </Routes>
        ) : (
          <Routes>
            <Route path='/sign-up' element={<SignUp />} />
            <Route path='/sign-in' element={<SignIn />} />
            <Route path='/' element={<DePauw />} />
          </Routes>
        )
      }
    </>
  );
}

export default App;

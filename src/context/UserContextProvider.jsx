import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const UserContext = createContext();

const UserContextProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [username, setUsername] = useState(null);
  const [website, setWebsite] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const VITE_SUPABASE_API_KEY = import.meta.env.VITE_SUPABASE_API_KEY;
  const VITE_SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

  const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_API_KEY);

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

  return (
    <UserContext.Provider 
      value={{
        supabase,
        session,
        setSession,
        data,
        setData,
        filteredData,
        setFilteredData,
        username,
        setUsername,
        website,
        setWebsite,
        avatarUrl,
        setAvatarUrl,
      }} 
    >
      {children}
    </UserContext.Provider>
  );
}

const useUserContext = () => useContext(UserContext);

export { UserContext as default, UserContextProvider, useUserContext };


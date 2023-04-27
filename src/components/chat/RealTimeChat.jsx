import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../../context/supabaseClient";
import './RealTimeChat.css';

function RealTimeChat({ session }) {
  const scrollRef = useRef();
  const userId = session.user.id;
  let mySubscription = null;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [profiles, setProfiles] = useState(null);

  useEffect(() => {
    const getProfile = async () => {
      let { data, error } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', userId)
        .single();

      if (error) {
        return;
      } else if (data) {
        setUsername(data.username);
        setAvatar(data.avatar_url);
      }
    }

    const getAllProfiles = async () => {
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
    
      setProfiles(profilesById);
    };

    getProfile();
    getAllProfiles();
    getMessagesAndSubscribe();
  }, []);

  useEffect(() => {
    scrollRef.current.scrollIntoView();
  }, [messages, newMessage]);

  const getMessagesAndSubscribe = () => {
    if (!mySubscription) {
      getInitialMessages();
      mySubscription = supabase
        .channel('PublicChannel')
        .on(
          'postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'messages' },
          (payload) => {
            console.log('Change received!', payload);
          }
        )
        .subscribe();
    }
  }

  const getInitialMessages = async () => {
    if (!messages.length) {
      const { data, error } = await supabase
        .from("messages")
        .select()
        .range(0, 49)
        .order("id", { ascending: true });
      // console.log(`data`, data);

      if (error) {
        supabase.removeSubscription(mySubscription);
        mySubscription = null;
        return;
      }

      setMessages(data);
    }
    scrollRef.current.scrollIntoView();
  }

  const handleNewMessageChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleNewMessageSubmit = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") {
      return;
    }

    const { error} = await supabase.from("messages").insert([{
      message: newMessage.trim(),
      user_id: userId,
      created_at: new Date().toISOString(),
    }]);

    if (error) return;
    setNewMessage("");
    window.location = '/chat';
    scrollRef.current.scrollIntoView();
  };

  return (
    <div className="flex chat-big-container">
      <div className="container chat-container">
        <div className="flex" style={{paddingTop: 0}}>
          <h1 style={{color: 'black'}}>Alumni Chat</h1>
          <img src="./depauw-remove-background.png" alt="" width="50px" />
        </div>
        <div
          className="chatbox"
          id="chat-box"
        >
          {profiles && messages.map((message) => {
            if (message.user_id === userId) {
              return (
                <div key={message.id} className="container" style={{alignItems: 'flex-end'}}>
                  <p className="username-title">{username}</p>
                  <div className="current-user-message" key={message.id}>{message.message}</div>
                </div>
              )
            }
            else {
              const othername = profiles[message.user_id]?.username || '';
              return (
                <div key={message.id} className="container edit-flex" style={{alignItems: 'flex-start'}}>
                  <p className="username-title">{othername}</p>
                  <div className="other-message" key={message.id}>{message.message}</div>
                </div>
              )
            }
          })}
          <div ref={scrollRef} />
        </div>
        <form className="flex" onSubmit={handleNewMessageSubmit}>
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={handleNewMessageChange}
            style={{
              margin: 0
            }}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}

export default RealTimeChat;

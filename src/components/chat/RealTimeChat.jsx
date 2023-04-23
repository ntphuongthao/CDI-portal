import React, { useState, useEffect } from "react";
import { supabase } from "../../context/supabaseClient";
import './RealTimeChat.css';

function RealTimeChat({ session }) {
  const userId = session.user.id;
  let mySubscription = null;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState(null);

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

    getProfile();
    getMessagesAndSubscribe();
  }, []);

  const getMessagesAndSubscribe = () => {
    if (!mySubscription) {
      getInitialMessages();
      mySubscription = supabase
        .channel('PublicChannel')
        .on(
          'postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'messages' },
          (payload) => {
            console.log('Change received!', payload)
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

      console.log(789, data);
      setMessages(data);
    }
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
  };

  return (
    <div className="flex addMarginTop">
      <div className="container chat-container">
        <h1 style={{color: 'black'}}>Open Chat</h1>
        <div className="chatbox">
          {messages.map((message) => {
            if (message.user_id === userId) {
              return (
                <div className="container" style={{alignItems: 'flex-end'}}>
                  <p className="username-title">{username}</p>
                  <div className="current-user-message" key={message.id}>{message.message}</div>
                </div>
              )
            }
            else {
              return (
                <div className="container edit-flex" style={{alignItems: 'flex-start'}}>
                  {/* <p className="username-title">{username}</p> */}
                  <div className="other-message" key={message.id}>{message.message}</div>
                </div>
              )
            }
          })}
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

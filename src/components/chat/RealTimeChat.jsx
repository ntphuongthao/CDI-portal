import React, { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
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
            console.log('here');
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

    const { error} = await supabase.from("messages").insert({
      message: newMessage.trim(),
      created_at: new Date().toISOString(),
    });

    if (error) return;
    setNewMessage("");
    window.location = '/chat';
  };

  return (
    <div className="flex">
      <div className="container chat-container flex">
        <ul className="chatbox flex">
          {messages.map((message) => (
            <li key={message.id}>{message.message}</li>
          ))}
        </ul>
        <form className="flex" onSubmit={handleNewMessageSubmit}>
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={handleNewMessageChange}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}

export default RealTimeChat;

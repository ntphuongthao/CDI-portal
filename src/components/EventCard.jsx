import { useEffect, useState } from "react";
import "./EventCard.css";
import { supabase } from "../supabaseClient";

const EventCard = ({ event, whiteBorder }) => {
  const [username, setUsername] = useState(null);

  const {
    created_at: createdAt, title, description, user_id: userId, date: eventDate,
  } = event;
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  useEffect(() => {
    async function getProfile() {

      let { data, error } = await supabase
        .from('profiles')
        .select(`username, website, avatar_url`)
        .eq('id', userId)
        .single();

      if (error) {
        return;
      } else if (data) {
        setUsername(data.username);
      }
    }
    
    getProfile();
  }, []);

  const dateObj = new Date(eventDate);
  dateObj.setHours(dateObj.getHours() + 24);

  const month = monthNames[dateObj.getMonth()];
  const date = dateObj.getDate();
  const year = dateObj.getFullYear();
  const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <div className="flex event-container">
      <div className={whiteBorder ? "event-card-white" : "event-card"}>
        <div className={whiteBorder ? "event-top-white" : "event-top"}>{month} {year}</div>
        <div className="event-weekday">{weekday}</div>
        <div className="event-date">{date}</div>
      </div>
      <div className="event-content">
        <h2>{title}</h2>
        <p>Created by: {username}</p>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default EventCard;
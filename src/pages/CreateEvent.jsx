import { useState } from "react";
import { supabase } from "../context/supabaseClient";
import './CreateEvent.css';

const CreateEvent = ({ session }) => {
  const user = session.user;

  const [event, setEvent] = useState({
    title: "",
    description: "",
    date: (new Date()).toISOString().slice(0, 10),
    user_id: user.id,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent({
      ...event,
      [name]: value,
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    await supabase.from("Events").insert(event).select();
    window.location = "/calendar";
  }

  const handleCancel = () => {
    window.location = "/";
  }

  return (
    <div className="edit addMarginTop">
      <div className="container create-event-container">
        <h2 className="title">Create your new Event!</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Title</label><br/>
          <input type="text" name="title" value={event.title} onChange={handleChange} />

          <label htmlFor="description">Description</label><br/>
          <textarea cols='60' rows='8' type="text" name="description" value={event.description} onChange={handleChange} />

          <label htmlFor="date">Date</label><br/>
          <input type="date" name="date" value={event.date} onChange={handleChange} />

          <div className="flex">
            <button type="submit">Create Event</button>
            <button className="cancelBtn" type="submit" onClick={handleCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateEvent;
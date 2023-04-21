import Calendar from 'react-calendar';
import { useEffect, useState } from 'react';
import './CustomCalendar.css';
import { supabase } from '../../context/supabaseClient';
import EventCard from './EventCard';
import { Link } from "react-router-dom";

const CustomCalendar = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState(null);
  const [displayedEvents, setDisplayedEvents] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data } = await supabase.from("Events").select();
      setEvents(data);
      setDisplayedEvents(data);
    }

    fetchEvents();
  }, []);

  useEffect(() => {
    if (events) showDateEvents();
  }, [date, events])

  const tileClassName = ({ date: datetime, view }) => {
    if (view === 'month' && datetime.getDate() === new Date(date).getDate() && datetime.getMonth() === new Date(date).getMonth() && datetime.getYear() === new Date(date).getYear()) {
      // This sets the background color for the current date
      return 'current-date';
    }
  };

  const showDateEvents = () => {
    const filteredEvents = events.filter((e) => e.date === new Date(date).toISOString().slice(0, 10));
    setDisplayedEvents(filteredEvents);
  };

  return (
    <div className='flex' style={{justifyContent: 'space-around', padding: 0, alignItems: 'flex-start'}}>
      <div className="calendar calendar-container">
        <Calendar
          onChange={setDate}
          value={date}
          tileClassName={tileClassName}
        />
        <div className='current-events'>
          {(displayedEvents && displayedEvents.length > 0) ?
            (<>
              <h2>Events on {date.toDateString()}</h2>
              <ul>
                {displayedEvents.map((event) => (
                  <EventCard event={event} key={event.id} whiteBorder={true} />
                ))}
              </ul>
            </>) : (
              <p>There are no events today!</p>
            )
          }
        </div>
      </div>

      <div className="all-events-container">
        <h1 className='flex'>
          All Events
          <img src="./depauw-remove-background.png" alt="Depauw Logo" width="50px" />
        </h1>
        <div className='container'>
          <button className='calendar-eventBtn'><Link style={{color: 'black'}} to='/new-event'>Add an event!</Link></button>
        </div>
        <div>
          {events && events.map((event) => (
            <EventCard key={event.created_at} event={event} whiteBorder={false} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CustomCalendar;
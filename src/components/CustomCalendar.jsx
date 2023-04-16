import Calendar from 'react-calendar';
import { useEffect, useState } from 'react';
import './CustomCalendar.css';
import { supabase } from '../supabaseClient';
import EventCard from './EventCard';

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

  const tileClassName = ({ date, view }) => {
    if (view === 'month' && date.getDate() === new Date().getDate() && date.getMonth() === new Date().getMonth() && date.getYear() === new Date().getYear()) {
      // This sets the background color for the current date
      return 'current-date';
    }
  };

  const handleClick = () => {
    const filteredEvents = events.filter((event) => event.date === new Date(date).toISOString().slice(0, 10));
    setDisplayedEvents(filteredEvents);
  };

  return (
    <div className='flex' style={{justifyContent: 'space-around'}}>
      <div className="calendar calendar-container">
        <Calendar
          onChange={setDate}
          value={date}
          tileClassName={tileClassName}
          onClickDay={handleClick}
        />
        <div>
          {(displayedEvents && displayedEvents.length > 0) ?
            (<>
              <h2>Events on {date.toDateString()}</h2>
              <ul>
                {displayedEvents.map((event) => (
                  <li key={event.id}>{event.title}</li>
                ))}
              </ul>
            </>) : (
              <p>There are no events today!</p>
            )
          }
        </div>
      </div>
      <div className="all-events-container container">
        <h2>All Events</h2>
        <div>
          {events && events.map((event) => (
            <EventCard event={event}/>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CustomCalendar;
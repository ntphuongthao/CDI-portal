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

  useEffect(() => {
    if (events) showDateEvents();
  }, [date, events])

  const tileClassName = ({ date, view }) => {
    if (view === 'month' && date.getDate() === new Date().getDate() && date.getMonth() === new Date().getMonth() && date.getYear() === new Date().getYear()) {
      // This sets the background color for the current date
      return 'current-date';
    }
  };

  const showDateEvents = () => {
    const filteredEvents = events.filter((e) => e.date === new Date(date).toISOString().slice(0, 10));
    setDisplayedEvents(filteredEvents);
  };

  return (
    <div className='flex' style={{justifyContent: 'space-around'}}>
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
                  <EventCard event={event} key={event.id} />
                ))}
              </ul>
            </>) : (
              <p>There are no events today!</p>
            )
          }
        </div>
      </div>

      <div className="all-events-container">
        <h1 style={{textAlign: "center"}}>All Events</h1>
        <div>
          {events && events.map((event) => (
            <EventCard key={event.created_at} event={event}/>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CustomCalendar;
import Calendar from 'react-calendar';
import { useEffect, useState } from 'react';
import './CustomCalendar.css';
import { supabase } from '../../context/supabaseClient';
import EventCard from './EventCard';
import { Link } from "react-router-dom";

const CustomCalendar = (props) => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState(null);
  const [currentEvents, setCurrentEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [displayedEvents, setDisplayedEvents] = useState(null);
  const currentUserId = props.session.user.id;
  const [displayPast, setDisplayPast] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      const { data } = await supabase.from("Events").select();
      setEvents(data);

      const today = new Date()
      const past = data.filter((event) => {
        const eventDate = new Date(event.date);
        return eventDate.getTime() < today.getTime();
      })

      const future = data.filter((event) => {
        const eventDate = new Date(event.date);
        return eventDate.getTime() >= today.getTime();
      })

      setPastEvents(past);
      setCurrentEvents(future);
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

  const handleDisplayPast = (display) => {
    setDisplayPast(display);
  }

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
              <p className='flex' style={{width: '600px'}}>There are no events today!</p>
            )
          }
        </div>
      </div>

      <div className="all-events-container">
        <div className="past-event-btns">
          <button className={`past-event-btn ${displayPast ? 'event-highlight': ''}`} onClick={() => handleDisplayPast(true)}>Past</button>
          <button className={`current-event-btn ${!displayPast ? 'event-highlight': ''}`} onClick={() => handleDisplayPast(false)}>Current</button>
        </div>
        <br />
        {displayPast && (
          <div>
            <h1 className="flex">
              Past Events
              <img src="./depauw-remove-background.png" alt="Depauw Logo" width="50px" />
            </h1>
            <div>
              {pastEvents.length === 0 && (
                <p style={{textAlign: 'center'}}>There are no past events to show!</p>
              )}
              {pastEvents && pastEvents.map((event) => (
                <EventCard
                  key={event.created_at}
                  event={event}
                  whiteBorder={false}
                  currentUserId={currentUserId}
                />
              ))}
            </div>
          </div>
        )}

        {!displayPast && (
          <div>
            <h1 className='flex'>
              Ongoing Events
              <img src="./depauw-remove-background.png" alt="Depauw Logo" width="50px" />
            </h1>
            <div className='container'>
              <button className='calendar-eventBtn'>
                <Link style={{color: 'black'}} to='/new-event'>Add an event!</Link>
              </button>
            </div>
            <div>
              {currentEvents.length === 0 && (
                <>
                  <br />
                  <p style={{textAlign: 'center'}}>There are no current events to show!</p>
                </>
              )}
              {currentEvents && currentEvents.map((event) => (
                <EventCard
                  key={event.created_at}
                  event={event}
                  whiteBorder={false}
                  currentUserId={currentUserId}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomCalendar;
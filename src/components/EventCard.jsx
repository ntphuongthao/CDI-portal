import "./EventCard.css";

const EventCard = ({ event }) => {
  const {
    created_at: createdAt, title, description
  } = event;
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const dateObj = new Date(createdAt);

  const month = monthNames[dateObj.getMonth()];
  const date = dateObj.getDate();
  const year = dateObj.getFullYear();
  const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'long' });

  return (
    <div className="flex event-container">
      <div className="event-card">
        <div className="event-top">{month}, {year}</div>
        <div className="event-weekday">{weekday}</div>
        <div className="event-date">{date}</div>
      </div>
      <div className="event-content">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default EventCard;
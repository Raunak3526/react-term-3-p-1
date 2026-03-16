import { FaBus, FaTrain } from 'react-icons/fa';
import { MdAccessTime, MdLocationOn, MdArrowForward } from 'react-icons/md';

function ScheduleCard({ schedule, isNextArrival, index, onClick }) {
  const transportIcons = {
    Bus: <FaBus />,
    Train: <FaTrain />,
    Metro: <FaTrain />,
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'On Time':
        return 'status-ontime';
      case 'Delayed':
        return 'status-delayed';
      case 'Arriving':
        return 'status-arriving';
      default:
        return '';
    }
  };

  const getMinutesUntil = (arrivalTime) => {
    const now = new Date();
    const arrival = new Date();
    const [hours, minutes] = arrivalTime.split(':').map(Number);
    arrival.setHours(hours, minutes, 0, 0);
    return Math.round((arrival - now) / 60000);
  };

  const minutesUntil = getMinutesUntil(schedule.arrivalTime);
  const routeName = `${schedule.origin} → ${schedule.destination}`;

  return (
    <div
      className={`schedule-card ${isNextArrival ? 'next-arrival' : ''}`}
      style={{ animationDelay: `${index * 0.08}s` }}
      onClick={() => onClick(schedule)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick(schedule)}
    >
      {isNextArrival && (
        <div className="next-badge">
          <span className="badge-dot"></span>
          Next Arrival
        </div>
      )}
      <div className="card-header">
        <div className="transport-type">
          <span className={`transport-icon ${schedule.type.toLowerCase()}`}>
            {transportIcons[schedule.type] || <FaBus />}
          </span>
          <div className="route-info">
            <span className="route-name">{routeName}</span>
            <span className="transport-name">{schedule.type} · Route {schedule.routeNumber}</span>
          </div>
        </div>
        <div className={`status-badge ${getStatusClass(schedule.status)}`}>
          {schedule.status}
        </div>
      </div>

      <div className="card-body">
        <div className="route-path">
          <div className="path-point">
            <MdLocationOn className="path-icon origin" />
            <span>{schedule.origin}</span>
          </div>
          <div className="path-line">
            <MdArrowForward className="arrow-icon" />
          </div>
          <div className="path-point">
            <MdLocationOn className="path-icon destination" />
            <span>{schedule.destination}</span>
          </div>
        </div>
      </div>

      <div className="card-footer">
        <div className="arrival-info">
          <MdAccessTime className="time-icon" />
          <span className="arrival-time">{schedule.arrivalTime}</span>
        </div>
        <div className={`time-until ${minutesUntil <= 5 ? 'arriving-soon' : ''}`}>
          {minutesUntil <= 0
            ? 'Departed'
            : minutesUntil <= 1
            ? 'Arriving now'
            : `${minutesUntil} min`}
        </div>
      </div>

      <div className="click-hint">Click for details →</div>
    </div>
  );
}

export default ScheduleCard;

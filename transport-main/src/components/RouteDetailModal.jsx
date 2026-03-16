import { FaBus, FaTrain, FaTimes, FaClock, FaMapMarkerAlt } from 'react-icons/fa';
import { MdAccessTime, MdLocationOn, MdArrowForward, MdSpeed, MdEventSeat } from 'react-icons/md';

function RouteDetailModal({ schedule, onClose }) {
  if (!schedule) return null;

  const transportIcons = {
    Bus: <FaBus />,
    Train: <FaTrain />,
    Metro: <FaTrain />,
  };

  const getMinutesUntil = (arrivalTime) => {
    const now = new Date();
    const arrival = new Date();
    const [hours, minutes] = arrivalTime.split(':').map(Number);
    arrival.setHours(hours, minutes, 0, 0);
    return Math.round((arrival - now) / 60000);
  };

  const minutesUntil = getMinutesUntil(schedule.arrivalTime);

  // Generate some derived detail data
  const platformNumber = ((schedule.id * 3) % 12) + 1;
  const seatsAvailable = schedule.completed ? 'Limited' : 'Available';
  const estimatedDuration = ((schedule.id * 7) % 45) + 10;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="modal-header">
          <div className={`modal-transport-icon ${schedule.type.toLowerCase()}`}>
            {transportIcons[schedule.type] || <FaBus />}
          </div>
          <div className="modal-title-info">
            <h2>{schedule.origin} → {schedule.destination}</h2>
            <span className="modal-type-badge">{schedule.type} · Route {schedule.routeNumber}</span>
          </div>
        </div>

        <div className="modal-route-visual">
          <div className="route-visual-point start">
            <MdLocationOn />
            <span>{schedule.origin}</span>
          </div>
          <div className="route-visual-line">
            <div className="route-visual-dots"></div>
            <MdArrowForward className="route-visual-arrow" />
          </div>
          <div className="route-visual-point end">
            <MdLocationOn />
            <span>{schedule.destination}</span>
          </div>
        </div>

        <div className="modal-details-grid">
          <div className="detail-item">
            <MdAccessTime className="detail-icon" />
            <div>
              <span className="detail-label">Arrival Time</span>
              <span className="detail-value">{schedule.arrivalTime}</span>
            </div>
          </div>
          <div className="detail-item">
            <FaClock className="detail-icon" />
            <div>
              <span className="detail-label">Time Until Arrival</span>
              <span className="detail-value">
                {minutesUntil <= 0 ? 'Departed' : minutesUntil <= 1 ? 'Arriving now' : `${minutesUntil} min`}
              </span>
            </div>
          </div>
          <div className="detail-item">
            <FaMapMarkerAlt className="detail-icon" />
            <div>
              <span className="detail-label">Platform / Stop</span>
              <span className="detail-value">#{platformNumber}</span>
            </div>
          </div>
          <div className="detail-item">
            <MdSpeed className="detail-icon" />
            <div>
              <span className="detail-label">Est. Duration</span>
              <span className="detail-value">{estimatedDuration} min</span>
            </div>
          </div>
          <div className="detail-item">
            <MdEventSeat className="detail-icon" />
            <div>
              <span className="detail-label">Seats</span>
              <span className="detail-value">{seatsAvailable}</span>
            </div>
          </div>
          <div className="detail-item">
            <div className={`detail-status-dot ${schedule.status === 'On Time' ? 'on-time' : schedule.status === 'Delayed' ? 'delayed' : 'arriving'}`}></div>
            <div>
              <span className="detail-label">Status</span>
              <span className="detail-value">{schedule.status}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RouteDetailModal;

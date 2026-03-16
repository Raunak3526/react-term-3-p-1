import { FaBus, FaTrain, FaSyncAlt, FaClock } from 'react-icons/fa';
import { MdLocationOn } from 'react-icons/md';

function Header({ lastUpdated, onRefresh, isRefreshing }) {
  const formatTime = (date) => {
    if (!date) return '--:--:--';
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  return (
    <header className="header">
      <div className="header-left">
        <div className="header-logo">
          <div className="logo-icon">
            <FaBus />
            <FaTrain className="logo-train" />
          </div>
          <div>
            <h1 className="header-title">TransitPulse</h1>
            <p className="header-subtitle">Real-Time Transport Schedules</p>
          </div>
        </div>
      </div>
      <div className="header-right">
        <div className="last-updated">
          <FaClock className="clock-icon" />
          <div>
            <span className="update-label">Last Updated</span>
            <span className="update-time">{formatTime(lastUpdated)}</span>
          </div>
        </div>
        <button
          className={`refresh-btn ${isRefreshing ? 'refreshing' : ''}`}
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          <FaSyncAlt className={`refresh-icon ${isRefreshing ? 'spinning' : ''}`} />
          <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>
    </header>
  );
}

export default Header;

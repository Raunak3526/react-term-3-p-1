import { FaRoute, FaClock, FaCheckCircle, FaBus } from 'react-icons/fa';

function StatsBar({ routes, nextArrival }) {
  const totalRoutes = [...new Set(routes.map((r) => r.routeNumber))].length;
  const onTimeCount = routes.filter((r) => r.status === 'On Time').length;
  const onTimePercent =
    routes.length > 0 ? Math.round((onTimeCount / routes.length) * 100) : 0;
  const activeServices = routes.filter((r) => {
    const now = new Date();
    const [hours, minutes] = r.arrivalTime.split(':').map(Number);
    const arrival = new Date();
    arrival.setHours(hours, minutes, 0, 0);
    return arrival > now;
  }).length;

  const getMinutesUntilNext = () => {
    if (!nextArrival) return '--';
    const now = new Date();
    const [hours, minutes] = nextArrival.arrivalTime.split(':').map(Number);
    const arrival = new Date();
    arrival.setHours(hours, minutes, 0, 0);
    const diff = Math.round((arrival - now) / 60000);
    return diff > 0 ? `${diff} min` : 'Now';
  };

  const stats = [
    {
      icon: <FaRoute />,
      label: 'Total Routes',
      value: totalRoutes,
      color: 'var(--accent-blue)',
    },
    {
      icon: <FaBus />,
      label: 'Active Services',
      value: activeServices,
      color: 'var(--accent-purple)',
    },
    {
      icon: <FaClock />,
      label: 'Next Arrival',
      value: getMinutesUntilNext(),
      color: 'var(--accent-green)',
    },
    {
      icon: <FaCheckCircle />,
      label: 'On Time',
      value: `${onTimePercent}%`,
      color: onTimePercent >= 80 ? 'var(--accent-green)' : 'var(--accent-orange)',
    },
  ];

  return (
    <div className="stats-bar">
      {stats.map((stat, index) => (
        <div className="stat-card" key={index}>
          <div className="stat-icon" style={{ color: stat.color }}>
            {stat.icon}
          </div>
          <div className="stat-content">
            <span className="stat-value">{stat.value}</span>
            <span className="stat-label">{stat.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default StatsBar;

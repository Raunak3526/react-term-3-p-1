import { FaRoute, FaBus, FaTrain, FaSubway } from 'react-icons/fa';
import { MdFilterList } from 'react-icons/md';

function RouteSelector({ routes, selectedRoute, onSelectRoute, selectedType, onSelectType }) {
  // Extract unique route names
  const uniqueRoutes = [];
  const seen = new Set();
  routes.forEach((r) => {
    const key = `${r.origin} → ${r.destination}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueRoutes.push({
        name: key,
        type: r.type,
        routeNumber: r.routeNumber,
      });
    }
  });
  uniqueRoutes.sort((a, b) => a.name.localeCompare(b.name));

  // Filter route options based on selected transport type
  const filteredOptions =
    selectedType === 'all'
      ? uniqueRoutes
      : uniqueRoutes.filter((r) => r.type === selectedType);

  const transportTypes = [
    { key: 'all', label: 'All', icon: <MdFilterList /> },
    { key: 'Bus', label: 'Bus', icon: <FaBus /> },
    { key: 'Train', label: 'Train', icon: <FaTrain /> },
    { key: 'Metro', label: 'Metro', icon: <FaSubway /> },
  ];

  return (
    <div className="route-selector">
      <div className="transport-type-tabs">
        {transportTypes.map((t) => (
          <button
            key={t.key}
            className={`type-tab ${selectedType === t.key ? 'active' : ''} ${t.key !== 'all' ? t.key.toLowerCase() : ''}`}
            onClick={() => {
              onSelectType(t.key);
              onSelectRoute('all');
            }}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>
      <div className="selector-wrapper">
        <FaRoute className="selector-icon" />
        <select
          value={selectedRoute}
          onChange={(e) => onSelectRoute(e.target.value)}
          className="route-dropdown"
          id="route-selector"
        >
          <option value="all">All Routes</option>
          {filteredOptions.map((route) => (
            <option key={route.name} value={route.name}>
              {route.type} — {route.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default RouteSelector;

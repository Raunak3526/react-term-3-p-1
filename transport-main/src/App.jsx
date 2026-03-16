import { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import RouteSelector from './components/RouteSelector';
import ScheduleCard from './components/ScheduleCard';
import StatsBar from './components/StatsBar';
import RouteDetailModal from './components/RouteDetailModal';
import './App.css';

const ROUTE_NAMES = [
  { origin: 'Central Station', destination: 'Airport Terminal', type: 'Bus' },
  { origin: 'Downtown Hub', destination: 'University Campus', type: 'Train' },
  { origin: 'Eastside Mall', destination: 'Tech Park', type: 'Bus' },
  { origin: 'Harbor Point', destination: 'City Center', type: 'Metro' },
  { origin: 'North Gate', destination: 'South Plaza', type: 'Train' },
  { origin: 'West End', destination: 'Riverside Drive', type: 'Bus' },
  { origin: 'Hills Station', destination: 'Market Square', type: 'Metro' },
  { origin: 'Lakeside View', destination: 'Convention Center', type: 'Train' },
  { origin: 'Stadium Road', destination: 'Medical District', type: 'Bus' },
  { origin: 'Old Town', destination: 'New Business Park', type: 'Metro' },
];

const STATUSES = ['On Time', 'On Time', 'On Time', 'On Time', 'Delayed', 'On Time', 'On Time'];

function mapTodosToRoutes(todos) {
  const now = new Date();
  return todos.slice(0, 20).map((todo, index) => {
    const routeData = ROUTE_NAMES[index % ROUTE_NAMES.length];
    const minutesFromNow = Math.floor((todo.id * 7 + index * 13) % 120) - 10;
    const arrivalDate = new Date(now.getTime() + minutesFromNow * 60000);
    const arrivalTime = `${String(arrivalDate.getHours()).padStart(2, '0')}:${String(arrivalDate.getMinutes()).padStart(2, '0')}`;

    const status = minutesFromNow <= 2 && minutesFromNow >= -1
      ? 'Arriving'
      : STATUSES[index % STATUSES.length];

    return {
      id: todo.id,
      routeNumber: ((todo.id - 1) % 10) + 1,
      ...routeData,
      arrivalTime,
      status,
      completed: todo.completed,
    };
  });
}

function App() {
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);

  const fetchRoutes = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/todos');
      if (!response.ok) throw new Error('Failed to fetch schedules');
      const data = await response.json();
      const mappedRoutes = mapTodosToRoutes(data);
      setRoutes(mappedRoutes);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchRoutes();
  }, [fetchRoutes]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchRoutes();
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchRoutes]);

  // Filter routes based on transport type and selected route name
  const typeFiltered =
    selectedType === 'all'
      ? routes
      : routes.filter((r) => r.type === selectedType);

  const filteredRoutes =
    selectedRoute === 'all'
      ? typeFiltered
      : typeFiltered.filter((r) => `${r.origin} → ${r.destination}` === selectedRoute);

  // Sort by arrival time
  const sortedRoutes = [...filteredRoutes].sort((a, b) => {
    return a.arrivalTime.localeCompare(b.arrivalTime);
  });

  // Find next arriving route (earliest future arrival)
  const findNextArrival = () => {
    const now = new Date();
    const nowStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const futureRoutes = sortedRoutes.filter((r) => r.arrivalTime >= nowStr);
    return futureRoutes.length > 0 ? futureRoutes[0].id : null;
  };

  const nextArrivalId = findNextArrival();
  const nextArrival = routes.find((r) => r.id === nextArrivalId);

  return (
    <div className="app">
      <Header
        lastUpdated={lastUpdated}
        onRefresh={fetchRoutes}
        isRefreshing={isRefreshing}
      />

      <main className="main-content">
        <StatsBar routes={routes} nextArrival={nextArrival} />

        <div className="controls-section">
          <RouteSelector
            routes={routes}
            selectedRoute={selectedRoute}
            onSelectRoute={setSelectedRoute}
            selectedType={selectedType}
            onSelectType={setSelectedType}
          />
          <div className="auto-refresh-badge">
            <span className="auto-dot"></span>
            Auto-refresh: 30s
          </div>
        </div>

        {error && (
          <div className="error-banner">
            <span>⚠️ {error}</span>
            <button onClick={fetchRoutes}>Try Again</button>
          </div>
        )}

        <div className="schedule-grid">
          {sortedRoutes.length > 0 ? (
            sortedRoutes.map((schedule, index) => (
              <ScheduleCard
                key={schedule.id}
                schedule={schedule}
                isNextArrival={schedule.id === nextArrivalId}
                index={index}
                onClick={setSelectedDetail}
              />
            ))
          ) : (
            <div className="empty-state">
              <p>No schedules found for the selected route.</p>
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        <p>TransitPulse © 2026 — Real-time schedules, always on track.</p>
      </footer>

      {selectedDetail && (
        <RouteDetailModal
          schedule={selectedDetail}
          onClose={() => setSelectedDetail(null)}
        />
      )}
    </div>
  );
}

export default App;

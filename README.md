# 🚆 Real-Time Transport Schedule App

## 📌 Problem Context

Users often need real-time access to transport schedules such as bus or train timings. This application provides a simple and dynamic interface to view and track transport routes in real time.

---

## ⚙️ Functional Requirements

- Fetch transport route data using `useEffect`
- Store and manage:
  - Available routes
  - Selected route
  - Last updated timestamp
- Provide a dropdown to select route number
- Highlight the next arriving bus/train based on timing
- Include a **Refresh** button to manually re-fetch data

---

## 🌐 Suggested API

Data is fetched from:
https://jsonplaceholder.typicode.com/todos

👉 The todos data is mapped locally to simulate transport routes and timing information.

---

## ✨ Bonus Features

- Auto-refresh data every 30 seconds
- Live update of route timings
- Improved UX with real-time changes

---

## 🎯 Learning Outcomes

This project helps in understanding:
- `useEffect` for side effects and data fetching
- Time-based state management
- Manual data re-fetching
- Derived state calculations (next arrival logic)
- Real-time UI updates

import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

function App() {
  const [token, setToken] = useState(null);
  const [timer, setTimer] = useState({ sessionTime: 25, breakTime: 5 });

  const authenticateUser = async () => {
    window.location.href = 'http://localhost:5000/auth/google';
  };

  const fetchUserData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/protected', {
        headers: { Authorization: token },
      });
      alert(response.data);
    } catch (e) {
      alert('Error accessing protected data');
    }
  };

  const updateTimer = async () => {
    try {
      const response = await axios.post('http://localhost:5000/set-timer', timer);
      alert(response.data.message);
    } catch (e) {
      alert('Error updating timer');
    }
  };

  const handleSessionChange = (e) => {
    setTimer({ ...timer, sessionTime: e.target.value });
  };

  const handleBreakChange = (e) => {
    setTimer({ ...timer, breakTime: e.target.value });
  };

  return (
    <Router>
      <div className="App">
        <h1>FocusFlow - Productivity Tool</h1>

        {token ? (
          <div>
            <button onClick={fetchUserData}>Access Protected Data</button>
            <h2>Pomodoro Timer</h2>
            <label>
              Session Time (minutes):
              <input
                type="number"
                value={timer.sessionTime}
                onChange={handleSessionChange}
              />
            </label>
            <label>
              Break Time (minutes):
              <input
                type="number"
                value={timer.breakTime}
                onChange={handleBreakChange}
              />
            </label>
            <button onClick={updateTimer}>Set Timer</button>
          </div>
        ) : (
          <button onClick={authenticateUser}>Login with Google</button>
        )}
      </div>
    </Router>
  );
}

export default App;

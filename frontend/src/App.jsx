import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import authService from './services/auth.service';
import './App.css';

function App() {
  const [currentUser, setCurrentUser] = useState(undefined);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const logout = () => {
    authService.logout();
    setCurrentUser(undefined);
  };

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={currentUser ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login onLoginSuccess={setCurrentUser} />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/dashboard" 
            element={currentUser ? <Dashboard user={currentUser} onLogout={logout} /> : <Navigate to="/login" />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

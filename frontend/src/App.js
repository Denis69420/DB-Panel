// frontend/src/App.js
import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

function App() {
  const location = useLocation();

  // On OAuth callback, check for token in query parameters
  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);
      // Remove the token query from URL
      window.history.replaceState({}, document.title, "/dashboard");
    }
  }, [location]);

  const token = localStorage.getItem('token');
  if (!token && location.pathname !== '/login') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-gray-900 text-gray-200">
      {token && <Sidebar />}
      <div className="flex-1">
        {token && <Navbar />}
        <div className="p-4">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/search" element={<Search />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;

// frontend/src/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

function Sidebar() {
  return (
    <div className="w-64 bg-gray-900 p-4">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <nav className="flex flex-col space-y-2">
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => isActive ? "bg-gray-700 p-2 rounded" : "p-2 hover:bg-gray-700 rounded"}
        >
          Dashboard
        </NavLink>
        <NavLink 
          to="/search" 
          className={({ isActive }) => isActive ? "bg-gray-700 p-2 rounded" : "p-2 hover:bg-gray-700 rounded"}
        >
          Search Players
        </NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;

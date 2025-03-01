// frontend/src/components/SearchBar.jsx
import React from 'react';

function SearchBar({ type, setType, value, setValue, handleSearch }) {
  return (
    <form onSubmit={handleSearch} className="flex space-x-2">
      <select value={type} onChange={e => setType(e.target.value)} className="p-2 bg-gray-700 rounded">
        <option value="playerId">Player ID</option>
        <option value="steam">Steam ID</option>
        <option value="discord">Discord ID</option>
        <option value="name">Character Name</option>
        <option value="license">License</option>
      </select>
      <input type="text" value={value} onChange={e => setValue(e.target.value)} placeholder="Search..." className="p-2 bg-gray-700 rounded flex-1"/>
      <button type="submit" className="px-4 py-2 bg-indigo-600 rounded hover:bg-indigo-700">Search</button>
    </form>
  );
}

export default SearchBar;

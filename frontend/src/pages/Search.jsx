// frontend/src/pages/Search.jsx
import React, { useState } from 'react';
import api from '../utils/api';

function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Called when the user submits the search form.
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    try {
      // Call the backend with query parameter "q"
      const res = await api.get('/search', { params: { q: query } });
      setResults(res.data);
    } catch (err) {
      setError('Search failed');
      console.error(err);
    }
    setLoading(false);
  };

  // Render a single search result.
  // This function checks if the result has a nested "row" property.
  // If so, it dynamically lists every key/value pair from that row.
  // Otherwise, it displays a flat row with some default fields.
  const renderResult = (result, index) => {
    if (result.row) {
      // Dynamic GUI: automatically list all fields in the returned row.
      const rowData = result.row;
      return (
        <div key={index} className="border border-gray-700 p-4 mb-4 rounded">
          <h2 className="font-bold text-lg mb-2">
            Table: <span className="text-indigo-400">{result.tableName}</span> |&nbsp;
            Column: <span className="text-green-400">{result.columnName}</span> |&nbsp;
            Type: <span className="text-yellow-400">{result.dataType}</span>
          </h2>
          <table className="min-w-full text-sm">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-2">Field</th>
                <th className="px-4 py-2">Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(rowData).map((key) => (
                <tr key={key} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="px-4 py-2 font-semibold">{key}</td>
                  <td className="px-4 py-2">{String(rowData[key])}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else {
      // If the result doesn't have a nested "row", assume a flat structure.
      return (
        <tr key={index} className="border-b border-gray-700 hover:bg-gray-700">
          <td className="px-4 py-2">{result.id}</td>
          <td className="px-4 py-2">{result.name}</td>
          <td className="px-4 py-2">{result.identifier}</td>
          <td className="px-4 py-2">{result.discord}</td>
          <td className="px-4 py-2">{result.license}</td>
        </tr>
      );
    }
  };

  return (
    <div className="p-4 text-white">
      <h1 className="text-2xl font-bold mb-4">Search Panel</h1>
      
      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex space-x-2">
          <input 
            type="text"
            className="w-full p-2 rounded bg-gray-700 text-white"
            placeholder="Enter any ID, name, etc."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded">
            Search
          </button>
        </div>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {results.length === 0 && !loading && <p className="py-4">No results found.</p>}

      {/* If results contain nested "row", use dynamic GUI; otherwise, show a flat table */}
      {results.length > 0 && (
        <>
          {results[0].row ? (
            results.map((result, index) => renderResult(result, index))
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-gray-800">
                  <tr>
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Identifier</th>
                    <th className="px-4 py-2">Discord</th>
                    <th className="px-4 py-2">License</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((result, index) => renderResult(result, index))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Search;

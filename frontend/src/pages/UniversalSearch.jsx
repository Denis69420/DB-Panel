// frontend/src/pages/UniversalSearch.jsx
import React, { useState } from 'react';
import api from '../utils/api';

function UniversalSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');
    setResults([]);

    try {
      // GET /api/search?q={query}
      const res = await api.get('/search', { params: { q: query } });
      setResults(res.data);
    } catch (err) {
      console.error(err);
      setError('Search failed. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Renders one matched row as a sub-table of key/value pairs.
   * Each "item" is { tableName, columnName, dataType, row: {...} }
   */
  const renderMatch = (item, idx) => {
    const rowKeys = Object.keys(item.row);

    return (
      <div key={idx} className="border border-gray-700 p-4 mb-4">
        <h2 className="font-bold text-lg mb-2">
          Table: <span className="text-indigo-400">{item.tableName}</span> |&nbsp;
          Column: <span className="text-green-400">{item.columnName}</span> |&nbsp;
          Type: <span className="text-yellow-400">{item.dataType}</span>
        </h2>

        <table className="min-w-full mt-2 text-sm">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-4 py-2">Field</th>
              <th className="px-4 py-2">Value</th>
            </tr>
          </thead>
          <tbody>
            {rowKeys.map((key) => (
              <tr key={key} className="border-b border-gray-700 hover:bg-gray-700">
                <td className="px-4 py-2 font-semibold">{key}</td>
                <td className="px-4 py-2">{JSON.stringify(item.row[key])}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="p-4 text-white">
      <h1 className="text-2xl font-bold mb-4">Universal DB Search</h1>

      <form onSubmit={handleSearch} className="mb-4 flex space-x-2">
        <input
          type="text"
          className="w-full p-2 rounded bg-gray-700 text-white"
          placeholder="Enter e.g. steam:11000014c9775ba"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded">
          Search
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {results.length > 0 ? (
        <div>
          {results.map(renderMatch)}
        </div>
      ) : (
        !loading && !error && <p>No results found.</p>
      )}
    </div>
  );
}

export default UniversalSearch;

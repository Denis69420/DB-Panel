// frontend/src/components/Navbar.jsx
import React from 'react';

function Navbar() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    // Decode JWT (this is a simple decode; in production consider using a proper library)
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUser(payload);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="flex justify-between items-center bg-gray-800 p-4">
      <div className="text-lg font-bold">FiveM Panel</div>
      <div className="flex items-center space-x-4">
        {user && (
          <>
            <img 
              src={`https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}.png`} 
              alt="Avatar" 
              className="w-8 h-8 rounded-full"
            />
            <span>{user.username}</span>
          </>
        )}
        <button onClick={handleLogout} className="px-3 py-1 bg-red-600 rounded hover:bg-red-700">
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;

// frontend/src/pages/Login.jsx
import React from 'react';

function Login() {
  const handleLogin = () => {
    window.location.href = 'http://localhost:5000/auth/discord';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <h1 className="text-4xl mb-8">Welcome to the FiveM Admin Panel</h1>
      <button 
        onClick={handleLogin}
        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded text-white"
      >
        Login with Discord
      </button>
    </div>
  );
}

export default Login;

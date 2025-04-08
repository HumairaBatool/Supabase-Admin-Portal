import React, { useState } from 'react';
import { supabase } from '../supabase/client';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    const { error, data } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      onLogin(data.user);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-purple-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-xl">
        <h2 className="text-3xl sm:text-4xl font-bold text-purple-600 text-center mb-6">Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 mb-4"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400 mb-4"
        />

        {error && (
          <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
        )}

        <button
          onClick={handleLogin}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-md transition duration-200"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;

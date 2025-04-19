import React, { useState } from 'react';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";

const showToast = (message, type = 'default') => {
  const background = {
    success: '#4CAF50',
    error: '#F44336',
    warning: '#FF9800',
    info: '#2196F3',
    default: '#323232'
  };

  Toastify({
    text: message,
    duration: 3000,
    close: true,
    gravity: "top",
    position: "center",
    stopOnFocus: true,
    style: {
      background: background[type],
      borderRadius: '8px',
      fontFamily: 'Poppins, sans-serif'
    }
  }).showToast();
};

const LoginModal = ({ onClose, onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      showToast('Please enter both username and password', 'warning');
      return;
    }

    setIsLoading(true);
    
    try {
      const res = await fetch('http://195.248.242.67:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('accessToken', data.token);
        showToast('Login successful!', 'success');
        onLoginSuccess();
      } else {
        const errorData = await res.json();
        showToast(errorData.message || 'Login failed', 'error');
      }
    } catch (err) {
      showToast('Network error. Please try again.', 'error');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 backdrop-blur-[5px] flex justify-center items-center z-50'>
      <div className='w-[80%]'>
        <input
          type="text"
          className='w-full mb-8 border rounded-xl p-5 text-[#404040] placeholder:text-[#AFAFAF] text-lg focus:outline-none border-none shadow-xl'
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className='w-full mb-3 border rounded-xl p-5 text-[#404040] placeholder:text-[#AFAFAF] text-lg focus:outline-none border-none shadow-xl'
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className='flex justify-center mt-14'>
          <button
            className='bg-white text-[#00427A] text-[20px] w-[60%] py-2 rounded-full disabled:opacity-50'
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </div>
        <button
          className='text-gray-500 w-full mt-2'
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
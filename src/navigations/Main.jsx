import React, { useState } from 'react';
import logo from "../assets/images/logo.svg";
import iranFlag from "../assets/images/iran.png";
import userIcon from "../assets/images/user.svg";
import { useNavigate } from 'react-router-dom';
import LoginModal from './Login';
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

const Main = () => {
  // Form state hooks
  const [phone, setPhone] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('CEO |  مدیر عامل');
  const [country, setCountry] = useState('Iran');
  const [description, setDescription] = useState('');
  const [showLogin, setShowLogin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // Submit handler
  const handleSubmit = async () => {
    if (!phone || !fullName) {
      showToast('Please fill in all required fields', 'warning');
      return;
    }

    const payload = {
      phone,
      fullName,
      role,
      country,
      expo: "Expo 2050",
      description
    };

    setIsSubmitting(true);
    
    try {
      const res = await fetch("http://195.248.242.67:5000/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      
      if (res.ok) {
        showToast('Form submitted successfully!', 'success');
        // Reset form after successful submission
        setPhone('');
        setFullName('');
        setDescription('');
      } else {
        showToast(data.message || 'Submission failed', 'error');
      }
    } catch (err) {
      showToast('Network error. Please try again.', 'error');
      console.error("Submission failed", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUserIconClick = () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      navigate('/admin');
    } else {
      setShowLogin(true);
    }
  };


  return (
    <div className='poppins mt-4 relative'>
      {/* Logo */}
      <div>
        <img src={logo} className='w-[145px] mx-auto' alt="Logo" />
      </div>

      <div className='mt-6 text-center'>
        <input
          type='tel'
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className='p-5 w-[90%] rounded-xl shadow-xl text-[#404040] placeholder:text-[#AFAFAF] text-lg focus:outline-none border-none'
          placeholder='Phone Num'
        />

        <input
          type='text'
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className='p-5 my-6 w-[90%] rounded-xl shadow-xl text-[#404040] placeholder:text-[#AFAFAF] text-lg focus:outline-none border-none'
          placeholder='Full Name'
        />

        <select
          className='px-5 w-[90%] rounded-xl shadow-xl h-[60px]'
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option>CEO |  مدیر عامل</option>
          <option>COO | مدیر اجرایی</option>
          <option>Businessman| تاجر</option>
          <option>Company representative|  نماینده شرکت</option>
          <option>Sale Manager | مدیر فروش</option>
          <option>Transportation | حمل و نقل</option>
          <option>Other | سایر</option>
        </select>

        <div className='flex items-center gap-4 w-[90%] mx-auto my-6'>
          {/* Country Selector */}
          <div className='flex items-center bg-white rounded-xl shadow-xl px-4 py-2 w-1/2'>
            <img src={iranFlag} alt="Iran Flag" className='w-10 h-10 rounded-full mr-2' />
            <select
              className='bg-white text-[#404040] text-sm focus:outline-none w-full p-2'
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option>Iran</option>
            </select>
          </div>

          {/* Expo Field */}
          <input
            type='text'
            value={"Expo 2050"}
            disabled
            className='w-1/2 bg-white rounded-xl shadow-xl p-[18px] text-[#AFAFAF] text-sm focus:outline-none'
          />
        </div>

        {/* Description */}
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className='p-5 w-[90%] rounded-xl shadow-xl'
          rows={3}
          placeholder='Description'
        ></textarea>

        <button
          className='text-[#00427A] bg-white rounded-full poppinsBold w-[60%] mt-4 p-2 shadow-xl'
          onClick={handleSubmit}
        >
          Save
        </button>
      </div>

      {/* Footer */}
      <div className='fixed bottom-10 right-1/2 translate-x-1/2 w-[80%]'>
        <div className='flex justify-between items-center'>
          <p className='text-white text-[14px] poppinsBold'>V1.2</p>
          <img src={userIcon} alt="User Icon" onClick={handleUserIconClick} />
        </div>
        <div className='text-center text-white mt-4' style={{ direction: "rtl" }}>
          <p>طراحی و توسعه توسط Artmodeco.com</p>
        </div>
      </div>


      {showLogin && (
        <LoginModal
          onClose={() => setShowLogin(false)}
          onLoginSuccess={() => {
            setShowLogin(false);
            navigate('/admin');
          }}
        />
      )}
    </div>
  );
};

export default Main;


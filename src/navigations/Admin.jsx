import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Toastify from 'toastify-js';
import "toastify-js/src/toastify.css";
import logo from "../assets/images/logo.svg";
import search from "../assets/images/search.svg";
import deleteIcon from "../assets/images/delete.svg";
import phoneIcon from "../assets/images/phone.svg";
import downloadIcon from "../assets/images/download.svg";
import homeIcon from "../assets/images/home.svg";
import axios from 'axios';
import * as XLSX from 'xlsx';

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

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigator = useNavigate();

  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('http://195.248.242.67:5000/api/users');
        setUsers(res.data);
        // showToast('Users loaded successfully', 'success');
      } catch (err) {
        showToast('Failed to fetch users', 'error');
        console.error('Fetch users error:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, []);

  // Handle delete user
  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://195.248.242.67:5000/api/users/${userId}`);
      setUsers(prev => prev.filter(user => user.id !== userId));
      showToast('User deleted successfully', 'success');
    } catch (err) {
      showToast('Failed to delete user', 'error');
      console.error('Delete user error:', err);
    }
  };

  // Filter users based on the search term
  const filteredUsers = users.filter(user =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.phone.includes(searchTerm) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Export users to Excel
  const exportToExcel = () => {
    try {
      if (filteredUsers.length === 0) {
        showToast('No data to export', 'warning');
        return;
      }
      
      const ws = XLSX.utils.json_to_sheet(filteredUsers);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Users');
      XLSX.writeFile(wb, 'users.xlsx');
      showToast('Excel file downloaded successfully', 'success');
    } catch (err) {
      showToast('Failed to export to Excel', 'error');
      console.error('Export error:', err);
    }
  };

  return (
    <div className='w-[90%] mx-auto poppins'>
      <div className='flex items-center justify-center'>
        <img src={logo} className='w-20 h-20' alt="Logo" />
      </div>

      <div className='flex items-center gap-2 bg-white rounded-xl p-3 shadow-xl'>
        <img src={search} className='' alt="Search" />
        <input
          type='text'
          placeholder='search'
          className='w-full focus:outline-none border-none'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* <div className='flex items-center justify-between mt-4'>
        <p className='text-white text-[14px]'>Filter By:</p>
        <select className='px-5 py-1 rounded-xl shadow-xl'>
          <option>Country</option>
        </select>
        <select className='px-5 py-1 rounded-xl shadow-xl'>
          <option>Job Position</option>
        </select>
      </div> */}

      {isLoading ? (
        <div className="text-center mt-10 text-white">Loading users...</div>
      ) : (
        <div className='mt-9 text-[#AFAFAF]'>
          {filteredUsers.length === 0 ? (
            <div className="text-center text-white">No users found</div>
          ) : (
            filteredUsers.map((user, index) => (
              <div key={index} className='bg-white rounded-lg p-3 mb-4'>
                <div className='flex items-center justify-between mb-2'>
                  <p className="peyda text-[14px]">{user.phone}</p>
                  <p className="peydaBold text-[20px]">{user.fullName}</p>
                </div>
                <p className="text-[14px] peyda text-right">
                  نماینده {user.role} - {user.country} - {user.expo}
                </p>
                <div className="flex items-center justify-start gap-2 mt-2">
                  <button onClick={() => handleDelete(user.id)}>
                    <img src={deleteIcon} className="w-6 h-6" alt="Delete" />
                  </button>
                  <a href={`tel:${user.phone}`}>
                    <button>
                      <img src={phoneIcon} className="w-6 h-6" alt="Call" />
                    </button>
                  </a>
                  <button><img src={downloadIcon} className="w-6 h-6" alt="Download" /></button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <div className="absolute right-1/2 translate-x-1/2 bottom-3 w-[80%] text-center">
        <div className="flex items-center justify-between">
          <img 
            onClick={() => navigator("/")} 
            src={homeIcon} 
            className='cursor-pointer' 
            alt="Home"
          />
          <div className="flex items-center gap-3">
            <button 
              onClick={exportToExcel} 
              className="bg-white rounded-full text-black text-[14px] px-4 py-1 poppinsBold"
              disabled={isLoading || filteredUsers.length === 0}
            >
              Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
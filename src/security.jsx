import React from 'react';
import { Navigate } from 'react-router-dom';

const Security = ({ children }) => {
  // Check for the bearer token in local storage
  const token = localStorage.getItem('accessToken');


  if (!token) {
    return <Navigate to="/auth/login" />;
  }

  // If the token exists, render the children
  return <>{children}</>;
};

export default Security;

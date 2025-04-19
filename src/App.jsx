import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Security from "./security"
import Main from "./navigations/Main";
import Login from './navigations/Login';
import Admin from './navigations/Admin';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Handle Auth routes separately */}
        <Route path="/auth/login" element={<Login />} />
        <Route path="/" element={<Main />} />
        
        {/* Main routes */}
        <Route
          path="/admin" 
          element={
            <Security>
              <Admin />
            </Security>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;

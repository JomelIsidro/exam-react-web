import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Home from './components/Home';
import { useSelector } from 'react-redux';

const App = () => {
  const token = useSelector((state) => state.auth.token);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={token ? <Navigate to="/home" /> : <Login />} />
        <Route path="/home" element={token ? <Home /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={token ? "/home" : "/login"} />} />
      </Routes>
    </Router>
  );
};

export default App;

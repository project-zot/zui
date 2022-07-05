import React, { useState, useEffect } from 'react'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ImageDetails from './components/ImageDetails.jsx'

import makeStyles from '@mui/styles/makeStyles';

import './App.css';

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthWrapper } from 'utilities/AuthWrapper.jsx';

const useStyles = makeStyles((theme) => ({

}));

function App() {
  const isUsername = () => {
    const localStorageUsername = localStorage.getItem('username');
    return localStorageUsername ? true : false;
  };
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [searchKeywords, setSearchKeywords] = useState(null);
  const [data, setData] = useState(null);
  const [isAuthEnabled, setIsAuthEnabled] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(isUsername())
  const classes = useStyles();



  return (
    <div className="App">
      <Router>
        <Routes>
          <Route element={<AuthWrapper  isAuthEnabled={isAuthEnabled} isLoggedIn={isLoggedIn} redirect="/login" />}>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage isLoggedIn={isLoggedIn} username={username} password={password} updateUsername={setUsername} updatePassword={setPassword} isAuthEnabled={isAuthEnabled} setIsAuthEnabled={setIsAuthEnabled} setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/home" element={<HomePage keywords={searchKeywords} updateKeywords={setSearchKeywords} data={data} updateData={setData} />} />
            <Route path="/image/:name" element={<ImageDetails username={username} password={password} />} />
          </Route>
          <Route element={<AuthWrapper isAuthEnabled={isAuthEnabled} isLoggedIn={!isLoggedIn} redirect="/"/>}>
            <Route path="*" element={<Navigate to="/login" />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;

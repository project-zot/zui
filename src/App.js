import React, { useState, useEffect } from 'react'
import HomePage from './pages/HomePage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import ImageDetails from './components/ImageDetails.jsx'

import makeStyles from '@mui/styles/makeStyles';

import './App.css';

import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";

const useStyles = makeStyles((theme) => ({

}));

function App() {
  const [username, setUsername] = useState(null);
  const [password, setPassword] = useState(null);
  const [hostFromStorage, setHostFromStorage] = useState(null);
  const [searchKeywords, setSearchKeywords] = useState(null);
  const [data, setData] = useState(null);
  const classes = useStyles();

  useEffect(() => {
    const localStorageHost = localStorage.getItem('host');
    const localStorageUsername = localStorage.getItem('username');
    const localStoragePassword = localStorage.getItem('password');

    if (localStorageHost) {
      setHostFromStorage(localStorageHost)
      setUsername(localStorageUsername);
      setPassword(localStoragePassword);
    } else {
      setHostFromStorage("")
    }
  }, [])

  return (
    <div className="App">
    <Router>
      { hostFromStorage !== null && (
          (hostFromStorage) ? (
              <Routes>
                <Route path="*" element={<Navigate to="/home"/>} />
                <Route path="/home" element={<HomePage keywords={searchKeywords} updateKeywords={setSearchKeywords} data={data} updateData={setData}/>} />
                <Route path="/image/:name*" element={<ImageDetails username={username} password={password}/>} />
              </Routes>
          ) : (
              <Routes>
                <Route path="*" element={<Navigate to="/login" />} />
                <Route path="/login" element={<LoginPage username={username} password={password} updateUsername={setUsername} updatePassword={setPassword}/>} />
              </Routes>
          )
      )}
    </Router>
    </div>
  );
}

export default App;

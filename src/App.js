import React, { useState } from 'react';
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';

import './App.css';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthWrapper } from 'utilities/AuthWrapper.jsx';
import RepoPage from 'pages/RepoPage.jsx';
import TagPage from 'pages/TagPage';
import ExplorePage from 'pages/ExplorePage.jsx';

function App() {
  const isToken = () => {
    const localStorageToken = localStorage.getItem('token');
    return localStorageToken ? true : false;
  };

  const [data, setData] = useState(null);
  const [isAuthEnabled, setIsAuthEnabled] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(isToken());

  return (
    <div className="App" data-testid="app-container">
      <Router>
        <Routes>
          <Route element={<AuthWrapper isLoggedIn={isLoggedIn} redirect="/login" />}>
            <Route path="/" element={<Navigate to="/home" />} />
            <Route path="/home" element={<HomePage data={data} updateData={setData} />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/image/:name" element={<RepoPage />} />
            <Route path="/image/:name/tag/:tag" element={<TagPage />} />
          </Route>
          <Route element={<AuthWrapper isLoggedIn={!isLoggedIn} redirect="/" />}>
            <Route
              path="/login"
              element={
                <LoginPage
                  isAuthEnabled={isAuthEnabled}
                  setIsAuthEnabled={setIsAuthEnabled}
                  isLoggedIn={isLoggedIn}
                  setIsLoggedIn={setIsLoggedIn}
                />
              }
            />
            <Route path="*" element={<Navigate to="/login" />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;

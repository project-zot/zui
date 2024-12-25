import React, { useState, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { isAuthenticated, isApiKeyEnabled } from 'utilities/authUtilities';
import { AuthWrapper } from 'utilities/AuthWrapper';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RepoPage from 'pages/RepoPage';
import TagPage from 'pages/TagPage';
import ExplorePage from 'pages/ExplorePage';
import UserManagementPage from 'pages/UserManagementPage';

import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());

  return (
    <div className="App" data-testid="app-container">
      <Suspense fallback="./../public/favicon.ico">
        <Router>
          <Routes>
            <Route element={<AuthWrapper isLoggedIn={isLoggedIn} hasHeader redirect="/login" />}>
              <Route path="/" element={<Navigate to="/home" />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/explore" element={<ExplorePage />} />
              <Route path="/image/:name" element={<RepoPage />} />
              <Route path="/image/:reponame/tag/:tag" element={<TagPage />} />
              {isApiKeyEnabled() && <Route path="/user/apikey" element={<UserManagementPage />} />}
              <Route path="*" element={<Navigate to="/home" />} />
            </Route>
            <Route element={<AuthWrapper isLoggedIn={!isLoggedIn} redirect="/" />}>
              <Route path="/login" element={<LoginPage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Route>
          </Routes>
        </Router>
      </Suspense>
    </div>
  );
}

export default App;

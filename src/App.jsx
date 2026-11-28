import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router';

import { isAuthenticated, isApiKeyEnabled, refreshAuthConfig } from 'utilities/authUtilities';
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
  // Bumped when the cached auth config turns out to be stale, to re-render
  // routes and header against the server's current auth settings.
  const [authConfigRevision, setAuthConfigRevision] = useState(0);

  useEffect(() => {
    refreshAuthConfig().then((changed) => {
      if (!changed) return;
      setIsLoggedIn(isAuthenticated());
      setAuthConfigRevision((revision) => revision + 1);
    });
  }, []);

  // Another tab may update the shared auth config (e.g. its own refresh or login
  // page) before this tab's refresh finishes, which would then report no change.
  // Storage events only fire for other tabs, so same-tab guest sessions are unaffected.
  useEffect(() => {
    const onStorage = (event) => {
      if (event.key !== 'authConfig' && event.key !== null) return;
      setIsLoggedIn(isAuthenticated());
      setAuthConfigRevision((revision) => revision + 1);
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  return (
    <div className="App" data-testid="app-container">
      <Router key={authConfigRevision}>
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
    </div>
  );
}

export default App;

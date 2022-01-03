import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import GithubCallbackPage from './pages/GithubCallbackPage';
import GithubVerifyPage from './pages/GithubVerifyPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/github/login" element={<GithubCallbackPage />} />
        <Route path="/github/verify" element={<GithubVerifyPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;

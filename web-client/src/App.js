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
import WritePostPage from './pages/WritePostPage';
import PostPage from './pages/PostPage';
import BoardPage from './pages/BoardPage';
import EditPostPage from './pages/EditPostPage';
import MyPage from './pages/MyPage';

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/github/login" element={<GithubCallbackPage />} />
        <Route path="/github/verify" element={<GithubVerifyPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/board/:boardType" element={<BoardPage />} />
        <Route
          path="/board/:boardType/post/write"
          element={<WritePostPage />}
        />
        <Route path="/board/:boardType/post/:postId" element={<PostPage />} />
        <Route
          path="/board/:boardType/post/:postId/edit"
          element={<EditPostPage />}
        />
        <Route path="/user/:nickname/profile" element={<MyPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;

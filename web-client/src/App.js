import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import SignupPage from './pages/auth/SignupPage';
import LoginPage from './pages/auth/LoginPage';
import GithubCallbackPage from './pages/auth/GithubCallbackPage';
import GithubVerifyPage from './pages/auth/GithubVerifyPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import WritePostPage from './pages/post/WritePostPage';
import PostPage from './pages/post/PostPage';
import BoardPage from './pages/board/BoardPage';
import EditPostPage from './pages/post/EditPostPage';
import ProfilePage from './pages/profile/ProfilePage';
import FollowListPage from './pages/profile/FollowListPage';
import EditProfilePage from './pages/profile/EditProfilePage';
import NotificationPage from './pages/profile/NotificationPage';

function App() {
  return (
    <>
      <Header />
      <div style={{ minHeight: '70%' }}>
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
          <Route path="/user/:nickname/profile" element={<ProfilePage />} />
          <Route
            path="/user/:nickname/profile/:type"
            element={<FollowListPage />}
          />
          <Route
            path="/user/:nickname/profile/edit"
            element={<EditProfilePage />}
          />
          <Route
            path="/user/:nickname/notification"
            element={<NotificationPage />}
          />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;

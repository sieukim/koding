import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import EmailSignupPage from './pages/auth/EmailSignupPage';
import EmailLoginPage from './pages/auth/EmailLoginPage';
import GithubLoginPage from './pages/auth/GithubLoginPage';
import GithubSignupPage from './pages/auth/GithubSignupPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import WritePostPage from './pages/post/WritePostPage';
import PostPage from './pages/post/PostPage';
import BoardPage from './pages/board/BoardPage';
import EditPostPage from './pages/post/EditPostPage';
import ProfilePage from './pages/profile/ProfilePage';
import FollowListPage from './pages/profile/FollowListPage';
import EditProfilePage from './pages/profile/EditProfilePage';
import NotificationPage from './pages/profile/NotificationPage';
import IntegratedSearchPage from './pages/search/IntegratedSearchPage';
import SearchPage from './pages/search/SearchPage';

function App() {
  return (
    <>
      <Header />
      <div style={{ minHeight: '70%' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<EmailLoginPage />} />
          <Route path="/signup" element={<EmailSignupPage />} />
          <Route path="/github/login" element={<GithubLoginPage />} />
          <Route path="/github/signup" element={<GithubSignupPage />} />
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
            path="/user/:nickname/profile/:tab"
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
          <Route path="/search" element={<IntegratedSearchPage />} />
          <Route path="/search/:boardType" element={<SearchPage />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
}

export default App;

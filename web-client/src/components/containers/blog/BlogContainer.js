import BlogPresenter from '../../presenters/blog/BlogPresenter';
import { useCallback, useEffect, useState } from 'react';
import * as api from '../../../modules/api';
import { useNavigate } from 'react-router-dom';

const BlogContainer = ({ profileUser, loginUser }) => {
  // navigate
  const navigate = useNavigate();

  // 로딩 상태
  const [loading, setLoading] = useState(false);
  // 게시글
  const [posts, setPosts] = useState([]);
  // 페이지 커서
  const [nextPageCursor, setNextPageCursor] = useState(null);

  // 블로그 게시글 가져오는 함수
  const getBlogPost = useCallback(async () => {
    if (!nextPageCursor) setLoading(true);

    const response = await api.getUserPosts(
      profileUser,
      'column',
      nextPageCursor,
    );

    setPosts((posts) => [...posts, ...response.data.posts]);
    setNextPageCursor(response.data.nextPageCursor);
    setLoading(false);
  }, [profileUser, nextPageCursor]);

  useEffect(() => {
    if (nextPageCursor === null) getBlogPost();
    // eslint-disable-next-line
  }, [nextPageCursor]);

  useEffect(() => {
    return () => {
      setLoading(false);
      setPosts([]);
      setNextPageCursor(null);
    };
  }, [profileUser]);

  // 게시글 작성 버튼 onClick 핸들러
  const onClickWrite = useCallback(() => {
    if (loginUser && loginUser.nickname === profileUser) {
      navigate(`/board/column/write`);
    }
  }, [loginUser, profileUser, navigate]);

  return (
    <BlogPresenter
      profileUser={profileUser}
      loginUser={loginUser}
      loading={loading}
      posts={posts}
      nextPageCursor={nextPageCursor}
      getBlogPost={getBlogPost}
      onClickWrite={onClickWrite}
    />
  );
};

export default BlogContainer;

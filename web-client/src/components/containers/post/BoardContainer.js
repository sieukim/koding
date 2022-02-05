import BoardPresenter from '../../presenters/post/BoardPresenter';
import * as api from '../../../modules/api';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const BoardContainer = ({ boardType, tags }) => {
  // 로그인 유저 정보
  const user = useSelector((state) => state.auth.user);

  const [loading, setLoading] = useState(false);

  // 게시글 목록
  const [posts, setPosts] = useState([]);

  const [nextPageCursor, setNextPageCursor] = useState(null);

  const getPosts = useCallback(async () => {
    if (!nextPageCursor) setLoading(true);
    const response = await api.readBoard(boardType, tags, nextPageCursor);
    setPosts((posts) => [...posts, ...response.data.posts]);
    setNextPageCursor(response.data.nextPageCursor);
    setLoading(false);
  }, [boardType, tags, nextPageCursor]);

  useEffect(() => {
    getPosts();

    return () => {
      setPosts([]);
      setNextPageCursor(null);
    };
  }, [boardType, tags]);

  const navigate = useNavigate();

  // 게시글 작성 버튼 onClick 핸들러
  const onClickWrite = useCallback(() => {
    if (user) {
      navigate(`/board/${boardType}/post/write`);
    } else {
      navigate(`/login`);
    }
  }, [navigate, boardType]);

  return (
    <BoardPresenter
      loading={loading}
      boardType={boardType}
      posts={posts}
      getPosts={getPosts}
      nextPageCursor={nextPageCursor}
      onClickWrite={onClickWrite}
    />
  );
};

export default BoardContainer;

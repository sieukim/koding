import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavPresenter from '../../presenters/post/NavPresenter';

const NavContainer = ({ getPostState, post }) => {
  // navigate
  const navigate = useNavigate();

  // 게시글 상태
  const [prev, setPrev] = useState({});
  const [next, setNext] = useState({});

  useEffect(() => {
    if (getPostState.success) {
      setPrev(getPostState.success.data.prevPostInfo);
      setNext(getPostState.success.data.nextPostInfo);
    }
    // eslint-disable-next-line
  }, [getPostState]);

  // 이전 글 이동
  const onClickPrev = useCallback(() => {
    navigate(`/board/${prev.boardType}/${prev.postId}`);
    // eslint-disable-next-line
  }, [post, navigate, prev]);

  // 다음 글 이동
  const onClickNext = useCallback(() => {
    navigate(`/board/${next.boardType}/${next.postId}`);
    // eslint-disable-next-line
  }, [post, navigate, next]);

  // 게시판 이동
  const onClickBoard = useCallback(() => {
    navigate(`/board/${post.boardType}`);
  }, [navigate, post.boardType]);

  return (
    <NavPresenter
      prev={prev}
      next={next}
      onClickPrev={onClickPrev}
      onClickBoard={onClickBoard}
      onClickNext={onClickNext}
    />
  );
};

export default NavContainer;

import PostPresenter from '../../presenters/post/PostPresenter';
import useAsync from '../../../hooks/useAsync';
import * as api from '../../../modules/api';
import { useNavigate } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useMessage } from '../../../hooks/useMessage';

const PostContainer = ({ boardType, postId, post, setPost }) => {
  // 로그인 유저
  const user = useSelector((state) => state.auth.user);

  const navigate = useNavigate();

  // 게시글 상태
  const [prev, setPrev] = useState({});
  const [next, setNext] = useState({});

  // 게시글 가져오기
  const [getPostState] = useAsync(
    () => api.readPost(boardType, postId),
    [boardType, postId],
    false,
  );

  useEffect(() => {
    if (getPostState.success) {
      setPost(getPostState.success.data.post);
      setPrev(getPostState.success.data.prevPostInfo);
      setNext(getPostState.success.data.nextPostInfo);
    }
  }, [getPostState]);

  // 게시글 좋아요
  const [likePostState, likePostFetch] = useAsync(
    () => api.likePost(boardType, postId, user.nickname),
    [boardType, postId, user],
    true,
  );

  const onClickLike = useCallback(async () => {
    await likePostFetch();
    setPost((post) => ({
      ...post,
      likeCount: post.likeCount + 1,
      liked: true,
    }));
  }, [likePostFetch]);

  useMessage(
    likePostState,
    '좋아요를 누른 게시글은 내 프로필에서 확인 가능합니다 📚',
  );

  // 게시글 좋아요 취소
  const [unlikePostState, unlikePostFetch] = useAsync(
    () => api.unlikePost(boardType, postId, user.nickname),
    [boardType, postId, user],
    true,
  );

  const onClickUnlike = useCallback(async () => {
    await unlikePostFetch();
    setPost((post) => ({
      ...post,
      likeCount: post.likeCount - 1,
      liked: false,
    }));
  }, [unlikePostFetch]);

  useMessage(unlikePostState, '🪄 좋아요를 취소했습니다.');

  // 게시글 스크랩
  const [scrapPostState, scrapPostFetch] = useAsync(
    () => api.scrapPost(boardType, postId, user.nickname),
    [boardType, postId, user],
    true,
  );

  const onClickScrap = useCallback(async () => {
    await scrapPostFetch();
    setPost((post) => ({
      ...post,
      scrapCount: post.scrapCount + 1,
      scrapped: true,
    }));
  }, [scrapPostFetch]);

  useMessage(
    scrapPostState,
    '스크랩된 게시글은 내 프로필에서 확인 가능합니다 📚',
  );

  // 게시글 스크랩 취소
  const [unscrapPostState, unscrapPostFetch] = useAsync(
    () => api.unscrapPost(boardType, postId, user.nickname),
    [boardType, postId, user],
    true,
  );

  const onClickUnscrap = useCallback(async () => {
    await unscrapPostFetch();
    setPost((post) => ({
      ...post,
      scrapCount: post.scrapCount - 1,
      scrapped: false,
    }));
  }, [unscrapPostFetch]);

  useMessage(unscrapPostState, '🪄 스크랩을 취소했습니다.');

  // 게시글 수정
  const onClickEdit = useCallback(() => {
    navigate(`/board/${boardType}/${postId}/edit`);
  }, [navigate, boardType, postId]);

  // 게시글 삭제
  const [removePostState, removePostFetch] = useAsync(
    () => api.removePost(boardType, postId),
    [boardType, postId],
    true,
  );

  const onClickRemove = useCallback(async () => {
    await removePostFetch();
    navigate(`/board/${boardType}`);
  }, [removePostFetch, navigate]);

  useMessage(removePostState, 'Good Bye ~ 🥺');

  // 이전 글 이동
  const onClickPrev = useCallback(() => {
    navigate(`/board/${prev.boardType}/${prev.postId}`);
  }, [post, navigate]);

  // 다음 글 이동
  const onClickNext = useCallback(() => {
    navigate(`/board/${next.boardType}/${next.postId}`);
  }, [post, navigate]);

  // 게시판 이동
  const onClickBoard = useCallback(() => {
    navigate(`/board/${boardType}`);
  }, [navigate, boardType]);

  return (
    <PostPresenter
      user={user}
      loading={getPostState.loading}
      post={post}
      prev={prev}
      next={next}
      onClickLike={onClickLike}
      onClickUnlike={onClickUnlike}
      onClickScrap={onClickScrap}
      onClickUnscrap={onClickUnscrap}
      onClickEdit={onClickEdit}
      onClickRemove={onClickRemove}
      onClickPrev={onClickPrev}
      onClickNext={onClickNext}
      onClickBoard={onClickBoard}
    />
  );
};

export default PostContainer;

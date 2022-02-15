import PostViewerPresenter from '../../presenters/post/PostViewerPresenter';
import useAsync from '../../../hooks/useAsync';
import * as api from '../../../modules/api';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useMessage } from '../../../hooks/useMessage';
import { message } from 'antd';

const PostViewerContainer = ({ loading, boardType, postId, post, setPost }) => {
  // 로그인 유저
  const user = useSelector((state) => state.auth.user) ?? {};
  // navigate
  const navigate = useNavigate();

  // 게시글 좋아요
  const [likePostState, likePostFetch] = useAsync(
    () => api.likePost(boardType, postId, user.nickname),
    [boardType, postId, user],
    true,
  );

  const onClickLike = useCallback(async () => {
    if (post.writerNickname === user.nickname) {
      message.error('본인 게시글은 좋아할 수 없습니다.');
      return;
    }
    await likePostFetch();
    setPost((post) => ({
      ...post,
      likeCount: post.likeCount + 1,
      liked: true,
    }));
    // eslint-disable-next-line
  }, [post.writerNickname, user.nickname, likePostFetch]);

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
    // eslint-disable-next-line
  }, [unlikePostFetch]);

  // message
  useMessage(unlikePostState, '🪄 좋아요를 취소했습니다.');

  // 게시글 스크랩
  const [scrapPostState, scrapPostFetch] = useAsync(
    () => api.scrapPost(boardType, postId, user.nickname),
    [boardType, postId, user],
    true,
  );

  const onClickScrap = useCallback(async () => {
    if (post.writerNickname === user.nickname) {
      message.error('본인 게시글은 스크랩할 수 없습니다.');
      return;
    }
    await scrapPostFetch();
    setPost((post) => ({
      ...post,
      scrapCount: post.scrapCount + 1,
      scrapped: true,
    }));
    // eslint-disable-next-line
  }, [post.writerNickname, user.writerNickname, scrapPostFetch]);

  // message
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
    // eslint-disable-next-line
  }, [unscrapPostFetch]);

  // message
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
  }, [removePostFetch, navigate, boardType]);

  // mgessage
  useMessage(removePostState, 'Good Bye ~ 🥺');

  return (
    <PostViewerPresenter
      user={user}
      loading={loading}
      post={post}
      onClickLike={onClickLike}
      onClickUnlike={onClickUnlike}
      onClickScrap={onClickScrap}
      onClickUnscrap={onClickUnscrap}
      onClickEdit={onClickEdit}
      onClickRemove={onClickRemove}
    />
  );
};

export default PostViewerContainer;

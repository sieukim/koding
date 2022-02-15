import * as api from '../../../modules/api';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CommentPresenter from '../../presenters/post/CommentPresenter';
import useAsync from '../../../hooks/useAsync';
import { useMessage } from '../../../hooks/useMessage';
import { message } from 'antd';

const CommentContainer = ({ boardType, postId, post, setPost }) => {
  // 로그인 유저
  const user = useSelector((state) => state.auth.user);

  const [loading, setLoading] = useState(false);

  // 댓글 상태
  const [comments, setComments] = useState([]);

  const [nextPageCursor, setNextPageCursor] = useState(null);
  // 댓글 내 작성자 배열
  const [writers, setWriters] = useState([]);

  useEffect(() => {
    if (post) {
      setWriters((writers) =>
        [...writers, post.writerNickname].filter(
          (nickname, index, writers) =>
            nickname && writers.indexOf(nickname) === index,
        ),
      );
    }
  }, [post]);

  // 댓글 가져오기
  const getComments = useCallback(async () => {
    if (!nextPageCursor) setLoading(true);
    const response = await api.readComment(boardType, postId, nextPageCursor);
    setComments((comments) => [...comments, ...response.data.comments]);
    setNextPageCursor(response.data.nextPageCursor);

    setWriters((writers) =>
      [
        ...writers,
        ...response.data.comments.map((comment) => comment.writerNickname),
      ].filter(
        (nickname, index, writers) =>
          nickname && writers.indexOf(nickname) === index,
      ),
    );

    setLoading(false);
    // eslint-disable-next-line
  }, [boardType, postId, nextPageCursor, post]);

  useEffect(() => {
    getComments();

    return () => {
      setLoading(false);
      setComments([]);
      setNextPageCursor(null);
      setWriters([]);
    };
    // eslint-disable-next-line
  }, [boardType, postId]);

  // 댓글 작성
  const [writeCommentState, writeCommentFetch] = useAsync(
    (comment) => api.writeComment(boardType, postId, comment),
    [boardType, postId],
    true,
  );

  const onClickWrite = useCallback(
    async (comment) => {
      const response = await writeCommentFetch(comment);
      setComments((comments) => [
        ...comments,
        { ...response.data, writer: user },
      ]);
      setPost((post) => ({ ...post, commentCount: post.commentCount + 1 }));
    },
    // eslint-disable-next-line
    [writeCommentFetch, user],
  );

  // message
  useMessage(writeCommentState, '댓글을 작성했습니다! 📝');

  // 댓글 삭제
  const [removeCommentState, removeCommentFetch] = useAsync(
    (commentId) => api.removeComment(boardType, postId, commentId),
    [boardType, postId],
    true,
  );

  const onClickRemove = useCallback(
    async (commentId) => {
      await removeCommentFetch(commentId);
      setComments((comments) =>
        comments.filter((comment) => comment.commentId !== commentId),
      );
      setPost((post) => ({ ...post, commentCount: post.commentCount - 1 }));
    },
    // eslint-disable-next-line
    [removeCommentFetch],
  );

  // message
  useMessage(removeCommentState, '댓글을 삭제했습니다! 🤧');

  // 댓글 좋아요
  const [likeCommentState, likeCommentFetch] = useAsync(
    (commentId) => api.likeComment(boardType, postId, commentId, user.nickname),
    [boardType, postId, user],
    true,
  );

  const onClickLike = useCallback(
    async (comment, commentId) => {
      if (comment.writer.nickname === user.nickname) {
        message.error('본인 댓글은 추천할 수 없습니다.');
        return;
      }
      await likeCommentFetch(commentId);
      setComments((comments) =>
        comments.map((comment) => {
          if (comment.commentId === commentId) {
            return {
              ...comment,
              likeCount: comment.likeCount + 1,
              liked: true,
            };
          } else {
            return { ...comment };
          }
        }),
      );
    },
    [user, likeCommentFetch],
  );

  // message
  useMessage(likeCommentState, '🪄 댓글을 추천했습니다.');

  // 댓글 좋아요 취소
  const [unlikeCommentState, unlikeCommentFetch] = useAsync(
    (commentId) =>
      api.unlikeComment(boardType, postId, commentId, user.nickname),
    [boardType, postId, user],
    true,
  );

  const onClickUnlike = useCallback(
    async (commentId) => {
      await unlikeCommentFetch(commentId);
      setComments((comments) =>
        comments.map((comment) => {
          if (comment.commentId === commentId) {
            return {
              ...comment,
              likeCount: comment.likeCount - 1,
              liked: false,
            };
          } else {
            return { ...comment };
          }
        }),
      );
    },
    [unlikeCommentFetch],
  );

  // message
  useMessage(unlikeCommentState, '🪄 댓글 추천을 취소했습니다.');

  return (
    <CommentPresenter
      user={user}
      loading={loading}
      writeLoading={writeCommentState.loading}
      post={post}
      comments={comments}
      getComments={getComments}
      writers={writers}
      nextPageCursor={nextPageCursor}
      onClickWrite={onClickWrite}
      onClickRemove={onClickRemove}
      onClickLike={onClickLike}
      onClickUnlike={onClickUnlike}
    />
  );
};
export default CommentContainer;

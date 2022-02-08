import * as api from '../../../modules/api';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CommentPresenter from '../../presenters/post/CommentPresenter';
import useAsync from '../../../hooks/useAsync';
import { useMessage } from '../../../hooks/useMessage';

const CommentContainer = ({ boardType, postId, setPost }) => {
  // 로그인 유저
  const user = useSelector((state) => state.auth.user);

  const [loading, setLoading] = useState(false);

  // 댓글 상태
  const [comments, setComments] = useState([]);
  const [nextPageCursor, setNextPageCursor] = useState(null);
  // 댓글 내 작성자 배열
  const [writers, setWriters] = useState([]);

  // 댓글 가져오기
  const getComments = useCallback(async () => {
    if (!nextPageCursor) setLoading(true);
    const response = await api.readComment(boardType, postId, nextPageCursor);
    setComments((comments) => [...comments, ...response.data.comments]);
    setNextPageCursor(response.data.nextPageCursor);

    // 중복 제거 전 닉네임 배열
    const writerNicknames = [
      ...response.data.comments.map((comment) => comment.writerNickname),
    ];

    setWriters((writers) => [
      ...writers,
      // 중복 제거 후 설정
      ...writerNicknames.filter(
        (writerNickname, index) =>
          writerNicknames.indexOf(writerNickname) === index,
      ),
    ]);

    setLoading(false);
  }, [boardType, postId, nextPageCursor]);

  useEffect(() => {
    getComments();

    return () => {
      setLoading(false);
      setComments([]);
      setNextPageCursor(null);
      setWriters([]);
    };
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
      setComments((comments) => [...comments, response.data]);
      setPost((post) => ({ ...post, commentCount: post.commentCount + 1 }));
    },
    [writeCommentFetch],
  );

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
    [removeCommentFetch],
  );

  useMessage(removeCommentState, '댓글을 삭제했습니다! 🤧');

  // 댓글 좋아요
  const [likeCommentState, likeCommentFetch] = useAsync(
    (commentId) => api.likeComment(boardType, postId, commentId, user.nickname),
    [boardType, postId, user],
    true,
  );

  const onClickLike = useCallback(
    async (commentId) => {
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
    [likeCommentFetch],
  );

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

  useMessage(unlikeCommentState, '🪄 댓글 추천을 취소했습니다.');

  return (
    <CommentPresenter
      user={user}
      loading={loading}
      writeLoading={writeCommentState.loading}
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

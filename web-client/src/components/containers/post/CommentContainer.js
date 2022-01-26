import CommentPresenter from '../../presenters/post/CommentPresenter';
import * as api from '../../../modules/api';
import useAsync from '../../../hooks/useAsync';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CommentContainer = ({
  boardType,
  postId,
  setCommentSuccess,
  success,
  cursor,
}) => {
  /* 게시글 댓글 가져오기 */

  const [comments, setComments] = useState([]);

  const [readCommentState, readCommentFetch] = useAsync(
    () => {
      setCommentSuccess(false);
      return api.readComment(boardType, postId, cursor);
    },
    [boardType, postId, cursor],
    false,
  );

  const navigate = useNavigate();

  // 이전 댓글 목록
  const prevPageCursor = readCommentState.success?.data?.prevPageCursor;

  // 이전 댓글 목록으로 이동 이벤트 리스너
  const onClickPrevCursor = useCallback(() => {
    const query = new URLSearchParams();
    if (prevPageCursor) query.set('cursor', prevPageCursor);
    navigate(`/board/${boardType}/post/${postId}?${query}`);
  }, [navigate, boardType, postId, prevPageCursor]);

  // 다음 댓글 목록
  const nextPageCursor = readCommentState.success?.data?.nextPageCursor;

  // 다음 댓글 목록으로 이동 이벤트 리스너
  const onClickNextCursor = useCallback(() => {
    const query = new URLSearchParams();
    if (nextPageCursor) query.set('cursor', nextPageCursor);
    navigate(`/board/${boardType}/post/${postId}?${query}`);
  }, [navigate, boardType, postId, nextPageCursor]);

  useEffect(() => {
    if (readCommentState.success) {
      setComments(readCommentState.success.data.comments);
      setCommentSuccess(true);
    }
  }, [readCommentState.success]);

  /* 댓글 작성 api */

  const [writeCommentState, writeCommentFetch] = useAsync(
    (comment) => api.writeComment(boardType, postId, comment),
    [boardType, postId],
    true,
  );

  useEffect(() => {
    if (writeCommentState.success) {
      setComments((comments) => {
        if (comments.length < 10) {
          const newComments = [...comments];
          newComments.push(writeCommentState.success.data);
          return newComments;
        } else {
          return comments;
        }
      });
    }
  }, [writeCommentState.success]);

  const writeComment = useCallback(
    async (comment) => {
      const response = await writeCommentFetch(comment);
      await readCommentFetch();

      return response;
    },
    [writeCommentFetch, readCommentFetch],
  );

  /* 댓글 수정 api */

  const [editCommentState, editCommentFetch] = useAsync(
    (commentId, comment) =>
      api.editComment(boardType, postId, commentId, comment),
    [boardType, postId],
    true,
  );

  const editComment = useCallback(
    async (commentId, comment) => await editCommentFetch(commentId, comment),
    [editCommentFetch],
  );

  /* 댓글 삭제 api */

  const [removeCommentState, removeCommentFetch] = useAsync(
    (commentId) => api.removeComment(boardType, postId, commentId),
    [boardType, postId],
    true,
  );

  const removeComment = useCallback(
    async (commentId) => {
      const response = await removeCommentFetch(commentId);
      await readCommentFetch();

      setComments((comments) => {
        return comments.filter((comment) => comment.commentId !== commentId);
      });

      return response;
    },
    [removeCommentFetch, removeCommentFetch],
  );

  useEffect(() => {
    if (comments.length === 0 && prevPageCursor) {
      const query = new URLSearchParams();
      query.set('cursor', prevPageCursor);
      navigate(`/board/${boardType}/post/${postId}?${query}`);
    }
  }, [comments, prevPageCursor, navigate, boardType, postId]);

  return (
    <>
      {success && (
        <CommentPresenter
          comments={comments}
          writeCommentState={writeCommentState}
          writeComment={writeComment}
          editCommentState={editCommentState}
          editComment={editComment}
          removeCommentState={removeCommentState}
          removeComment={removeComment}
          hasPrevPage={prevPageCursor}
          hasNextPage={nextPageCursor}
          onClickPrevCursor={onClickPrevCursor}
          onClickNextCursor={onClickNextCursor}
        />
      )}
    </>
  );
};

export default CommentContainer;

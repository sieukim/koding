import styled from 'styled-components';
import { useCallback, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getDate } from '../../utils/getDate';
import { getMentionedList } from '../../utils/getMentionedList';

const StyledComment = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 10px;

  p {
    font-weight: bold;
    padding: 5px 0;
    margin: 5px 0;
  }

  form {
    display: flex;
    justify-content: space-between;
    width: 100%;

    input {
      width: 85%;
    }

    button {
      width: 10%;
    }
  }

  .comment {
    display: flex;
    flex-direction: column;
    margin: 10px 0;
    padding: 10px;
    background: wheat;
  }

  .comment-header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin: auto 0;
  }

  .comment-info {
    display: flex;
    flex-direction: row;
  }

  .comment-createdAt {
    margin-left: 5px;
    color: gray;
  }

  button {
    margin: 0 5px;
  }
`;

const CommentPresenter = ({
  comments,
  writeCommentState,
  writeComment,
  editCommentState,
  editComment,
  removeCommentState,
  removeComment,
}) => {
  const user = useSelector((state) => state.auth.user);

  /* 댓글 */

  // 댓글 내용
  const [comment, setComment] = useState('');

  const onChangeInput = useCallback(
    (e) => {
      setComment(e.target.value);
    },
    [setComment],
  );

  // 댓글 등록
  const onSubmitButton = useCallback(
    (e) => {
      e.preventDefault();

      const mentionedNicknames = getMentionedList(comment);

      // api 호출
      writeComment({
        content: comment,
        mentionedNicknames: mentionedNicknames,
      });

      setComment('');
    },
    [writeComment, comment],
  );

  // 댓글 수정
  const [editCommentId, setEditCommentId] = useState('');

  // 수정 버튼 & 등록 버튼 토글
  const onClickEdit = useCallback(
    (e) => {
      const commentId = e.target.dataset.commentid;
      setEditCommentId(commentId);
    },
    [setEditCommentId],
  );

  const innerRef = useRef();

  const onEditComment = useCallback(
    (e) => {
      e.preventDefault();

      const commentId = e.target.dataset.commentid;
      const comment = innerRef.current.innerText;
      const mentionedNicknames = getMentionedList(comment);

      editComment(commentId, {
        content: comment,
        mentionedNicknames: mentionedNicknames,
      });

      setEditCommentId('');
    },
    [editComment, innerRef],
  );

  // 댓글 삭제
  const onRemoveComment = useCallback(
    (e) => {
      e.preventDefault();
      const commentId = e.target.dataset.commentid;
      removeComment(commentId);
    },
    [removeComment],
  );

  return (
    <StyledComment>
      <p>댓글</p>
      <form onSubmit={onSubmitButton}>
        <input
          name="comment"
          placeholder="댓글을 입력하세요."
          onChange={onChangeInput}
          value={comment}
        />
        <button>등록</button>
      </form>
      {writeCommentState.error && (
        <div>오류가 발생했습니다. 잠시 후 다시 시도해주세요.</div>
      )}
      {comments.map((comment) => (
        <div key={comment.commentId} className="comment">
          <div className="comment-header">
            <div className="comment-info">
              <NavLink to={`/user/${comment.writerNickname}`}>
                {comment.writerNickname}
              </NavLink>
              <div className="comment-createdAt">
                {getDate(comment.createdAt)}
              </div>
            </div>
            {user && user.nickname === comment.writerNickname && (
              <div className="comment-button">
                {comment.commentId !== editCommentId && (
                  <button
                    data-commentid={comment.commentId}
                    onClick={onClickEdit}
                  >
                    수정
                  </button>
                )}
                {comment.commentId === editCommentId && (
                  <button
                    data-commentid={comment.commentId}
                    onClick={onEditComment}
                  >
                    등록
                  </button>
                )}
                <button
                  data-commentid={comment.commentId}
                  onClick={onRemoveComment}
                >
                  삭제
                </button>
              </div>
            )}
            {(editCommentState.error || removeCommentState.error) && (
              <div>오류가 발생했습니다. 잠시 후 다시 시도해주세요.</div>
            )}
          </div>
          <div
            ref={comment.commentId === editCommentId ? innerRef : undefined}
            className="comment-content"
            contentEditable={
              comment.commentId === editCommentId &&
              user &&
              user.nickname === comment.writerNickname
            }
            suppressContentEditableWarning
          >
            {comment.content}
          </div>
        </div>
      ))}
    </StyledComment>
  );
};

export default CommentPresenter;

import ReadPostPresenter from '../../presenters/post/ReadPostPresenter';
import useAsync from '../../../hooks/useAsync';
import * as api from '../../../modules/api';
import { useCallback } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const ReadPostContainer = ({ boardType, postId }) => {
  /* 읽을 게시글 가져오기 */

  // read post state
  const [readPostState] = useAsync(
    () => api.readPost(boardType, postId),
    [boardType, postId],
    false,
  );

  /* 게시글 삭제 */

  // remove post state
  const [removePostState, removePostFetch] = useAsync(
    () => api.removePost(boardType, postId),
    [boardType, postId],
    true,
  );

  // remove post api 호출
  const removePost = useCallback(
    async () => await removePostFetch(),
    [removePostFetch],
  );

  /* button event listener */

  const navigate = useNavigate();

  // 게시글 삭제
  const onClickRemove = useCallback(() => {
    removePost(boardType, postId);
  }, [removePost, boardType, postId]);

  // 게시글 수정
  const onClickEdit = useCallback(() => {
    navigate(`/board/${boardType}/post/${postId}/edit`);
  }, [boardType, postId, navigate]);

  // 목록으로 이동
  const onClickList = useCallback(() => {
    navigate(`/board/${boardType}`);
  }, [boardType, navigate]);

  // 태그 검색
  const onClickTag = useCallback(
    (e) => {
      const tag = e.target.innerHTML;
      navigate(`/board/${boardType}?tags=${tag}`);
    },
    [boardType, navigate],
  );

  return (
    <>
      {removePostState.success && <Navigate to={`/board/${boardType}`} />}
      <ReadPostPresenter
        boardType={boardType}
        readPostState={readPostState}
        removePost={removePost}
        removePostState={removePostState}
        onClickRemove={onClickRemove}
        onClickEdit={onClickEdit}
        onClickList={onClickList}
        onClickTag={onClickTag}
      />
    </>
  );
};

export default ReadPostContainer;

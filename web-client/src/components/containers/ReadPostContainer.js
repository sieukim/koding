import ReadPostPresenter from '../presenters/ReadPostPresenter';
import useAsync from '../../hooks/useAsync';
import * as api from '../../modules/api';
import { useCallback } from 'react';
import { Navigate } from 'react-router-dom';

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

  return (
    <>
      {removePostState.success && <Navigate to={`/board/${boardType}`} />}
      <ReadPostPresenter
        boardType={boardType}
        readPostState={readPostState}
        removePost={removePost}
        removePostState={removePostState}
      />
    </>
  );
};

export default ReadPostContainer;

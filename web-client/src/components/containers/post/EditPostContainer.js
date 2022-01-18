import EditPostPresenter from '../../presenters/post/EditPostPresenter';
import useAsync from '../../../hooks/useAsync';
import * as api from '../../../modules/api';
import { useCallback } from 'react';
import { Navigate } from 'react-router-dom';

const EditPostContainer = ({ boardType, postId }) => {
  /* 수정할 게시글 가져오기 */

  // read post state
  const [readPostState] = useAsync(
    () => api.readPost(boardType, postId),
    [boardType, postId],
    false,
  );

  /* 게시글 수정 */

  // edit post state
  const [editPostState, editPostFetch] = useAsync(
    (post) => api.editPost(boardType, postId, post),
    [boardType, postId],
    true,
  );

  const editPost = useCallback(
    async (post) => {
      await editPostFetch(post);
    },
    [editPostFetch],
  );

  /* 태그 목록 조회 */
  const [getTagListState] = useAsync(
    () => api.getTagList(boardType),
    [boardType],
    false,
  );

  return (
    <>
      {editPostState.success && (
        <Navigate to={`/board/${boardType}/post/${postId}`} />
      )}
      <EditPostPresenter
        readPostState={readPostState}
        post={readPostState.success?.data?.post}
        editPost={editPost}
        editPostState={editPostState}
        tagList={getTagListState.success?.data}
      />
    </>
  );
};

export default EditPostContainer;

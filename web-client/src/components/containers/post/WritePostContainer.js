import { useCallback } from 'react';
import * as api from '../../../modules/api';
import useAsync from '../../../hooks/useAsync';
import WritePostPresenter from '../../presenters/post/WritePostPresenter';
import { Navigate } from 'react-router-dom';

const WritePostContainer = ({ boardType }) => {
  /* 게시글 등록 */

  // write post state
  const [writePostState, writePostFetch] = useAsync(
    (post) => api.writePost(boardType, post),
    [],
    true,
  );

  // write post api 호출
  const writePost = useCallback(
    async (post) => {
      await writePostFetch(post);
    },
    [writePostFetch],
  );

  /* 태그 목록 조회 */
  const [getTagListState] = useAsync(
    () => api.getTagList(boardType),
    [boardType],
    false,
  );

  return (
    <>
      {writePostState.success && (
        <Navigate
          to={`/board/${boardType}/post/${writePostState.success.data.postId}`}
        />
      )}
      <WritePostPresenter
        writePost={writePost}
        writePostState={writePostState}
        tagList={getTagListState.success?.data}
      />
    </>
  );
};

export default WritePostContainer;

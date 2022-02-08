import EditPostPresenter from '../../presenters/post/EditPostPresenter';
import useAsync from '../../../hooks/useAsync';
import * as api from '../../../modules/api';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMessage } from '../../../hooks/useMessage';

const EditPostContainer = ({ boardType, postId }) => {
  const navigate = useNavigate();

  // 게시글 읽어오기
  const [readPostState] = useAsync(
    () => api.readPost(boardType, postId),
    [boardType, postId],
    false,
  );

  // 게시글 수정
  const [editPostState, editPostFetch] = useAsync(
    (post) => api.editPost(boardType, postId, post),
    [boardType, postId],
    true,
  );

  const onClickEdit = useCallback(
    async (post) => {
      await editPostFetch(post);
      navigate(`/board/${boardType}/${postId}`);
    },
    [editPostFetch, navigate, boardType, postId],
  );

  useMessage(editPostState, '게시물이 수정되었습니다 📝');

  // 게시판 내 존재하는 태그 배열 조회
  const [getTagsListState] = useAsync(
    async () => {
      const response = await api.getTagList(boardType);
      return response.data.map((value) => ({ label: value, value: value }));
    },
    [boardType],
    false,
  );

  return (
    <EditPostPresenter
      loading={editPostState.loading}
      boardType={boardType}
      post={readPostState.success?.data?.post ?? {}}
      onClickEdit={onClickEdit}
      tagsList={getTagsListState.success ?? []}
    />
  );
};

export default EditPostContainer;

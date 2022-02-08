import { useCallback } from 'react';
import * as api from '../../../modules/api';
import useAsync from '../../../hooks/useAsync';
import WritePostPresenter from '../../presenters/post/WritePostPresenter';
import { useNavigate } from 'react-router-dom';
import { useMessage } from '../../../hooks/useMessage';

const WritePostContainer = ({ boardType }) => {
  const navigate = useNavigate();

  // 게시글 등록
  const [writePostState, writePostFetch] = useAsync(
    (post) => api.writePost(boardType, post),
    [],
    true,
  );

  const onClickWrite = useCallback(
    async (post) => {
      const response = await writePostFetch(post);
      navigate(`/board/${boardType}/${response.data.postId}`);
    },
    [writePostFetch, navigate, boardType],
  );

  useMessage(writePostState, '게시물이 등록되었습니다 📝');

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
    <WritePostPresenter
      loading={writePostState.loading}
      boardType={boardType}
      onClickWrite={onClickWrite}
      tagsList={getTagsListState.success ?? []}
    />
  );
};

export default WritePostContainer;

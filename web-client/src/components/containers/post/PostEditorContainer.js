import PostEditorPresenter from '../../presenters/post/PostEditorPresenter';
import { useNavigate } from 'react-router-dom';
import useAsync from '../../../hooks/useAsync';
import * as api from '../../../modules/api';
import { useCallback, useEffect } from 'react';
import { useMessage } from '../../../hooks/useMessage';

const PostEditorContainer = ({ boardType, postId }) => {
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

  // message
  useMessage(writePostState, '게시물이 등록되었습니다 📝');

  // 게시글 읽어오기
  const [readPostState, readPostFetch] = useAsync(
    () => api.readPost(boardType, postId),
    [boardType, postId],
    true,
  );

  useEffect(() => {
    if (postId) readPostFetch();
    // eslint-disable-next-line
  }, [postId]);

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

  // message
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
    <PostEditorPresenter
      loading={writePostState.loading || editPostState.loading}
      boardType={boardType}
      postId={postId}
      onClickWrite={onClickWrite}
      onClickEdit={onClickEdit}
      existingPost={readPostState.success?.data?.post ?? {}}
      tagsList={getTagsListState.success ?? []}
    />
  );
};

export default PostEditorContainer;

import styled from 'styled-components';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Editor, PrintState } from '../../utils/MyComponents';

const StyledEdit = styled.form`
  display: flex;
  flex-direction: column;
  width: 50%;
`;

const EditPostPresenter = ({ readPostState, editPost, editPostState }) => {
  const editorRef = useRef();

  // 게시글 정보 가져오기: postTitle, markdownContent
  const { title: postTitle = '', markdownContent = '' } =
    readPostState.success?.data?.post ?? {};

  // title 설정
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (postTitle) setTitle(postTitle);
  }, [postTitle, setTitle]);

  const onChangeInput = useCallback(
    (e) => {
      setTitle(e.target.value);
    },
    [setTitle],
  );

  // markdownContent 설정
  useEffect(() => {
    editorRef.current &&
      editorRef.current.getInstance().setMarkdown(markdownContent);
  }, [editorRef, markdownContent]);

  /* 게시글 수정 */

  const onSubmitButton = useCallback(
    (e) => {
      e.preventDefault();
      const markdownContent = editorRef.current.getInstance().getMarkdown();
      editPost({
        title: title,
        markdownContent: markdownContent,
        tags: [],
      });
    },
    [editorRef, editPost, title],
  );

  return (
    <StyledEdit onSubmit={onSubmitButton}>
      <PrintState state={readPostState} loading={true} />
      {readPostState.success && (
        <>
          <input
            name="title"
            placeholder="제목을 입력하세요."
            required
            onChange={onChangeInput}
            value={title}
          />
          <Editor innerRef={editorRef} />
          <button>수정</button>
          <PrintState state={editPostState} />
        </>
      )}
    </StyledEdit>
  );
};

export default EditPostPresenter;

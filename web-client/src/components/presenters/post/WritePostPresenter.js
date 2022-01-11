import styled from 'styled-components';
import { useCallback, useRef, useState } from 'react';
import { Editor, PrintState } from '../../../utils/MyComponents';

const StyledWritePost = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const WritePostPresenter = ({ writePost, writePostState }) => {
  const editorRef = useRef();

  /* 게시글 제목 */

  const [title, setTitle] = useState('');

  const onChangeInput = useCallback(
    (e) => {
      setTitle(e.target.value);
    },
    [setTitle],
  );

  /* 게시글 등록 */
  const onSubmitButton = useCallback(
    (e) => {
      e.preventDefault();
      if (editorRef.current) {
        const markdownContent = editorRef.current.getInstance().getMarkdown();
        writePost({ title: title, markdownContent: markdownContent, tags: [] });
      }
    },
    [editorRef, writePost, title],
  );

  return (
    <StyledWritePost onSubmit={onSubmitButton}>
      <input
        name="title"
        placeholder="제목을 입력하세요."
        required
        onChange={onChangeInput}
      />
      <Editor innerRef={editorRef} />
      <button>등록</button>
      <PrintState state={writePostState} />
    </StyledWritePost>
  );
};

export default WritePostPresenter;

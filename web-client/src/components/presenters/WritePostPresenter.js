import styled from 'styled-components';
import { useCallback, useRef, useState } from 'react';
// editor
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
// codeSyntaxHighlight
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css';
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight-all';
// colorSyntax
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
// uml
import uml from '@toast-ui/editor-plugin-uml';
// table-merged-cell
import tableMergedCell from '@toast-ui/editor-plugin-table-merged-cell';
// chart
import chart from '@toast-ui/editor-plugin-chart';

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
      <Editor
        ref={editorRef}
        initialEditType="markdown"
        previewStyle="vertical"
        useCommandShortcut={true}
        plugins={[
          [codeSyntaxHighlight, { highlighter: Prism }],
          colorSyntax,
          uml,
          tableMergedCell,
          chart,
        ]}
        placeholder="내용을 입력하세요."
      />
      <button>등록</button>
      {writePostState.error && (
        <div>오류가 발생했습니다. 잠시 후 다시 시도해주세요.</div>
      )}
    </StyledWritePost>
  );
};

export default WritePostPresenter;

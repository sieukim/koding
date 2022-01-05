import styled from 'styled-components';
import { useCallback, useEffect, useRef, useState } from 'react';
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

const StyledEdit = styled.form`
  display: flex;
  flex-direction: column;
  width: 50%;
`;

const EditPostPresenter = ({ readPostState, editPost, editPostState }) => {
  const editorRef = useRef();

  /* 게시글 정보 가져오기*/

  // postTitle, markdownContent
  const postTitle = readPostState.success?.data?.title;
  const markdownContent = readPostState.success?.data?.markdownContent;

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
      {readPostState.loading && <div>로딩중입니다. 잠시만 기다려주세요.</div>}
      {readPostState.error && (
        <div>오류가 발생했습니다. 잠시 후 다시 시도해주세요.</div>
      )}
      {readPostState.success && (
        <>
          <input
            name="title"
            placeholder="제목을 입력하세요."
            required
            onChange={onChangeInput}
            value={title}
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
          <button>수정</button>
          {editPostState.error && (
            <div>오류가 발생했습니다. 잠시 후 다시 시도해주세요.</div>
          )}
        </>
      )}
    </StyledEdit>
  );
};

export default EditPostPresenter;

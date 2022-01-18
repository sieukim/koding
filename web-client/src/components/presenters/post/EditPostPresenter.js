import styled from 'styled-components';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Editor, PrintState } from '../../../utils/MyComponents';
import TagPresenter from './TagPresenter';

const StyledEdit = styled.form`
  display: flex;
  flex-direction: column;
  width: 50%;
`;

const EditPostPresenter = ({
  readPostState,
  post = {},
  editPost,
  editPostState,
  tagList = [],
}) => {
  const editorRef = useRef();

  // 게시글 정보 가져오기: postTitle, markdownContent
  const { title: postTitle = '', markdownContent = '' } = post;

  // title 설정
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (postTitle) setTitle(postTitle);
  }, [postTitle]);

  const onChangeInput = useCallback((e) => {
    setTitle(e.target.value);
  }, []);

  // markdownContent 설정
  useEffect(() => {
    editorRef.current &&
      editorRef.current.getInstance().setMarkdown(markdownContent);
  }, [editorRef, markdownContent]);

  /* 태그 입력 */

  const [tags, setTags] = useState([]);

  const onChangeTag = useCallback((e, value) => {
    e.preventDefault();
    setTags(value);
  }, []);

  /* 게시글 수정 */

  const onSubmitButton = useCallback(
    (e) => {
      e.preventDefault();

      const editorRefInstance = editorRef.current.getInstance();
      const markdownContent = editorRefInstance.getMarkdown();
      const htmlContent = editorRefInstance.getHTML();

      editPost({
        title: title,
        markdownContent: markdownContent,
        htmlContent: htmlContent,
        tags: tags,
      });
    },
    [editorRef, editPost, title, tags],
  );

  return (
    <>
      {readPostState.success && (
        <StyledEdit onSubmit={onSubmitButton}>
          <PrintState state={readPostState} />
          <input
            name="title"
            placeholder="제목을 입력하세요."
            required
            onChange={onChangeInput}
            value={title}
          />
          <TagPresenter
            onChangeTag={onChangeTag}
            tags={tagList}
            defaultValue={readPostState.success.data.post.tags}
          />
          <Editor innerRef={editorRef} />
          <button>수정</button>
          <PrintState state={editPostState} />
        </StyledEdit>
      )}
    </>
  );
};

export default EditPostPresenter;

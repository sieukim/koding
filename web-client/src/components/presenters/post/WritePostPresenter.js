import styled from 'styled-components';
import { useCallback, useRef, useState } from 'react';
import TagPresenter from './TagPresenter';
import * as api from '../../../modules/api';
import { Editor } from '../../../utils/Editor';

const StyledWritePost = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const WritePostPresenter = ({ writePost, writePostState, tagList = [] }) => {
  const editorRef = useRef();

  /* 태그 입력 */

  const [tags, setTags] = useState([]);

  const onChangeTag = useCallback((e, value) => {
    e.preventDefault();
    setTags(value);
  }, []);

  /* 게시글 제목 */

  const [title, setTitle] = useState('');

  const onChangeInput = useCallback((e) => {
    setTitle(e.target.value);
  }, []);

  /* 이미지 업로드 */

  const [imageUrls, setImageUrls] = useState([]);

  const uploadImage = useCallback(async (blob, callback) => {
    const response = await api.uploadImage(blob);
    const url = response.data.imageUrl;

    setImageUrls((imageUrl) => [...imageUrl, url]);

    callback(url, 'alt_text');
  }, []);

  /* 게시글 등록 */
  const onSubmitButton = useCallback(
    (e) => {
      e.preventDefault();
      if (editorRef.current) {
        const markdownContent = editorRef.current.getInstance().getMarkdown();
        const htmlContent = editorRef.current.getInstance().getHTML();

        writePost({
          title: title,
          markdownContent: markdownContent,
          htmlContent: htmlContent,
          tags: tags,
          imageUrls: imageUrls,
        });
      }
    },
    [editorRef, writePost, title, tags, imageUrls],
  );

  return (
    <StyledWritePost onSubmit={onSubmitButton}>
      <input
        name="title"
        placeholder="제목을 입력하세요."
        required
        onChange={onChangeInput}
      />
      <TagPresenter onChangeTag={onChangeTag} tags={tagList} />
      <Editor
        innerRef={editorRef}
        hooks={{
          addImageBlobHook: uploadImage,
        }}
      />
      <button>등록</button>
    </StyledWritePost>
  );
};

export default WritePostPresenter;

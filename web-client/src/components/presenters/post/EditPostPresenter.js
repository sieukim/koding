import styled from 'styled-components';
import { useCallback, useEffect, useRef, useState } from 'react';
import TagPresenter from './TagPresenter';
import * as api from '../../../modules/api';
import { Editor } from '../../../utils/Editor';

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

  /* 이미지 업로드 */

  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    if (readPostState.success) {
      setImageUrls(readPostState.success.data.post.imageUrls);
    }
  }, [readPostState.success]);

  const uploadImage = useCallback(async (blob, callback) => {
    const response = await api.uploadImage(blob);
    const url = response.data.imageUrl;

    setImageUrls((imageUrl) => [...imageUrl, url]);

    callback(url, 'alt_text');
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
        imageUrls: imageUrls.filter((imageUrl) =>
          markdownContent.includes(imageUrl),
        ),
      });
    },
    [editorRef, editPost, title, tags, imageUrls],
  );

  return (
    <>
      {readPostState.success && (
        <StyledEdit onSubmit={onSubmitButton}>
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
          <Editor
            innerRef={editorRef}
            hooks={{
              addImageBlobHook: uploadImage,
            }}
          />
          <button>수정</button>
        </StyledEdit>
      )}
    </>
  );
};

export default EditPostPresenter;

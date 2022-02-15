import { StyledPostEditorPage } from '../styled/post/StyledPostEditorPage';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button, Form, Input } from 'antd';
import { Editor } from '../utils/editor/Editor';
import { Tags } from '../utils/editor/Tags';

const PostEditorPresenter = ({
  loading,
  boardType,
  postId,
  onClickWrite,
  onClickEdit,
  existingPost,
  tagsList,
}) => {
  const editorRef = useRef();
  const [form] = Form.useForm();

  // 입력 태그 배열
  const [tags, setTags] = useState([]);

  // 이미지 Url
  const [imageUrls, setImageUrls] = useState([]);

  // form onFinish(onSubmit) 핸들러
  const onFinish = useCallback(
    (values) => {
      if (editorRef.current) {
        const markdownContent = editorRef.current.getInstance().getMarkdown();
        const htmlContent = editorRef.current.getInstance().getHTML();

        const post = {
          ...values,
          markdownContent,
          htmlContent,
          tags,
          imageUrls: imageUrls.filter((imageUrl) =>
            markdownContent.includes(imageUrl),
          ),
        };

        // 게시글 등록
        if (!postId) onClickWrite(post);
        // 게시글 편집
        else onClickEdit(post);
      }
    },
    [editorRef, postId, onClickWrite, onClickEdit, tags, imageUrls],
  );

  // 제목
  useEffect(() => {
    form.setFieldsValue({ title: existingPost.title ?? '' });
  }, [form, existingPost]);

  // 내용
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current
        .getInstance()
        .setMarkdown(existingPost.markdownContent ?? '');
    }
  }, [editorRef, existingPost]);

  // 태그, 이미지 주소
  useEffect(() => {
    setTags(existingPost.tags ?? []);
    setImageUrls(existingPost.imageUrls ?? []);
  }, [existingPost]);

  return (
    <StyledPostEditorPage>
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          name="title"
          rules={[{ required: true, message: '제목을 입력하세요.' }]}
        >
          <Input placeholder="제목을 입력하세요." className="title-container" />
        </Form.Item>
        <Form.Item
          name="content"
          rules={[{ required: true, message: '내용을 입력하세요.' }]}
        >
          <Editor innerRef={editorRef} setImageUrls={setImageUrls} />
        </Form.Item>
        <div className="tags-container">
          <Form.Item name="tags">
            <Tags
              boardType={boardType}
              tags={tags}
              setTags={setTags}
              tagsList={tagsList}
            />
          </Form.Item>
          <Button htmlType="submit" loading={loading}>
            등록
          </Button>
        </div>
      </Form>
    </StyledPostEditorPage>
  );
};

export default PostEditorPresenter;
